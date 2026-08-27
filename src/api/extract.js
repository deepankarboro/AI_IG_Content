export async function handleExtract(request, env) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { url, rawText, userApiKey, deviceFingerprint } = body;

    if (!url && !rawText) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Please provide an Instagram/YouTube URL or paste text." 
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const isUsingUserKey = Boolean(userApiKey && userApiKey.trim());
    const apiKey = isUsingUserKey ? userApiKey.trim() : (env.GEMINI_API_KEY || env.gemini_api_key);

    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        quotaExceeded: false,
        noHostKey: true,
        message: "The host's GEMINI_API_KEY is not yet detected in Cloudflare Environment Variables. Please enter your free key in the 'Custom API Key Settings' section below, or configure GEMINI_API_KEY in Cloudflare Dashboard -> Settings -> Variables."
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    let extractedMetadata = "";

    if (url) {
      const cleanUrl = url.trim();
      
      // 1. If YouTube URL: use YouTube oEmbed
      if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
        try {
          const ytOembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`;
          const ytRes = await fetch(ytOembed);
          if (ytRes.ok) {
            const ytData = await ytRes.json();
            extractedMetadata += `YouTube Video Title: ${ytData.title}\nChannel: ${ytData.author_name}\n`;
          }
        } catch (e) {
          console.warn("YouTube oEmbed fetch error:", e);
        }
      }

      // 2. If Instagram URL: try Instagram oEmbed first
      if (cleanUrl.includes("instagram.com")) {
        try {
          const igOembed = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(cleanUrl)}`;
          const igRes = await fetch(igOembed, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" }
          });
          if (igRes.ok) {
            const igData = await igRes.json();
            if (igData.title) extractedMetadata += `Instagram Title: ${igData.title}\n`;
            if (igData.author_name) extractedMetadata += `Author: ${igData.author_name}\n`;
            if (igData.html) {
              const textOnly = igData.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
              extractedMetadata += `Post Context: ${textOnly}\n`;
            }
          }
        } catch (e) {
          console.warn("Instagram oEmbed error:", e);
        }
      }

      // 3. Fallback: Direct HTML metadata fetch
      if (!extractedMetadata) {
        try {
          const fetchRes = await fetch(cleanUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            }
          });
          if (fetchRes.ok) {
            const html = await fetchRes.text();
            const ogDescMatch = html.match(/<meta\s+(?:property|name)=["'](?:og:description|description)["']\s+content=["'](.*?)["']/i);
            const ogTitleMatch = html.match(/<meta\s+(?:property|name)=["'](?:og:title|title)["']\s+content=["'](.*?)["']/i);
            if (ogTitleMatch) extractedMetadata += `Title: ${ogTitleMatch[1]}\n`;
            if (ogDescMatch) extractedMetadata += `Caption: ${ogDescMatch[1]}\n`;
          }
        } catch (err) {
          console.warn("Direct fetch error:", err);
        }
      }
    }

    // Always include the URL and user notes in the payload
    const contentToProcess = [
      url ? `Target URL: ${url}` : "",
      extractedMetadata ? `Extracted Metadata:\n${extractedMetadata}` : "",
      rawText ? `User Provided Notes/Caption:\n${rawText}` : ""
    ].filter(Boolean).join("\n\n");

    const systemPrompt = `You are an expert AI & Open-Source Content Curator. 
Analyze the provided content (from an Instagram post or YouTube video) and extract all featured GitHub repositories, AI tools, libraries, or prompt templates.

If only a URL or minimal title is provided, use your internal knowledge about popular AI repositories and tech stacks to identify the featured tools.

Convert each item into our standardized copy-paste-ready Markdown card schema:

### 🛠️ [Tool Name](https://github.com/owner/repo)
> **Tagline / 1-Sentence Purpose**

- **Category:** Local LLMs | Image Gen | Audio/Speech | Automation | Dev Tools | Prompts
- **Replaces:** [Paid tool it replaces, e.g. Midjourney / Zapier / OpenAI / Figma]
- **Official Repo:** [owner/repo](https://github.com/owner/repo)

#### 💻 One-Click Install / Run
\`\`\`bash
# exact CLI install / run command
\`\`\`

#### 📌 Quick Usage Snippet
\`\`\`text
# quick starter snippet or prompt
\`\`\`

---

Ensure the output is clean, valid Markdown without unnecessary chat commentary.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\nInput Content:\n${contentToProcess}` }
            ]
          }
        ]
      })
    });

    if (geminiRes.status === 429) {
      return new Response(JSON.stringify({
        success: false,
        quotaExceeded: true,
        reason: "GLOBAL_QUOTA_EXHAUSTED",
        message: "The free Gemini API quota for this key is currently rate-limited. Please try again in 1 minute or enter your own key."
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    if (!geminiRes.ok) {
      const errorData = await geminiRes.text();
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Gemini API returned status ${geminiRes.status}: ${errorData}` 
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    const geminiData = await geminiRes.json();
    const resultMarkdown = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No structured tools could be extracted.";

    return new Response(JSON.stringify({
      success: true,
      markdown: resultMarkdown,
      isUsingUserKey
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }), {
      status: 200,
      headers: corsHeaders
    });
  }
}

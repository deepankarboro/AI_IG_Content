export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { url, rawText, userApiKey } = body;

    if (!url && !rawText) {
      return new Response(JSON.stringify({ error: "Please provide an Instagram/YouTube URL or paste text." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const apiKey = userApiKey || env.GEMINI_API_KEY;
    const isUsingHostKey = !userApiKey;

    if (!apiKey) {
      return new Response(JSON.stringify({
        quotaExceeded: true,
        message: "The host's daily free Gemini quota has not been set or is currently unavailable."
      }), {
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }

    let extractedMetadata = "";
    if (url) {
      try {
        const fetchRes = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          }
        });
        if (fetchRes.ok) {
          const html = await fetchRes.text();
          // Extract OpenGraph title and description
          const ogDescMatch = html.match(/<meta\s+(?:property|name)=["'](?:og:description|description)["']\s+content=["'](.*?)["']/i);
          const ogTitleMatch = html.match(/<meta\s+(?:property|name)=["'](?:og:title|title)["']\s+content=["'](.*?)["']/i);
          if (ogTitleMatch) extractedMetadata += `Title: ${ogTitleMatch[1]}\n`;
          if (ogDescMatch) extractedMetadata += `Description / Caption: ${ogDescMatch[1]}\n`;
        }
      } catch (err) {
        console.warn("Direct fetch error:", err);
      }
    }

    const contentToProcess = `${rawText || ""}\n${extractedMetadata}`.trim();

    if (!contentToProcess) {
      return new Response(JSON.stringify({
        error: "Could not extract content from the URL. Please paste the post's text or caption directly."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const systemPrompt = `You are an expert AI & Open-Source Content Curator. 
Analyze the provided content (from an Instagram/YouTube post) and extract all featured GitHub repositories, AI tools, libraries, or prompt templates.

Convert each item into our standardized copy-paste-ready Markdown card schema:

### 🛠️ [Tool Name](https://github.com/owner/repo)
> **Tagline / 1-Sentence Purpose**

- **Category:** Local LLMs | Image Gen | Audio/Speech | Automation | Dev Tools | Prompts
- **Replaces:** [Paid tool it replaces, e.g. Midjourney / Zapier / OpenAI]
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

Ensure the output is clean Markdown without unnecessary chat commentary.`;

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
        quotaExceeded: true,
        isUsingHostKey,
        message: "The host's daily free Gemini limit has been reached for today."
      }), {
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!geminiRes.ok) {
      const errorData = await geminiRes.text();
      return new Response(JSON.stringify({ error: `Gemini API error: ${errorData}` }), {
        status: geminiRes.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    const geminiData = await geminiRes.json();
    const resultMarkdown = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No structured tools could be extracted.";

    return new Response(JSON.stringify({
      success: true,
      markdown: resultMarkdown
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

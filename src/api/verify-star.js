export async function handleVerifyStar(request, env) {
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
    const { username, deviceFingerprint, checkOnly } = body;

    if (!username || !username.trim()) {
      return new Response(JSON.stringify({ error: "Please provide a valid GitHub username." }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const targetRepoOwner = "deepankarboro";
    const targetRepoName = "AI_IG_Content";

    const githubUrl = `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/starred/${targetRepoOwner}/${targetRepoName}`;

    const headers = {
      "User-Agent": "AI-IG-Content-Hub-StarVerifier",
      "Accept": "application/vnd.github.v3+json"
    };

    if (env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${env.GITHUB_TOKEN}`;
    }

    const ghRes = await fetch(githubUrl, { headers });
    const isStarred = ghRes.status === 204;

    if (isStarred) {
      return new Response(JSON.stringify({
        isStarred: true,
        username: cleanUsername,
        bonusGranted: 3,
        message: `Star verified for @${cleanUsername}! +3 bonus extractions unlocked.`
      }), {
        status: 200,
        headers: corsHeaders
      });
    } else if (ghRes.status === 404) {
      return new Response(JSON.stringify({
        isStarred: false,
        username: cleanUsername,
        message: `No star detected from @${cleanUsername} on ${targetRepoOwner}/${targetRepoName}. Please star the repo and try again.`
      }), {
        status: 200,
        headers: corsHeaders
      });
    } else {
      const stargazersUrl = `https://api.github.com/repos/${targetRepoOwner}/${targetRepoName}/stargazers?per_page=100`;
      const sgRes = await fetch(stargazersUrl, { headers });
      if (sgRes.ok) {
        const stargazers = await sgRes.json();
        const found = Array.isArray(stargazers) && stargazers.some(sg => (sg.login || "").toLowerCase() === cleanUsername);
        return new Response(JSON.stringify({
          isStarred: found,
          username: cleanUsername,
          bonusGranted: found ? 3 : 0,
          message: found ? `Star verified for @${cleanUsername}!` : `No star detected from @${cleanUsername}.`
        }), {
          status: 200,
          headers: corsHeaders
        });
      }

      return new Response(JSON.stringify({
        error: "GitHub API rate limit or error. Please verify the username or try again in a few minutes."
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

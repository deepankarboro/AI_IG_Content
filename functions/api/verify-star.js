export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { username, deviceFingerprint, checkOnly } = body;

    if (!username || !username.trim()) {
      return new Response(JSON.stringify({ error: "Please provide a valid GitHub username." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const targetRepoOwner = "deepankarboro";
    const targetRepoName = "AI_IG_Content";

    // GitHub API endpoint to check if user starred the repository
    const githubUrl = `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/starred/${targetRepoOwner}/${targetRepoName}`;

    const headers = {
      "User-Agent": "AI-IG-Content-Hub-StarVerifier",
      "Accept": "application/vnd.github.v3+json"
    };

    if (env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${env.GITHUB_TOKEN}`;
    }

    const ghRes = await fetch(githubUrl, { headers });

    // GitHub returns 204 No Content if the user has starred the repo
    const isStarred = ghRes.status === 204;

    if (isStarred) {
      return new Response(JSON.stringify({
        isStarred: true,
        username: cleanUsername,
        bonusGranted: 3,
        message: `Star verified for @${cleanUsername}! +3 bonus extractions unlocked.`
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else if (ghRes.status === 404) {
      return new Response(JSON.stringify({
        isStarred: false,
        username: cleanUsername,
        message: `No star detected from @${cleanUsername} on ${targetRepoOwner}/${targetRepoName}. Please star the repo and try again.`
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      // Fallback: check stargazers list if /starred endpoint returned rate limit
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
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({
        error: "GitHub API rate limit or error. Please verify the username or try again in a few minutes."
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

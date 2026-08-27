import { handleExtract } from './api/extract.js';
import { handleVerifyStar } from './api/verify-star.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/extract') {
      return handleExtract(request, env);
    }

    if (url.pathname === '/api/verify-star') {
      return handleVerifyStar(request, env);
    }

    // Serve static VitePress assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};

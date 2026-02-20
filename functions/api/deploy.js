// Cloudflare Pages Function — proxies deploy hook requests to bypass CORS
export async function onRequestPost(context) {
  try {
    const { hookUrl } = await context.request.json();

    if (!hookUrl || !hookUrl.startsWith('https://api.cloudflare.com/')) {
      return new Response(JSON.stringify({ error: 'Invalid hook URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(hookUrl, { method: 'POST' });
    const body = await res.text();

    return new Response(body, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

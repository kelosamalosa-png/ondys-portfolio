async function createSignedState(secret) {
  const nonce = crypto.randomUUID();
  const timestamp = Date.now().toString();
  const data = `${nonce}:${timestamp}`;
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );
  
  const signatureHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return btoa(`${data}:${signatureHex}`);
}

export async function onRequestGet(context) {
  const { env } = context;
  
  if (!env.GITHUB_CLIENT_ID || !env.STATE_SIGNING_SECRET || !env.OAUTH_CALLBACK_URL) {
    return new Response('OAuth not configured', { status: 500 });
  }
  
  const state = await createSignedState(env.STATE_SIGNING_SECRET);
  
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: env.OAUTH_CALLBACK_URL,
    scope: 'repo,user',
    state: state,
  });
  
  const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  
  return Response.redirect(authUrl, 302);
}

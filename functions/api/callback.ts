/// <reference path="../types.d.ts" />

interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  OAUTH_CALLBACK_URL: string;
  STATE_SIGNING_SECRET: string;
  ALLOWED_GITHUB_USER: string;
}

async function verifySignedState(state: string, secret: string): Promise<boolean> {
  try {
    const decoded = atob(state);
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    
    const [nonce, timestamp, signatureHex] = parts;
    const data = `${nonce}:${timestamp}`;
    
    // Check timestamp (valid for 10 minutes)
    const stateTime = parseInt(timestamp);
    if (Date.now() - stateTime > 10 * 60 * 1000) {
      return false;
    }
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signature = new Uint8Array(
      signatureHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16))
    );
    
    return await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      encoder.encode(data)
    );
  } catch {
    return false;
  }
}

function createSuccessHTML(token: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Přihlášení úspěšné</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: #1a1a2e;
      color: #eee;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .success {
      color: #10b981;
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="success">✓</div>
    <h1>Přihlášení úspěšné!</h1>
    <p>Toto okno se automaticky zavře...</p>
  </div>
  <script>
    (function() {
      function sendMessage(message) {
        if (window.opener) {
          window.opener.postMessage(message, '*');
        }
      }
      
      sendMessage('authorization:github:success:${JSON.stringify({ token: token, provider: 'github' })}');
      
      setTimeout(function() {
        window.close();
      }, 1000);
    })();
  </script>
</body>
</html>`;
}

function createErrorHTML(error: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Chyba přihlášení</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: #1a1a2e;
      color: #eee;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .error {
      color: #ef4444;
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="error">✗</div>
    <h1>Chyba přihlášení</h1>
    <p>${error}</p>
  </div>
  <script>
    (function() {
      if (window.opener) {
        window.opener.postMessage('authorization:github:error:${error}', '*');
      }
    })();
  </script>
</body>
</html>`;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  
  if (error) {
    return new Response(createErrorHTML(`GitHub chyba: ${error}`), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  
  if (!code || !state) {
    return new Response(createErrorHTML('Chybí autorizační kód nebo state'), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  
  // Verify state
  const isValidState = await verifySignedState(state, env.STATE_SIGNING_SECRET);
  if (!isValidState) {
    return new Response(createErrorHTML('Neplatný nebo expirovaný state token'), {
      status: 403,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  
  // Exchange code for token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: code,
    }),
  });
  
  if (!tokenResponse.ok) {
    return new Response(createErrorHTML('Nepodařilo se získat access token'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  
  const tokenData = await tokenResponse.json() as { access_token?: string; error?: string };
  
  if (tokenData.error || !tokenData.access_token) {
    return new Response(createErrorHTML(`Token chyba: ${tokenData.error || 'neznámá chyba'}`), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  
  const accessToken = tokenData.access_token;
  
  // Verify user
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Ondys-Portfolio-Admin',
    },
  });
  
  if (!userResponse.ok) {
    return new Response(createErrorHTML('Nepodařilo se ověřit uživatele'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  
  const userData = await userResponse.json() as { login?: string };
  
  if (!userData.login) {
    return new Response(createErrorHTML('Nepodařilo se získat uživatelské jméno'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  
  // Check if user is allowed
  const allowedUser = env.ALLOWED_GITHUB_USER || 'kelosamalosa';
  if (userData.login.toLowerCase() !== allowedUser.toLowerCase()) {
    return new Response(createErrorHTML(`Přístup odepřen. Uživatel '${userData.login}' nemá oprávnění.`), {
      status: 403,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  
  // Success - return token to Decap CMS
  return new Response(createSuccessHTML(accessToken), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};

async function verifySignedState(state, secret) {
  try {
    const decoded = atob(state);
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    
    const [nonce, timestamp, signatureHex] = parts;
    const data = `${nonce}:${timestamp}`;
    
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
      signatureHex.match(/.{2}/g).map(byte => parseInt(byte, 16))
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

function createSuccessHTML(token) {
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
    .container { text-align: center; padding: 2rem; }
    .success { color: #10b981; font-size: 3rem; margin-bottom: 1rem; }
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
      var token = ${JSON.stringify(token)};
      var data = JSON.stringify({ token: token, provider: 'github' });
      
      if (window.opener) {
        window.opener.postMessage('authorization:github:success:' + data, '*');
      }
      
      // Fallback for Decap CMS
      if (window.opener && window.opener.postMessage) {
        window.opener.postMessage(
          { type: 'github', token: token },
          '*'
        );
      }
      
      // Also try Netlify Identity format
      if (window.netlifyIdentity) {
        window.netlifyIdentity.gotrue.currentUser().then(function() {
          window.close();
        });
      }
      
      setTimeout(function() { window.close(); }, 2000);
    })();
  </script>
</body>
</html>`;
}

function createErrorHTML(error) {
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
    .container { text-align: center; padding: 2rem; }
    .error { color: #ef4444; font-size: 3rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="error">✗</div>
    <h1>Chyba přihlášení</h1>
    <p>${error}</p>
  </div>
  <script>
    if (window.opener) {
      window.opener.postMessage('authorization:github:error:${error}', '*');
    }
  </script>
</body>
</html>`;
}

export async function onRequestGet(context) {
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
  
  const isValidState = await verifySignedState(state, env.STATE_SIGNING_SECRET);
  if (!isValidState) {
    return new Response(createErrorHTML('Neplatný nebo expirovaný state token'), {
      status: 403,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  
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
  
  const tokenData = await tokenResponse.json();
  
  if (tokenData.error || !tokenData.access_token) {
    return new Response(createErrorHTML(`Token chyba: ${tokenData.error || 'neznámá chyba'}`), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  
  const accessToken = tokenData.access_token;
  
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
  
  const userData = await userResponse.json();
  
  if (!userData.login) {
    return new Response(createErrorHTML('Nepodařilo se získat uživatelské jméno'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  
  const allowedUser = env.ALLOWED_GITHUB_USER || 'kelosamalosa';
  if (userData.login.toLowerCase() !== allowedUser.toLowerCase()) {
    return new Response(createErrorHTML(`Přístup odepřen. Uživatel '${userData.login}' nemá oprávnění.`), {
      status: 403,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  
  return new Response(createSuccessHTML(accessToken), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

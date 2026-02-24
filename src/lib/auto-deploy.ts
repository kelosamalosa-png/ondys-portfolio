const DEPLOY_HOOK_KEY = 'ondys-deploy-hook';
const DEPLOY_COOLDOWN = 10_000; // 10s cooldown between deploys
let lastDeploy = 0;

/**
 * Automatically trigger a site rebuild after content changes.
 * Reads the deploy hook URL from localStorage and calls the proxy.
 * Has a 10-second cooldown to batch rapid edits.
 */
export async function triggerAutoDeploy(): Promise<void> {
  if (typeof window === 'undefined') return;

  const hookUrl = localStorage.getItem(DEPLOY_HOOK_KEY);
  if (!hookUrl) return;

  const now = Date.now();
  if (now - lastDeploy < DEPLOY_COOLDOWN) return;
  lastDeploy = now;

  try {
    await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hookUrl }),
    });
    console.log('[auto-deploy] Rebuild triggered');
  } catch (err) {
    console.warn('[auto-deploy] Failed:', err);
  }
}

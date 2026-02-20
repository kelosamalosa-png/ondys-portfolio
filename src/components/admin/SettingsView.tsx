import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const DEPLOY_HOOK_KEY = 'ondys-deploy-hook';

export default function SettingsView() {
  const [userEmail, setUserEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [deployHook, setDeployHook] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deployMsg, setDeployMsg] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email || '');
    });
    setDeployHook(localStorage.getItem(DEPLOY_HOOK_KEY) || '');
  }, []);

  const saveDeployHook = () => {
    localStorage.setItem(DEPLOY_HOOK_KEY, deployHook);
    setDeployMsg('Deploy hook saved');
    setTimeout(() => setDeployMsg(''), 2000);
  };

  const triggerDeploy = async () => {
    const hook = localStorage.getItem(DEPLOY_HOOK_KEY);
    if (!hook) { setDeployMsg('Set deploy hook URL first'); return; }
    setDeploying(true);
    setDeployMsg('');
    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hookUrl: hook }),
      });
      if (res.ok) {
        setDeployMsg('Deploy triggered! Site will rebuild in ~1 min.');
      } else {
        setDeployMsg(`Deploy failed: ${res.status}`);
      }
    } catch (err: any) {
      setDeployMsg(`Deploy error: ${err.message}`);
    } finally {
      setDeploying(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      setMsgType('error');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage(error.message);
      setMsgType('error');
    } else {
      setMessage('Password updated successfully');
      setMsgType('success');
      setNewPassword('');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">Settings</h1>
        <p className="text-sm text-[#71717A] mt-1">Account & configuration</p>
      </div>

      {/* Account info */}
      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#BFFF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Account
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0A0A0C]">
            <span className="text-xs font-mono text-[#52525B]">Email</span>
            <span className="text-sm font-mono text-[#A1A1AA]">{userEmail}</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0A0A0C]">
            <span className="text-xs font-mono text-[#52525B]">Auth Provider</span>
            <span className="text-sm font-mono text-[#A1A1AA]">Supabase</span>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#BFFF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          {message && (
            <div className={`px-3 py-2 rounded-lg text-xs font-mono ${
              msgType === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {message}
            </div>
          )}
          <div>
            <label className="block text-xs font-mono text-[#A1A1AA] mb-1.5 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0A0A0C] border border-[#27272A] text-white text-sm font-mono focus:border-[#BFFF00]/50 focus:outline-none focus:ring-1 focus:ring-[#BFFF00]/20 transition-colors placeholder:text-[#3F3F46]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#27272A] text-white text-sm font-medium hover:bg-[#3F3F46] transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Rebuild Site */}
      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#BFFF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Rebuild Site
        </h2>
        <p className="text-xs text-[#52525B] mb-3">
          After editing projects, trigger a rebuild to publish changes to the live site.
        </p>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={deployHook}
              onChange={(e) => setDeployHook(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-[#0A0A0C] border border-[#27272A] text-white text-sm font-mono focus:border-[#BFFF00]/50 focus:outline-none focus:ring-1 focus:ring-[#BFFF00]/20 transition-colors placeholder:text-[#3F3F46]"
              placeholder="Cloudflare Pages deploy hook URL"
            />
            <button
              onClick={saveDeployHook}
              className="px-3 py-2 rounded-lg bg-[#27272A] text-white text-sm hover:bg-[#3F3F46] transition-colors shrink-0"
            >
              Save
            </button>
          </div>
          <button
            onClick={triggerDeploy}
            disabled={deploying || !deployHook}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deploying ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#09090B] border-t-transparent rounded-full animate-spin" />
                Rebuilding...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Rebuild Now
              </>
            )}
          </button>
          {deployMsg && (
            <p className={`text-xs font-mono ${deployMsg.includes('error') || deployMsg.includes('failed') ? 'text-red-400' : 'text-green-400'}`}>
              {deployMsg}
            </p>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#BFFF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Quick Links
        </h2>
        <div className="space-y-1.5">
          {[
            { label: 'GitHub Repository', url: 'https://github.com/kelosamalosa-png/ondys-portfolio' },
            { label: 'Cloudflare Dashboard', url: 'https://dash.cloudflare.com' },
            { label: 'Supabase Dashboard', url: 'https://supabase.com/dashboard' },
            { label: 'Live Site', url: 'https://ondys.dev' },
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#1E1E21] transition-colors group"
            >
              <span className="text-sm text-[#A1A1AA] group-hover:text-white transition-colors">{link.label}</span>
              <svg className="w-3.5 h-3.5 text-[#3F3F46] group-hover:text-[#BFFF00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

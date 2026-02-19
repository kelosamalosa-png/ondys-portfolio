interface DashboardProps {
  stats: {
    projects: number;
    devlogs: number;
    services: number;
    skills: number;
  };
  recentProjects: Array<{
    slug: string;
    title: string;
    status: string;
    year: number;
  }>;
  recentDevlogs: Array<{
    slug: string;
    project: string;
    version: string;
    date: string;
  }>;
}

function StatCard({ label, value, icon, href }: { label: string; value: number; icon: string; href: string }) {
  return (
    <a href={href} className="block bg-[#111113] border border-[#27272A] rounded-xl p-5 hover:border-[#BFFF00]/30 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-[#52525B] uppercase tracking-wider">{label}</span>
        <span className="text-[#3F3F46] group-hover:text-[#BFFF00] transition-colors">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white font-mono">{value}</p>
    </a>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    live: 'bg-green-400',
    beta: 'bg-yellow-400',
    prototype: 'bg-purple-400',
    alpha: 'bg-blue-400',
    stable: 'bg-green-400',
  };
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[status] || 'bg-gray-400'}`} />;
}

export default function DashboardView({ stats, recentProjects, recentDevlogs }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">Dashboard</h1>
        <p className="text-sm text-[#71717A] mt-1">Content overview &amp; quick actions</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Projects" value={stats.projects} icon="📁" href="/admin/projects/" />
        <StatCard label="Devlogs" value={stats.devlogs} icon="📋" href="/admin/devlogs/" />
        <StatCard label="Services" value={stats.services} icon="💼" href="/admin/services/" />
        <StatCard label="Skills" value={stats.skills} icon="⭐" href="/admin/skills/" />
      </div>

      {/* Quick actions */}
      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#BFFF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { label: 'New Project', href: '/admin/projects/?action=new', color: 'text-blue-400' },
            { label: 'New Devlog', href: '/admin/devlogs/?action=new', color: 'text-green-400' },
            { label: 'New Service', href: '/admin/services/?action=new', color: 'text-purple-400' },
            { label: 'New Skill', href: '/admin/skills/?action=new', color: 'text-yellow-400' },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1E1E21] border border-[#27272A] hover:border-[#3F3F46] text-sm text-[#A1A1AA] hover:text-white transition-colors"
            >
              <span className={`text-lg ${action.color}`}>+</span>
              {action.label}
            </a>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent projects */}
        <div className="bg-[#111113] border border-[#27272A] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#27272A]">
            <h2 className="text-sm font-semibold text-white">Recent Projects</h2>
            <a href="/admin/projects/" className="text-xs text-[#BFFF00] font-mono hover:text-[#D4FF4D]">View all →</a>
          </div>
          <div className="divide-y divide-[#1E1E21]">
            {recentProjects.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[#3F3F46]">No projects yet</p>
            ) : (
              recentProjects.map((p) => (
                <a
                  key={p.slug}
                  href={`/admin/projects/?edit=${p.slug}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[#1E1E21] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <StatusDot status={p.status} />
                    <span className="text-sm text-[#E4E4E7] truncate">{p.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#52525B] font-mono">{p.year}</span>
                    <span className={`text-[10px] font-mono font-semibold uppercase ${
                      p.status === 'live' ? 'text-green-400' : p.status === 'beta' ? 'text-yellow-400' : 'text-purple-400'
                    }`}>{p.status}</span>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* Recent devlogs */}
        <div className="bg-[#111113] border border-[#27272A] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#27272A]">
            <h2 className="text-sm font-semibold text-white">Recent Devlogs</h2>
            <a href="/admin/devlogs/" className="text-xs text-[#BFFF00] font-mono hover:text-[#D4FF4D]">View all →</a>
          </div>
          <div className="divide-y divide-[#1E1E21]">
            {recentDevlogs.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[#3F3F46]">No devlogs yet</p>
            ) : (
              recentDevlogs.map((d) => (
                <a
                  key={d.slug}
                  href={`/admin/devlogs/?edit=${d.slug}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[#1E1E21] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono text-[#BFFF00]">v{d.version}</span>
                    <span className="text-sm text-[#E4E4E7] truncate">{d.project}</span>
                  </div>
                  <span className="text-xs text-[#52525B] font-mono shrink-0">{d.date}</span>
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* System info */}
      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-3">System</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="flex justify-between px-3 py-2 rounded-lg bg-[#0A0A0C]">
            <span className="text-[#52525B]">Framework</span>
            <span className="text-[#A1A1AA]">Astro 5</span>
          </div>
          <div className="flex justify-between px-3 py-2 rounded-lg bg-[#0A0A0C]">
            <span className="text-[#52525B]">Styling</span>
            <span className="text-[#A1A1AA]">Tailwind 4</span>
          </div>
          <div className="flex justify-between px-3 py-2 rounded-lg bg-[#0A0A0C]">
            <span className="text-[#52525B]">Auth</span>
            <span className="text-[#A1A1AA]">Supabase</span>
          </div>
          <div className="flex justify-between px-3 py-2 rounded-lg bg-[#0A0A0C]">
            <span className="text-[#52525B]">Deploy</span>
            <span className="text-[#A1A1AA]">Cloudflare</span>
          </div>
        </div>
      </div>
    </div>
  );
}

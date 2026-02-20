import { useState, useEffect } from 'react';
import { fetchAllProjects, type ProjectRow } from '../../lib/supabase-projects';
import ProjectEditor from './ProjectEditor';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<ProjectRow | null | 'new'>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // If editing, show editor
  if (editing !== null) {
    return (
      <ProjectEditor
        project={editing === 'new' ? null : editing}
        onSave={() => { setEditing(null); load(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  const filtered = projects.filter((p) =>
    [p.title_cs, p.title_en, p.project_slug, p.category, p.status, (p.stack || []).join(' ')]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const aVal = String((a as any)[sortKey] || '');
        const bVal = String((b as any)[sortKey] || '');
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      })
    : filtered;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const columns = [
    { key: 'title_cs', label: 'Name' },
    { key: 'status', label: 'Status' },
    { key: 'category', label: 'Category' },
    { key: 'year', label: 'Year' },
    { key: 'featured', label: 'Featured' },
    { key: 'stack', label: 'Stack' },
  ];

  const statusColors: Record<string, string> = {
    live: 'text-green-400 bg-green-500/10',
    beta: 'text-yellow-400 bg-yellow-500/10',
    prototype: 'text-purple-400 bg-purple-500/10',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-[#BFFF00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">Projects</h1>
          <p className="text-sm text-[#71717A] mt-0.5 font-mono">{sorted.length} items</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#27272A] text-white text-sm hover:bg-[#3F3F46] transition-colors"
            title="Refresh"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => setEditing('new')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3F3F46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#111113] border border-[#27272A] text-sm text-white font-mono focus:border-[#BFFF00]/50 focus:outline-none focus:ring-1 focus:ring-[#BFFF00]/20 transition-colors placeholder:text-[#3F3F46]"
        />
      </div>

      {/* Table */}
      <div className="bg-[#111113] border border-[#27272A] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#27272A]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider cursor-pointer hover:text-[#A1A1AA] transition-colors select-none"
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && (
                        <span className="text-[#BFFF00]">{sortDir === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </span>
                  </th>
                ))}
                <th className="text-right px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E21]">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-[#3F3F46] text-sm">
                    {search ? 'No results found' : 'No projects yet'}
                  </td>
                </tr>
              ) : (
                sorted.map((project) => (
                  <tr key={project.id} className="hover:bg-[#1E1E21]/50 transition-colors">
                    <td className="px-4 py-3 text-[#E4E4E7] whitespace-nowrap">
                      <div>
                        <span className="text-sm">{project.title_cs}</span>
                        <span className="block text-[10px] text-[#52525B] font-mono">{project.project_slug}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${statusColors[project.status] || 'text-[#A1A1AA] bg-[#27272A]'}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-mono text-[#A1A1AA]">{project.category}</span>
                    </td>
                    <td className="px-4 py-3 text-[#E4E4E7] whitespace-nowrap text-sm">{project.year}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {project.featured
                        ? <span className="text-[#BFFF00] text-xs">●</span>
                        : <span className="text-[#3F3F46] text-xs">○</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-[#71717A] max-w-[200px] truncate block">
                        {(project.stack || []).join(', ') || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setEditing(project)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-[#BFFF00] hover:bg-[#BFFF00]/10 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

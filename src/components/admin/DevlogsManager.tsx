import { useState, useEffect } from 'react';
import {
  fetchAllDevlogs,
  createDevlog,
  updateDevlog,
  deleteDevlog,
  type DevlogRow,
  type DevlogInsert,
  type DevlogFeature,
} from '../../lib/supabase-content';
import { triggerAutoDeploy } from '../../lib/auto-deploy';

const emptyDevlog: DevlogInsert = {
  devlog_slug: '',
  project_slug: '',
  version: '',
  version_status: 'beta',
  release_date: new Date().toISOString().slice(0, 10),
  summary_cs: '',
  summary_en: '',
  new_features: [],
  fixes: [],
  known_issues: [],
};

function FeatureList({
  label,
  items,
  onChange,
}: {
  label: string;
  items: DevlogFeature[];
  onChange: (items: DevlogFeature[]) => void;
}) {
  const inputCls =
    'w-full px-3 py-2 rounded-lg bg-[#0A0A0C] border border-[#27272A] text-white text-sm font-mono focus:border-[#BFFF00]/50 focus:outline-none focus:ring-1 focus:ring-[#BFFF00]/20 transition-colors placeholder:text-[#3F3F46]';

  const update = (idx: number, lang: 'cs' | 'en', val: string) => {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [lang]: val };
    onChange(copy);
  };

  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...items, { cs: '', en: '' }]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">{label}</span>
        <button
          type="button"
          onClick={add}
          className="text-[10px] font-mono text-[#BFFF00] hover:text-[#D4FF4D] transition-colors"
        >
          + Add
        </button>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input value={item.cs} onChange={(e) => update(idx, 'cs', e.target.value)} className={inputCls} placeholder="CS" />
            <input value={item.en} onChange={(e) => update(idx, 'en', e.target.value)} className={inputCls} placeholder="EN" />
          </div>
          <button
            type="button"
            onClick={() => remove(idx)}
            className="mt-2 text-[#3F3F46] hover:text-red-400 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      {items.length === 0 && <p className="text-xs text-[#3F3F46] font-mono">No items</p>}
    </div>
  );
}

function DevlogEditor({
  devlog,
  onSave,
  onCancel,
}: {
  devlog: DevlogRow | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<DevlogInsert>(
    devlog
      ? {
          devlog_slug: devlog.devlog_slug,
          project_slug: devlog.project_slug,
          version: devlog.version,
          version_status: devlog.version_status,
          release_date: devlog.release_date,
          summary_cs: devlog.summary_cs || '',
          summary_en: devlog.summary_en || '',
          new_features: devlog.new_features || [],
          fixes: devlog.fixes || [],
          known_issues: devlog.known_issues || [],
        }
      : { ...emptyDevlog }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  // Auto-generate slug from project_slug + version
  const autoSlug = () => {
    if (form.project_slug && form.version) {
      set('devlog_slug', `${form.project_slug}-${form.version.replace(/\./g, '-')}`);
    }
  };

  const handleSave = async () => {
    if (!form.devlog_slug || !form.project_slug || !form.version) {
      setError('Slug, project, and version are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (devlog) {
        await updateDevlog(devlog.id, form);
      } else {
        await createDevlog(form);
      }
      onSave();
      triggerAutoDeploy();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full px-3 py-2 rounded-lg bg-[#0A0A0C] border border-[#27272A] text-white text-sm font-mono focus:border-[#BFFF00]/50 focus:outline-none focus:ring-1 focus:ring-[#BFFF00]/20 transition-colors placeholder:text-[#3F3F46]';
  const labelCls = 'block text-xs font-mono text-[#A1A1AA] mb-1.5 uppercase tracking-wider';

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">
          {devlog ? 'Edit Devlog' : 'New Devlog'}
        </h1>
        <button onClick={onCancel} className="text-sm text-[#71717A] hover:text-white transition-colors">← Back</button>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">{error}</div>
      )}

      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Project Slug</label>
            <input value={form.project_slug} onChange={(e) => set('project_slug', e.target.value)} onBlur={autoSlug} className={inputCls} placeholder="facha" />
          </div>
          <div>
            <label className={labelCls}>Version</label>
            <input value={form.version} onChange={(e) => set('version', e.target.value)} onBlur={autoSlug} className={inputCls} placeholder="0.3.0" />
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.version_status} onChange={(e) => set('version_status', e.target.value)} className={inputCls}>
              <option value="alpha">Alpha</option>
              <option value="beta">Beta</option>
              <option value="stable">Stable</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Devlog Slug</label>
            <input value={form.devlog_slug} onChange={(e) => set('devlog_slug', e.target.value)} className={inputCls} placeholder="facha-0-3-0" />
          </div>
          <div>
            <label className={labelCls}>Release Date</label>
            <input type="date" value={form.release_date} onChange={(e) => set('release_date', e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Summary (CS)</label>
            <textarea value={form.summary_cs} onChange={(e) => set('summary_cs', e.target.value)} className={inputCls} rows={2} />
          </div>
          <div>
            <label className={labelCls}>Summary (EN)</label>
            <textarea value={form.summary_en} onChange={(e) => set('summary_en', e.target.value)} className={inputCls} rows={2} />
          </div>
        </div>
      </div>

      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5 space-y-5">
        <FeatureList label="New Features" items={form.new_features} onChange={(v) => set('new_features', v)} />
        <FeatureList label="Fixes" items={form.fixes} onChange={(v) => set('fixes', v)} />
        <FeatureList label="Known Issues" items={form.known_issues} onChange={(v) => set('known_issues', v)} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : devlog ? 'Update Devlog' : 'Create Devlog'}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-lg bg-[#27272A] text-white text-sm hover:bg-[#3F3F46] transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function DevlogsManager() {
  const [devlogs, setDevlogs] = useState<DevlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<DevlogRow | null | 'new'>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setDevlogs(await fetchAllDevlogs());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (editing !== null) {
    return (
      <DevlogEditor
        devlog={editing === 'new' ? null : editing}
        onSave={() => { setEditing(null); load(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  const filtered = devlogs.filter((d) =>
    [d.project_slug, d.version, d.summary_cs, d.summary_en].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (d: DevlogRow) => {
    if (!confirm(`Delete devlog ${d.project_slug} v${d.version}?`)) return;
    try {
      await deleteDevlog(d.id);
      load();
      triggerAutoDeploy();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">Devlogs</h1>
          <p className="text-sm text-[#71717A] mt-0.5 font-mono">{filtered.length} items</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Devlog
        </button>
      </div>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3F3F46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#111113] border border-[#27272A] text-sm text-white font-mono focus:border-[#BFFF00]/50 focus:outline-none focus:ring-1 focus:ring-[#BFFF00]/20 transition-colors placeholder:text-[#3F3F46]"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#52525B]">Loading...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-400 text-sm font-mono">{error}</div>
      ) : (
        <div className="bg-[#111113] border border-[#27272A] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#27272A]">
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Project</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Version</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Features</th>
                <th className="text-right px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E21]">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[#3F3F46]">No devlogs yet</td></tr>
              ) : filtered.map((d) => {
                const statusColors: Record<string, string> = {
                  alpha: 'text-blue-400 bg-blue-500/10',
                  beta: 'text-yellow-400 bg-yellow-500/10',
                  stable: 'text-green-400 bg-green-500/10',
                };
                return (
                  <tr key={d.id} className="hover:bg-[#1E1E21]/50 transition-colors">
                    <td className="px-4 py-3 text-[#E4E4E7] font-mono text-xs">{d.project_slug}</td>
                    <td className="px-4 py-3 text-[#BFFF00] font-mono text-xs">v{d.version}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${statusColors[d.version_status] || ''}`}>
                        {d.version_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#A1A1AA] font-mono text-xs">{d.release_date}</td>
                    <td className="px-4 py-3 text-[#71717A] text-xs">{(d.new_features || []).length}F / {(d.fixes || []).length}B / {(d.known_issues || []).length}I</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => setEditing(d)} className="px-2 py-1 rounded text-[11px] font-mono text-[#71717A] hover:text-white hover:bg-[#27272A] transition-colors">Edit</button>
                      <button onClick={() => handleDelete(d)} className="px-2 py-1 rounded text-[11px] font-mono text-[#71717A] hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

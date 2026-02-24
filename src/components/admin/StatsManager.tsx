import { useState, useEffect } from 'react';
import {
  fetchAllSiteStats,
  createSiteStat,
  updateSiteStat,
  deleteSiteStat,
  type SiteStatRow,
  type SiteStatInsert,
} from '../../lib/supabase-content';
import { triggerAutoDeploy } from '../../lib/auto-deploy';

const empty: SiteStatInsert = {
  stat_key: '',
  value_cs: '',
  value_en: '',
  label_cs: '',
  label_en: '',
  order: 0,
  icon: '',
};

function Editor({
  item,
  onSave,
  onCancel,
}: {
  item: SiteStatRow | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<SiteStatInsert>(
    item
      ? {
          stat_key: item.stat_key,
          value_cs: item.value_cs,
          value_en: item.value_en,
          label_cs: item.label_cs,
          label_en: item.label_en,
          order: item.order,
          icon: item.icon || '',
        }
      : { ...empty }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.stat_key || !form.value_cs || !form.value_en) {
      setError('Key and values are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (item) {
        await updateSiteStat(item.id, form);
      } else {
        await createSiteStat(form);
      }
      onSave();
      triggerAutoDeploy();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const i =
    'w-full px-3 py-2 rounded-lg bg-[#0A0A0C] border border-[#27272A] text-white text-sm font-mono focus:border-[#BFFF00]/50 focus:outline-none focus:ring-1 focus:ring-[#BFFF00]/20 transition-colors placeholder:text-[#3F3F46]';
  const l = 'block text-xs font-mono text-[#A1A1AA] mb-1.5 uppercase tracking-wider';

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">
          {item ? 'Edit Stat' : 'New Stat'}
        </h1>
        <button onClick={onCancel} className="text-sm text-[#71717A] hover:text-white transition-colors">← Back</button>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">{error}</div>
      )}

      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={l}>Key</label>
            <input value={form.stat_key} onChange={(e) => set('stat_key', e.target.value)} className={i} placeholder="projects" />
          </div>
          <div>
            <label className={l}>Icon (emoji)</label>
            <input value={form.icon} onChange={(e) => set('icon', e.target.value)} className={i} placeholder="🚀" />
          </div>
          <div>
            <label className={l}>Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} className={i} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={l}>Value (CS)</label>
            <input value={form.value_cs} onChange={(e) => set('value_cs', e.target.value)} className={i} placeholder="10+" />
          </div>
          <div>
            <label className={l}>Value (EN)</label>
            <input value={form.value_en} onChange={(e) => set('value_en', e.target.value)} className={i} placeholder="10+" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={l}>Label (CS)</label>
            <input value={form.label_cs} onChange={(e) => set('label_cs', e.target.value)} className={i} placeholder="Projektů" />
          </div>
          <div>
            <label className={l}>Label (EN)</label>
            <input value={form.label_en} onChange={(e) => set('label_en', e.target.value)} className={i} placeholder="Projects" />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : item ? 'Update' : 'Create'}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-lg bg-[#27272A] text-white text-sm hover:bg-[#3F3F46] transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function StatsManager() {
  const [items, setItems] = useState<SiteStatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<SiteStatRow | null | 'new'>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try { setItems(await fetchAllSiteStats()); }
    catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (editing !== null) {
    return <Editor item={editing === 'new' ? null : editing} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />;
  }

  const handleDelete = async (s: SiteStatRow) => {
    if (!confirm(`Delete stat "${s.stat_key}"?`)) return;
    try { await deleteSiteStat(s.id); load(); triggerAutoDeploy(); }
    catch (err: any) { alert(err.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">Site Stats</h1>
          <p className="text-sm text-[#71717A] mt-0.5 font-mono">{items.length} items — shown in About section</p>
        </div>
        <button onClick={() => setEditing('new')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Stat
        </button>
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
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Icon</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Key</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Value</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Label</th>
                <th className="text-right px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E21]">
              {items.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-[#3F3F46]">No stats yet</td></tr>
              ) : items.map((s) => (
                <tr key={s.id} className="hover:bg-[#1E1E21]/50 transition-colors">
                  <td className="px-4 py-3 text-base">{s.icon}</td>
                  <td className="px-4 py-3 text-[#A1A1AA] font-mono text-xs">{s.stat_key}</td>
                  <td className="px-4 py-3 text-[#BFFF00] font-mono font-bold">{s.value_en}</td>
                  <td className="px-4 py-3 text-[#E4E4E7]">{s.label_en}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => setEditing(s)} className="px-2 py-1 rounded text-[11px] font-mono text-[#71717A] hover:text-white hover:bg-[#27272A] transition-colors">Edit</button>
                    <button onClick={() => handleDelete(s)} className="px-2 py-1 rounded text-[11px] font-mono text-[#71717A] hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

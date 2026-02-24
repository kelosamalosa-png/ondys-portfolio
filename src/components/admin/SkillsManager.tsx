import { useState, useEffect } from 'react';
import {
  fetchAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  type SkillRow,
  type SkillInsert,
} from '../../lib/supabase-content';
import { triggerAutoDeploy } from '../../lib/auto-deploy';

const emptySkill: SkillInsert = {
  skill_slug: '',
  order: 0,
  title_cs: '',
  title_en: '',
  description_cs: '',
  description_en: '',
};

function SkillEditor({
  skill,
  onSave,
  onCancel,
}: {
  skill: SkillRow | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<SkillInsert>(
    skill
      ? {
          skill_slug: skill.skill_slug,
          order: skill.order,
          title_cs: skill.title_cs,
          title_en: skill.title_en,
          description_cs: skill.description_cs,
          description_en: skill.description_en,
        }
      : { ...emptySkill }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.skill_slug || !form.title_cs || !form.title_en) {
      setError('Slug and titles are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (skill) {
        await updateSkill(skill.id, form);
      } else {
        await createSkill(form);
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
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">
          {skill ? 'Edit Skill' : 'New Skill'}
        </h1>
        <button onClick={onCancel} className="text-sm text-[#71717A] hover:text-white transition-colors">
          ← Back
        </button>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Slug</label>
            <input value={form.skill_slug} onChange={(e) => set('skill_slug', e.target.value)} className={inputCls} placeholder="flutter" />
          </div>
          <div>
            <label className={labelCls}>Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Title (CS)</label>
            <input value={form.title_cs} onChange={(e) => set('title_cs', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Title (EN)</label>
            <input value={form.title_en} onChange={(e) => set('title_en', e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Description (CS)</label>
            <textarea value={form.description_cs} onChange={(e) => set('description_cs', e.target.value)} className={inputCls} rows={3} />
          </div>
          <div>
            <label className={labelCls}>Description (EN)</label>
            <textarea value={form.description_en} onChange={(e) => set('description_en', e.target.value)} className={inputCls} rows={3} />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : skill ? 'Update Skill' : 'Create Skill'}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-lg bg-[#27272A] text-white text-sm hover:bg-[#3F3F46] transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function SkillsManager() {
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<SkillRow | null | 'new'>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setSkills(await fetchAllSkills());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (editing !== null) {
    return (
      <SkillEditor
        skill={editing === 'new' ? null : editing}
        onSave={() => { setEditing(null); load(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  const filtered = skills.filter((s) =>
    [s.title_cs, s.title_en, s.skill_slug, s.description_cs].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (skill: SkillRow) => {
    if (!confirm(`Delete "${skill.title_en}"?`)) return;
    try {
      await deleteSkill(skill.id);
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
          <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">Skills</h1>
          <p className="text-sm text-[#71717A] mt-0.5 font-mono">{filtered.length} items</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Skill
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
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Title (CS)</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Title (EN)</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Description</th>
                <th className="text-right px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E21]">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-[#3F3F46]">No skills yet</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#1E1E21]/50 transition-colors">
                  <td className="px-4 py-3 text-[#A1A1AA] font-mono">{s.order}</td>
                  <td className="px-4 py-3 text-[#E4E4E7]">{s.title_cs}</td>
                  <td className="px-4 py-3 text-[#E4E4E7]">{s.title_en}</td>
                  <td className="px-4 py-3 text-[#71717A] max-w-[200px] truncate">{s.description_en}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => setEditing(s)} className="px-2 py-1 rounded text-[11px] font-mono text-[#71717A] hover:text-white hover:bg-[#27272A] transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(s)} className="px-2 py-1 rounded text-[11px] font-mono text-[#71717A] hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1">
                      Delete
                    </button>
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

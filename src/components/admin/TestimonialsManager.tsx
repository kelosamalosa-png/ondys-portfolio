import { useState, useEffect } from 'react';
import {
  fetchAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type TestimonialRow,
  type TestimonialInsert,
} from '../../lib/supabase-content';
import { triggerAutoDeploy } from '../../lib/auto-deploy';

const empty: TestimonialInsert = {
  order: 0,
  visible: true,
  name: '',
  role_cs: '',
  role_en: '',
  company: '',
  avatar_url: '',
  text_cs: '',
  text_en: '',
  rating: 5,
};

function Editor({
  item,
  onSave,
  onCancel,
}: {
  item: TestimonialRow | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<TestimonialInsert>(
    item
      ? {
          order: item.order,
          visible: item.visible,
          name: item.name,
          role_cs: item.role_cs,
          role_en: item.role_en,
          company: item.company || '',
          avatar_url: item.avatar_url || '',
          text_cs: item.text_cs,
          text_en: item.text_en,
          rating: item.rating,
        }
      : { ...empty }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.text_cs || !form.text_en) {
      setError('Name and texts are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (item) {
        await updateTestimonial(item.id, form);
      } else {
        await createTestimonial(form);
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
          {item ? 'Edit Testimonial' : 'New Testimonial'}
        </h1>
        <button onClick={onCancel} className="text-sm text-[#71717A] hover:text-white transition-colors">← Back</button>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">{error}</div>
      )}

      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={l}>Name</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} className={i} placeholder="Jan Novák" />
          </div>
          <div>
            <label className={l}>Company</label>
            <input value={form.company} onChange={(e) => set('company', e.target.value)} className={i} placeholder="Acme s.r.o." />
          </div>
          <div>
            <label className={l}>Avatar URL</label>
            <input value={form.avatar_url} onChange={(e) => set('avatar_url', e.target.value)} className={i} placeholder="https://..." />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={l}>Role (CS)</label>
            <input value={form.role_cs} onChange={(e) => set('role_cs', e.target.value)} className={i} placeholder="CEO" />
          </div>
          <div>
            <label className={l}>Role (EN)</label>
            <input value={form.role_en} onChange={(e) => set('role_en', e.target.value)} className={i} placeholder="CEO" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={l}>Text (CS)</label>
            <textarea value={form.text_cs} onChange={(e) => set('text_cs', e.target.value)} className={i} rows={4} />
          </div>
          <div>
            <label className={l}>Text (EN)</label>
            <textarea value={form.text_en} onChange={(e) => set('text_en', e.target.value)} className={i} rows={4} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={l}>Rating (1-5)</label>
            <input type="number" min={1} max={5} value={form.rating} onChange={(e) => set('rating', Number(e.target.value))} className={i} />
          </div>
          <div>
            <label className={l}>Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} className={i} />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.visible} onChange={(e) => set('visible', e.target.checked)} className="accent-[#BFFF00]" />
              <span className="text-xs font-mono text-[#A1A1AA]">Visible</span>
            </label>
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

export default function TestimonialsManager() {
  const [items, setItems] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<TestimonialRow | null | 'new'>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try { setItems(await fetchAllTestimonials()); }
    catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (editing !== null) {
    return <Editor item={editing === 'new' ? null : editing} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />;
  }

  const handleDelete = async (t: TestimonialRow) => {
    if (!confirm(`Delete testimonial from "${t.name}"?`)) return;
    try { await deleteTestimonial(t.id); load(); triggerAutoDeploy(); }
    catch (err: any) { alert(err.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">Testimonials</h1>
          <p className="text-sm text-[#71717A] mt-0.5 font-mono">{items.length} items</p>
        </div>
        <button onClick={() => setEditing('new')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Testimonial
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
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Company</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Rating</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Visible</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Text</th>
                <th className="text-right px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E21]">
              {items.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[#3F3F46]">No testimonials yet</td></tr>
              ) : items.map((t) => (
                <tr key={t.id} className="hover:bg-[#1E1E21]/50 transition-colors">
                  <td className="px-4 py-3 text-[#E4E4E7] font-semibold">{t.name}</td>
                  <td className="px-4 py-3 text-[#A1A1AA] text-xs">{t.company || '—'}</td>
                  <td className="px-4 py-3 text-[#BFFF00] font-mono text-xs">{'★'.repeat(t.rating)}</td>
                  <td className="px-4 py-3">{t.visible ? <span className="text-[#BFFF00] text-xs">●</span> : <span className="text-[#3F3F46] text-xs">○</span>}</td>
                  <td className="px-4 py-3 text-[#71717A] text-xs max-w-[200px] truncate">{t.text_en}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => setEditing(t)} className="px-2 py-1 rounded text-[11px] font-mono text-[#71717A] hover:text-white hover:bg-[#27272A] transition-colors">Edit</button>
                    <button onClick={() => handleDelete(t)} className="px-2 py-1 rounded text-[11px] font-mono text-[#71717A] hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1">Delete</button>
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

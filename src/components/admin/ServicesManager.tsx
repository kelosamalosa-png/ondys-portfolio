import { useState, useEffect } from 'react';
import {
  fetchAllServices,
  createService,
  updateService,
  deleteService,
  type ServiceRow,
  type ServiceInsert,
} from '../../lib/supabase-content';
import { triggerAutoDeploy } from '../../lib/auto-deploy';

const emptyService: ServiceInsert = {
  service_slug: '',
  slug_cs: '',
  slug_en: '',
  icon: '',
  order: 0,
  featured: true,
  title_cs: '',
  title_en: '',
  description_cs: '',
  description_en: '',
  tags: [],
  badge_cs: '',
  badge_en: '',
  price_cs: '',
  price_en: '',
  price_note_cs: '',
  price_note_en: '',
  related_project: '',
  seo_title_cs: '',
  seo_title_en: '',
  seo_description_cs: '',
  seo_description_en: '',
  body_cs: '',
  body_en: '',
};

function ServiceEditor({
  service,
  onSave,
  onCancel,
}: {
  service: ServiceRow | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ServiceInsert>(
    service
      ? {
          service_slug: service.service_slug,
          slug_cs: service.slug_cs,
          slug_en: service.slug_en,
          icon: service.icon,
          order: service.order,
          featured: service.featured,
          title_cs: service.title_cs,
          title_en: service.title_en,
          description_cs: service.description_cs,
          description_en: service.description_en,
          tags: service.tags || [],
          badge_cs: service.badge_cs || '',
          badge_en: service.badge_en || '',
          price_cs: service.price_cs || '',
          price_en: service.price_en || '',
          price_note_cs: service.price_note_cs || '',
          price_note_en: service.price_note_en || '',
          related_project: service.related_project || '',
          seo_title_cs: service.seo_title_cs || '',
          seo_title_en: service.seo_title_en || '',
          seo_description_cs: service.seo_description_cs || '',
          seo_description_en: service.seo_description_en || '',
          body_cs: service.body_cs || '',
          body_en: service.body_en || '',
        }
      : { ...emptyService }
  );
  const [tagsStr, setTagsStr] = useState((service?.tags || []).join(', '));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'general' | 'content' | 'seo'>('general');

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.service_slug || !form.title_cs || !form.title_en) {
      setError('Slug and titles are required');
      return;
    }
    const payload = { ...form, tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean) };
    setSaving(true);
    setError('');
    try {
      if (service) {
        await updateService(service.id, payload);
      } else {
        await createService(payload);
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
  const tabCls = (t: string) =>
    `px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${tab === t ? 'bg-[#BFFF00]/10 text-[#BFFF00]' : 'text-[#71717A] hover:text-white'}`;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">
          {service ? 'Edit Service' : 'New Service'}
        </h1>
        <button onClick={onCancel} className="text-sm text-[#71717A] hover:text-white transition-colors">← Back</button>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">{error}</div>
      )}

      <div className="flex gap-1 mb-2">
        <button className={tabCls('general')} onClick={() => setTab('general')}>General</button>
        <button className={tabCls('content')} onClick={() => setTab('content')}>Content</button>
        <button className={tabCls('seo')} onClick={() => setTab('seo')}>SEO</button>
      </div>

      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5 space-y-4">
        {tab === 'general' && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Service Slug</label>
                <input value={form.service_slug} onChange={(e) => set('service_slug', e.target.value)} className={inputCls} placeholder="flutter-app-development" />
              </div>
              <div>
                <label className={labelCls}>Slug CS</label>
                <input value={form.slug_cs} onChange={(e) => set('slug_cs', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Slug EN</label>
                <input value={form.slug_en} onChange={(e) => set('slug_en', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Icon (emoji)</label>
                <input value={form.icon} onChange={(e) => set('icon', e.target.value)} className={inputCls} placeholder="📱" />
              </div>
              <div>
                <label className={labelCls}>Order</label>
                <input type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} className={inputCls} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="accent-[#BFFF00]" />
                  <span className="text-xs font-mono text-[#A1A1AA]">Featured</span>
                </label>
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
            <div>
              <label className={labelCls}>Tags (comma separated)</label>
              <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className={inputCls} placeholder="Android, iOS, Offline-first" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Badge (CS)</label>
                <input value={form.badge_cs} onChange={(e) => set('badge_cs', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Badge (EN)</label>
                <input value={form.badge_en} onChange={(e) => set('badge_en', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Price (CS)</label>
                <input value={form.price_cs} onChange={(e) => set('price_cs', e.target.value)} className={inputCls} placeholder="od 50 000 Kč" />
              </div>
              <div>
                <label className={labelCls}>Price (EN)</label>
                <input value={form.price_en} onChange={(e) => set('price_en', e.target.value)} className={inputCls} placeholder="from €2,000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Price Note (CS)</label>
                <input value={form.price_note_cs} onChange={(e) => set('price_note_cs', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Price Note (EN)</label>
                <input value={form.price_note_en} onChange={(e) => set('price_note_en', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Related Project Slug</label>
              <input value={form.related_project} onChange={(e) => set('related_project', e.target.value)} className={inputCls} placeholder="facha" />
            </div>
          </>
        )}

        {tab === 'content' && (
          <>
            <div>
              <label className={labelCls}>Body (CS) — Markdown</label>
              <textarea value={form.body_cs} onChange={(e) => set('body_cs', e.target.value)} className={inputCls} rows={14} />
            </div>
            <div>
              <label className={labelCls}>Body (EN) — Markdown</label>
              <textarea value={form.body_en} onChange={(e) => set('body_en', e.target.value)} className={inputCls} rows={14} />
            </div>
          </>
        )}

        {tab === 'seo' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>SEO Title (CS)</label>
                <input value={form.seo_title_cs} onChange={(e) => set('seo_title_cs', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>SEO Title (EN)</label>
                <input value={form.seo_title_en} onChange={(e) => set('seo_title_en', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>SEO Description (CS)</label>
                <textarea value={form.seo_description_cs} onChange={(e) => set('seo_description_cs', e.target.value)} className={inputCls} rows={3} />
              </div>
              <div>
                <label className={labelCls}>SEO Description (EN)</label>
                <textarea value={form.seo_description_en} onChange={(e) => set('seo_description_en', e.target.value)} className={inputCls} rows={3} />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-lg bg-[#27272A] text-white text-sm hover:bg-[#3F3F46] transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ServicesManager() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<ServiceRow | null | 'new'>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setServices(await fetchAllServices());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (editing !== null) {
    return (
      <ServiceEditor
        service={editing === 'new' ? null : editing}
        onSave={() => { setEditing(null); load(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  const filtered = services.filter((s) =>
    [s.title_cs, s.title_en, s.service_slug, (s.tags || []).join(' ')].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (svc: ServiceRow) => {
    if (!confirm(`Delete "${svc.title_en}"?`)) return;
    try {
      await deleteService(svc.id);
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
          <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">Services</h1>
          <p className="text-sm text-[#71717A] mt-0.5 font-mono">{filtered.length} items</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Service
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
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Icon</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Featured</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Tags</th>
                <th className="text-right px-4 py-3 text-[10px] font-mono font-semibold text-[#52525B] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E21]">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[#3F3F46]">No services yet</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#1E1E21]/50 transition-colors">
                  <td className="px-4 py-3 text-base">{s.icon}</td>
                  <td className="px-4 py-3 text-[#E4E4E7]">{s.title_en}</td>
                  <td className="px-4 py-3 text-[#A1A1AA] font-mono text-xs">{s.price_en || '—'}</td>
                  <td className="px-4 py-3">{s.featured ? <span className="text-[#BFFF00] text-xs">●</span> : <span className="text-[#3F3F46] text-xs">○</span>}</td>
                  <td className="px-4 py-3 text-[#71717A] text-xs max-w-[150px] truncate">{(s.tags || []).join(', ')}</td>
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

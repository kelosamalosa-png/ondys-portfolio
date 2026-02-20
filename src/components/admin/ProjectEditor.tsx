import { useState, useEffect } from 'react';
import type { ProjectRow, ProjectInsert } from '../../lib/supabase-projects';
import { createProject, updateProject, deleteProject } from '../../lib/supabase-projects';
import ImageUpload from './ImageUpload';

interface ProjectEditorProps {
  project: ProjectRow | null;
  onSave: () => void;
  onCancel: () => void;
}

const emptyProject: ProjectInsert = {
  project_slug: '',
  status: 'prototype',
  category: 'app',
  featured: false,
  year: new Date().getFullYear(),
  title_cs: '',
  title_en: '',
  summary_cs: '',
  summary_en: '',
  body_cs: '',
  body_en: '',
  stack: [],
  links_website: '',
  links_demo: '',
  links_github: '',
  links_other: '',
  links_other_label: '',
  images: [],
};

export default function ProjectEditor({ project, onSave, onCancel }: ProjectEditorProps) {
  const isNew = !project;
  const [form, setForm] = useState<ProjectInsert>(
    project
      ? {
          project_slug: project.project_slug,
          status: project.status,
          category: project.category,
          featured: project.featured,
          year: project.year,
          title_cs: project.title_cs,
          title_en: project.title_en,
          summary_cs: project.summary_cs,
          summary_en: project.summary_en,
          body_cs: project.body_cs,
          body_en: project.body_en,
          stack: project.stack || [],
          links_website: project.links_website || '',
          links_demo: project.links_demo || '',
          links_github: project.links_github || '',
          links_other: project.links_other || '',
          links_other_label: project.links_other_label || '',
          images: project.images || [],
        }
      : { ...emptyProject }
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stackInput, setStackInput] = useState(form.stack.join(', '));
  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'links' | 'images'>('general');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = <K extends keyof ProjectInsert>(key: K, value: ProjectInsert[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
    setSuccess('');
  };

  const handleStackChange = (value: string) => {
    setStackInput(value);
    set('stack', value.split(',').map((s) => s.trim()).filter(Boolean));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (!form.project_slug) return setError('Slug is required');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.project_slug)) return setError('Slug must be lowercase letters, numbers, and hyphens');
    if (!form.title_cs) return setError('Czech title is required');
    if (!form.title_en) return setError('English title is required');

    setSaving(true);
    try {
      if (isNew) {
        await createProject(form);
      } else {
        await updateProject(project.id, form);
      }
      setSuccess('Saved!');
      setTimeout(() => onSave(), 600);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    setDeleting(true);
    try {
      await deleteProject(project.id);
      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
      setDeleting(false);
    }
  };

  const tabs = [
    { id: 'general' as const, label: 'General', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'content' as const, label: 'Content', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'links' as const, label: 'Links', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { id: 'images' as const, label: 'Images', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1 text-xs font-mono text-[#BFFF00] hover:text-[#D4FF4D] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">
            {isNew ? 'New Project' : `Edit: ${project.title_cs}`}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && !confirmDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Delete
            </button>
          )}
          {confirmDelete && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400 font-mono">Are you sure?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-2 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-2 rounded-lg text-sm text-[#71717A] hover:bg-[#27272A] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#09090B] border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status messages */}
      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}
      {success && (
        <div className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#27272A]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono transition-colors border-b-2 -mb-px
              ${activeTab === tab.id
                ? 'border-[#BFFF00] text-[#BFFF00]'
                : 'border-transparent text-[#71717A] hover:text-[#A1A1AA]'
              }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-[#111113] border border-[#27272A] rounded-xl p-5 space-y-5">
        {activeTab === 'general' && (
          <>
            {/* Row: Slug + Status + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Slug (URL)" hint="lowercase, hyphens only">
                <input
                  type="text"
                  value={form.project_slug}
                  onChange={(e) => set('project_slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  disabled={!isNew}
                  className={inputClass + (!isNew ? ' opacity-50 cursor-not-allowed' : '')}
                  placeholder="my-project"
                />
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={(e) => set('status', e.target.value as any)} className={inputClass}>
                  <option value="prototype">Prototype</option>
                  <option value="beta">Beta</option>
                  <option value="live">Live</option>
                </select>
              </Field>
              <Field label="Category">
                <select value={form.category} onChange={(e) => set('category', e.target.value as any)} className={inputClass}>
                  <option value="app">App</option>
                  <option value="tool">Tool</option>
                  <option value="web">Web</option>
                  <option value="game">Game</option>
                </select>
              </Field>
            </div>

            {/* Row: Year + Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Year">
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => set('year', parseInt(e.target.value) || 2025)}
                  className={inputClass}
                  min={2000}
                  max={2100}
                />
              </Field>
              <Field label="Featured">
                <label className="inline-flex items-center gap-2 mt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => set('featured', e.target.checked)}
                    className="w-4 h-4 rounded border-[#27272A] bg-[#0A0A0C] text-[#BFFF00] focus:ring-[#BFFF00]/20 accent-[#BFFF00]"
                  />
                  <span className="text-sm text-[#A1A1AA]">Show on homepage</span>
                </label>
              </Field>
              <Field label="Stack" hint="comma-separated">
                <input
                  type="text"
                  value={stackInput}
                  onChange={(e) => handleStackChange(e.target.value)}
                  className={inputClass}
                  placeholder="Flutter, React, Python"
                />
              </Field>
            </div>

            {/* Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Title (CZ)">
                <input type="text" value={form.title_cs} onChange={(e) => set('title_cs', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Title (EN)">
                <input type="text" value={form.title_en} onChange={(e) => set('title_en', e.target.value)} className={inputClass} />
              </Field>
            </div>

            {/* Summaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Summary (CZ)">
                <textarea value={form.summary_cs} onChange={(e) => set('summary_cs', e.target.value)} className={inputClass + ' h-20 resize-y'} />
              </Field>
              <Field label="Summary (EN)">
                <textarea value={form.summary_en} onChange={(e) => set('summary_en', e.target.value)} className={inputClass + ' h-20 resize-y'} />
              </Field>
            </div>
          </>
        )}

        {activeTab === 'content' && (
          <>
            <Field label="Body (CZ)" hint="Markdown supported">
              <textarea
                value={form.body_cs}
                onChange={(e) => set('body_cs', e.target.value)}
                className={inputClass + ' h-64 resize-y font-mono text-xs'}
                placeholder="## O projektu&#10;&#10;Detailní popis projektu..."
              />
            </Field>
            <Field label="Body (EN)" hint="Markdown supported">
              <textarea
                value={form.body_en}
                onChange={(e) => set('body_en', e.target.value)}
                className={inputClass + ' h-64 resize-y font-mono text-xs'}
                placeholder="## About&#10;&#10;Detailed project description..."
              />
            </Field>
          </>
        )}

        {activeTab === 'links' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Website URL">
                <input type="url" value={form.links_website} onChange={(e) => set('links_website', e.target.value)} className={inputClass} placeholder="https://..." />
              </Field>
              <Field label="Demo URL">
                <input type="url" value={form.links_demo} onChange={(e) => set('links_demo', e.target.value)} className={inputClass} placeholder="https://..." />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="GitHub URL">
                <input type="url" value={form.links_github} onChange={(e) => set('links_github', e.target.value)} className={inputClass} placeholder="https://github.com/..." />
              </Field>
              <Field label="Other URL">
                <input type="url" value={form.links_other} onChange={(e) => set('links_other', e.target.value)} className={inputClass} placeholder="https://..." />
              </Field>
            </div>
            <Field label="Other Link Label" hint="Custom button text">
              <input type="text" value={form.links_other_label} onChange={(e) => set('links_other_label', e.target.value)} className={inputClass} placeholder="Download APK" />
            </Field>
          </>
        )}

        {activeTab === 'images' && (
          <ImageUpload
            projectSlug={form.project_slug || 'new-project'}
            images={form.images}
            onChange={(imgs) => set('images', imgs)}
          />
        )}
      </div>
    </div>
  );
}

// ---- Helper components ----

const inputClass = 'w-full px-3 py-2 rounded-lg bg-[#0A0A0C] border border-[#27272A] text-sm text-white font-mono focus:border-[#BFFF00]/50 focus:outline-none focus:ring-1 focus:ring-[#BFFF00]/20 transition-colors placeholder:text-[#3F3F46]';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
        {label}
        {hint && <span className="text-[#3F3F46] normal-case ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

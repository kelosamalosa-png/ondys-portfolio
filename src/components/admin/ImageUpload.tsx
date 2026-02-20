import { useState, useRef } from 'react';
import { uploadProjectImage, deleteProjectImage } from '../../lib/supabase-projects';

interface ImageUploadProps {
  projectSlug: string;
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUpload({ projectSlug, images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);

    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          setError(`${file.name} is not an image`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError(`${file.name} is too large (max 5MB)`);
          continue;
        }
        const url = await uploadProjectImage(projectSlug, file);
        newUrls.push(url);
      }
      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = async (index: number) => {
    const url = images[index];
    try {
      await deleteProjectImage(url);
    } catch {
      // Image might already be deleted from storage, continue anyway
    }
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleReorder = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">
        Screenshots / Images
      </label>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, idx) => (
            <div key={url} className="relative group rounded-lg overflow-hidden border border-[#27272A] bg-[#0A0A0C]">
              <img
                src={url}
                alt={`Screenshot ${idx + 1}`}
                className="w-full h-32 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(idx, idx - 1)}
                    className="p-1.5 rounded bg-[#27272A] text-white hover:bg-[#3F3F46] transition-colors"
                    title="Move left"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {idx < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(idx, idx + 1)}
                    className="p-1.5 rounded bg-[#27272A] text-white hover:bg-[#3F3F46] transition-colors"
                    title="Move right"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  title="Remove"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-[#71717A]">
                {idx + 1}/{images.length}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${dragOver ? 'border-[#BFFF00] bg-[#BFFF00]/5' : 'border-[#27272A] hover:border-[#3F3F46]'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-[#BFFF00] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[#71717A] font-mono">Uploading...</span>
          </div>
        ) : (
          <>
            <svg className="w-8 h-8 mx-auto mb-2 text-[#3F3F46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-[#71717A] font-mono">
              Drop images here or <span className="text-[#BFFF00]">click to browse</span>
            </p>
            <p className="text-[10px] text-[#3F3F46] mt-1">PNG, JPG, WebP — max 5MB</p>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 font-mono">{error}</p>
      )}
    </div>
  );
}

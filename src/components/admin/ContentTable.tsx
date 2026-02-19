import { useState } from 'react';

interface Column {
  key: string;
  label: string;
}

interface ContentTableProps {
  title: string;
  columns: Column[];
  rows: Record<string, any>[];
  editBaseUrl?: string;
  onNewClick?: () => void;
  newLabel?: string;
  githubRepo?: string;
  contentFolder?: string;
}

function CellValue({ colKey, value }: { colKey: string; value: any }) {
  if (value === undefined || value === null) return <span className="text-sm text-[#3F3F46]">—</span>;

  if (colKey === 'status') {
    const colors: Record<string, string> = {
      live: 'text-green-400 bg-green-500/10',
      beta: 'text-yellow-400 bg-yellow-500/10',
      prototype: 'text-purple-400 bg-purple-500/10',
      alpha: 'text-blue-400 bg-blue-500/10',
      stable: 'text-green-400 bg-green-500/10',
    };
    return (
      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${colors[value] || 'text-[#A1A1AA] bg-[#27272A]'}`}>
        {value}
      </span>
    );
  }

  if (colKey === 'featured') {
    return value
      ? <span className="text-[#BFFF00] text-xs">●</span>
      : <span className="text-[#3F3F46] text-xs">○</span>;
  }

  if (colKey === 'category') {
    return <span className="text-xs font-mono text-[#A1A1AA]">{value}</span>;
  }

  if (colKey === 'version') {
    return <span className="text-xs font-mono text-[#BFFF00]">v{value}</span>;
  }

  if (colKey === 'icon') {
    return <span className="text-base">{value}</span>;
  }

  if (colKey === 'stack' || colKey === 'tags') {
    if (!value) return <span className="text-[#3F3F46]">—</span>;
    return <span className="text-xs text-[#71717A] max-w-[200px] truncate block">{value}</span>;
  }

  return <span className="text-sm">{String(value)}</span>;
}

export default function ContentTable({
  title,
  columns,
  rows,
  editBaseUrl,
  onNewClick,
  newLabel = 'New',
  githubRepo = 'kelosamalosa-png/ondys-portfolio',
  contentFolder,
}: ContentTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = rows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const aVal = String(a[sortKey] || '');
        const bVal = String(b[sortKey] || '');
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

  const getGitHubEditUrl = (slug: string) => {
    if (!contentFolder) return null;
    return `https://github.com/${githubRepo}/edit/main/${contentFolder}/${slug}.md`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">{title}</h1>
          <p className="text-sm text-[#71717A] mt-0.5 font-mono">{sorted.length} items</p>
        </div>
        <div className="flex items-center gap-2">
          {onNewClick && (
            <button
              onClick={onNewClick}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {newLabel}
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3F3F46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
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
                    {search ? 'No results found' : 'No items yet'}
                  </td>
                </tr>
              ) : (
                sorted.map((row, idx) => (
                  <tr key={row._slug || idx} className="hover:bg-[#1E1E21]/50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-[#E4E4E7] whitespace-nowrap">
                        <CellValue colKey={col.key} value={row[col.key]} />
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {row._slug && getGitHubEditUrl(row._slug) && (
                          <a
                            href={getGitHubEditUrl(row._slug)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono text-[#71717A] hover:text-white hover:bg-[#27272A] transition-colors"
                            title="Edit on GitHub"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </a>
                        )}
                      </div>
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

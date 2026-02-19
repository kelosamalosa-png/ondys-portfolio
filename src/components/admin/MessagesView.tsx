import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function MessagesView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[Space_Grotesk]">Messages</h1>
          <p className="text-sm text-[#71717A] mt-0.5 font-mono">{messages.length} messages</p>
        </div>
        <button
          onClick={fetchMessages}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#27272A] text-white text-sm hover:bg-[#3F3F46] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {selected ? (
        <div className="bg-[#111113] border border-[#27272A] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#27272A]">
            <button
              onClick={() => setSelected(null)}
              className="text-xs font-mono text-[#BFFF00] hover:text-[#D4FF4D] transition-colors"
            >
              ← Back to list
            </button>
            <span className="text-xs font-mono text-[#52525B]">{formatDate(selected.created_at)}</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#52525B] uppercase tracking-wider">Name</span>
                <p className="text-sm text-white mt-1">{selected.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#52525B] uppercase tracking-wider">Email</span>
                <a href={`mailto:${selected.email}`} className="block text-sm text-[#BFFF00] mt-1 hover:text-[#D4FF4D]">
                  {selected.email}
                </a>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#52525B] uppercase tracking-wider">Message</span>
              <p className="text-sm text-[#E4E4E7] mt-1 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
            </div>
            <div className="pt-3 border-t border-[#1E1E21]">
              <a
                href={`mailto:${selected.email}?subject=Re: ondys.dev contact`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#BFFF00] text-[#09090B] text-sm font-semibold hover:bg-[#D4FF4D] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Reply
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#111113] border border-[#27272A] rounded-xl overflow-hidden">
          {messages.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-[#3F3F46]">No messages yet</p>
          ) : (
            <div className="divide-y divide-[#1E1E21]">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelected(msg)}
                  className="w-full flex items-start gap-3 px-5 py-4 hover:bg-[#1E1E21]/50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-[#27272A] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-mono text-[#A1A1AA]">{msg.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-white truncate">{msg.name}</span>
                      <span className="text-[10px] font-mono text-[#52525B] shrink-0">{formatDate(msg.created_at)}</span>
                    </div>
                    <span className="text-xs text-[#BFFF00] font-mono">{msg.email}</span>
                    <p className="text-xs text-[#71717A] mt-1 line-clamp-2">{msg.message}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

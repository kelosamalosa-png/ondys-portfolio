import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';

interface ContactFormProps {
  lang: 'cs' | 'en';
}

const labels = {
  cs: {
    name: 'Jméno',
    email: 'E-mail',
    message: 'Zpráva',
    send: 'Odeslat',
    sending: 'Odesílám...',
    success: 'Zpráva odeslána! Ozvu se co nejdříve.',
    error: 'Něco se pokazilo. Zkuste to znovu nebo napište přímo na email.',
    orEmail: 'Nebo přímo na',
  },
  en: {
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send',
    sending: 'Sending...',
    success: 'Message sent! I\'ll get back to you soon.',
    error: 'Something went wrong. Try again or email directly.',
    orEmail: 'Or email directly at',
  },
};

export default function ContactForm({ lang }: ContactFormProps) {
  const t = labels[lang];
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const inputClasses =
    'w-full px-4 py-3 bg-[#111113] border border-[#27272A] rounded-lg text-white text-sm placeholder-[#52525B] focus:outline-none focus:ring-2 focus:ring-[#BFFF00]/40 focus:border-[#BFFF00]/40 transition-all font-sans';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check
    if (formData.get('website')) {
      setStatus('success');
      return;
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
      setStatus('error');
      setErrorMsg(lang === 'cs' ? 'Vyplňte všechna pole.' : 'Please fill in all fields.');
      return;
    }

    const { error } = await supabase.from('contact_messages').insert([
      { name, email, message },
    ]);

    if (error) {
      setStatus('error');
      setErrorMsg(t.error);
      console.error('Contact form error:', error);
    } else {
      setStatus('success');
      form.reset();
    }
  };

  return (
    <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-8">
      {status === 'success' ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white font-medium mb-2">{t.success}</p>
          <button
            onClick={() => setStatus('idle')}
            className="text-xs font-mono text-[#BFFF00] hover:text-[#D4FF4D] transition-colors mt-2"
          >
            {lang === 'cs' ? '← Nová zpráva' : '← New message'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
          </div>

          {status === 'error' && errorMsg && (
            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-mono font-medium text-[#71717A] uppercase tracking-wider mb-2">
                {t.name}
              </label>
              <input type="text" id="name" name="name" required className={inputClasses} />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-mono font-medium text-[#71717A] uppercase tracking-wider mb-2">
                {t.email}
              </label>
              <input type="email" id="email" name="email" required className={inputClasses} />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-mono font-medium text-[#71717A] uppercase tracking-wider mb-2">
              {t.message}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className={`${inputClasses} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#BFFF00] text-[#09090B] font-semibold text-sm hover:bg-[#D4FF4D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? t.sending : t.send}
            {status !== 'sending' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
            {status === 'sending' && (
              <div className="w-4 h-4 border-2 border-[#09090B] border-t-transparent rounded-full animate-spin" />
            )}
          </button>
        </form>
      )}

      <div className="mt-6 pt-6 border-t border-[#1E1E21] text-center">
        <p className="text-[#52525B] text-xs font-mono mb-2">{t.orEmail}</p>
        <a
          href="mailto:ondys.dev@gmail.com"
          className="text-[#BFFF00] hover:text-[#D4FF4D] font-mono text-sm transition-colors"
        >
          ondys.dev@gmail.com
        </a>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
      form.reset();
    } catch {
      setError('Network error. Check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        style={{
          border: '1px solid var(--mk-border)',
          background: 'var(--mk-accent-soft)',
          borderRadius: '10px',
          padding: '2rem',
        }}
      >
        <h3 className="mk-h3" style={{ marginBottom: '0.6rem' }}>Message sent</h3>
        <p className="mk-body" style={{ margin: 0 }}>
          Thanks for reaching out. Someone from our team reads every message
          and will reply within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.1rem' }}>
        <div>
          <label className="mk-label" htmlFor="contact-name">Full name</label>
          <input className="mk-input" id="contact-name" name="name" required autoComplete="name" />
        </div>
        <div>
          <label className="mk-label" htmlFor="contact-email">Work email</label>
          <input className="mk-input" id="contact-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>

      <div style={{ marginTop: '1.1rem' }}>
        <label className="mk-label" htmlFor="contact-company">
          Company <span style={{ fontWeight: 400, color: 'var(--mk-ink-muted)' }}>(optional)</span>
        </label>
        <input className="mk-input" id="contact-company" name="company" autoComplete="organization" />
      </div>

      <div style={{ marginTop: '1.1rem' }}>
        <label className="mk-label" htmlFor="contact-message">How can we help?</label>
        <textarea
          className="mk-textarea"
          id="contact-message"
          name="message"
          required
          placeholder="Tell us about the project, the problem, or the role you're hiring for."
        />
      </div>

      {status === 'error' && (
        <p
          role="alert"
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            background: 'oklch(0.95 0.03 27)',
            color: 'oklch(0.40 0.16 27)',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {error}
        </p>
      )}

      <button className="mk-btn" type="submit" disabled={status === 'submitting'} style={{ marginTop: '1.5rem' }}>
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}

'use client';

import { useRef, useState } from 'react';

export default function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    const data = new FormData(e.currentTarget);
    data.set('jobId', jobId);
    try {
      const res = await fetch('/api/applications', { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
      formRef.current?.reset();
      setFileName('');
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
        <h3 className="mk-h3" style={{ marginBottom: '0.6rem' }}>Application received</h3>
        <p className="mk-body" style={{ margin: 0 }}>
          Thanks for applying to {jobTitle}. Your resume is with our recruiting
          team; if the fit looks right, you&apos;ll hear from us within a week.
        </p>
        <button
          className="mk-btn-ghost"
          style={{ marginTop: '1.25rem', background: 'oklch(1 0 0)' }}
          onClick={() => setStatus('idle')}
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate={false}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.1rem' }}>
        <div>
          <label className="mk-label" htmlFor="apply-name">Full name</label>
          <input className="mk-input" id="apply-name" name="name" required autoComplete="name" />
        </div>
        <div>
          <label className="mk-label" htmlFor="apply-email">Email</label>
          <input className="mk-input" id="apply-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>

      <div style={{ marginTop: '1.1rem' }}>
        <label className="mk-label" htmlFor="apply-phone">
          Phone <span style={{ fontWeight: 400, color: 'var(--mk-ink-muted)' }}>(optional)</span>
        </label>
        <input className="mk-input" id="apply-phone" name="phone" type="tel" autoComplete="tel" />
      </div>

      <div style={{ marginTop: '1.1rem' }}>
        <label className="mk-label" htmlFor="apply-resume">Resume</label>
        <label
          htmlFor="apply-resume"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            border: '1px dashed var(--mk-border)',
            borderRadius: '6px',
            padding: '0.9rem 1rem',
            cursor: 'pointer',
            background: 'oklch(1 0 0)',
          }}
        >
          <span className="mk-btn-ghost" style={{ padding: '0.4rem 0.9rem', fontSize: '0.825rem', pointerEvents: 'none' }}>
            Choose file
          </span>
          <span style={{ fontSize: '0.875rem', color: fileName ? 'var(--mk-ink)' : 'var(--mk-ink-muted)' }}>
            {fileName || 'PDF, DOC, DOCX, TXT, or RTF · up to 8 MB'}
          </span>
        </label>
        <input
          id="apply-resume"
          name="resume"
          type="file"
          required
          accept=".pdf,.doc,.docx,.txt,.rtf"
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden' }}
          onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
        />
      </div>

      <div style={{ marginTop: '1.1rem' }}>
        <label className="mk-label" htmlFor="apply-note">
          Anything else? <span style={{ fontWeight: 400, color: 'var(--mk-ink-muted)' }}>(optional)</span>
        </label>
        <textarea
          className="mk-textarea"
          id="apply-note"
          name="note"
          placeholder="A link to your work, or context a resume can't carry."
          style={{ minHeight: '90px' }}
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
        {status === 'submitting' ? 'Submitting…' : 'Submit application'}
      </button>
    </form>
  );
}

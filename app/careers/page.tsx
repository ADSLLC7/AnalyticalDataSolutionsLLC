import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';
import Reveal from '@/components/site/Reveal';
import { getOpenJobs } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Careers | Analytical Data Solutions',
  description:
    'Open roles at Analytical Data Solutions: cloud engineering, data engineering, DevOps, integration, and technical recruiting.',
};

export const dynamic = 'force-dynamic';

export default async function CareersPage() {
  const jobs = await getOpenJobs();

  return (
    <div className="mk">
      <SiteNav />

      <main>
        <section className="mk-section" style={{ paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <div className="mk-container">
            <h1 className="mk-h1 hero-line" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
              Careers
            </h1>
            <p className="mk-lead hero-line" style={{ marginTop: '1.25rem' }}>
              Build your career at Analytical Data Solutions LLC: real
              projects, direct mentorship, and clients who build things. Every
              application gets a human read; if it&apos;s a fit, you hear from
              us within a week.
            </p>
            <p className="mk-body hero-line" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              HR, onboarding, timesheets, and immigration compliance are
              managed through OnBlick, so your paperwork is never the thing
              holding you up.
            </p>
          </div>
        </section>

        <section style={{ paddingBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <div className="mk-container">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
              alt="Team members working together at a shared table, laptops open"
              loading="lazy"
              style={{ width: '100%', aspectRatio: '4 / 1', maxHeight: '280px', objectFit: 'cover', borderRadius: '14px', display: 'block' }}
            />
          </div>
        </section>

        <section className="mk-section" style={{ paddingTop: 0 }}>
          <div className="mk-container">
            {jobs.length === 0 ? (
              <div
                style={{
                  border: '1px dashed var(--mk-border)',
                  borderRadius: '10px',
                  padding: 'clamp(2.5rem, 5vw, 4rem)',
                  textAlign: 'center',
                }}
              >
                <h2 className="mk-h3" style={{ marginBottom: '0.7rem' }}>No open roles right now</h2>
                <p className="mk-body" style={{ margin: '0 auto' }}>
                  We post every opening here first. Check back soon, or send a
                  note to{' '}
                  <a href="mailto:hr@analyticaldatasolution.com" className="mk-link" style={{ display: 'inline' }}>
                    hr@analyticaldatasolution.com
                  </a>{' '}
                  and we&apos;ll keep your resume on file.
                </p>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid var(--mk-border)' }}>
                {jobs.map((job, i) => (
                  <Reveal key={job.id} delay={i * 40}>
                    <Link
                      href={`/careers/${job.id}`}
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      <div
                        className="mk-row"
                        style={{ alignItems: 'center', gridTemplateColumns: '1fr auto' }}
                      >
                        <div>
                          <h2 className="mk-h3" style={{ marginBottom: '0.35rem' }}>{job.title}</h2>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--mk-ink-muted)', fontWeight: 500 }}>
                            {job.practice} · {job.location} · {job.type}
                          </p>
                          <p className="mk-body" style={{ margin: '0.6rem 0 0', fontSize: '0.9rem' }}>
                            {job.summary}
                          </p>
                        </div>
                        <span className="mk-link" style={{ whiteSpace: 'nowrap' }}>
                          View role
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

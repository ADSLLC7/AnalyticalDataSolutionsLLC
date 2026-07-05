import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteNav from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';
import ApplyForm from '@/components/site/ApplyForm';
import { getJob } from '@/lib/cms';

export const dynamic = 'force-dynamic';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob(params.id);
  if (!job) return { title: 'Role not found | Analytical Data Solutions' };
  return {
    title: `${job.title} | Careers at Analytical Data Solutions`,
    description: job.summary,
  };
}

export default async function JobPage({ params }: Props) {
  const job = await getJob(params.id);
  if (!job || job.status !== 'open') notFound();

  return (
    <div className="mk">
      <SiteNav />

      <main>
        <section className="mk-section" style={{ paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <div className="mk-container">
            <Link href="/careers" className="mk-link" style={{ fontSize: '0.875rem' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden style={{ transform: 'rotate(180deg)' }}>
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All open roles
            </Link>
            <h1 className="mk-h1 hero-line" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', marginTop: '1.25rem' }}>
              {job.title}
            </h1>
            <p className="hero-line" style={{ marginTop: '0.8rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--mk-ink-muted)' }}>
              {job.practice} · {job.location} · {job.type}
            </p>
          </div>
        </section>

        <section className="mk-section" style={{ paddingTop: 0 }}>
          <div className="mk-container mk-split-narrow" style={{ alignItems: 'start' }}>
            {/* Role details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
              <div>
                <h2 className="mk-h3" style={{ marginBottom: '0.8rem' }}>The role</h2>
                <p className="mk-body" style={{ margin: 0 }}>{job.summary}</p>
              </div>

              <div>
                <h2 className="mk-h3" style={{ marginBottom: '0.8rem' }}>What you&apos;ll do</h2>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {job.responsibilities.map((r) => (
                    <li key={r} style={{ display: 'flex', gap: '0.6rem', alignItems: 'baseline', fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--mk-ink)' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden style={{ flexShrink: 0, transform: 'translateY(1px)' }}>
                        <path d="M2 6.5l2.5 2.5L10 3.5" stroke="var(--mk-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="mk-h3" style={{ marginBottom: '0.8rem' }}>What we&apos;re looking for</h2>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {job.qualifications.map((q) => (
                    <li key={q} style={{ display: 'flex', gap: '0.6rem', alignItems: 'baseline', fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--mk-ink)' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden style={{ flexShrink: 0, transform: 'translateY(1px)' }}>
                        <path d="M2 6.5l2.5 2.5L10 3.5" stroke="var(--mk-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--mk-ink-muted)', margin: 0 }}>
                Posted {new Date(job.postedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {/* Application form */}
            <div
              style={{
                border: '1px solid var(--mk-border)',
                borderRadius: '12px',
                padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                background: 'var(--mk-surface)',
                position: 'sticky',
                top: '90px',
              }}
            >
              <h2 className="mk-h3" style={{ marginBottom: '0.4rem' }}>Apply for this role</h2>
              <p className="mk-body" style={{ fontSize: '0.875rem', margin: '0 0 1.5rem' }}>
                Attach your resume; everything else is optional.
              </p>
              <ApplyForm jobId={job.id} jobTitle={job.title} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

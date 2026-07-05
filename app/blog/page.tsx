import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';
import Reveal from '@/components/site/Reveal';
import { getPosts } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Blog | Analytical Data Solutions',
  description:
    'Practical writing on AI, data engineering, cloud infrastructure, and the tech hiring market from the ADS team.',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const [featured, ...rest] = await getPosts();

  return (
    <div className="mk">
      <SiteNav />

      <main>
        <section className="mk-section" style={{ paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <div className="mk-container">
            <h1 className="mk-h1 hero-line" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
              Blog
            </h1>
            <p className="mk-lead hero-line" style={{ marginTop: '1.25rem' }}>
              What the Analytical Data Solutions LLC team is seeing in AI,
              data, and infrastructure, written from client work rather than
              press releases.
            </p>
          </div>
        </section>

        {/* Sliding topic ticker */}
        <section style={{ paddingBottom: 'clamp(1.5rem, 3vw, 2rem)' }} aria-hidden>
          <div className="mk-container">
            <div className="mk-ticker">
              <div className="mk-ticker-track">
                {[...Array(2)].flatMap((_, dup) =>
                  [
                    'Agentic AI', 'LLM cost engineering', 'RAG pipelines', 'Data engineering',
                    'Cloud FinOps', 'Kubernetes', 'Salesforce', 'Workday', 'Java & .NET',
                    'Hiring market', 'Vector search', 'Platform engineering',
                  ].map((t) => (
                    <span
                      key={`${dup}-${t}`}
                      style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.9rem',
                        borderRadius: '999px',
                        background: 'var(--mk-accent-soft)',
                        color: 'var(--mk-accent)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Header image */}
        <section style={{ paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <div className="mk-container">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
              alt="Analyst's desk with a laptop showing charts beside handwritten notes"
              loading="lazy"
              style={{ width: '100%', aspectRatio: '4 / 1', maxHeight: '280px', objectFit: 'cover', borderRadius: '14px', display: 'block' }}
            />
          </div>
        </section>

        {/* Featured */}
        <section style={{ paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <div className="mk-container">
            <Reveal>
              <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <article
                  className="mk-deep-band mk-lift"
                  style={{
                    borderRadius: '14px',
                    padding: 'clamp(1.75rem, 4vw, 3rem)',
                  }}
                >
                  <span className="mk-tag" style={{ background: 'var(--mk-deep-soft)', color: 'var(--mk-on-deep)' }}>
                    {featured.tag}
                  </span>
                  <h2 className="mk-h2" style={{ margin: '1rem 0 0.9rem', maxWidth: '24ch' }}>
                    {featured.title}
                  </h2>
                  <p style={{ color: 'var(--mk-on-deep-muted)', fontSize: '1rem', lineHeight: 1.65, maxWidth: '62ch', margin: '0 0 1.4rem' }}>
                    {featured.excerpt}
                  </p>
                  <p style={{ fontSize: '0.825rem', color: 'var(--mk-on-deep-muted)', fontWeight: 500, margin: 0 }}>
                    {featured.author} ·{' '}
                    {new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {' · '}{featured.readMinutes} min read
                  </p>
                </article>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Rest */}
        <section className="mk-section" style={{ paddingTop: 0 }}>
          <div className="mk-container mk-grid-cards">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={i * 50}>
                <Link href={`/blog/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                  <article
                    className="mk-lift"
                    style={{
                      border: '1px solid var(--mk-border)',
                      borderRadius: '10px',
                      padding: '1.5rem',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.8rem',
                      background: 'oklch(1 0 0)',
                    }}
                  >
                    <span className="mk-tag">{p.tag}</span>
                    <h2 className="mk-h3" style={{ textWrap: 'balance' }}>{p.title}</h2>
                    <p className="mk-body" style={{ fontSize: '0.9rem', margin: 0 }}>{p.excerpt}</p>
                    <p style={{ marginTop: 'auto', marginBottom: 0, fontSize: '0.8rem', color: 'var(--mk-ink-muted)', fontWeight: 500 }}>
                      {new Date(p.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      {' · '}{p.readMinutes} min read
                    </p>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

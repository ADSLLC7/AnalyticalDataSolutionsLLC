import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteNav from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';
import { getPosts, getPostBySlug } from '@/lib/cms';

type Props = { params: { slug: string } };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Post not found | Analytical Data Solutions' };
  return {
    title: `${post.title} | ADS Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const others = (await getPosts()).filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="mk">
      <SiteNav />

      <main>
        <article>
          <header className="mk-section" style={{ paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="mk-container" style={{ maxWidth: '820px' }}>
              <Link href="/blog" className="mk-link" style={{ fontSize: '0.875rem' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden style={{ transform: 'rotate(180deg)' }}>
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                All posts
              </Link>
              <p style={{ margin: '1.5rem 0 0' }}>
                <span className="mk-tag">{post.tag}</span>
              </p>
              <h1 className="mk-h1 hero-line" style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', marginTop: '1rem' }}>
                {post.title}
              </h1>
              <p className="hero-line" style={{ marginTop: '1.1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--mk-ink-muted)' }}>
                {post.author} ·{' '}
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {' · '}{post.readMinutes} min read
              </p>
            </div>
          </header>

          <div className="mk-container" style={{ maxWidth: '820px', paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
            {post.body.map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: '1.0325rem',
                  lineHeight: 1.8,
                  color: 'var(--mk-ink)',
                  margin: i === 0 ? 0 : '1.4rem 0 0',
                  maxWidth: '68ch',
                  textWrap: 'pretty',
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </article>

        {/* Read next */}
        <section className="mk-section" style={{ borderTop: '1px solid var(--mk-border)', background: 'var(--mk-surface)' }}>
          <div className="mk-container">
            <h2 className="mk-h2" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.8rem)', marginBottom: '1.75rem' }}>
              Read next
            </h2>
            <div className="mk-grid-cards">
              {others.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <article
                    className="mk-lift"
                    style={{
                      border: '1px solid var(--mk-border)',
                      borderRadius: '10px',
                      padding: '1.5rem',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.7rem',
                      background: 'oklch(1 0 0)',
                    }}
                  >
                    <span className="mk-tag">{p.tag}</span>
                    <h3 className="mk-h3" style={{ textWrap: 'balance' }}>{p.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--mk-ink-muted)', fontWeight: 500, margin: 'auto 0 0' }}>
                      {p.readMinutes} min read
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

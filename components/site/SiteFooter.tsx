import Link from 'next/link';
import Logo from '@/components/site/Logo';

const COLUMNS = [
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/services', label: 'Services' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact us' },
    ],
  },
  {
    heading: 'Work with us',
    links: [
      { href: '/careers', label: 'Open roles' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mk-deep-band" style={{ marginTop: 'auto' }}>
      <div className="mk-container" style={{ paddingBlock: 'clamp(2.75rem, 5vw, 4rem)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          <div>
            <div style={{ marginBottom: '1.1rem' }}>
              <Logo size={38} onDark stacked />
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--mk-on-deep-muted)', margin: '0 0 1.1rem', maxWidth: '32ch' }}>
              Analytical Data Solutions LLC provides IT consulting and technical
            staffing for mid-market companies and growth-stage startups.
            </p>
            <a
              href="mailto:hr@analyticaldatasolution.com"
              style={{ color: 'var(--mk-on-deep)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}
            >
              hr@analyticaldatasolution.com
            </a>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', margin: '0 0 0.9rem' }}>{col.heading}</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      style={{ color: 'var(--mk-on-deep-muted)', fontSize: '0.875rem', textDecoration: 'none' }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p style={{ fontWeight: 700, fontSize: '0.875rem', margin: '0 0 0.9rem' }}>Office</p>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--mk-on-deep-muted)', margin: 0 }}>
              3300 West Dallas Pkwy, Ste 200
              <br />
              Plano, Texas 75093
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 'clamp(2rem, 4vw, 3rem)',
            paddingTop: '1.4rem',
            borderTop: '1px solid var(--mk-border-deep)',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--mk-on-deep-muted)', margin: 0 }}>
            &copy; {new Date().getFullYear()} Analytical Data Solutions LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

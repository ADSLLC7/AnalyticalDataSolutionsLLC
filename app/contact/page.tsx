import type { Metadata } from 'next';
import SiteNav from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';
import ContactForm from '@/components/site/ContactForm';

export const metadata: Metadata = {
  title: 'Contact us | Analytical Data Solutions',
  description:
    'Talk to Analytical Data Solutions about cloud, data, DevOps, integration, or technical staffing. We reply within one business day.',
};

export default function ContactPage() {
  return (
    <div className="mk">
      <SiteNav />

      <main>
        <section className="mk-section">
          <div className="mk-container mk-split-narrow" style={{ alignItems: 'start' }}>
            <div>
              <h1 className="mk-h1 hero-line" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
                Contact us
              </h1>
              <p className="mk-lead hero-line" style={{ marginTop: '1.25rem' }}>
                Describe the project, the problem, or the role. A real person
                at Analytical Data Solutions LLC reads every message and
                replies within one business day.
              </p>

              <div className="hero-line" style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <p className="mk-label" style={{ marginBottom: '0.2rem' }}>Email</p>
                  <a href="mailto:hr@analyticaldatasolution.com" className="mk-link">
                    hr@analyticaldatasolution.com
                  </a>
                </div>
                <div>
                  <p className="mk-label" style={{ marginBottom: '0.2rem' }}>Office</p>
                  <p className="mk-body" style={{ margin: 0 }}>
                    3300 West Dallas Pkwy, Ste 200
                    <br />
                    Plano, Texas 75093
                  </p>
                </div>
              </div>
            </div>

            <div
              className="hero-line"
              style={{
                border: '1px solid var(--mk-border)',
                borderRadius: '12px',
                padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                background: 'var(--mk-surface)',
              }}
            >
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

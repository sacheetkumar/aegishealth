import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function PrivacyPage() {
  return (
    <main className={styles.main}>
      <nav className={styles.navBar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </span>
          Aegis Health
        </div>
        <Link href="/" className={styles.backBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block' }}>
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Dashboard
        </Link>
      </nav>

      <article className={styles.contentCard}>
        <header className={styles.header}>
          <h1>Privacy Policy & Security Declaration</h1>
          <p className={styles.subtitle}>Effective Date: June 9, 2026</p>
        </header>

        <section className={styles.section}>
          <h2>1. Client-Side AI Processing</h2>
          <p>
            At Aegis Health, we prioritize patient confidentiality. All disease classification models and symptom-checking functions—including our Naive Bayes Machine Learning Engine—execute **entirely inside your local web browser**. 
          </p>
          <p>
            Your symptom selections, text queries, and computed match percentages are never transmitted, uploaded, or stored on our servers.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Personal Health Information (PHI)</h2>
          <p>
            This portal does not store or process certified Personal Health Information (PHI). We do not request medical records, health insurance details, or biological diagnostics. The symptom checker is a clinical simulation designed to refer you to specialist categories.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Mock Booking & Scheduling Data</h2>
          <p>
            The appointment scheduling calendar in our Referral Directory is a **simulation tool**. The patient names, dates, and phone numbers you enter during slot bookings are saved temporarily in browser memory (session storage) only. This information is discarded once the browser tab is closed and is never saved to a database or shared with third parties.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Cookies & Web Storage</h2>
          <p>
            We use browser standard `localStorage` and `sessionStorage` strictly to maintain your visual settings (such as dark/light mode preferences) and mock user sessions (such as sign-in login badges). We do not use cross-site tracking cookies or advertising trackers.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Medical Simulator Disclaimer</h2>
          <p>
            Aegis Health is a software simulator. It does not constitute certified medical advice, diagnosis, or clinical treatment plans. If you are experiencing a severe medical emergency, please contact your local healthcare providers or urgent care services immediately.
          </p>
        </section>

        <footer className={styles.cardFooter}>
          <p>For inquiries regarding our software security protocols, contact security@aegisaihealth.demo</p>
          <Link href="/" className={styles.dashboardLink}>
            Return to Dashboard
          </Link>
        </footer>
      </article>
    </main>
  );
}

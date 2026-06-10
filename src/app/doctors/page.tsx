'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from '../page.module.css'; // Reuse home page styles
import DoctorList from '@/components/DoctorList';
import DirectBookingModal from '@/components/DirectBookingModal';

function DoctorsContent() {
  const searchParams = useSearchParams();
  const initialSpecialty = searchParams.get('specialty') || undefined;

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Auth Form Fields
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGoogleChooserActive, setIsGoogleChooserActive] = useState(false);

  // Sync theme and session on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const mockSession = sessionStorage.getItem('userSession');
    if (mockSession) {
      setCurrentUser(JSON.parse(mockSession));
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setAuthError(null);
    setEmailInput('');
    setPasswordInput('');
    setNameInput('');
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
    setAuthError(null);
    setIsGoogleChooserActive(false);
  };

  const handleGoogleSelect = async (name: string, email: string) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || 'Google authentication failed.');
        setAuthLoading(false);
        setIsGoogleChooserActive(false);
        return;
      }

      const sessionUser = { email: data.user.email, name: data.user.name };
      setCurrentUser(sessionUser);
      sessionStorage.setItem('userSession', JSON.stringify(sessionUser));
      setIsGoogleChooserActive(false);
      setIsAuthOpen(false);
    } catch (err) {
      console.error('Google auth error:', err);
      setAuthError('An unexpected error occurred during Google sign in.');
      setIsGoogleChooserActive(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleUseOther = () => {
    const email = prompt('Enter your Google email address:');
    if (!email) return;

    if (!email.includes('@') || !email.includes('.')) {
      alert('Please enter a valid email address.');
      return;
    }

    const prefix = email.split('@')[0];
    const name = prefix
      .split(/[^a-zA-Z]/)
      .filter(Boolean)
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ') || 'Google User';

    handleGoogleSelect(name, email);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;

    setAuthLoading(true);
    setAuthError(null);

    try {
      const endpoint = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/signin';
      const body = authMode === 'signup' 
        ? { name: nameInput || 'User', email: emailInput, password: passwordInput }
        : { email: emailInput, password: passwordInput };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed. Please try again.');
        setAuthLoading(false);
        return;
      }

      const sessionUser = { email: data.user.email, name: data.user.name };
      setCurrentUser(sessionUser);
      sessionStorage.setItem('userSession', JSON.stringify(sessionUser));
      setIsAuthOpen(false);
    } catch (err: any) {
      console.error('Auth error:', err);
      setAuthError('An unexpected error occurred. Please try again later.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogOut = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('userSession');
  };

  return (
    <main className={styles.main}>
      {/* Top contact & social bar */}
      <div className={styles.topBar}>
        <div className={styles.topContactInfo}>
          <a href="mailto:sacheetkumar001@gmail.com" className={styles.topContactItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            sacheetkumar001@gmail.com
          </a>
          <a href="tel:+15551234567" className={styles.topContactItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            +1 (555) 123-4567
          </a>
        </div>
        <div className={styles.topSocials}>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.topSocialLink} title="LinkedIn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.topSocialLink} title="Facebook">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a href="https://github.com/sacheetkumar/aegishealth" target="_blank" rel="noopener noreferrer" className={styles.topSocialLink} title="GitHub">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.topSocialLink} title="Instagram">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className={styles.navBar}>
        <Link href="/" className={styles.logo} style={{ textDecoration: 'none' }}>
          <span className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </span>
          Aegis Health
        </Link>

        {/* Right side navigation utilities */}
        <div className={styles.controls}>
          <Link href="/" className={styles.signupBtn} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard Home
          </Link>

          <button onClick={() => setIsBookingOpen(true)} className={styles.signupBtn} style={{ fontSize: '0.85rem', padding: '8px 16px', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Book Appointment
          </button>

          {/* Authentication Section */}
          {currentUser ? (
            <div className={styles.userSection}>
              <div className={styles.userBadge} title={currentUser.email}>
                <span className={styles.userInitials}>
                  {currentUser.name[0]?.toUpperCase()}
                </span>
                <span className={styles.userNameText}>{currentUser.name}</span>
              </div>
              <button onClick={handleLogOut} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button
                onClick={() => handleOpenAuth('signin')}
                className={styles.signupBtn}
                style={{ border: 'none' }}
              >
                Sign In
              </button>
              <button
                onClick={() => handleOpenAuth('signup')}
                className={styles.signupBtn}
                style={{ border: 'none' }}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Icon-Only Theme Toggle (shift to right-most) */}
          <button
            onClick={toggleTheme}
            className={styles.themeToggleIcon}
            aria-label="Toggle Theme"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Banner for Doctors Directory matching DoctorOnCall */}
      <section className={styles.doctorsHero}>
        <div className={styles.doctorsHeroOverlay}></div>
        <div className={styles.doctorsHeroContent}>
          <h1>FIND A DOCTOR</h1>
          <div className={styles.doctorsHeroDivider}></div>
          <p>Search by name, specialty, or filters below.</p>
        </div>
      </section>

      {/* Directory Section */}
      <section className="glass-card" style={{ padding: '32px', minHeight: '60vh' }}>
        <DoctorList
          filteredSpecialty={initialSpecialty}
          currentUser={currentUser}
        />
      </section>

      {/* Auth Modal */}
      {isAuthOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={handleCloseAuth} className={styles.closeBtn}>×</button>

            {isGoogleChooserActive ? (
              <div className={styles.googleChooser}>
                <h3>Choose an account</h3>
                <p>to continue to Aegis Health</p>

                <div className={styles.googleAccountList}>
                  <button
                    onClick={() => handleGoogleSelect('Sacheet Kumar', 'sacheetkumar001@gmail.com')}
                    className={styles.googleAccountItem}
                  >
                    <div className={styles.googleAvatar}>S</div>
                    <div className={styles.googleAccountDetails}>
                      <span className={styles.googleAccountName}>Sacheet Kumar</span>
                      <span className={styles.googleAccountEmail}>sacheetkumar001@gmail.com</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleGoogleSelect('Guest User', 'guest.aegis@gmail.com')}
                    className={styles.googleAccountItem}
                  >
                    <div className={styles.googleAvatar}>G</div>
                    <div className={styles.googleAccountDetails}>
                      <span className={styles.googleAccountName}>Guest User</span>
                      <span className={styles.googleAccountEmail}>guest.aegis@gmail.com</span>
                    </div>
                  </button>

                  <button
                    onClick={handleGoogleUseOther}
                    className={styles.googleAccountItem}
                  >
                    <div className={styles.googleAvatar}>+</div>
                    <div className={styles.googleAccountDetails}>
                      <span className={styles.googleAccountName}>Use another account</span>
                    </div>
                  </button>
                </div>

                <button onClick={() => setIsGoogleChooserActive(false)} className={styles.googleCancelBtn}>
                  Back to Form
                </button>
              </div>
            ) : (
              <>
                <div className={styles.authTabs}>
                  <button
                    onClick={() => { setAuthMode('signin'); setAuthError(null); }}
                    className={`${styles.authTabButton} ${authMode === 'signin' ? styles.activeAuthTabButton : ''}`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                    className={`${styles.authTabButton} ${authMode === 'signup' ? styles.activeAuthTabButton : ''}`}
                  >
                    Sign Up
                  </button>
                </div>

                {authError && (
                  <div className={styles.authErrorMsg} role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block', flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className={styles.authForm}>
                  {authMode === 'signup' && (
                    <div className={styles.inputGroup}>
                      <label htmlFor="authName">Full Name</label>
                      <input
                        id="authName"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                      />
                    </div>
                  )}

                  <div className={styles.inputGroup}>
                    <label htmlFor="authEmail">Email Address</label>
                    <input
                      id="authEmail"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="authPassword">Password</label>
                    <input
                      id="authPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className={styles.authSubmitBtn}
                  >
                    {authLoading ? 'Verifying Account...' : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
                  </button>

                  <div className={styles.divider}>
                    <span>or</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsGoogleChooserActive(true)}
                    className={styles.googleAuthBtn}
                  >
                    <svg className={styles.googleIcon} width="16" height="16" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.62v3.02h3.87c2.26-2.08 3.58-5.14 3.58-8.49z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.12C3.26 20.22 7.37 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.27 14.27c-.24-.72-.38-1.5-.38-2.27s.14-1.55.38-2.27V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.98-3.12z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 3.78 1.29 7.61l3.98 3.12c.95-2.85 3.6-4.98 6.73-4.98z"
                      />
                    </svg>
                    <span>{authMode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <DirectBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        currentUser={currentUser}
      />

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/privacy" className={styles.footerLink}>
            Privacy Policy & Data Security
          </Link>
        </div>
        <p>© 2026 Aegis AI Health Platform. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--fg-color)', fontFamily: 'var(--font-body)' }}>
        Loading Referral Directory...
      </div>
    }>
      <DoctorsContent />
    </Suspense>
  );
}

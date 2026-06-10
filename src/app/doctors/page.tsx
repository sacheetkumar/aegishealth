'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from '../page.module.css'; // Reuse home page styles
import DoctorList from '@/components/DoctorList';

function DoctorsContent() {
  const searchParams = useSearchParams();
  const initialSpecialty = searchParams.get('specialty') || undefined;

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  
  // Auth Form Fields
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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
          <Link href="/" className={styles.navLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard Home
          </Link>

          {/* Icon-Only Theme Toggle */}
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
                className={styles.signinBtn}
              >
                Sign In
              </button>
              <button
                onClick={() => handleOpenAuth('signup')}
                className={styles.signupBtn}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

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
            </form>
          </div>
        </div>
      )}

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

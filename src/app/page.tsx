'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Predictor from '@/components/Predictor';
import ChatAssistant from '@/components/ChatAssistant';
import PrescriptionUpload from '@/components/PrescriptionUpload';
import DirectBookingModal from '@/components/DirectBookingModal';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    question: 'How does the AI disease prediction work?',
    answer: 'Aegis uses a client-side Machine Learning Naive Bayes classifier. It is trained on structured clinical symptom-disease vectors, evaluating both prior likelihood P(Disease) and conditional symptom weights P(Symptom | Disease) to compute a percentage-based confidence match for your symptoms.'
  },
  {
    id: 2,
    question: 'Is my personal health data stored or shared?',
    answer: 'No. To guarantee patient privacy, the entire diagnostic engine and text processing execute client-side directly in your browser. We do not transmit, save, or upload any symptom check logs, queries, or medical results to any remote databases.'
  },
  {
    id: 3,
    question: 'How are the recommended doctors matched?',
    answer: 'Referral recommendations are determined by standard clinical guidelines matching predicted diseases to specialties. For instance, respiratory symptoms refer to Pulmonologists, stomach conditions refer to Gastroenterologists, and skin rashes refer to Dermatologists.'
  },
  {
    id: 4,
    question: 'Can I book real clinical consultations through this platform?',
    answer: 'The scheduling calendar is a mock booking system built for demonstration purposes. It simulates slot reservation, validation checks, and patient notification workflows but does not schedule physical doctor visits.'
  },
  {
    id: 5,
    question: 'Is Aegis a replacement for certified medical advice?',
    answer: 'No. Aegis Health is a software simulation tool. It is not certified for clinical diagnostic use or medical treatment plans. For any real health emergency, please contact your local emergency services or visit an urgent care facility immediately.'
  }
];

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<'predictor' | 'chatbot' | 'prescription'>('predictor');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Authentication State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);

  // Auth Form Fields
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isGoogleChooserActive, setIsGoogleChooserActive] = useState(false);

  // FAQ Accordion State
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  const loadAppointments = async (email?: string) => {
    const activeEmail = email || currentUser?.email;
    if (!activeEmail) {
      setAppointments([]);
      return;
    }
    try {
      const res = await fetch(`/api/appointments?email=${encodeURIComponent(activeEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      const res = await fetch('/api/appointments/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        loadAppointments();
      }
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
    }
  };

  // Sync theme and session on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Check if user session mock exists
    const mockSession = sessionStorage.getItem('userSession');
    if (mockSession) {
      const parsedUser = JSON.parse(mockSession);
      setCurrentUser(parsedUser);
      loadAppointments(parsedUser.email);
    }
  }, []);

  // Sync appointments list when currentUser changes
  useEffect(() => {
    if (currentUser) {
      loadAppointments(currentUser.email);
    } else {
      setAppointments([]);
    }
  }, [currentUser]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Redirect to separate Doctors page with selected specialty recommendation
  const handleRecommendDoctors = (specialty: string) => {
    router.push(`/doctors?specialty=${encodeURIComponent(specialty)}`);
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setAuthError(null);
    // Clear inputs
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

  const toggleFaq = (id: number) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  return (
    <main className={styles.main}>
      {/* Navigation bar */}
      <nav className={styles.navBar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </span>
          Aegis Health
        </div>

        {/* Right side navigation utilities */}
        <div className={styles.controls}>
          <Link href="/doctors" className={styles.signupBtn} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Find Doctors
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

      {/* Hero Banner */}
      <section className={styles.hero}>
        <h1>AI-Powered Disease Prediction &   Doctor Recommendation</h1>
        <p>
          Diagnose health symptoms instantly with our Naive Bayes Machine Learning model and connect with specialized local physicians for follow-up care.
        </p>
      </section>

      {/* Core Platform Metrics */}
      <section className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricNum}>Bayes v1.0</div>
          <div className={styles.metricLabel}>Dynamic AI Engine</div>
          <div className={styles.metricDesc}>Trained on probabilistic diagnostic symptom vectors</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricNum}>20+ Types</div>
          <div className={styles.metricLabel}>Trained Conditions</div>
          <div className={styles.metricDesc}>Coverage of primary medical disease classifications</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricNum}>100 Doctors</div>
          <div className={styles.metricLabel}>Specialist Network</div>
          <div className={styles.metricDesc}>On-duty board physicians with instant schedule booking</div>
        </div>
      </section>

      {/* Tabs Menu */}
      <section className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button
            onClick={() => setActiveTab('predictor')}
            className={`${styles.tabButton} ${activeTab === 'predictor' ? styles.activeTabButton : ''}`}
          >
            <span className={styles.tabIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
              </svg>
            </span>
            Symptom Matrix Selector
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`${styles.tabButton} ${activeTab === 'chatbot' ? styles.activeTabButton : ''}`}
          >
            <span className={styles.tabIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            Conversational AI Health Advisor
          </button>
          <button
            onClick={() => setActiveTab('prescription')}
            className={`${styles.tabButton} ${activeTab === 'prescription' ? styles.activeTabButton : ''}`}
          >
            <span className={styles.tabIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </span>
            Prescription OCR Analyzer
          </button>
        </div>

        <div className={`${styles.tabContent} glass-card`} style={{ padding: '24px' }}>
          {activeTab === 'predictor' && (
            <Predictor onRecommendDoctors={handleRecommendDoctors} />
          )}
          {activeTab === 'chatbot' && (
            <ChatAssistant onRecommendDoctors={handleRecommendDoctors} />
          )}
          {activeTab === 'prescription' && (
            <PrescriptionUpload 
              onRecommendDoctors={handleRecommendDoctors} 
              currentUser={currentUser}
            />
          )}
        </div>
      </section>

      {/* Booked Appointments Section (Logged-in only) */}
      {currentUser && appointments.length > 0 && (
        <section className={`${styles.appointmentsSection} glass-card`} style={{ padding: '32px' }}>
          <div className={styles.appointmentsHeader}>
            <div className={styles.appointmentsTitle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline-block', color: 'var(--primary-color)' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h2>Your Scheduled Consultations</h2>
            </div>
            <p>Manage your upcoming physician appointments and clinic schedules.</p>
          </div>
          <div className={styles.appointmentsGrid}>
            {appointments.map(app => (
              <div key={app.id} className={styles.appointmentCard}>
                <div className={styles.appointmentHeader}>
                  <div>
                    <h3>{app.docName}</h3>
                    <span className={styles.appointmentSpecialty}>{app.specialty}</span>
                  </div>
                  <button
                    onClick={() => handleCancelAppointment(app.id)}
                    className={styles.cancelAppBtn}
                    title="Cancel Appointment"
                  >
                    Cancel
                  </button>
                </div>
                <div className={styles.appointmentDetails}>
                  <div className={styles.appointmentDetailRow}>
                    <span className={styles.detailLabel}>Patient:</span>
                    <span>{app.patientName} ({app.patientPhone})</span>
                  </div>
                  <div className={styles.appointmentDetailRow}>
                    <span className={styles.detailLabel}>Schedule:</span>
                    <span><strong>{app.date}</strong> at <strong>{app.time}</strong></span>
                  </div>
                  <div className={styles.appointmentDetailRow}>
                    <span className={styles.detailLabel}>Location:</span>
                    <span>{app.clinic}, {app.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* FAQs Section */}
      <section className={styles.faqSection}>
        <div className={styles.sectionHeader}>
          <h2>Frequently Asked Questions</h2>
          <p>Answers to common inquiries regarding our clinical diagnostics and scheduling procedures.</p>
        </div>

        <div className={styles.faqList}>
          {FAQ_ITEMS.map(faq => {
            const isOpen = expandedFaqId === faq.id;
            return (
              <div key={faq.id} className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ''}`}>
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className={styles.faqQuestionRow}
                  aria-expanded={isOpen}
                >
                  <span className={styles.faqQuestion}>{faq.question}</span>
                  <span className={`${styles.faqIcon} ${isOpen ? styles.faqIconOpen : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className={`${styles.faqAnswerRow} animate-fade-in`}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Unified Authentication Modal Popup */}
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
        onAppointmentBooked={() => loadAppointments()}
      />

      {/* Footer copyright and redirect links */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/privacy" className={styles.footerLink}>
            Privacy Policy & Data Security
          </Link>
          <span className={styles.footerSeparator}>•</span>
          <a href="#top" className={styles.footerLink}>Back to Top</a>
        </div>
        <p>© 2026 Aegis AI Health Platform. All rights reserved.</p>
      </footer>
    </main>
  );
}

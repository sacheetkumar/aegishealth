'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Doctor, doctorsList } from '@/lib/dataset';
import styles from './DoctorList.module.css';

interface DoctorListProps {
  filteredSpecialty?: string;
  onClearSpecialtyFilter?: () => void;
  currentUser?: { email: string; name: string } | null;
  onAppointmentBooked?: () => void;
}

export default function DoctorList({ 
  filteredSpecialty, 
  onClearSpecialtyFilter,
  currentUser,
  onAppointmentBooked
}: DoctorListProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking states
  const [bookingDoc, setBookingDoc] = useState<Doctor | null>(null);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync specialty filter from parent
  useEffect(() => {
    if (filteredSpecialty) {
      setSelectedSpecialty(filteredSpecialty);
    } else {
      setSelectedSpecialty('All');
    }
  }, [filteredSpecialty]);

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setAppointmentDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Unique specialties for dropdown
  const uniqueSpecialties = useMemo(() => {
    const specialties = doctorsList.map(d => d.specialty);
    return ['All', ...Array.from(new Set(specialties))];
  }, []);

  // Filter doctors list
  const filteredDoctors = useMemo(() => {
    return doctorsList.filter(doc => {
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSpecialty && matchesSearch;
    });
  }, [selectedSpecialty, searchQuery]);

  const handleOpenBooking = (doctor: Doctor, slot: string) => {
    setBookingDoc(doctor);
    setBookingSlot(slot);
    setBookingConfirmed(false);
    
    // Autofill details if user session exists
    if (currentUser) {
      setPatientName(currentUser.name);
    }
  };

  const handleCloseBooking = () => {
    setBookingDoc(null);
    setBookingSlot(null);
    setPatientName('');
    setPatientPhone('');
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoc || !bookingSlot || !patientName.trim() || !patientPhone.trim() || !appointmentDate) return;

    setIsSubmitting(true);
    
    try {
      const newApp = {
        id: Date.now().toString(),
        docName: bookingDoc.name,
        specialty: bookingDoc.specialty,
        clinic: bookingDoc.clinic,
        location: bookingDoc.location,
        patientName,
        patientPhone,
        date: appointmentDate,
        time: bookingSlot,
        userEmail: currentUser?.email || 'guest'
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to book appointment');
      }

      setBookingConfirmed(true);

      if (onAppointmentBooked) {
        onAppointmentBooked();
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      alert(`Failed to schedule consultation: ${err.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to calculate mock fees based on experience
  const getMockFees = (experience: number) => {
    return Math.min(60 + experience * 5, 180);
  };

  // Helper to generate mockup phone numbers based on ID
  const getMockPhone = (id: string) => {
    const num = id.replace(/[^0-9]/g, '') || '4567';
    return `+1 (555) 019-${num.substring(0, 4).padEnd(4, '8')}`;
  };

  // Helper to generate mock review counts
  const getMockReviewsCount = (rating: number, id: string) => {
    const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
    return Math.floor((seed % 40) + rating * 6);
  };

  return (
    <div className={styles.mainContainer}>
      {/* Sidebar Filter Panel (Matching DoctorOnCall layout) */}
      <aside className={styles.sidebarFilters}>
        <div className={styles.sidebarHeader}>
          <h3>Filter Directory</h3>
          <p>Narrow down physician listings</p>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="searchName">Search by Name/Location</label>
          <div className={styles.inputWrapper}>
            <svg className={styles.inputIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              id="searchName"
              type="text"
              placeholder="Doctor, clinic, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="selectSpecialty">Specialization Specialty</label>
          <select
            id="selectSpecialty"
            value={selectedSpecialty}
            onChange={(e) => {
              setSelectedSpecialty(e.target.value);
              if (e.target.value === 'All' && onClearSpecialtyFilter) {
                onClearSpecialtyFilter();
              }
            }}
          >
            {uniqueSpecialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        {filteredSpecialty && (
          <button onClick={onClearSpecialtyFilter} className={styles.resetBtn}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Reset AI Recommender
          </button>
        )}
      </aside>

      {/* Main Grid Section (Matching HealthBooker 3-column layout) */}
      <section className={styles.contentCol}>
        <div className={styles.contentHeader}>
          <h2>Physician Referral Directory</h2>
          <span className={styles.resultsCount}>{filteredDoctors.length} Specialists Available</span>
        </div>

        {filteredDoctors.length > 0 ? (
          <div className={styles.grid}>
            {filteredDoctors.map(doc => {
              const isMatchedReferral = doc.specialty === filteredSpecialty;
              const fees = getMockFees(doc.experience);
              const phone = getMockPhone(doc.id);
              const reviews = getMockReviewsCount(doc.rating, doc.id);
              
              return (
                <div key={doc.id} className={`${styles.docCard} ${isMatchedReferral ? styles.matchedDocCard : ''}`}>
                  {isMatchedReferral && (
                    <span className={styles.recommendedBadge}>AI Recommended</span>
                  )}
                  
                  {/* Doctor Profile Details Header */}
                  <div className={styles.docHeader}>
                    <div className={styles.avatar}>
                      {/* Generates nice avatar illustrations initials */}
                      {doc.name.split(' ')[1]?.[0] ? `${doc.name.split(' ')[0][0]}${doc.name.split(' ')[1][0]}` : doc.name[0]}
                    </div>
                    
                    <div className={styles.docNameBox}>
                      <h3>
                        {doc.name}
                        {/* Verified badge matching DoctorOnCall */}
                        <span className={styles.verifiedTick} title="Verified Medical Professional">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </span>
                      </h3>
                      <div className={styles.specialtyBadge}>{doc.specialty}</div>
                    </div>
                  </div>

                  {/* Doctor Info Body */}
                  <div className={styles.docBody}>
                    <div className={styles.metaRow}>
                      <span className={styles.ratingStars}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <strong>{doc.rating.toFixed(1)}</strong> ({reviews} reviews)
                      </span>
                    </div>

                    <div className={styles.detailsList}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Experience:</span>
                        <span className={styles.detailVal}>{doc.experience} Years</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Consultation Fee:</span>
                        <span className={styles.detailVal} style={{ color: 'var(--primary-color)', fontWeight: 600 }}>$ {fees}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Phone:</span>
                        <span className={styles.detailVal}>{phone}</span>
                      </div>
                    </div>

                    <div className={styles.locationBlock}>
                      <div className={styles.locationLine}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                          <line x1="9" y1="22" x2="9" y2="16"/>
                          <line x1="15" y1="22" x2="15" y2="16"/>
                        </svg>
                        <span>{doc.clinic}</span>
                      </div>
                      <div className={styles.locationLine}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>{doc.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Consultation Slot Selection (Interactive Booking) */}
                  <div className={styles.slotsBlock}>
                    <span className={styles.slotsTitle}>Available Slots Today</span>
                    <div className={styles.slotsGrid}>
                      {doc.availableSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => handleOpenBooking(doc, slot)}
                          className={styles.slotBtn}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <p>No medical specialists match your current search queries. Try adjusting your filters.</p>
          </div>
        )}
      </section>

      {/* Booking Confirmation Dialog Modal */}
      {bookingDoc && bookingSlot && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={handleCloseBooking} className={styles.closeBtn} aria-label="Close dialog">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {!bookingConfirmed ? (
              <>
                <div className={styles.modalHeader}>
                  <h2>Schedule Consultation</h2>
                  <p>Provide contact details to request your diagnostic appointment.</p>
                </div>

                <form onSubmit={handleConfirmBooking} className={styles.modalBody}>
                  <div className={styles.bookingSummary}>
                    <div className={styles.summaryRow}>
                      <span>Doctor:</span>
                      <strong>{bookingDoc.name} ({bookingDoc.specialty})</strong>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Preferred Slot:</span>
                      <strong>{bookingSlot}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Clinic:</span>
                      <strong>{bookingDoc.clinic}</strong>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="patientNameInput">Patient Full Name</label>
                    <input
                      id="patientNameInput"
                      type="text"
                      placeholder="e.g. John Doe"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="patientPhoneInput">Contact Phone Number</label>
                    <input
                      id="patientPhoneInput"
                      type="tel"
                      placeholder="e.g. +1 (555) 019-2834"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="appointmentDateInput">Preferred Date</label>
                    <input
                      id="appointmentDateInput"
                      type="date"
                      required
                      value={appointmentDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.confirmBtn}
                  >
                    {isSubmitting ? 'Confirming Appointment...' : 'Book Consultation'}
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.successContainer}>
                <div className={styles.successCircle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className={styles.successText}>
                  <h3>Appointment Confirmed!</h3>
                  <p>
                    Your consultation booking with <strong>{bookingDoc.name}</strong> is successfully scheduled.
                  </p>
                  <p style={{ marginTop: '12px', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    📅 Date: <strong>{appointmentDate}</strong> <br />
                    ⏰ Time: <strong>{bookingSlot}</strong> <br />
                    🏢 Clinic: <strong>{bookingDoc.clinic}</strong>
                  </p>
                  <p style={{ marginTop: '12px', fontSize: '0.8rem', opacity: 0.6 }}>
                    A confirmation SMS notification has been dispatched to {patientPhone}.
                  </p>
                </div>
                <button onClick={handleCloseBooking} className={styles.doneBtn}>
                  Return to Directory
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

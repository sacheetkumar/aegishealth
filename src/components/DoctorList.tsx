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

  // Sync specialty filter from parent (e.g., predicted disease recommendation)
  useEffect(() => {
    if (filteredSpecialty) {
      setSelectedSpecialty(filteredSpecialty);
    } else {
      setSelectedSpecialty('All');
    }
  }, [filteredSpecialty]);

  // Set default appointment date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setAppointmentDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Extract all unique specialties for dropdown
  const uniqueSpecialties = useMemo(() => {
    const specialties = doctorsList.map(d => d.specialty);
    return ['All', ...Array.from(new Set(specialties))];
  }, []);

  // Filter doctors list based on search and specialty selection
  const filteredDoctors = useMemo(() => {
    return doctorsList.filter(doc => {
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSpecialty && matchesSearch;
    });
  }, [selectedSpecialty, searchQuery]);

  const handleOpenBooking = (doctor: Doctor, slot: string) => {
    setBookingDoc(doctor);
    setBookingSlot(slot);
    setBookingConfirmed(false);
  };

  const handleCloseBooking = () => {
    setBookingDoc(null);
    setBookingSlot(null);
    setPatientName('');
    setPatientPhone('');
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoc || !bookingSlot || !patientName.trim() || !patientPhone.trim() || !appointmentDate) return;

    setIsSubmitting(true);
    
    // Simulate API request delay
    setTimeout(() => {
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

      const allAppsStr = localStorage.getItem('aegis_appointments');
      const allApps = allAppsStr ? JSON.parse(allAppsStr) : [];
      allApps.push(newApp);
      localStorage.setItem('aegis_appointments', JSON.stringify(allApps));

      setIsSubmitting(false);
      setBookingConfirmed(true);

      if (onAppointmentBooked) {
        onAppointmentBooked();
      }
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Physician Referral Directory</h2>
          <p>Schedule consultations with our board-certified medical specialists based on your condition.</p>
        </div>
        
        {/* Filters */}
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} style={{ marginRight: '8px' }}>Specialty:</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                if (e.target.value === 'All' && onClearSpecialtyFilter) {
                  onClearSpecialtyFilter();
                }
              }}
              className={styles.select}
            >
              {uniqueSpecialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <input
              type="text"
              placeholder="Search clinic or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.select}
              style={{ width: '220px' }}
            />
          </div>

          {filteredSpecialty && (
            <button onClick={onClearSpecialtyFilter} className={styles.clearFilterBtn}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block' }}>
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Reset Recommender
            </button>
          )}
        </div>
      </div>

      {/* Grid displays */}
      {filteredDoctors.length > 0 ? (
        <div className={styles.grid}>
          {filteredDoctors.map(doc => {
            const isMatchedReferral = doc.specialty === filteredSpecialty;
            return (
              <div key={doc.id} className={styles.docCard}>
                {isMatchedReferral && (
                  <span className={styles.recommendedBadge}>AI Recommended</span>
                )}
                
                <div className={styles.docProfile}>
                  <div className={styles.avatar}>
                    {doc.name.split(' ')[1]?.[0] ? `${doc.name.split(' ')[0][0]}${doc.name.split(' ')[1][0]}` : doc.name[0]}
                  </div>
                  <div className={styles.docInfo}>
                    <h3>{doc.name}</h3>
                    <div className={styles.docSpecialty}>{doc.specialty}</div>
                    <div className={styles.ratingRow}>
                      <span className={styles.stars}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" style={{ marginRight: '4px', verticalAlign: 'middle', display: 'inline-block', color: '#EAB308' }}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        {doc.rating.toFixed(1)}
                      </span>
                      <span className={styles.experience}>({doc.experience} yrs exp)</span>
                    </div>
                  </div>
                </div>

                <div className={styles.clinicDetails}>
                  <div className={styles.clinicName}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block', opacity: 0.8 }}>
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                      <line x1="9" y1="22" x2="9" y2="16"/>
                      <line x1="15" y1="22" x2="15" y2="16"/>
                      <line x1="9" y1="16" x2="15" y2="16"/>
                      <path d="M8 6h8M8 10h8"/>
                    </svg>
                    {doc.clinic}
                  </div>
                  <div className={styles.clinicLoc}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block', opacity: 0.8 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {doc.location}
                  </div>
                </div>

                {/* Available Slots */}
                <div className={styles.slotsSection}>
                  <span className={styles.slotsTitle}>Available Consultation Slots Today</span>
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
        <div style={{ padding: '40px', textAlign: 'center', opacity: 0.6 }}>
          No doctors match your current filters. Try resetting the recommender.
        </div>
      )}

      {/* Booking Dialog Modal */}
      {bookingDoc && bookingSlot && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={handleCloseBooking} className={styles.closeBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                      <span>{bookingDoc.name}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Specialty:</span>
                      <span>{bookingDoc.specialty}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Consultation Slot:</span>
                      <span>{bookingSlot}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Clinic:</span>
                      <span>{bookingDoc.clinic}</span>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Patient Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Contact Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (555) 019-2834"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Preferred Date</label>
                    <input
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
                  <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                    📅 Date: {appointmentDate} <br />
                    ⏰ Time: {bookingSlot} <br />
                    🏢 Clinic: {bookingDoc.clinic}
                  </p>
                  <p style={{ marginTop: '12px', fontSize: '0.8rem', opacity: 0.6 }}>
                    A confirmation SMS has been dispatched to {patientPhone}.
                  </p>
                </div>
                <button onClick={handleCloseBooking} className={styles.doneBtn}>
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

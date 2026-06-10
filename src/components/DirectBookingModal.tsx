'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Doctor, doctorsList } from '@/lib/dataset';
import styles from './DirectBookingModal.module.css';

interface DirectBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { email: string; name: string } | null;
  onAppointmentBooked?: () => void;
}

export default function DirectBookingModal({
  isOpen,
  onClose,
  currentUser,
  onAppointmentBooked
}: DirectBookingModalProps) {
  // Specialties dropdown list
  const specialties = useMemo(() => {
    const list = doctorsList.map(d => d.specialty);
    return Array.from(new Set(list));
  }, []);

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Set default specialty and doctor on load
  useEffect(() => {
    if (specialties.length > 0) {
      setSelectedSpecialty(specialties[0]);
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setAppointmentDate(tomorrow.toISOString().split('T')[0]);
  }, [specialties]);

  // Filter doctors by selected specialty
  const filteredDoctors = useMemo(() => {
    if (!selectedSpecialty) return [];
    return doctorsList.filter(d => d.specialty === selectedSpecialty);
  }, [selectedSpecialty]);

  // Reset selected doctor when specialty changes
  useEffect(() => {
    if (filteredDoctors.length > 0) {
      setSelectedDoctorId(filteredDoctors[0].id);
    } else {
      setSelectedDoctorId('');
    }
  }, [filteredDoctors]);

  // Get active doctor details
  const activeDoctor = useMemo(() => {
    return doctorsList.find(d => d.id === selectedDoctorId) || null;
  }, [selectedDoctorId]);

  // Reset selected slot when doctor changes
  useEffect(() => {
    if (activeDoctor && activeDoctor.availableSlots.length > 0) {
      setSelectedSlot(activeDoctor.availableSlots[0]);
    } else {
      setSelectedSlot('');
    }
  }, [activeDoctor]);

  // Populate user details if signed in
  useEffect(() => {
    if (currentUser) {
      setPatientName(currentUser.name);
    } else {
      setPatientName('');
    }
  }, [currentUser, isOpen]);

  const handleClose = () => {
    setIsConfirmed(false);
    setPatientPhone('');
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoctor || !selectedSlot || !patientName.trim() || !patientPhone.trim() || !appointmentDate) return;

    setIsSubmitting(true);

    try {
      const newApp = {
        id: Date.now().toString(),
        docName: activeDoctor.name,
        specialty: activeDoctor.specialty,
        clinic: activeDoctor.clinic,
        location: activeDoctor.location,
        patientName,
        patientPhone,
        date: appointmentDate,
        time: selectedSlot,
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

      setIsConfirmed(true);

      if (onAppointmentBooked) {
        onAppointmentBooked();
      }
    } catch (err: any) {
      console.error('Navbar booking error:', err);
      alert(`Failed to schedule consultation: ${err.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className={styles.closeBtn} aria-label="Close modal">
          &times;
        </button>

        {!isConfirmed ? (
          <>
            <div className={styles.modalHeader}>
              <h2>Book Consultation</h2>
              <p>Directly reserve a slot with one of our specialized physicians.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="specialty">Medical Specialty</label>
                <select
                  id="specialty"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className={styles.select}
                >
                  {specialties.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="doctor">Select Doctor</label>
                <select
                  id="doctor"
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className={styles.select}
                  disabled={filteredDoctors.length === 0}
                >
                  {filteredDoctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.clinic})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="date">Preferred Date</label>
                <input
                  id="date"
                  type="date"
                  required
                  value={appointmentDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className={styles.input}
                />
              </div>

              {activeDoctor && activeDoctor.availableSlots.length > 0 && (
                <div className={styles.slotsSection}>
                  <span className={styles.slotsTitle}>Available Slots Today</span>
                  <div className={styles.slotsGrid}>
                    {activeDoctor.availableSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`${styles.slotBtn} ${selectedSlot === slot ? styles.activeSlotBtn : ''}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="patientName">Patient Full Name</label>
                <input
                  id="patientName"
                  type="text"
                  placeholder="e.g. John Doe"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="patientPhone">Contact Phone Number</label>
                <input
                  id="patientPhone"
                  type="tel"
                  placeholder="e.g. +1 (555) 019-2834"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className={styles.input}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedDoctorId || !selectedSlot}
                className={styles.confirmBtn}
              >
                {isSubmitting ? 'Reserving Slot...' : 'Book Consultation'}
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
              <h3>Booking Confirmed!</h3>
              <p>Your appointment has been successfully recorded in our registry.</p>
            </div>

            {activeDoctor && (
              <div className={styles.bookingSummary}>
                <div className={styles.summaryRow}>
                  <span>Doctor:</span>
                  <span>{activeDoctor.name}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Specialty:</span>
                  <span>{activeDoctor.specialty}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Clinic:</span>
                  <span>{activeDoctor.clinic}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Date:</span>
                  <span>{appointmentDate}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Time:</span>
                  <span>{selectedSlot}</span>
                </div>
              </div>
            )}

            <button onClick={handleClose} className={styles.doneBtn}>
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

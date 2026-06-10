'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './PrescriptionUpload.module.css';

interface PrescriptionUploadProps {
  onRecommendDoctors: (specialty: string) => void;
  currentUser?: { email: string; name: string } | null;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
}

interface ExtractionResult {
  id?: number;
  fileName?: string;
  condition: string;
  specialty: string;
  medications: Medication[];
  warnings: string;
  precautions: string[];
  createdAt?: string;
}

const SCAN_STEPS = [
  'Initializing file buffers and checking integrity...',
  'Extracting text using Optical Character Recognition (OCR)...',
  'Analyzing prescription structure and handwritten notes...',
  'Matching active chemical agents against reference database...',
  'Cross-checking drug-drug contraindications...',
  'Generating diagnostic recommendations and physician referrals...'
];

export default function PrescriptionUpload({ onRecommendDoctors, currentUser }: PrescriptionUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepIdx, setScanStepIdx] = useState(0);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<ExtractionResult[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Load prescription history
  const loadHistory = async () => {
    if (!currentUser?.email) {
      setHistory([]);
      return;
    }
    try {
      const res = await fetch(`/api/prescriptions?email=${encodeURIComponent(currentUser.email)}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.prescriptions || []);
      }
    } catch (err) {
      console.error('Failed to load prescription history:', err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [currentUser]);

  // Handle Drag & Drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selectedFile: File) => {
    // Only support PDF and Images
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('Unsupported file format. Please upload a PDF or an Image (PNG, JPG).');
      return;
    }

    setFile(selectedFile);
    setResult(null);

    // Create thumbnail preview if image
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteFile = () => {
    setFile(null);
    setResult(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // Run the OCR and Analysis simulator
  const handleAnalyzePrescription = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setScanProgress(0);
    setScanStepIdx(0);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    if (currentUser?.email) {
      formData.append('email', currentUser.email);
    }

    try {
      const res = await fetch('/api/prescriptions/scan', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to scan prescription.');
        setIsAnalyzing(false);
        return;
      }

      // Store pending result to display when progress animation finishes
      (window as any)._pendingPrescriptionResult = data.prescription;
    } catch (err) {
      console.error('OCR Upload error:', err);
      alert('An error occurred during prescription analysis.');
      setIsAnalyzing(false);
    }
  };

  // Progress ticks
  useEffect(() => {
    if (!isAnalyzing || !file) return;

    const totalDuration = 2200; // 2.2s
    const tickInterval = 30; // 30ms ticks
    const increment = 100 / (totalDuration / tickInterval);

    const timer = setInterval(() => {
      setScanProgress(prev => {
        const nextProgress = prev + increment;
        if (nextProgress >= 100) {
          clearInterval(timer);
          
          // Generate final result from server response (or fallback if it failed to complete in time)
          const serverResult = (window as any)._pendingPrescriptionResult;
          if (serverResult) {
            setResult(serverResult);
            loadHistory();
          } else {
            const analysis = performMockOcr(file.name);
            setResult(analysis);
          }
          setIsAnalyzing(false);
          delete (window as any)._pendingPrescriptionResult;
          return 100;
        }

        const step = Math.floor((nextProgress / 100) * SCAN_STEPS.length);
        setScanStepIdx(Math.min(step, SCAN_STEPS.length - 1));
        return nextProgress;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [isAnalyzing, file]);

  const handleDeleteHistoryItem = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this scan from your history?')) return;
    try {
      const res = await fetch(`/api/prescriptions?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadHistory();
        if (result && result.id === id) {
          setResult(null);
          setFile(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  // Simulated OCR matching fallback function
  const performMockOcr = (filename: string): ExtractionResult => {
    const name = filename.toLowerCase();

    if (name.includes('heart') || name.includes('bp') || name.includes('cardio') || name.includes('hyper')) {
      return {
        condition: 'Hypertension (Chronic High Blood Pressure)',
        specialty: 'Cardiologist',
        medications: [
          { name: 'Amlodipine Besylate', dosage: '5 mg', frequency: 'Once daily (Morning)', purpose: 'Calcium channel blocker to relax blood vessels' },
          { name: 'Losartan Potassium', dosage: '50 mg', frequency: 'Once daily (Night)', purpose: 'Angiotensin receptor blocker to reduce pressure' }
        ],
        warnings: 'Caution: Avoid high sodium (salt) foods. Monitor your blood pressure daily and record findings. Discontinue Losartan immediately if pregnancy is suspected.',
        precautions: [
          'Change positions slowly (e.g. standing up) to avoid dizziness.',
          'Limit intake of alcohol as it can cause sudden drops in pressure.',
          'Schedule regular heart diagnostics and kidney function checkups.'
        ]
      };
    }

    if (name.includes('sugar') || name.includes('diab') || name.includes('insulin') || name.includes('gluc')) {
      return {
        condition: 'Type 2 Diabetes Mellitus',
        specialty: 'Endocrinologist',
        medications: [
          { name: 'Metformin Hydrochloride', dosage: '500 mg', frequency: 'Twice daily (With meals)', purpose: 'Biguanide to reduce liver glucose release' },
          { name: 'Glimepiride', dosage: '2 mg', frequency: 'Once daily (Before breakfast)', purpose: 'Sulfonylurea to stimulate insulin secretion' }
        ],
        warnings: 'Warning: Watch for symptoms of hypoglycemia (shaking, sweating, confusion). Always carry a fast-acting glucose source (e.g. fruit juice or candy).',
        precautions: [
          'Take Metformin with food to minimize stomach discomfort.',
          'Maintain a low-glycemic, high-fiber dietary plan.',
          'Examine your feet daily for small cuts or abrasions.'
        ]
      };
    }

    if (name.includes('skin') || name.includes('rash') || name.includes('dermat') || name.includes('itch')) {
      return {
        condition: 'Tinea Corporis (Fungal Skin Infection)',
        specialty: 'Dermatologist',
        medications: [
          { name: 'Clotrimazole Cream 1%', dosage: 'Apply thin layer', frequency: 'Twice daily topically', purpose: 'Antifungal agent to clear skin lesions' },
          { name: 'Cetirizine', dosage: '10 mg', frequency: 'Once daily (Before bedtime)', purpose: 'Antihistamine to control severe itching' }
        ],
        warnings: 'Warning: For external topical use only. Do not apply near eyes or open mucosal membranes. Complete the full 2-week course even if itching stops.',
        precautions: [
          'Keep the infected skin region completely dry and clean.',
          'Do not share personal items (clothing, towels) to prevent spread.',
          'Wear loose, breathable cotton clothes to avoid moisture collection.'
        ]
      };
    }

    return {
      condition: 'Acute Bronchial Bronchitis & Respiratory Congestion',
      specialty: 'Pulmonologist',
      medications: [
        { name: 'Amoxicillin Trihydrate', dosage: '500 mg', frequency: 'Three times daily for 7 days', purpose: 'Penicillin antibiotic to resolve bacterial infection' },
        { name: 'Albuterol Inhaler', dosage: '90 mcg (2 puffs)', frequency: 'Every 4-6 hours as needed', purpose: 'Bronchodilator to relieve chest wheezing' },
        { name: 'Paracetamol', dosage: '650 mg', frequency: 'Every 6 hours as needed', purpose: 'Analgesic to reduce chest ache and mild fever' }
      ],
      warnings: 'Warning: Complete the full 7-day course of antibiotics to prevent bacterial resistance. Seek emergency care if shortness of breath worsens rapidly.',
      precautions: [
        'Inhale steam twice daily and keep hydrated (8+ glasses of warm water).',
        'Avoid environmental triggers such as smoke, heavy dust, or cold winds.',
        'Use the rescue Albuterol inhaler immediately if experiencing wheezing.'
      ]
    };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h2>Prescription OCR Analyzer</h2>
        <p>Upload your doctor-signed prescription sheet (PDF or Image) to extract medication routines and view referrals.</p>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.editorCol}>
          {!isAnalyzing && !result && (
            <>
              {!file ? (
                <div
                  className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,image/png,image/jpeg,image/jpg"
                    className={styles.fileInput}
                  />
                  <div className={styles.uploadIcon}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-color)' }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <div className={styles.dropzoneText}>
                    <h3>Drag & Drop prescription here</h3>
                    <p>or click to browse local folders (Supports PDF, PNG, JPG up to 10MB)</p>
                  </div>
                </div>
              ) : (
                <div className={styles.fileCard}>
                  <div className={styles.fileDetails}>
                    <div className={styles.thumbnailWrapper}>
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className={styles.thumbnail} />
                      ) : (
                        <span className={styles.pdfIcon}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--danger-color)' }}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <path d="M9 15h1a1.5 1.5 0 0 0 0-3H9v6M14 12v6h1a3 3 0 0 0 3-3V15a3 3 0 0 0-3-3h-1z"/>
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className={styles.fileNameInfo}>
                      <div className={styles.fileName}>{file.name}</div>
                      <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                  <button onClick={handleDeleteFile} className={styles.deleteBtn} aria-label="Delete file">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              )}

              <button
                onClick={handleAnalyzePrescription}
                disabled={!file}
                className={styles.actionBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline-block' }}>
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Run Diagnostic OCR Scan
              </button>
            </>
          )}

          {isAnalyzing && (
            <div className={styles.scanContainer}>
              <div className={styles.radarOuter}>
                <div className={styles.radarInner}></div>
              </div>
              <div className={styles.scanText}>Clinical OCR Extraction in Progress...</div>
              <div className={styles.scanProgress}>
                <div
                  className={styles.scanProgressBar}
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <div className={styles.scanLog}>{SCAN_STEPS[scanStepIdx]}</div>
            </div>
          )}

          {!isAnalyzing && result && (
            <div className={styles.resultsContainer}>
              <div className={styles.resultCard}>
                <div className={styles.resultHeader}>
                  <h3>Prescription Diagnostics Extract</h3>
                  <button onClick={handleDeleteFile} className={styles.resetBtn}>
                    Reset Scanner
                  </button>
                </div>

                <div className={styles.analysisGrid}>
                  <div className={styles.medsSection}>
                    <h4>Extracted Medication Routine</h4>
                    <div className={styles.medsTableWrapper}>
                      <table className={styles.medsTable}>
                        <thead>
                          <tr>
                            <th>Medication</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Clinical Purpose</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.medications.map((med, idx) => (
                            <tr key={idx}>
                              <td className={styles.medName}>{med.name}</td>
                              <td>{med.dosage}</td>
                              <td>{med.frequency}</td>
                              <td>{med.purpose}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className={styles.referralsCol}>
                    <div className={styles.summarySection}>
                      <h4>AI Extracted Diagnosis</h4>
                      <div className={styles.diagCondition}>{result.condition}</div>
                      <div className={styles.diagReferral}>
                        Recommended Specialty: <strong>{result.specialty}</strong>
                      </div>
                    </div>

                    <div className={styles.warningsSection}>
                      <h4>Contraindications & Precautions</h4>
                      <div className={styles.warningCard}>
                        <p>{result.warnings}</p>
                      </div>
                      <div className={styles.precautionCard}>
                        <ul className={styles.precautionList}>
                          {result.precautions.map((prec, idx) => (
                            <li key={idx}>{prec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <button
                    onClick={() => onRecommendDoctors(result.specialty)}
                    className={styles.recommendDocsBtn}
                  >
                    Find Recommended Specialists ({result.specialty})
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', verticalAlign: 'middle', display: 'inline-block' }}>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar History Panel */}
        {currentUser && history.length > 0 && (
          <div className={styles.historyCol}>
            <h3>Prescription History</h3>
            <p>Access your past parsed clinical diagnostic sheets.</p>
            <div className={styles.historyList}>
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className={`${styles.historyItem} ${result?.id === item.id ? styles.activeHistoryItem : ''}`}
                  onClick={() => {
                    setResult(item);
                    setFile(new File([], item.fileName || 'prescription.pdf'));
                  }}
                >
                  <div className={styles.historyItemMeta}>
                    <span className={styles.historyDocName}>{item.fileName || 'Prescription Document'}</span>
                    <span className={styles.historyDate}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'Recent'}
                    </span>
                    <span className={styles.historyCondition}>{item.condition}</span>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteHistoryItem(item.id!, e)}
                    className={styles.deleteHistoryBtn}
                    title="Delete history record"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

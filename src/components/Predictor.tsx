'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Symptom, symptomsList } from '@/lib/dataset';
import { NaiveBayesClassifier, PredictionResult } from '@/lib/classifier';
import styles from './Predictor.module.css';

interface PredictorProps {
  onRecommendDoctors: (specialty: string) => void;
}

const SCAN_STEPS = [
  'Extracting symptom profiles...',
  'Initializing Bayesian network...',
  'Computing prior probabilities P(Disease)...',
  'Evaluating conditional likelihoods P(Symptom | Disease)...',
  'Calculating Jaccard overlaps and symptom matching scores...',
  'Finalizing diagnostics report...'
];

export default function Predictor({ onRecommendDoctors }: PredictorProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [expandedDiseaseId, setExpandedDiseaseId] = useState<string | null>(null);

  // Memoize the classifier
  const classifier = useMemo(() => new NaiveBayesClassifier(), []);

  // Filter symptoms based on search query
  const filteredSymptoms = useMemo(() => {
    if (!searchQuery.trim()) return symptomsList;
    const query = searchQuery.toLowerCase();
    return symptomsList.filter(s => s.name.toLowerCase().includes(query));
  }, [searchQuery]);

  // Group symptoms by category
  const symptomsByCategory = useMemo(() => {
    const groups: Record<string, Symptom[]> = {};
    filteredSymptoms.forEach(symptom => {
      if (!groups[symptom.category]) {
        groups[symptom.category] = [];
      }
      groups[symptom.category].push(symptom);
    });
    return groups;
  }, [filteredSymptoms]);

  // Toggle symptom selection
  const handleToggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  // Run the diagnostic simulation
  const handleRunDiagnostic = () => {
    if (selectedSymptoms.length === 0) return;

    setIsAnalyzing(true);
    setScanProgress(0);
    setScanStepIndex(0);
    setPredictions([]);
    setExpandedDiseaseId(null);
  };

  // Diagnostic loading bar ticks
  useEffect(() => {
    if (!isAnalyzing) return;

    const totalDuration = 1800; // 1.8s
    const tickInterval = 30; // 30ms ticks
    const increment = 100 / (totalDuration / tickInterval);

    const timer = setInterval(() => {
      setScanProgress(prev => {
        const nextProgress = prev + increment;
        if (nextProgress >= 100) {
          clearInterval(timer);
          // Complete analysis
          const results = classifier.predict(selectedSymptoms);
          setPredictions(results);
          setIsAnalyzing(false);
          return 100;
        }

        // Cycle through log messages based on progress
        const stepIdx = Math.floor((nextProgress / 100) * SCAN_STEPS.length);
        setScanStepIndex(Math.min(stepIdx, SCAN_STEPS.length - 1));

        return nextProgress;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [isAnalyzing, selectedSymptoms, classifier]);

  const handleClearAll = () => {
    setSelectedSymptoms([]);
    setPredictions([]);
    setExpandedDiseaseId(null);
  };

  const getRiskClass = (risk: 'Low' | 'Medium' | 'High') => {
    if (risk === 'High') return styles.highRisk;
    if (risk === 'Medium') return styles.medRisk;
    return styles.lowRisk;
  };

  const getProgressClass = (risk: 'Low' | 'Medium' | 'High') => {
    if (risk === 'High') return styles.highRiskProgress;
    if (risk === 'Medium') return styles.medRiskProgress;
    return styles.lowRiskProgress;
  };

  const getBadgeClass = (risk: 'Low' | 'Medium' | 'High') => {
    if (risk === 'High') return styles.badgeHigh;
    if (risk === 'Medium') return styles.badgeMedium;
    return styles.badgeLow;
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h2>AI Symptom Analyzer</h2>
        <p>Select your symptoms below to analyze potential diagnoses using our machine learning classifier.</p>
      </div>

      {!isAnalyzing && predictions.length === 0 && (
        <>
          {/* Search bar */}
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search symptoms (e.g. fever, headache, dry cough)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Categorized Symptom Grid */}
          <div className={styles.categoryGrid}>
            {Object.entries(symptomsByCategory).map(([category, symptoms]) => (
              <div key={category} className={styles.categoryCard}>
                <h3>
                  {category}
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                    ({symptoms.length})
                  </span>
                </h3>
                <div className={styles.symptomList}>
                  {symptoms.map(symptom => {
                    const isSelected = selectedSymptoms.includes(symptom.id);
                    return (
                      <button
                        key={symptom.id}
                        onClick={() => handleToggleSymptom(symptom.id)}
                        className={`${styles.symptomItem} ${isSelected ? styles.symptomItemSelected : ''}`}
                      >
                        {isSelected && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                        {symptom.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Symptoms Dashboard */}
          {selectedSymptoms.length > 0 && (
            <div className={`${styles.activeSection} animate-fade-in`}>
              <div className={styles.activeHeader}>
                <strong>Selected Symptoms ({selectedSymptoms.length})</strong>
                <button onClick={handleClearAll} className={styles.clearBtn}>
                  Clear All
                </button>
              </div>
              <div className={styles.activeTags}>
                {selectedSymptoms.map(id => {
                  const sym = symptomsList.find(s => s.id === id);
                  return (
                    <div key={id} className={styles.tag}>
                      {sym?.name}
                      <span
                        onClick={() => handleToggleSymptom(id)}
                        className={styles.removeTagBtn}
                      >
                        ×
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Run Diagnostic Button */}
          <button
            onClick={handleRunDiagnostic}
            disabled={selectedSymptoms.length === 0}
            className={styles.actionBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline-block' }}>
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z"/>
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z"/>
            </svg>
            Analyze Selected Symptoms
          </button>
        </>
      )}

      {/* Analyzing Simulation Loader */}
      {isAnalyzing && (
        <div className={styles.scanContainer}>
          <div className={styles.radarOuter}>
            <div className={styles.scanLine}></div>
            <div className={styles.radarInner}></div>
          </div>
          <div className={styles.scanText}>AI Diagnostic Scan Running...</div>
          <div className={styles.scanProgress}>
            <div
              className={styles.scanProgressBar}
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
          <div className={styles.scanLog}>{SCAN_STEPS[scanStepIndex]}</div>
        </div>
      )}

      {/* Results Dashboard */}
      {!isAnalyzing && predictions.length > 0 && (
        <div className={styles.resultsContainer}>
          <div className={styles.activeHeader}>
            <h3>AI Diagnostic Analysis</h3>
            <button onClick={handleClearAll} className={styles.clearBtn} style={{ fontSize: '0.9rem' }}>
              Reset Analysis
            </button>
          </div>

          <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '8px' }}>
            Top predicted conditions matching symptoms: <strong>{selectedSymptoms.map(id => symptomsList.find(s => s.id === id)?.name).join(', ')}</strong>
          </div>

          {predictions.map(({ disease, confidence, matchedSymptoms }) => {
            const isExpanded = expandedDiseaseId === disease.id;
            return (
              <div
                key={disease.id}
                className={`${styles.resultCard} ${getRiskClass(disease.riskLevel)} animate-fade-in`}
              >
                <div className={styles.resultHeader}>
                  <div className={styles.diseaseTitle}>
                    <h4>{disease.name}</h4>
                    <div className={styles.diseaseMeta}>
                      <span className={`${styles.badge} ${getBadgeClass(disease.riskLevel)}`}>
                        {disease.riskLevel} Risk
                      </span>
                      <span className={`${styles.badge} ${styles.badgeSpecialty}`}>
                        {disease.specialty}
                      </span>
                    </div>
                  </div>
                  <div className={styles.scoreWrapper}>
                    <div className={styles.scorePercent}>{confidence}%</div>
                    <div className={styles.scoreLabel}>Confidence</div>
                  </div>
                </div>

                <p className={styles.diseaseDesc}>{disease.description}</p>

                <div className={styles.progressBarOuter}>
                  <div
                    className={`${styles.progressBarInner} ${getProgressClass(disease.riskLevel)}`}
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>

                <div className={styles.matchedSymptomBar}>
                  Matched Symptoms:{' '}
                  <span className={styles.matchedText}>
                    {matchedSymptoms.map(id => symptomsList.find(s => s.id === id)?.name).join(', ')}
                  </span>{' '}
                  ({matchedSymptoms.length}/{disease.symptoms.length} core symptoms)
                </div>

                {/* Precautions Accordion */}
                {isExpanded && (
                  <div className={`${styles.detailsSection} animate-fade-in`}>
                    <h5>Recommended Precautionary Steps</h5>
                    <ul className={styles.precautionsList}>
                      {disease.precautions.map((precaution, idx) => (
                        <li key={idx}>{precaution}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.cardFooter}>
                  <button
                    onClick={() => setExpandedDiseaseId(isExpanded ? null : disease.id)}
                    className={styles.toggleDetailsBtn}
                  >
                    {isExpanded ? (
                      <>
                        Hide Precautions
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', verticalAlign: 'middle', display: 'inline-block', transform: 'rotate(180deg)' }}>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </>
                    ) : (
                      <>
                        View Precautions
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', verticalAlign: 'middle', display: 'inline-block' }}>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onRecommendDoctors(disease.specialty)}
                    className={styles.recommendDocsBtn}
                  >
                    Find Recommended Doctors
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', verticalAlign: 'middle', display: 'inline-block' }}>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

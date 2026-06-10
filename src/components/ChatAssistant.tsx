'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { parseSymptomsFromText, NaiveBayesClassifier, PredictionResult } from '@/lib/classifier';
import { symptomsList } from '@/lib/dataset';
import styles from './ChatAssistant.module.css';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  detectedSymptoms?: string[];
  diagnosticResult?: PredictionResult;
}

interface ChatAssistantProps {
  onRecommendDoctors: (specialty: string) => void;
}

export default function ChatAssistant({ onRecommendDoctors }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize classifier
  const classifier = useMemo(() => new NaiveBayesClassifier(), []);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: "Welcome! I'm Aegis, your AI Medical Assistant. Feel free to describe your symptoms in plain language (e.g. \"I have a high fever, severe headache, and body aches\" or \"I'm experiencing heartburn and nausea\"). I will analyze them using our diagnostic model and refer you to the correct specialist."
      }
    ]);
  }, []);

  // Scroll to bottom of chat history when message list updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking and calculation
    setTimeout(() => {
      const detectedSymptomIds = parseSymptomsFromText(userMessage.text);
      let replyText = '';
      let topPrediction: PredictionResult | undefined;

      if (detectedSymptomIds.length > 0) {
        // Run classification
        const predictions = classifier.predict(detectedSymptomIds);
        
        if (predictions.length > 0) {
          topPrediction = predictions[0];
          const matchedNames = detectedSymptomIds.map(id => symptomsList.find(s => s.id === id)?.name || id);
          
          replyText = `Based on your description, I identified these symptoms: ${matchedNames.join(', ')}. Our Bayesian classifier suggests the most likely condition is ${topPrediction.disease.name}.`;
        } else {
          replyText = "I identified some symptoms, but they don't strongly match any specific condition in our dataset. I suggest scheduling a general consultation.";
        }
      } else {
        replyText = "I couldn't identify any specific medical symptoms in your description. Could you please specify what you're experiencing? For example: fever, cough, joint pain, nausea, or a headache.";
      }

      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `reply_${Date.now()}`,
          sender: 'bot',
          text: replyText,
          detectedSymptoms: detectedSymptomIds,
          diagnosticResult: topPrediction
        }
      ]);
    }, 1300);
  };

  return (
    <div className={styles.container}>
      {/* Bot Chat Header */}
      <div className={styles.chatHeader}>
        <div className={styles.botAvatar}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4M8 15h.01M16 15h.01" />
          </svg>
        </div>
        <div className={styles.headerInfo}>
          <h3>Aegis Clinical AI</h3>
          <span>Online & Diagnostic</span>
        </div>
      </div>

      {/* Message Timeline */}
      <div className={styles.chatHistory}>
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`${styles.messageRow} ${msg.sender === 'user' ? styles.userRow : styles.botRow}`}
          >
            <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.userBubble : styles.botBubble}`}>
              <div>{msg.text}</div>

              {/* Inline Diagnostic Report Card */}
              {msg.diagnosticResult && (
                <div className={`${styles.botDiagnosticBlock} animate-fade-in`}>
                  <div className={styles.diagnosticHeading}>AI Clinical Referral</div>
                  <div className={styles.diseaseMatchName}>
                    <span>{msg.diagnosticResult.disease.name}</span>
                    <span className={styles.matchConfidence}>{msg.diagnosticResult.confidence}% confidence</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    {msg.diagnosticResult.disease.description}
                  </div>
                  <div className={styles.inlineSpecialtyReferral}>
                    <span>Specialist: <strong>{msg.diagnosticResult.disease.specialty}</strong></span>
                    <button
                      onClick={() => onRecommendDoctors(msg.diagnosticResult!.disease.specialty)}
                      className={styles.inlineLinkBtn}
                    >
                      Find Doctor
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', verticalAlign: 'middle', display: 'inline-block' }}>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.messageRow} ${styles.botRow}`}>
            <div className={`${styles.messageBubble} ${styles.botBubble} ${styles.typingIndicator}`}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input Controls */}
      <form onSubmit={handleSendMessage} className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Describe your health symptoms..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            className={styles.chatInput}
          />
        </div>
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className={styles.sendBtn}
        >
          Send
        </button>
      </form>
    </div>
  );
}

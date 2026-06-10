import { Disease, diseasesList, Symptom, symptomsList, trainingData } from './dataset';

export interface PredictionResult {
  disease: Disease;
  probability: number; // Bayesian probability distribution %
  confidence: number;  // Combined score of Bayes and Jaccard overlap %
  matchedSymptoms: string[];
}

export class NaiveBayesClassifier {
  private diseasePriors: Record<string, number> = {};
  private conditionalProbabilities: Record<string, Record<string, number>> = {};
  private totalTrainingCases = 0;
  private laplaceAlpha = 0.5;

  constructor() {
    this.train();
  }

  private train() {
    this.totalTrainingCases = trainingData.length;
    if (this.totalTrainingCases === 0) return;

    // 1. Calculate disease priors
    const diseaseCounts: Record<string, number> = {};
    diseasesList.forEach(d => {
      diseaseCounts[d.id] = 0;
      this.conditionalProbabilities[d.id] = {};
      symptomsList.forEach(s => {
        this.conditionalProbabilities[d.id][s.id] = 0;
      });
    });

    trainingData.forEach(caseRecord => {
      diseaseCounts[caseRecord.diseaseId] = (diseaseCounts[caseRecord.diseaseId] || 0) + 1;
      
      // Count symptoms for this disease
      caseRecord.symptoms.forEach(symptomId => {
        if (this.conditionalProbabilities[caseRecord.diseaseId] && 
            this.conditionalProbabilities[caseRecord.diseaseId][symptomId] !== undefined) {
          this.conditionalProbabilities[caseRecord.diseaseId][symptomId]++;
        }
      });
    });

    // Compute priors
    diseasesList.forEach(d => {
      // Prior P(Disease)
      this.diseasePriors[d.id] = diseaseCounts[d.id] / this.totalTrainingCases;
      
      // Compute conditional probability P(Symptom | Disease) with Laplace Smoothing
      const diseaseTotalCases = diseaseCounts[d.id];
      symptomsList.forEach(s => {
        const symptomCount = this.conditionalProbabilities[d.id][s.id];
        // Laplace smoothing formula: (count + alpha) / (total_cases_of_disease + alpha * 2)
        // We treat it as binary (symptom present vs absent)
        this.conditionalProbabilities[d.id][s.id] = 
          (symptomCount + this.laplaceAlpha) / (diseaseTotalCases + this.laplaceAlpha * 2);
      });
    });
  }

  public predict(selectedSymptomIds: string[]): PredictionResult[] {
    if (selectedSymptomIds.length === 0) return [];

    const results: PredictionResult[] = [];
    let scoreSum = 0;
    const rawScores: Record<string, number> = {};

    // 1. Calculate Bayesian scores using logs to prevent underflow
    diseasesList.forEach(disease => {
      // Start with log P(Disease)
      let logScore = Math.log(this.diseasePriors[disease.id] || 0.05);

      symptomsList.forEach(symptom => {
        const pSymptomGivenDisease = this.conditionalProbabilities[disease.id][symptom.id];
        if (selectedSymptomIds.includes(symptom.id)) {
          // P(Symptom = 1 | Disease)
          logScore += Math.log(pSymptomGivenDisease);
        } else {
          // P(Symptom = 0 | Disease)
          logScore += Math.log(1 - pSymptomGivenDisease);
        }
      });

      const rawScore = Math.exp(logScore);
      rawScores[disease.id] = rawScore;
      scoreSum += rawScore;
    });

    // 2. Compute probability distribution and Jaccard overlap
    diseasesList.forEach(disease => {
      // Bayesian probability normalized to sum to 100%
      const bayesianProbability = scoreSum > 0 ? (rawScores[disease.id] / scoreSum) * 100 : 0;

      // Jaccard similarity: intersection / union of symptoms
      const diseaseSymptoms = disease.symptoms;
      const matched = selectedSymptomIds.filter(s => diseaseSymptoms.includes(s));
      const union = Array.from(new Set([...selectedSymptomIds, ...diseaseSymptoms]));
      const jaccardOverlap = union.length > 0 ? (matched.length / union.length) * 100 : 0;

      // Additional strict match: percentage of disease's core symptoms matched
      const coreMatchPercentage = diseaseSymptoms.length > 0 
        ? (matched.length / diseaseSymptoms.length) * 100 
        : 0;

      // Combined Confidence Score
      // If we match many core symptoms, Jaccard and core match dominate.
      // Bayesian probability handles relative likelihood.
      const confidence = Math.round((bayesianProbability * 0.35 + jaccardOverlap * 0.35 + coreMatchPercentage * 0.30));

      results.push({
        disease,
        probability: Math.round(bayesianProbability),
        confidence: Math.min(Math.max(confidence, 1), 99), // Keep it between 1% and 99% for realism
        matchedSymptoms: matched
      });
    });

    // Sort by confidence score descending, then probability
    return results
      .filter(r => r.confidence > 5 || r.matchedSymptoms.length > 0)
      .sort((a, b) => b.confidence - a.confidence || b.probability - a.probability);
  }
}

// Simple NLP parser using keyword mappings to detect symptoms in natural language
export const parseSymptomsFromText = (text: string): string[] => {
  const lowercaseText = text.toLowerCase();
  const detectedSymptomIds: string[] = [];

  const keywordMappings: Record<string, string[]> = {
    fever: ['fever', 'high temp', 'temperature', 'feverish', 'hot body', 'chills'],
    fatigue: ['fatigue', 'tired', 'exhausted', 'weakness', 'drained', 'lethargic', 'no energy', 'weary'],
    chills: ['chill', 'shivering', 'cold sweat', 'shiver'],
    sweating: ['sweat', 'sweating', 'perspir'],
    weight_loss: ['weight loss', 'losing weight', 'lost weight', 'skinny'],
    increased_thirst: ['thirst', 'thirsty', 'drink water', 'polydipsia'],
    increased_hunger: ['hunger', 'hungry', 'appetite increase', 'eating a lot', 'polyphagia'],
    dizziness: ['dizzy', 'dizziness', 'lightheaded', 'spinning', 'vertigo', 'giddy'],
    lymph_nodes: ['lymph', 'swollen gland', 'neck swelling', 'swollen node'],
    
    dry_cough: ['dry cough', 'coughing dry', 'hacking cough'],
    wet_cough: ['wet cough', 'cough with phlegm', 'coughing phlegm', 'mucus cough', 'coughing mucus'],
    short_breath: ['shortness of breath', 'breathless', 'breathing difficulty', 'dyspnea', 'hard to breathe', 'choking'],
    sore_throat: ['sore throat', 'throat pain', 'throat irritation', 'hurt to swallow'],
    runny_nose: ['runny nose', 'congested nose', 'stuffy nose', 'nasal block', 'cold nose'],
    sneezing: ['sneeze', 'sneezing'],
    wheezing: ['wheeze', 'wheezing', 'whistling breath'],
    chest_congestion: ['congestion', 'tight chest', 'chest block'],
    
    nausea: ['nausea', 'nauseous', 'sick to my stomach', 'queasy'],
    vomiting: ['vomit', 'throwing up', 'puking', 'threw up'],
    heartburn: ['heartburn', 'acid reflux', 'indigestion', 'acid in throat'],
    stomach_pain: ['stomach ache', 'stomach pain', 'cramps', 'belly ache', 'abdominal'],
    diarrhea: ['diarrhea', 'loose stool', 'runny motion', 'watery poop'],
    constipation: ['constipat', 'hard stool', 'cannot poop'],
    bloating: ['bloat', 'gas', 'gassy', 'flatulence'],
    loss_of_appetite: ['loss of appetite', 'not hungry', 'dont want to eat', 'poor appetite'],
    difficulty_swallowing: ['difficulty swallowing', 'hard to swallow', 'swallow pain'],
    
    headache: ['headache', 'head ache', 'throbbing head', 'pain in head', 'migraine'],
    migraine_aura: ['aura', 'flashing light', 'zig zag patterns', 'blind spot'],
    sensitivity_light: ['sensitive to light', 'photophobia', 'light hurts'],
    sensitivity_sound: ['sensitive to sound', 'phonophobia', 'noise hurts'],
    numbness: ['numb', 'tingling', 'pins and needles'],
    blurry_vision: ['blurry vision', 'blurred', 'double vision', 'cannot see clearly'],
    confusion: ['confusion', 'brain fog', 'disoriented', 'forgetful'],
    insomnia: ['insomnia', 'cannot sleep', 'sleepless', 'wake up at night'],
    
    skin_rash: ['rash', 'skin break', 'red spots', 'lesion', 'skin infection'],
    itching: ['itch', 'itching', 'scratchy', 'pruritus'],
    dry_skin: ['dry skin', 'scaly skin', 'peeling skin', 'flaky skin'],
    redness: ['redness', 'inflamed skin', 'red skin'],
    blisters: ['blister', 'fluid bump', 'pimple-like bump'],
    yellow_skin: ['yellow skin', 'yellow eyes', 'jaundice'],
    
    joint_pain: ['joint pain', 'knee pain', 'elbow pain', 'wrist pain', 'arthritis'],
    joint_stiffness: ['stiffness in joint', 'stiff joint', 'morning stiffness'],
    muscle_pain: ['muscle pain', 'body ache', 'sore muscle', 'myalgia', 'body hurts'],
    back_pain: ['back pain', 'backache', 'spine pain', 'lower back'],
    neck_stiffness: ['stiff neck', 'neck stiffness'],
    
    frequent_urination: ['frequent urination', 'peeing a lot', 'pee often', 'polyuria'],
    painful_urination: ['burning urination', 'painful urination', 'burns when i pee', 'dysuria'],
    cloudy_urine: ['cloudy urine', 'smelly urine', 'urine odor'],
    blood_in_urine: ['blood in urine', 'red pee', 'hematuria'],
    
    loss_taste_smell: ['taste', 'smell', 'no taste', 'no smell', 'lost taste', 'lost smell'],
    chest_pain: ['chest pain', 'heart pain', 'angina', 'tightness in chest'],
    palpitations: ['palpitation', 'fluttering heart', 'racing heart', 'heart beat fast'],
    easy_bruising: ['bruis', 'bleeding easy']
  };

  Object.entries(keywordMappings).forEach(([symptomId, keywords]) => {
    const hasKeyword = keywords.some(keyword => lowercaseText.includes(keyword));
    if (hasKeyword) {
      detectedSymptomIds.push(symptomId);
    }
  });

  return detectedSymptomIds;
};

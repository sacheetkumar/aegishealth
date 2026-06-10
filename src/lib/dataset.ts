export interface Disease {
  id: string;
  name: string;
  description: string;
  precautions: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  specialty: string;
  symptoms: string[];
}

export interface Symptom {
  id: string;
  name: string;
  category: 'General' | 'Respiratory' | 'Digestive' | 'Neurological' | 'Skin' | 'Musculoskeletal' | 'Urinary' | 'Other';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  clinic: string;
  location: string;
  availableSlots: string[];
}

export const symptomsList: Symptom[] = [
  // General Symptoms
  { id: 'fever', name: 'High Fever', category: 'General' },
  { id: 'fatigue', name: 'Extreme Fatigue', category: 'General' },
  { id: 'chills', name: 'Chills', category: 'General' },
  { id: 'sweating', name: 'Excessive Sweating', category: 'General' },
  { id: 'weight_loss', name: 'Unexplained Weight Loss', category: 'General' },
  { id: 'increased_thirst', name: 'Increased Thirst (Polydipsia)', category: 'General' },
  { id: 'increased_hunger', name: 'Extreme Hunger (Polyphagia)', category: 'General' },
  { id: 'dizziness', name: 'Dizziness or Lightheadedness', category: 'General' },
  { id: 'lymph_nodes', name: 'Swollen Lymph Nodes', category: 'General' },

  // Respiratory Symptoms
  { id: 'dry_cough', name: 'Dry Cough', category: 'Respiratory' },
  { id: 'wet_cough', name: 'Cough with Phlegm', category: 'Respiratory' },
  { id: 'short_breath', name: 'Shortness of Breath (Dyspnea)', category: 'Respiratory' },
  { id: 'sore_throat', name: 'Sore Throat', category: 'Respiratory' },
  { id: 'runny_nose', name: 'Runny or Congested Nose', category: 'Respiratory' },
  { id: 'sneezing', name: 'Frequent Sneezing', category: 'Respiratory' },
  { id: 'wheezing', name: 'Wheezing Sound', category: 'Respiratory' },
  { id: 'chest_congestion', name: 'Chest Congestion', category: 'Respiratory' },

  // Digestive Symptoms
  { id: 'nausea', name: 'Nausea', category: 'Digestive' },
  { id: 'vomiting', name: 'Vomiting', category: 'Digestive' },
  { id: 'heartburn', name: 'Heartburn / Acid Regurgitation', category: 'Digestive' },
  { id: 'stomach_pain', name: 'Stomach Pain / Abdominal Cramps', category: 'Digestive' },
  { id: 'diarrhea', name: 'Diarrhea', category: 'Digestive' },
  { id: 'constipation', name: 'Constipation', category: 'Digestive' },
  { id: 'bloating', name: 'Bloating or Gas', category: 'Digestive' },
  { id: 'loss_of_appetite', name: 'Loss of Appetite', category: 'Digestive' },
  { id: 'difficulty_swallowing', name: 'Difficulty Swallowing', category: 'Digestive' },

  // Neurological Symptoms
  { id: 'headache', name: 'Severe Headache', category: 'Neurological' },
  { id: 'migraine_aura', name: 'Visual Aura / Flashing Lights', category: 'Neurological' },
  { id: 'sensitivity_light', name: 'Sensitivity to Light', category: 'Neurological' },
  { id: 'sensitivity_sound', name: 'Sensitivity to Sound', category: 'Neurological' },
  { id: 'numbness', name: 'Numbness or Tingling Sensation', category: 'Neurological' },
  { id: 'blurry_vision', name: 'Blurry Vision', category: 'Neurological' },
  { id: 'confusion', name: 'Confusion or Brain Fog', category: 'Neurological' },
  { id: 'insomnia', name: 'Difficulty Sleeping', category: 'Neurological' },

  // Skin Symptoms
  { id: 'skin_rash', name: 'Skin Rash or Lesions', category: 'Skin' },
  { id: 'itching', name: 'Severe Itching (Pruritus)', category: 'Skin' },
  { id: 'dry_skin', name: 'Dry, Scaly or Peeling Skin', category: 'Skin' },
  { id: 'redness', name: 'Skin Redness or Inflammation', category: 'Skin' },
  { id: 'blisters', name: 'Fluid-filled Blisters', category: 'Skin' },
  { id: 'yellow_skin', name: 'Yellowish Skin or Eyes (Jaundice)', category: 'Skin' },

  // Musculoskeletal Symptoms
  { id: 'joint_pain', name: 'Joint Pain', category: 'Musculoskeletal' },
  { id: 'joint_stiffness', name: 'Joint Stiffness (especially morning)', category: 'Musculoskeletal' },
  { id: 'muscle_pain', name: 'Muscle Aches / Body Pain', category: 'Musculoskeletal' },
  { id: 'back_pain', name: 'Lower Back Pain', category: 'Musculoskeletal' },
  { id: 'neck_stiffness', name: 'Stiff Neck', category: 'Musculoskeletal' },

  // Urinary Symptoms
  { id: 'frequent_urination', name: 'Frequent Urination', category: 'Urinary' },
  { id: 'painful_urination', name: 'Burning or Painful Urination', category: 'Urinary' },
  { id: 'cloudy_urine', name: 'Cloudy or Strong-smelling Urine', category: 'Urinary' },
  { id: 'blood_in_urine', name: 'Blood in Urine', category: 'Urinary' },

  // Other Symptoms
  { id: 'loss_taste_smell', name: 'Loss of Taste or Smell', category: 'Other' },
  { id: 'chest_pain', name: 'Chest Pain or Tightness', category: 'Other' },
  { id: 'palpitations', name: 'Rapid or Irregular Heartbeat', category: 'Other' },
  { id: 'easy_bruising', name: 'Easy Bruising or Bleeding', category: 'Other' }
];

export const diseasesList: Disease[] = [
  // === General Physician (25 Diseases) ===
  {
    id: 'influenza',
    name: 'Influenza (Flu)',
    description: 'A common viral infection of the respiratory tract causing fever, body aches, sore throat, and severe fatigue.',
    precautions: ['Get plenty of rest', 'Drink warm fluids', 'Take pain relievers', 'Avoid close contact with others'],
    riskLevel: 'Medium',
    specialty: 'General Physician',
    symptoms: ['fever', 'fatigue', 'chills', 'dry_cough', 'sore_throat', 'runny_nose', 'muscle_pain', 'headache']
  },
  {
    id: 'common_cold',
    name: 'Common Cold',
    description: 'A mild viral infection of the nose, throat, and sinuses, causing runny nose, congestion, and frequent sneezing.',
    precautions: ['Stay hydrated', 'Inhale steam', 'Use saline nasal drops', 'Get adequate sleep'],
    riskLevel: 'Low',
    specialty: 'General Physician',
    symptoms: ['runny_nose', 'sneezing', 'sore_throat', 'dry_cough', 'fatigue', 'headache']
  },
  {
    id: 'malaria',
    name: 'Malaria',
    description: 'A life-threatening disease caused by plasmodium parasites transmitted through infected female Anopheles mosquito bites.',
    precautions: ['Take anti-malarial drugs', 'Use mosquito nets', 'Cover skin with protective clothing', 'Control standing water'],
    riskLevel: 'High',
    specialty: 'General Physician',
    symptoms: ['fever', 'chills', 'sweating', 'headache', 'nausea', 'vomiting', 'muscle_pain', 'fatigue']
  },
  {
    id: 'typhoid',
    name: 'Typhoid Fever',
    description: 'A bacterial infection caused by Salmonella Typhi, usually contracted through contaminated food or water.',
    precautions: ['Drink clean boiled water', 'Eat thoroughly cooked food', 'Wash hands frequently', 'Complete antibiotics course'],
    riskLevel: 'High',
    specialty: 'General Physician',
    symptoms: ['fever', 'headache', 'stomach_pain', 'diarrhea', 'constipation', 'fatigue', 'loss_of_appetite']
  },
  {
    id: 'dengue',
    name: 'Dengue Fever',
    description: 'A mosquito-borne viral disease causing severe high fever, joint and muscle pain, skin rashes, and occasionally bleeding.',
    precautions: ['Drink electrolyte fluids', 'Avoid aspirin/ibuprofen', 'Rest completely', 'Monitor platelet counts'],
    riskLevel: 'High',
    specialty: 'General Physician',
    symptoms: ['fever', 'headache', 'joint_pain', 'muscle_pain', 'skin_rash', 'fatigue', 'nausea', 'vomiting']
  },
  {
    id: 'gastroenteritis',
    name: 'Viral Gastroenteritis',
    description: 'An intestinal infection marked by watery diarrhea, abdominal cramps, nausea, vomiting, and sometimes fever.',
    precautions: ['Drink ORS solution', 'Follow BRAT diet (banana, rice, applesauce, toast)', 'Wash hands before meals', 'Avoid dairy and fatty foods'],
    riskLevel: 'Medium',
    specialty: 'General Physician',
    symptoms: ['diarrhea', 'vomiting', 'nausea', 'stomach_pain', 'bloating', 'fever', 'fatigue']
  },
  {
    id: 'heat_stroke',
    name: 'Heat Stroke',
    description: 'A critical condition caused by your body overheating, usually as a result of prolonged exposure to high temperatures.',
    precautions: ['Move to a cool indoor area', 'Apply cool water to skin', 'Drink cool fluids slowly', 'Seek emergency care'],
    riskLevel: 'High',
    specialty: 'General Physician',
    symptoms: ['fever', 'dizziness', 'headache', 'nausea', 'vomiting', 'sweating', 'confusion']
  },
  {
    id: 'vit_d_deficiency',
    name: 'Vitamin D Deficiency',
    description: 'A common nutritional deficiency causing weak bones, joint discomfort, fatigue, and lower muscle strength.',
    precautions: ['Get early morning sunlight exposure', 'Eat fortified foods', 'Take Vitamin D3 supplements', 'Monitor blood levels regularly'],
    riskLevel: 'Low',
    specialty: 'General Physician',
    symptoms: ['fatigue', 'muscle_pain', 'joint_pain', 'back_pain', 'dizziness']
  },
  {
    id: 'anemia',
    name: 'Iron Deficiency Anemia',
    description: 'A condition in which the blood lacks adequate healthy red blood cells due to insufficient iron, leading to low oxygen delivery.',
    precautions: ['Eat iron-rich foods (spinach, dates)', 'Take iron supplements with Vitamin C', 'Avoid tea/coffee with meals', 'Monitor hemoglobin count'],
    riskLevel: 'Medium',
    specialty: 'General Physician',
    symptoms: ['fatigue', 'dizziness', 'short_breath', 'headache', 'blurry_vision']
  },
  {
    id: 'dehydration',
    name: 'Clinical Dehydration',
    description: 'A harmful reduction in the amount of water and crucial electrolytes in the body needed to carry out normal functions.',
    precautions: ['Drink plenty of mineral water', 'Sip electrolyte fluids', 'Avoid caffeine/alcohol', 'Rest in cool areas'],
    riskLevel: 'Medium',
    specialty: 'General Physician',
    symptoms: ['fatigue', 'dizziness', 'headache', 'increased_thirst', 'confusion']
  },
  {
    id: 'tetanus',
    name: 'Tetanus Infection',
    description: 'A serious bacterial disease affecting the nervous system, leading to painful muscle contractions, particularly of the jaw (lockjaw).',
    precautions: ['Administer Tdap/Tetanus vaccine', 'Clean wounds thoroughly with antiseptics', 'Seek urgent clinical care', 'Avoid self-dressing dirty deep wounds'],
    riskLevel: 'High',
    specialty: 'General Physician',
    symptoms: ['muscle_pain', 'fever', 'neck_stiffness', 'headache', 'difficulty_swallowing']
  },
  {
    id: 'rabies',
    name: 'Rabies Virus',
    description: 'A deadly viral disease spread to people from the saliva of infected animals, primarily through bites.',
    precautions: ['Wash animal bites immediately with soap/water', 'Administer Post-Exposure Prophylaxis (PEP) vaccine', 'Avoid contact with stray animals', 'Get pets vaccinated'],
    riskLevel: 'High',
    specialty: 'General Physician',
    symptoms: ['fever', 'headache', 'nausea', 'difficulty_swallowing', 'confusion']
  },
  {
    id: 'lyme_disease',
    name: 'Lyme Disease',
    description: 'A tick-borne bacterial illness that causes a characteristic skin rash, joint stiffness, and chronic fatigue.',
    precautions: ['Wear protective clothing in woods', 'Use tick repellents', 'Remove ticks carefully with tweezers', 'Take antibiotics course'],
    riskLevel: 'Medium',
    specialty: 'General Physician',
    symptoms: ['skin_rash', 'fever', 'fatigue', 'headache', 'joint_pain', 'muscle_pain']
  },
  {
    id: 'scurvy',
    name: 'Vitamin C Deficiency (Scurvy)',
    description: 'A nutritional deficiency caused by lack of Vitamin C, leading to bleeding gums, skin rashes, joint aches, and bruising.',
    precautions: ['Eat citrus fruits (amlas, oranges)', 'Eat raw vegetables', 'Take Vitamin C supplements', 'Avoid overcooking vegetables'],
    riskLevel: 'Medium',
    specialty: 'General Physician',
    symptoms: ['fatigue', 'joint_pain', 'easy_bruising', 'skin_rash', 'muscle_pain']
  },
  {
    id: 'cholera',
    name: 'Cholera',
    description: 'An acute diarrheal illness caused by infection of the intestine with the Vibrio cholerae bacteria, causing severe watery diarrhea.',
    precautions: ['Drink only bottled/boiled water', 'Wash hands frequently with soap', 'Administer oral rehydration salts (ORS)', 'Seek immediate intravenous fluids if severe'],
    riskLevel: 'High',
    specialty: 'General Physician',
    symptoms: ['diarrhea', 'vomiting', 'nausea', 'increased_thirst', 'muscle_pain', 'fatigue']
  },
  {
    id: 'food_poisoning',
    name: 'Bacterial Food Poisoning',
    description: 'Illness caused by consuming food contaminated with toxins, bacteria, viruses, or parasites.',
    precautions: ['Drink clear broths or ORS', 'Eat bland foods', 'Wash hands and surfaces', 'Avoid raw foods'],
    riskLevel: 'Medium',
    specialty: 'General Physician',
    symptoms: ['vomiting', 'nausea', 'diarrhea', 'stomach_pain', 'fever', 'fatigue']
  },
  {
    id: 'mononucleosis',
    name: 'Infectious Mononucleosis',
    description: 'A contagious viral infection (often Epstein-Barr virus) causing severe sore throat, fever, and swollen lymph nodes.',
    precautions: ['Get rest', 'Drink plenty of fluids', 'Avoid contact sports (spleen rupture risk)', 'Use pain relievers'],
    riskLevel: 'Medium',
    specialty: 'General Physician',
    symptoms: ['sore_throat', 'fever', 'fatigue', 'headache', 'lymph_nodes', 'muscle_pain']
  },
  {
    id: 'brucellosis',
    name: 'Brucellosis',
    description: 'An infectious bacterial disease contracted from animal fluids or unpasteurized dairy products.',
    precautions: ['Avoid raw/unpasteurized milk products', 'Cook meat thoroughly', 'Wear gloves when handling animals', 'Complete double-antibiotic therapy'],
    riskLevel: 'Medium',
    specialty: 'General Physician',
    symptoms: ['fever', 'chills', 'sweating', 'fatigue', 'joint_pain', 'muscle_pain']
  },
  {
    id: 'gout_gp',
    name: 'Gouty Uric Acid Flare',
    description: 'An inflammatory arthritis caused by deposition of uric acid crystals in joints, causing severe local aches.',
    precautions: ['Avoid high-purine foods (red meat)', 'Drink plenty of water', 'Limit alcohol consumption', 'Take anti-inflammatory medications'],
    riskLevel: 'Medium',
    specialty: 'General Physician',
    symptoms: ['joint_pain', 'joint_stiffness', 'redness', 'fever']
  },
  {
    id: 'fatigue_syndrome',
    name: 'Chronic Fatigue Syndrome (CFS)',
    description: 'A complicated disorder characterized by extreme fatigue that lasts for at least six months and cannot be explained by an underlying medical condition.',
    precautions: ['Adopt strict activity pacing', 'Maintain sleep hygiene', 'Engage in gentle stretching', 'Consult therapist for support'],
    riskLevel: 'Low',
    specialty: 'General Physician',
    symptoms: ['fatigue', 'muscle_pain', 'headache', 'insomnia', 'confusion']
  },
  {
    id: 'measles',
    name: 'Measles (Rubeola)',
    description: 'A highly contagious viral infection of the respiratory system causing fever, cough, runny nose, and red skin rashes.',
    precautions: ['Administer MMR vaccine', 'Maintain isolation', 'Take Vitamin A supplements', 'Use fever reducers'],
    riskLevel: 'High',
    specialty: 'General Physician',
    symptoms: ['fever', 'dry_cough', 'runny_nose', 'sore_throat', 'skin_rash', 'redness']
  },
  {
    id: 'rubella',
    name: 'German Measles (Rubella)',
    description: 'A mild viral infection that causes a skin rash, fever, and swollen lymph nodes, but is highly dangerous during pregnancy.',
    precautions: ['Ensure MMR vaccination', 'Isolate from pregnant women', 'Drink warm fluids', 'Rest adequately'],
    riskLevel: 'Medium',
    specialty: 'General Physician',
    symptoms: ['skin_rash', 'fever', 'lymph_nodes', 'sore_throat', 'headache', 'joint_pain']
  },
  {
    id: 'mumps',
    name: 'Mumps',
    description: 'A contagious viral infection causing painful swelling of the salivary (parotid) glands in the cheek and jaw area.',
    precautions: ['Apply warm/cold packs to swollen jaw', 'Eat soft foods', 'Avoid sour/acidic items', 'Isolate for 5 days after swelling starts'],
    riskLevel: 'Medium',
    specialty: 'General Physician',
    symptoms: ['fever', 'headache', 'fatigue', 'difficulty_swallowing', 'muscle_pain']
  },
  {
    id: 'pertussis',
    name: 'Whooping Cough (Pertussis)',
    description: 'A highly contagious bacterial respiratory tract infection characterized by a severe hacking cough followed by a high-pitched intake of breath.',
    precautions: ['Get DTaP vaccination', 'Use room humidifiers', 'Stay hydrated', 'Complete prescribed antibiotic course'],
    riskLevel: 'High',
    specialty: 'General Physician',
    symptoms: ['dry_cough', 'runny_nose', 'sneezing', 'fever', 'short_breath']
  },
  {
    id: 'strep_throat',
    name: 'Strep Throat',
    description: 'A bacterial throat infection causing a painful sore throat, fever, and difficulties in swallowing.',
    precautions: ['Saltwater gargles', 'Complete antibiotic course', 'Use soft food items', 'Replace toothbrush after starting antibiotics'],
    riskLevel: 'Medium',
    specialty: 'General Physician',
    symptoms: ['sore_throat', 'fever', 'difficulty_swallowing', 'headache', 'lymph_nodes']
  },

  // === Pulmonologist (15 Diseases) ===
  {
    id: 'covid19',
    name: 'COVID-19 Respiratory Disease',
    description: 'An infectious respiratory disease caused by the SARS-CoV-2 virus, ranging from mild symptoms to severe viral pneumonia.',
    precautions: ['Isolate for 5-7 days', 'Monitor blood oxygen levels', 'Wear masks', 'Seek immediate clinical care if short of breath'],
    riskLevel: 'High',
    specialty: 'Pulmonologist',
    symptoms: ['fever', 'fatigue', 'dry_cough', 'short_breath', 'sore_throat', 'loss_taste_smell', 'muscle_pain', 'headache']
  },
  {
    id: 'asthma',
    name: 'Bronchial Asthma',
    description: 'A chronic respiratory condition in which the airways narrow, swell, and produce extra mucus, making breathing difficult.',
    precautions: ['Carry rescue inhalers', 'Identify allergen triggers (dust/pollen)', 'Avoid heavy cold drafts', 'Monitor peak flow counts'],
    riskLevel: 'High',
    specialty: 'Pulmonologist',
    symptoms: ['dry_cough', 'short_breath', 'wheezing', 'chest_congestion', 'fatigue']
  },
  {
    id: 'pneumonia',
    name: 'Infectious Pneumonia',
    description: 'An infection that inflames the air sacs in one or both lungs, which may fill with fluid or pus, causing severe coughing with phlegm.',
    precautions: ['Complete antibiotic/antiviral therapy', 'Use steam humidifiers', 'Avoid smoking', 'Rest in a semi-upright posture'],
    riskLevel: 'High',
    specialty: 'Pulmonologist',
    symptoms: ['fever', 'chills', 'wet_cough', 'short_breath', 'chest_pain', 'fatigue', 'sweating']
  },
  {
    id: 'tuberculosis',
    name: 'Pulmonary Tuberculosis (TB)',
    description: 'A contagious bacterial infection caused by Mycobacterium tuberculosis that primarily attacks the lungs.',
    precautions: ['Complete full 6-month DOTS treatment', 'Wear face masks', 'Ensure bedroom is well-ventilated', 'Monitor liver panel values'],
    riskLevel: 'High',
    specialty: 'Pulmonologist',
    symptoms: ['wet_cough', 'fever', 'chills', 'sweating', 'weight_loss', 'fatigue', 'chest_pain', 'loss_of_appetite']
  },
  {
    id: 'copd',
    name: 'COPD (Chronic Obstructive Pulmonary Disease)',
    description: 'A progressive lung disease characterized by long-term breathing problems and poor airflow, primarily caused by smoking.',
    precautions: ['Stop smoking immediately', 'Ensure annual flu vaccination', 'Engage in pulmonary rehab', 'Use long-acting bronchodilator inhalers'],
    riskLevel: 'High',
    specialty: 'Pulmonologist',
    symptoms: ['wet_cough', 'short_breath', 'wheezing', 'chest_congestion', 'fatigue']
  },
  {
    id: 'pulm_embolism',
    name: 'Pulmonary Embolism',
    description: 'A sudden blockage in one of the pulmonary arteries in your lungs, usually caused by blood clots traveling from deep veins in the legs.',
    precautions: ['Seek emergency critical care', 'Take prescribed anticoagulants', 'Avoid prolonged immobilization', 'Wear compression stockings'],
    riskLevel: 'High',
    specialty: 'Pulmonologist',
    symptoms: ['short_breath', 'chest_pain', 'dry_cough', 'palpitations', 'sweating', 'dizziness']
  },
  {
    id: 'pleurisy',
    name: 'Pleurisy',
    description: 'An inflammation of the pleural membranes surrounding the lungs, causing sharp chest pains aggravated by breathing or coughing.',
    precautions: ['Take anti-inflammatory drugs', 'Rest lying on the painful side (helps splint)', 'Avoid heavy physical efforts', 'Monitor temperature for infection signs'],
    riskLevel: 'Medium',
    specialty: 'Pulmonologist',
    symptoms: ['chest_pain', 'short_breath', 'dry_cough', 'fever', 'fatigue']
  },
  {
    id: 'sleep_apnea',
    name: 'Obstructive Sleep Apnea',
    description: 'A sleep disorder where breathing repeatedly stops and starts due to brief throat muscle relaxation blockages.',
    precautions: ['Use CPAP therapy machine during sleep', 'Lose excess body weight', 'Avoid sleeping on your back', 'Avoid alcohol and sedatives before bed'],
    riskLevel: 'Medium',
    specialty: 'Pulmonologist',
    symptoms: ['insomnia', 'fatigue', 'headache', 'confusion', 'dizziness']
  },
  {
    id: 'bronchiectasis',
    name: 'Bronchiectasis',
    description: 'A chronic condition where the bronchial tubes become permanently widened and damaged, leading to mucus accumulation.',
    precautions: ['Perform daily chest physiotherapy', 'Drink plenty of water', 'Take inhaled bronchodilators', 'Treat infections promptly with antibiotics'],
    riskLevel: 'High',
    specialty: 'Pulmonologist',
    symptoms: ['wet_cough', 'short_breath', 'chest_pain', 'fatigue', 'wheezing']
  },
  {
    id: 'sarcoidosis',
    name: 'Pulmonary Sarcoidosis',
    description: 'An inflammatory disease characterized by the growth of tiny collections of inflammatory cells (granulomas) in the lungs.',
    precautions: ['Take prescribed corticosteroids', 'Get regular chest X-rays', 'Avoid dust and chemical fumes', 'Eat a healthy balanced diet'],
    riskLevel: 'High',
    specialty: 'Pulmonologist',
    symptoms: ['dry_cough', 'short_breath', 'chest_pain', 'fatigue', 'skin_rash', 'weight_loss']
  },
  {
    id: 'bronchitis_acute',
    name: 'Acute Bronchitis',
    description: 'Temporary inflammation of the bronchial tubes, usually following a viral cold, causing coughing and phlegm.',
    precautions: ['Drink warm broths', 'Inhale steam', 'Take cough expectorants', 'Avoid dry cold air'],
    riskLevel: 'Low',
    specialty: 'Pulmonologist',
    symptoms: ['wet_cough', 'chest_congestion', 'sore_throat', 'fatigue', 'wheezing', 'fever']
  },
  {
    id: 'pulm_fibrosis',
    name: 'Idiopathic Pulmonary Fibrosis',
    description: 'A progressive disease where lung tissue becomes scarred and stiffened over time, making it difficult for oxygen to enter the blood.',
    precautions: ['Receive home oxygen therapy', 'Avoid air pollutants', 'Maintain updated immunizations', 'Discuss antifibrotic therapy options'],
    riskLevel: 'High',
    specialty: 'Pulmonologist',
    symptoms: ['dry_cough', 'short_breath', 'fatigue', 'weight_loss', 'chest_pain']
  },
  {
    id: 'croup',
    name: 'Laryngotracheobronchitis (Croup)',
    description: 'An acute viral respiratory infection in young children causing airway swelling, leading to a loud barking cough.',
    precautions: ['Sit in a cool misty room', 'Avoid crying triggers (worsens swelling)', 'Administer oral dexamethasone steroid', 'Seek care if retractions develop'],
    riskLevel: 'Medium',
    specialty: 'Pulmonologist',
    symptoms: ['dry_cough', 'short_breath', 'wheezing', 'sore_throat', 'fever']
  },
  {
    id: 'silicosis',
    name: 'Silicosis Lung Disease',
    description: 'An occupational progressive lung disease caused by inhaling dust containing crystalline silica particles.',
    precautions: ['Use high-quality respirator masks at work', 'Implement wet-method dust suppression', 'Get screened for TB regularly', 'Avoid smoking'],
    riskLevel: 'High',
    specialty: 'Pulmonologist',
    symptoms: ['dry_cough', 'short_breath', 'chest_pain', 'fatigue', 'weight_loss']
  },
  {
    id: 'asbestosis',
    name: 'Asbestosis',
    description: 'A chronic lung disease caused by inhaling asbestos fibers, leading to progressive lung scarring.',
    precautions: ['Avoid further asbestos exposure', 'Participate in chest screenings', 'Use supplemental oxygen if needed', 'Quit smoking (reduces lung cancer risk)'],
    riskLevel: 'High',
    specialty: 'Pulmonologist',
    symptoms: ['short_breath', 'dry_cough', 'chest_pain', 'fatigue', 'weight_loss']
  },

  // === Endocrinologist (10 Diseases) ===
  {
    id: 'diabetes_type2',
    name: 'Type 2 Diabetes Mellitus',
    description: 'A chronic metabolic disorder characterized by high blood glucose, insulin resistance, and pancreatic dysfunction.',
    precautions: ['Follow a low-carb diet', 'Exercise 30+ mins daily', 'Monitor finger-prick sugar levels', 'Examine feet daily for cuts'],
    riskLevel: 'High',
    specialty: 'Endocrinologist',
    symptoms: ['fatigue', 'weight_loss', 'increased_thirst', 'increased_hunger', 'blurry_vision', 'frequent_urination', 'numbness']
  },
  {
    id: 'diabetes_type1',
    name: 'Type 1 Diabetes Mellitus',
    description: 'An autoimmune condition where the pancreas produces little to no insulin, requiring daily exogenous insulin therapy.',
    precautions: ['Administer daily insulin injections', 'Count dietary carbohydrates', 'Carry glucagon kits', 'Monitor sugar trends continuous CGM'],
    riskLevel: 'High',
    specialty: 'Endocrinologist',
    symptoms: ['increased_thirst', 'frequent_urination', 'increased_hunger', 'weight_loss', 'fatigue', 'blurry_vision', 'vomiting']
  },
  {
    id: 'hypothyroidism',
    name: 'Hypothyroidism',
    description: 'A clinical state where the thyroid gland is underactive, producing insufficient thyroid hormone, slowing the metabolic rate.',
    precautions: ['Take Levothyroxine on empty stomach', 'Eat high-fiber foods for constipation', 'Check thyroid levels (TSH) every 6-8 weeks', 'Avoid calcium/iron near hormone dose'],
    riskLevel: 'Medium',
    specialty: 'Endocrinologist',
    symptoms: ['fatigue', 'weight_loss', 'constipation', 'dry_skin', 'dizziness', 'insomnia']
  },
  {
    id: 'hyperthyroidism',
    name: 'Hyperthyroidism',
    description: 'A thyroid disorder marked by excess production of thyroid hormone, leading to hypermetabolism, tremors, and weight loss.',
    precautions: ['Take beta-blockers for heart symptoms', 'Take antithyroid drug therapy', 'Drink plenty of water', 'Avoid iodized salt overrides'],
    riskLevel: 'High',
    specialty: 'Endocrinologist',
    symptoms: ['weight_loss', 'increased_hunger', 'palpitations', 'sweating', 'insomnia', 'fatigue', 'blurry_vision']
  },
  {
    id: 'goiter',
    name: 'Goiter (Thyroid Enlargement)',
    description: 'An abnormal swelling of the thyroid gland, often caused by iodine deficiency or thyroid nodules, causing neck swelling.',
    precautions: ['Use iodized table salt', 'Monitor for breathing/swallowing difficulties', 'Avoid excessive goitrogenic foods (raw cabbage)', 'Get thyroid ultrasound scan'],
    riskLevel: 'Medium',
    specialty: 'Endocrinologist',
    symptoms: ['difficulty_swallowing', 'neck_stiffness', 'dry_cough', 'wheezing']
  },
  {
    id: 'hashimotos',
    name: 'Hashimoto\'s Thyroiditis',
    description: 'An autoimmune disorder where the immune system mistakenly attacks thyroid tissue, gradually leading to hypothyroidism.',
    precautions: ['Take daily thyroid hormone replacements', 'Monitor antibody levels', 'Manage systemic inflammation', 'Get thyroid nodule scans'],
    riskLevel: 'Medium',
    specialty: 'Endocrinologist',
    symptoms: ['fatigue', 'constipation', 'dry_skin', 'muscle_pain', 'joint_stiffness']
  },
  {
    id: 'pcos',
    name: 'Polycystic Ovary Syndrome (PCOS)',
    description: 'A hormonal disorder common among reproductive-age women, causing irregular periods, insulin resistance, and cystic ovaries.',
    precautions: ['Adopt a low-GI nutrition plan', 'Engage in strength training', 'Take Metformin if insulin resistant', 'Monitor fertility indicators'],
    riskLevel: 'Medium',
    specialty: 'Endocrinologist',
    symptoms: ['weight_loss', 'skin_rash', 'itching', 'fatigue', 'insomnia']
  },
  {
    id: 'addisons',
    name: 'Addison\'s Disease',
    description: 'A rare disorder where the adrenal glands produce insufficient cortisol and aldosterone hormones, leading to fatigue and low pressure.',
    precautions: ['Take oral steroid replacements daily', 'Carry hydrocortisone emergency injection kit', 'Increase salt intake during hot weather', 'Wear medical alert identification'],
    riskLevel: 'High',
    specialty: 'Endocrinologist',
    symptoms: ['fatigue', 'weight_loss', 'nausea', 'vomiting', 'diarrhea', 'stomach_pain', 'dizziness']
  },
  {
    id: 'cushings',
    name: 'Cushing\'s Syndrome',
    description: 'A hormonal disorder caused by prolonged exposure to high levels of cortisol, leading to weight gain and high blood pressure.',
    precautions: ['Monitor bone density (osteoporosis risk)', 'Restrict salt intake', 'Monitor blood glucose levels', 'Identify cortisol tumor triggers'],
    riskLevel: 'High',
    specialty: 'Endocrinologist',
    symptoms: ['fatigue', 'skin_rash', 'redness', 'muscle_pain', 'insomnia', 'headache']
  },
  {
    id: 'prolactinoma',
    name: 'Hyperprolactinemia',
    description: 'A condition where the pituitary gland secretes excess prolactin hormone, causing fertility issues and headaches.',
    precautions: ['Take dopamine agonist medications', 'Monitor visual fields', 'Get pituitary MRI scans', 'Avoid severe stress'],
    riskLevel: 'Medium',
    specialty: 'Endocrinologist',
    symptoms: ['headache', 'blurry_vision', 'fatigue', 'insomnia', 'numbness']
  },

  // === Cardiologist (10 Diseases) ===
  {
    id: 'hypertension',
    name: 'Hypertension (Chronic High Blood Pressure)',
    description: 'A long-term medical condition where the blood pressure in the systemic arteries is persistently elevated, strain on heart.',
    precautions: ['Limit daily sodium intake to < 1.5g', 'Do daily aerobic walks', 'Manage stress levels', 'Restrict alcohol and tobacco'],
    riskLevel: 'High',
    specialty: 'Cardiologist',
    symptoms: ['headache', 'dizziness', 'chest_pain', 'palpitations', 'blurry_vision', 'short_breath']
  },
  {
    id: 'coronary_disease',
    name: 'Coronary Artery Disease (CAD)',
    description: 'A narrowing or blockage of the coronary arteries, usually caused by plaque buildup, reducing blood flow to cardiac muscle.',
    precautions: ['Eat a Mediterranean diet', 'Take daily low-dose Aspirin', 'Maintain LDL cholesterol < 70 mg/dL', 'Avoid sudden heavy lifting'],
    riskLevel: 'High',
    specialty: 'Cardiologist',
    symptoms: ['chest_pain', 'short_breath', 'fatigue', 'palpitations', 'nausea', 'dizziness', 'sweating']
  },
  {
    id: 'heart_failure',
    name: 'Congestive Heart Failure (CHF)',
    description: 'A chronic progressive condition where the heart muscle is too weak to pump blood efficiently, causing fluid retention.',
    precautions: ['Weigh yourself daily (fluid tracking)', 'Take prescribed diuretics', 'Restrict fluid intake to 1.5-2L/day', 'Avoid NSAID pain relievers'],
    riskLevel: 'High',
    specialty: 'Cardiologist',
    symptoms: ['short_breath', 'fatigue', 'chest_congestion', 'palpitations', 'dizziness', 'wet_cough']
  },
  {
    id: 'arrhythmia',
    name: 'Atrial Fibrillation (Arrhythmia)',
    description: 'An irregular, often rapid heart rate that causes poor blood flow and increases the risk of stroke.',
    precautions: ['Take blood thinners (anticoagulants)', 'Avoid caffeine, energy drinks, and alcohol', 'Learn self-pulse checks', 'Get regular ECG monitoring'],
    riskLevel: 'High',
    specialty: 'Cardiologist',
    symptoms: ['palpitations', 'short_breath', 'fatigue', 'dizziness', 'chest_pain', 'sweating']
  },
  {
    id: 'infarction',
    name: 'Acute Myocardial Infarction (Heart Attack)',
    description: 'A life-threatening medical emergency where blood flow to a part of the heart muscle is blocked, causing tissue death.',
    precautions: ['Chew one full 325mg Aspirin immediately', 'Call emergency ambulance services', 'Lie down and stay completely calm', 'Administer emergency oxygen if available'],
    riskLevel: 'High',
    specialty: 'Cardiologist',
    symptoms: ['chest_pain', 'short_breath', 'sweating', 'nausea', 'vomiting', 'dizziness', 'palpitations']
  },
  {
    id: 'angina',
    name: 'Angina Pectoris',
    description: 'A type of temporary chest pain or pressure caused by reduced blood flow to the heart muscle, often during stress or physical exertion.',
    precautions: ['Rest immediately when pain starts', 'Place sublingual Nitroglycerin under tongue', 'Avoid extreme physical exertion', 'Stop cold drafts exposure'],
    riskLevel: 'High',
    specialty: 'Cardiologist',
    symptoms: ['chest_pain', 'short_breath', 'fatigue', 'dizziness', 'nausea']
  },
  {
    id: 'pericarditis',
    name: 'Pericarditis',
    description: 'Inflammation of the pericardium (sac surrounding the heart), causing sharp chest pain that improves when sitting forward.',
    precautions: ['Take anti-inflammatory meds', 'Avoid physical exercise', 'Monitor for difficulty breathing', 'Follow-up with echocardiogram'],
    riskLevel: 'High',
    specialty: 'Cardiologist',
    symptoms: ['chest_pain', 'fever', 'fatigue', 'palpitations', 'short_breath', 'dry_cough']
  },
  {
    id: 'myocarditis',
    name: 'Myocarditis',
    description: 'Inflammation of the heart muscle (myocardium), commonly triggered by viral infections, leading to chest ache.',
    precautions: ['Rest completely', 'Avoid strenuous sports for 3-6 months', 'Monitor heart rhythm', 'Follow medication guidelines'],
    riskLevel: 'High',
    specialty: 'Cardiologist',
    symptoms: ['chest_pain', 'short_breath', 'palpitations', 'fatigue', 'fever', 'dizziness']
  },
  {
    id: 'mitral_valve',
    name: 'Mitral Valve Prolapse',
    description: 'A heart valve disease where the leaflets of the mitral valve bulge into the left atrium like a parachute during contraction.',
    precautions: ['Limit caffeine and stimulants', 'Engage in moderate exercise', 'Stay hydrated', 'Get regular checkups with echocardiogram'],
    riskLevel: 'Medium',
    specialty: 'Cardiologist',
    symptoms: ['palpitations', 'chest_pain', 'fatigue', 'dizziness', 'short_breath', 'insomnia']
  },
  {
    id: 'atherosclerosis',
    name: 'Atherosclerosis',
    description: 'A disease where plaque builds up inside the arteries, hardening and narrowing the arterial walls.',
    precautions: ['Maintain low LDL cholesterol levels', 'Quit smoking', 'Do moderate daily exercise', 'Eat high-fiber, low-fat foods'],
    riskLevel: 'High',
    specialty: 'Cardiologist',
    symptoms: ['fatigue', 'dizziness', 'numbness', 'headache', 'chest_pain']
  },

  // === Neurologist (12 Diseases) ===
  {
    id: 'migraine',
    name: 'Migraine Headache',
    description: 'A neurological disorder causing severe, recurring, throbbing headaches usually affecting one side of the head, with sensory aura.',
    precautions: ['Rest in a quiet dark room', 'Apply ice pack to neck/forehead', 'Avoid triggers (chocolate, cheese, screen glare)', 'Take triptan medications early'],
    riskLevel: 'Medium',
    specialty: 'Neurologist',
    symptoms: ['headache', 'migraine_aura', 'sensitivity_light', 'sensitivity_sound', 'nausea', 'vomiting', 'dizziness']
  },
  {
    id: 'tension_headache',
    name: 'Tension Headache',
    description: 'A common mild-to-moderate dull ache around the forehead, often described as a tight band around the head, linked to stress.',
    precautions: ['Apply hot/cold compress to neck', 'Engage in deep breathing relaxation', 'Maintain consistent posture', 'Limit painkiller overuse'],
    riskLevel: 'Low',
    specialty: 'Neurologist',
    symptoms: ['headache', 'fatigue', 'neck_stiffness', 'insomnia']
  },
  {
    id: 'cluster_headache',
    name: 'Cluster Headache',
    description: 'An extremely painful series of headaches that occur in cycles or "clusters," usually centered around one eye.',
    precautions: ['Inhale 100% pure oxygen during attack', 'Maintain strict sleep patterns', 'Avoid alcohol during cluster cycles', 'Discuss preventive triptan medications'],
    riskLevel: 'High',
    specialty: 'Neurologist',
    symptoms: ['headache', 'redness', 'sweating', 'runny_nose', 'insomnia']
  },
  {
    id: 'epilepsy',
    name: 'Epilepsy & Seizure Disorder',
    description: 'A neurological disorder in which brain activity becomes abnormal, causing seizures or periods of unusual behavior and loss of awareness.',
    precautions: ['Take anticonvulsant pills without skipping doses', 'Maintain consistent sleep', 'Avoid strobe lights and hyperventilation', 'Do not swim or climb heights alone'],
    riskLevel: 'High',
    specialty: 'Neurologist',
    symptoms: ['confusion', 'numbness', 'blurry_vision', 'dizziness', 'headache', 'insomnia']
  },
  {
    id: 'parkinsons',
    name: 'Parkinson\'s Disease',
    description: 'A progressive nervous system disorder that affects movement, causing tremors, muscle stiffness, and slow steps.',
    precautions: ['Take levodopa/carbidopa medications regularly', 'Engage in physical balance therapy', 'Modify home surfaces to prevent slips', 'Use thick utensils'],
    riskLevel: 'High',
    specialty: 'Neurologist',
    symptoms: ['joint_stiffness', 'muscle_pain', 'fatigue', 'dizziness', 'difficulty_swallowing', 'confusion']
  },
  {
    id: 'alzheimers',
    name: 'Alzheimer\'s Disease',
    description: 'A progressive neurologic disease that causes the brain to shrink and brain cells to die, causing memory loss and confusion.',
    precautions: ['Implement structured routine schedules', 'Place childproof door locks/sensors', 'Maintain cognitive activities', 'Keep emergency contacts on patient'],
    riskLevel: 'High',
    specialty: 'Neurologist',
    symptoms: ['confusion', 'insomnia', 'fatigue', 'headache', 'dizziness']
  },
  {
    id: 'multiple_sclerosis',
    name: 'Multiple Sclerosis (MS)',
    description: 'A chronic demyelinating disease where the immune system attacks the protective myelin sheath covering nerves, disrupting brain-body communication.',
    precautions: ['Avoid hot environments (exacerbates symptoms)', 'Undergo regular physical therapy', 'Receive disease-modifying therapies', 'Balance activity with rest'],
    riskLevel: 'High',
    specialty: 'Neurologist',
    symptoms: ['numbness', 'fatigue', 'blurry_vision', 'dizziness', 'muscle_pain', 'joint_stiffness', 'difficulty_swallowing']
  },
  {
    id: 'stroke',
    name: 'Ischemic Stroke',
    description: 'A critical brain injury caused by sudden blockage of blood supply to part of the brain, leading to facial droop or numbness.',
    precautions: ['Seek immediate thrombolytic care (clot-buster)', 'Perform FAST checks (Face, Arm, Speech, Time)', 'Take blood thinners', 'Participate in physical rehabilitation'],
    riskLevel: 'High',
    specialty: 'Neurologist',
    symptoms: ['numbness', 'confusion', 'blurry_vision', 'headache', 'dizziness', 'difficulty_swallowing']
  },
  {
    id: 'bells_palsy',
    name: 'Bell\'s Palsy',
    description: 'A condition that causes temporary weakness or paralysis of the muscles in the face, typically on one side, due to facial nerve swelling.',
    precautions: ['Use lubricating eye drops', 'Tape eye closed at night (prevents dryness)', 'Initiate early corticosteroid therapy', 'Massage facial muscles'],
    riskLevel: 'Medium',
    specialty: 'Neurologist',
    symptoms: ['numbness', 'headache', 'difficulty_swallowing', 'dry_skin', 'dizziness']
  },
  {
    id: 'meningitis',
    name: 'Infectious Meningitis',
    description: 'A highly dangerous inflammation of the protective membranes (meninges) covering the brain and spinal cord, caused by viral/bacterial infections.',
    precautions: ['Seek immediate hospitalization', 'Administer antibiotics or antivirals', 'Receive meningococcal vaccine', 'Reduce brain swelling medications'],
    riskLevel: 'High',
    specialty: 'Neurologist',
    symptoms: ['fever', 'headache', 'neck_stiffness', 'sensitivity_light', 'nausea', 'vomiting', 'confusion']
  },
  {
    id: 'sciatica',
    name: 'Sciatica Nerve Pain',
    description: 'Pain radiating along the path of the sciatic nerve, which branches from your lower back through your hips and down each leg.',
    precautions: ['Avoid sitting for long durations', 'Perform gentle hamstring stretches', 'Apply hot/cold packs to back', 'Use firm mattress support'],
    riskLevel: 'Medium',
    specialty: 'Neurologist',
    symptoms: ['back_pain', 'numbness', 'muscle_pain', 'joint_stiffness', 'fatigue']
  },
  {
    id: 'neuropathy',
    name: 'Peripheral Neuropathy',
    description: 'Nerve damage that causes pain, burning numbness, or tingling sensations, most commonly in the hands and feet.',
    precautions: ['Inspect feet daily for silent cuts', 'Manage underlying cause (e.g. diabetes)', 'Avoid exposure to extreme cold', 'Take prescribed nerve pain pills'],
    riskLevel: 'Medium',
    specialty: 'Neurologist',
    symptoms: ['numbness', 'muscle_pain', 'dizziness', 'dry_skin', 'fatigue']
  },

  // === Gastroenterologist (12 Diseases) ===
  {
    id: 'gerd',
    name: 'GERD (Acid Reflux)',
    description: 'A chronic digestive disease where stomach acid backflows into the food pipe, irritating the mucosal lining.',
    precautions: ['Eat smaller portions', 'Do not lie down for 3 hours after eating', 'Elevate the head of bed during sleep', 'Avoid spicy, greasy, acidic foods'],
    riskLevel: 'Low',
    specialty: 'Gastroenterologist',
    symptoms: ['heartburn', 'nausea', 'difficulty_swallowing', 'stomach_pain', 'bloating']
  },
  {
    id: 'ibs',
    name: 'Irritable Bowel Syndrome (IBS)',
    description: 'A common gastrointestinal disorder affecting the large intestine, causing cramping, bloating, gas, and changes in bowel habits.',
    precautions: ['Follow a low-FODMAP diet', 'Increase soluble fiber slowly', 'Manage stress and anxiety', 'Drink warm herbal teas'],
    riskLevel: 'Low',
    specialty: 'Gastroenterologist',
    symptoms: ['stomach_pain', 'bloating', 'diarrhea', 'constipation', 'nausea', 'fatigue']
  },
  {
    id: 'celiac',
    name: 'Celiac Disease',
    description: 'An autoimmune reaction to eating gluten (protein found in wheat, barley, rye) that damages the lining of the small intestine.',
    precautions: ['Maintain strict gluten-free diet', 'Read food label lists carefully', 'Use separate kitchen cookware (prevent cross-contamination)', 'Monitor mineral/vitamin levels'],
    riskLevel: 'High',
    specialty: 'Gastroenterologist',
    symptoms: ['diarrhea', 'bloating', 'weight_loss', 'stomach_pain', 'fatigue', 'nausea', 'vomiting']
  },
  {
    id: 'crohns',
    name: 'Crohn\'s Disease',
    description: 'A chronic inflammatory bowel disease (IBD) that causes severe inflammation of your digestive tract lining.',
    precautions: ['Avoid high-fiber foods during flares', 'Limit dairy if lactose sensitive', 'Stay hydrated', 'Receive biologic or immunosuppressant therapies'],
    riskLevel: 'High',
    specialty: 'Gastroenterologist',
    symptoms: ['stomach_pain', 'diarrhea', 'weight_loss', 'fever', 'fatigue', 'nausea', 'loss_of_appetite']
  },
  {
    id: 'colitis',
    name: 'Ulcerative Colitis',
    description: 'An inflammatory bowel disease that causes long-lasting inflammation and ulcers in the innermost lining of your large intestine.',
    precautions: ['Limit dairy and greasy foods', 'Keep a detailed food journal', 'Do low-impact exercise', 'Maintain regular colonoscopy screening schedule'],
    riskLevel: 'High',
    specialty: 'Gastroenterologist',
    symptoms: ['diarrhea', 'stomach_pain', 'blood_in_urine', 'fever', 'fatigue', 'weight_loss', 'loss_of_appetite']
  },
  {
    id: 'peptic_ulcer',
    name: 'Peptic Ulcer Disease',
    description: 'Sores or ulcers that develop on the lining of the stomach, lower esophagus, or small intestine, causing burning stomach pain.',
    precautions: ['Avoid NSAIDs (aspirin/advil)', 'Take PPI medication (Omeprazole)', 'Limit caffeine and carbonated drinks', 'Quit smoking and alcohol'],
    riskLevel: 'Medium',
    specialty: 'Gastroenterologist',
    symptoms: ['stomach_pain', 'heartburn', 'nausea', 'vomiting', 'loss_of_appetite', 'bloating']
  },
  {
    id: 'gallstones',
    name: 'Gallstones (Cholelithiasis)',
    description: 'Hardened deposits of digestive fluid that can form in your gallbladder, causing severe abdominal pain after fatty meals.',
    precautions: ['Restrict fatty and deep-fried foods', 'Lose weight gradually (prevents stones)', 'Stay hydrated', 'Consult surgeon for gall bladder removal options'],
    riskLevel: 'High',
    specialty: 'Gastroenterologist',
    symptoms: ['stomach_pain', 'nausea', 'vomiting', 'fever', 'yellow_skin']
  },
  {
    id: 'pancreatitis',
    name: 'Acute Pancreatitis',
    description: 'Sudden inflammation of the pancreas, causing severe radiating back pain, vomiting, and clinical distress.',
    precautions: ['Fast completely during acute stage (bowel rest)', 'Stay hydrated with IV fluids', 'Avoid fatty meals completely', 'Quit alcohol and smoking'],
    riskLevel: 'High',
    specialty: 'Gastroenterologist',
    symptoms: ['stomach_pain', 'back_pain', 'nausea', 'vomiting', 'fever', 'palpitations', 'sweating']
  },
  {
    id: 'appendicitis',
    name: 'Acute Appendicitis',
    description: 'A painful medical emergency where the appendix becomes inflamed and filled with pus, requiring surgical removal.',
    precautions: ['Do not eat or drink (keep empty stomach)', 'Do not take laxatives or pain relievers before exam', 'Avoid applying heat pack', 'Seek immediate surgical emergency care'],
    riskLevel: 'High',
    specialty: 'Gastroenterologist',
    symptoms: ['stomach_pain', 'nausea', 'vomiting', 'fever', 'loss_of_appetite', 'constipation', 'diarrhea']
  },
  {
    id: 'hepatitis_a',
    name: 'Hepatitis A',
    description: 'A highly contagious liver infection caused by the Hepatitis A virus, contracted from contaminated food/water.',
    precautions: ['Get Hepatitis A vaccine', 'Wash hands after using restroom', 'Avoid raw shellfish', 'Avoid alcohol completely to protect liver'],
    riskLevel: 'Medium',
    specialty: 'Gastroenterologist',
    symptoms: ['yellow_skin', 'stomach_pain', 'nausea', 'vomiting', 'fatigue', 'fever', 'loss_of_appetite']
  },
  {
    id: 'hepatitis_b',
    name: 'Hepatitis B',
    description: 'A serious liver infection caused by the Hepatitis B virus, which can become chronic, leading to cirrhosis.',
    precautions: ['Receive Hepatitis B vaccine series', 'Do not share razors/needles', 'Receive antiviral therapy if chronic', 'Monitor liver enzymes regularly'],
    riskLevel: 'High',
    specialty: 'Gastroenterologist',
    symptoms: ['yellow_skin', 'fatigue', 'stomach_pain', 'nausea', 'vomiting', 'joint_pain', 'loss_of_appetite']
  },
  {
    id: 'diverticulitis',
    name: 'Diverticulitis',
    description: 'Inflammation or infection of small pouches (diverticula) that can form in the walls of the intestines.',
    precautions: ['Follow clear liquid diet during acute flares', 'Eat high-fiber foods when healed', 'Drink plenty of water', 'Take prescribed antibiotic therapy'],
    riskLevel: 'High',
    specialty: 'Gastroenterologist',
    symptoms: ['stomach_pain', 'fever', 'nausea', 'vomiting', 'constipation', 'diarrhea', 'bloating']
  },

  // === Dermatologist (10 Diseases) ===
  {
    id: 'fungal_infection',
    name: 'Fungal Skin Infection',
    description: 'A localized skin infection caused by dermatophytes, leading to circular rashes, severe itching, and peeling.',
    precautions: ['Keep the skin area clean and dry', 'Apply antifungal creams', 'Do not share clothing/towels', 'Wear loose breathable fabrics'],
    riskLevel: 'Low',
    specialty: 'Dermatologist',
    symptoms: ['skin_rash', 'itching', 'redness', 'dry_skin', 'blisters']
  },
  {
    id: 'shingles',
    name: 'Herpes Zoster (Shingles)',
    description: 'A painful blistering skin rash caused by reactivation of the varicella-zoster (chickenpox) virus in nerve paths.',
    precautions: ['Start antiviral pills within 72 hours', 'Keep rash clean and covered', 'Do not touch/scratch blisters', 'Avoid contact with pregnant women'],
    riskLevel: 'Medium',
    specialty: 'Dermatologist',
    symptoms: ['skin_rash', 'itching', 'blisters', 'redness', 'fever', 'numbness', 'headache']
  },
  {
    id: 'acne',
    name: 'Acne Vulgaris',
    description: 'A common skin condition that occurs when hair follicles become plugged with oil and dead skin cells.',
    precautions: ['Wash face gently twice daily', 'Use non-comedogenic cosmetics', 'Avoid popping pimples', 'Apply salicylic acid or retinoid creams'],
    riskLevel: 'Low',
    specialty: 'Dermatologist',
    symptoms: ['skin_rash', 'redness', 'blisters', 'itching']
  },
  {
    id: 'eczema',
    name: 'Atopic Dermatitis (Eczema)',
    description: 'A chronic inflammatory skin condition characterized by dry, red, extremely itchy patches of skin.',
    precautions: ['Moisturize skin within 3 mins of bathing', 'Avoid harsh soaps and perfumes', 'Use mild laundry detergents', 'Apply topical hydrocortisone during flares'],
    riskLevel: 'Low',
    specialty: 'Dermatologist',
    symptoms: ['skin_rash', 'itching', 'dry_skin', 'redness', 'blisters']
  },
  {
    id: 'psoriasis',
    name: 'Psoriasis',
    description: 'An autoimmune skin condition that speeds up the life cycle of skin cells, causing scale-like plaques.',
    precautions: ['Apply thick hydrating ointments', 'Expose skin to brief sunshine', 'Avoid skin injuries/scratches', 'Manage systemic stress triggers'],
    riskLevel: 'Medium',
    specialty: 'Dermatologist',
    symptoms: ['skin_rash', 'itching', 'dry_skin', 'redness', 'joint_pain']
  },
  {
    id: 'rosacea',
    name: 'Rosacea',
    description: 'A chronic inflammatory skin disease causing facial redness, swelling, and small pus-filled bumps on cheeks/nose.',
    precautions: ['Wear high SPF mineral sunscreens', 'Avoid spicy food and alcohol triggers', 'Use ultra-gentle cleansers', 'Avoid steam and hot baths'],
    riskLevel: 'Low',
    specialty: 'Dermatologist',
    symptoms: ['redness', 'skin_rash', 'itching', 'dry_skin']
  },
  {
    id: 'urticaria',
    name: 'Urticaria (Hives)',
    description: 'An outbreak of swollen, red bumps or plaques on the skin that appear suddenly as a result of an allergic reaction.',
    precautions: ['Take oral antihistamine medications', 'Apply cool wet compresses', 'Avoid tight clothing friction', 'Identify and eliminate allergen triggers'],
    riskLevel: 'Medium',
    specialty: 'Dermatologist',
    symptoms: ['skin_rash', 'itching', 'redness', 'sweating', 'fever']
  },
  {
    id: 'contact_dermatitis',
    name: 'Contact Dermatitis',
    description: 'A localized red, itchy rash caused by direct contact with a substance or allergen (like poison ivy or soap chemicals).',
    precautions: ['Wash contact area immediately with soap', 'Apply calamine lotion', 'Avoid contact with known chemical sensitizers', 'Use oatmeal baths'],
    riskLevel: 'Low',
    specialty: 'Dermatologist',
    symptoms: ['skin_rash', 'itching', 'redness', 'blisters', 'dry_skin']
  },
  {
    id: 'vitiligo',
    name: 'Vitiligo',
    description: 'A skin condition characterized by patches of the skin losing their pigment, becoming chalky white.',
    precautions: ['Apply high SPF sunscreen to white skin patches', 'Use cosmetic skin creams', 'Consider light therapy (phototherapy)', 'Avoid direct sunburns'],
    riskLevel: 'Low',
    specialty: 'Dermatologist',
    symptoms: ['skin_rash', 'itching']
  },
  {
    id: 'scabies',
    name: 'Scabies',
    description: 'A contagious skin infestation caused by tiny burrowing mites, causing intense itching, especially at night.',
    precautions: ['Apply Permethrin cream all over body neck-down', 'Wash all clothes/sheets in hot water', 'Treat all family members simultaneously', 'Trim fingernails short'],
    riskLevel: 'Medium',
    specialty: 'Dermatologist',
    symptoms: ['itching', 'skin_rash', 'blisters', 'redness']
  },

  // === Orthopedic (6 Diseases) ===
  {
    id: 'rheumatoid_arthritis',
    name: 'Rheumatoid Arthritis',
    description: 'A chronic systemic autoimmune disease causing painful swelling, stiffness, and eventual joint deformity.',
    precautions: ['Do low-impact stretching (swimming/walks)', 'Apply warm heat packs in mornings', 'Take DMARD medications', 'Rest during painful flares'],
    riskLevel: 'Medium',
    specialty: 'Orthopedic',
    symptoms: ['joint_pain', 'joint_stiffness', 'fatigue', 'fever', 'muscle_pain']
  },
  {
    id: 'osteoarthritis',
    name: 'Osteoarthritis',
    description: 'A degenerative joint disease where the protective cartilage cushioning the ends of bones wears down over time.',
    precautions: ['Maintain healthy body weight', 'Strengthen surrounding muscles', 'Take glucosamine supplements', 'Use cushioned insoles'],
    riskLevel: 'Medium',
    specialty: 'Orthopedic',
    symptoms: ['joint_pain', 'joint_stiffness', 'back_pain']
  },
  {
    id: 'osteoporosis',
    name: 'Osteoporosis',
    description: 'A medical condition in which the bones become brittle and fragile from loss of tissue, typically as a result of calcium deficiency.',
    precautions: ['Take Calcium + Vitamin D supplements', 'Engage in weight-bearing exercise', 'Take bone-retention medications', 'Remove home tripping hazards'],
    riskLevel: 'High',
    specialty: 'Orthopedic',
    symptoms: ['back_pain', 'fractures', 'loss_of_height', 'joint_stiffness']
  },
  {
    id: 'tendonitis',
    name: 'Tendonitis (Tendon Inflammation)',
    description: 'Inflammation or irritation of a tendon—the thick fibrous cords that attach muscle to bone, causing local tenderness.',
    precautions: ['Practice R.I.C.E. (Rest, Ice, Compression, Elevation)', 'Use supportive splints or sleeves', 'Do slow physiotherapy strengthening', 'Avoid repetitive strains'],
    riskLevel: 'Low',
    specialty: 'Orthopedic',
    symptoms: ['joint_pain', 'joint_stiffness', 'muscle_pain']
  },
  {
    id: 'carpal_tunnel',
    name: 'Carpal Tunnel Syndrome',
    description: 'A numbness and tingling in the hand and arm caused by a pinched median nerve in the wrist.',
    precautions: ['Wear wrist splints during sleep', 'Take regular keyboard breaks', 'Perform wrist extensions', 'Avoid awkward wrist bending'],
    riskLevel: 'Low',
    specialty: 'Orthopedic',
    symptoms: ['numbness', 'muscle_pain', 'joint_stiffness']
  },
  {
    id: 'scoliosis',
    name: 'Scoliosis (Spinal Curvature)',
    description: 'A sideways curvature of the spine that occurs most often during the growth spurt just before puberty.',
    precautions: ['Perform core strengthening exercise', 'Wear back brace if directed', 'Get periodic spinal X-rays', 'Maintain good sitting ergonomics'],
    riskLevel: 'Medium',
    specialty: 'Orthopedic',
    symptoms: ['back_pain', 'neck_stiffness', 'fatigue', 'joint_stiffness']
  },

  // === Urologist (6 Diseases) ===
  {
    id: 'uti',
    name: 'Urinary Tract Infection (UTI)',
    description: 'An infection in any part of the urinary system, usually the bladder, causing pain and high urgency.',
    precautions: ['Drink 2.5-3L water daily', 'Empty bladder completely and regularly', 'Complete full course of antibiotics', 'Practice proper hygiene'],
    riskLevel: 'Medium',
    specialty: 'Urologist',
    symptoms: ['frequent_urination', 'painful_urination', 'cloudy_urine', 'blood_in_urine', 'stomach_pain', 'fever']
  },
  {
    id: 'kidney_stones',
    name: 'Kidney Stones (Nephrolithiasis)',
    description: 'Hard deposits of minerals and acid salts that stick together in concentrated urine, causing excruciating flank pain.',
    precautions: ['Drink 3L+ fluids daily', 'Restrict oxalate-rich foods (spinach, chocolate)', 'Limit sodium and animal proteins', 'Take potassium citrate if directed'],
    riskLevel: 'High',
    specialty: 'Urologist',
    symptoms: ['painful_urination', 'blood_in_urine', 'stomach_pain', 'nausea', 'vomiting', 'fever']
  },
  {
    id: 'bph',
    name: 'Benign Prostatic Hyperplasia (BPH)',
    description: 'Age-associated prostate gland enlargement that can block the flow of urine out of the bladder in men.',
    precautions: ['Avoid fluids before bedtime', 'Limit caffeine and alcohol', 'Double-void (urinate again after a moment)', 'Discuss alpha-blocker therapy'],
    riskLevel: 'Medium',
    specialty: 'Urologist',
    symptoms: ['frequent_urination', 'painful_urination', 'cloudy_urine', 'stomach_pain', 'insomnia']
  },
  {
    id: 'overactive_bladder',
    name: 'Overactive Bladder (OAB)',
    description: 'A bladder control problem that causes a sudden, uncontrollable urge to urinate, sometimes with leakage.',
    precautions: ['Perform pelvic floor exercises (Kegels)', 'Adopt timed bladder training', 'Avoid bladder irritants (caffeine/spicy food)', 'Monitor fluid intake levels'],
    riskLevel: 'Low',
    specialty: 'Urologist',
    symptoms: ['frequent_urination', 'painful_urination', 'insomnia']
  },
  {
    id: 'cystitis',
    name: 'Interstitial Cystitis (Painful Bladder)',
    description: 'A chronic bladder condition causing painful pressure and bladder spasms in the pelvic area.',
    precautions: ['Limit acidic foods and artificial sweeteners', 'Wear loose fitting undergarments', 'Maintain bladder dilation therapies', 'Do gentle stretches'],
    riskLevel: 'Medium',
    specialty: 'Urologist',
    symptoms: ['painful_urination', 'frequent_urination', 'stomach_pain', 'cloudy_urine']
  },
  {
    id: 'epididymitis',
    name: 'Epididymitis',
    description: 'Inflammation of the coiled tube (epididymis) at the back of the testicle, often caused by bacterial infection.',
    precautions: ['Apply ice packs to scrotum', 'Wear athletic scrotal support', 'Take prescribed antibiotic course', 'Rest in bed completely'],
    riskLevel: 'High',
    specialty: 'Urologist',
    symptoms: ['painful_urination', 'frequent_urination', 'fever', 'stomach_pain', 'cloudy_urine', 'nausea']
  }
];

// Generates 600 simulated patient records (6 cases per disease) for Naive Bayes training.
// This matches symptoms probabilistically to diseases based on their true profiles.
export const generateTrainingData = (): { diseaseId: string; symptoms: string[] }[] => {
  const data: { diseaseId: string; symptoms: string[] }[] = [];
  
  diseasesList.forEach(disease => {
    // Generate 6 patient cases for each of the 106 diseases (total 636 cases)
    for (let i = 0; i < 6; i++) {
      const caseSymptoms: string[] = [];
      
      // Each disease symptom has an 82% chance of appearing in the simulated patient
      disease.symptoms.forEach(symptomId => {
        if (Math.random() < 0.82) {
          caseSymptoms.push(symptomId);
        }
      });
      
      // Add a 10% chance of a random unrelated symptom
      if (Math.random() < 0.25) {
        const randomSymptom = symptomsList[Math.floor(Math.random() * symptomsList.length)];
        if (!caseSymptoms.includes(randomSymptom.id)) {
          caseSymptoms.push(randomSymptom.id);
        }
      }
      
      // Ensure the patient has at least one symptom
      if (caseSymptoms.length === 0) {
        caseSymptoms.push(disease.symptoms[0]);
      }
      
      data.push({
        diseaseId: disease.id,
        symptoms: caseSymptoms
      });
    }
  });
  
  return data;
};

export const trainingData = generateTrainingData();

const indianFirstNames = [
  "Rajesh", "Amit", "Sanjay", "Anil", "Sandeep", "Vikram", "Sunita", "Priya", "Deepika", "Meenakshi", 
  "Rohan", "Arjun", "Karan", "Sneha", "Kiran", "Aditya", "Neha", "Rahul", "Pooja", "Vijay", 
  "Divya", "Harish", "Asha", "Manish", "Gaurav", "Swati", "Vivek", "Kriti", "Shweta", "Ravi",
  "Dev", "Ishaan", "Kabir", "Meera", "Ananya", "Riya", "Kavita", "Suresh", "Ramesh", "Preeti"
];

const indianLastNames = [
  "Kumar", "Patel", "Sharma", "Nair", "Rao", "Mehta", "Iyer", "Gupta", "Joshi", "Verma", 
  "Singh", "Reddy", "Choudhury", "Bose", "Pillai", "Deshmukh", "Pandey", "Mishra", "Gill", "Sen", 
  "Menon", "Acharya", "Prasad", "Naidu", "Subramanian", "Roy", "Banerjee", "Kapoor", "Chatterjee", "Saxena",
  "Malhotra", "Joshi", "Dubey", "Johar", "Bhat", "Dhar", "Pathak", "Sinha", "Varma", "Gokhale"
];

const clinicPrefixes = [
  "Apollo Specialty Clinic", "Fortis Health Centre", "Max Care Hospital", "Manipal Medical Plaza", 
  "Narayana Health Point", "Care Family Clinic", "Prime Diagnostics", "Metro Wellness Centre", 
  "Aegis Healthcare", "Medica Clinic", "Hiranandani Hospital", "Lilavati Health Pavilion", 
  "KIMS Wellness Hub", "Amrita Medical Center", "Cloudnine Specialty Clinic"
];

const locations = [
  "Indiranagar, Bengaluru", "Jayanagar, Bengaluru", "Koramangala, Bengaluru", "Whitefield, Bengaluru",
  "Andheri West, Mumbai", "Bandra West, Mumbai", "Powai, Mumbai",
  "Saket, New Delhi", "Vasant Kunj, New Delhi", "Dwarka, New Delhi",
  "Salt Lake, Kolkata", "Gariahat, Kolkata",
  "Adyar, Chennai", "Velachery, Chennai",
  "Hitech City, Hyderabad", "Gachibowli, Hyderabad", "Banjara Hills, Hyderabad",
  "Aundh, Pune", "Koregaon Park, Pune", "Sector 62, Noida", "DLF Phase 3, Gurugram"
];

const generateDoctorsList = (): Doctor[] => {
  const list: Doctor[] = [];
  const specialties = [
    'General Physician',
    'Pulmonologist',
    'Endocrinologist',
    'Cardiologist',
    'Neurologist',
    'Gastroenterologist',
    'Dermatologist',
    'Orthopedic',
    'Urologist'
  ];
  
  for (let i = 1; i <= 100; i++) {
    // Deterministic selection based on index i
    const firstName = indianFirstNames[i % indianFirstNames.length];
    const lastName = indianLastNames[(i * 3) % indianLastNames.length];
    
    // Distribute male/female titles
    const prefix = i % 3 === 0 ? "Dr. (Mrs.)" : "Dr.";
    const name = `${prefix} ${firstName} ${lastName}`;
    
    const specialty = specialties[(i * 7) % specialties.length];
    
    // Rating between 4.2 and 5.0
    const rating = parseFloat((4.2 + (i % 9) * 0.1).toFixed(1));
    
    // Experience between 5 and 27 years
    const experience = 5 + (i % 23);
    
    const clinic = clinicPrefixes[i % clinicPrefixes.length];
    const location = locations[(i * 13) % locations.length];
    
    // Different time slots based on index
    const timeSlotsSet = [
      ['09:00 AM', '10:30 AM', '02:00 PM', '04:15 PM'],
      ['11:00 AM', '01:30 PM', '03:00 PM', '05:30 PM'],
      ['10:00 AM', '11:30 AM', '03:15 PM', '04:45 PM'],
      ['09:30 AM', '12:00 PM', '02:30 PM', '04:00 PM'],
      ['08:30 AM', '10:00 AM', '11:30 AM', '02:00 PM'],
      ['01:30 PM', '03:00 PM', '04:30 PM', '05:45 PM']
    ];
    const availableSlots = timeSlotsSet[i % timeSlotsSet.length];
    
    list.push({
      id: `doc_${i}`,
      name,
      specialty,
      rating: rating > 5.0 ? 5.0 : rating,
      experience,
      clinic,
      location,
      availableSlots
    });
  }
  
  return list;
};

export const doctorsList = generateDoctorsList();

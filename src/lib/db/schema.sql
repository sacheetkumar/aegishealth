-- Schema definition for Aegis Health database

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(50) PRIMARY KEY,
  doc_name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  clinic VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(50) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  condition VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  medications JSONB NOT NULL,
  warnings TEXT,
  precautions TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

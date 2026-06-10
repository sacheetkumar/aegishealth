import { Pool } from 'pg';

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  // In development, use a global variable to preserve the Pool
  // across module reloads caused by Next.js Hot Module Replacement (HMR).
  if (!(global as any).pgPool) {
    (global as any).pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  pool = (global as any).pgPool;
}

// Global mock memory DB for fallback when PostgreSQL is stopped or unconfigured
if (!(global as any).mockDb) {
  (global as any).mockDb = {
    users: [
      { name: 'Sacheet Kumar', email: 'sacheetkumar001@gmail.com', password_hash: '$2a$10$T1K72Lp0z7oZqZ9dK0/MDeXnS/3.Y7t4UoqM6x1Xh9hGfN3i56jP.' }
    ],
    appointments: [],
    prescriptions: []
  };
}

export async function query(text: string, params: any[] = []): Promise<any> {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (dbErr: any) {
    const isConnectionError = 
      dbErr.code === 'ECONNREFUSED' || 
      dbErr.message.includes('connect ECONNREFUSED') || 
      dbErr.message.includes('connection') ||
      dbErr.message.includes('does not exist');

    if (!isConnectionError) {
      throw dbErr;
    }

    console.warn('[DB Fallback] PostgreSQL connection failed. Degrading to in-memory mock database:', dbErr.message);
    return runMockQuery(text, params);
  }
}

function runMockQuery(text: string, params: any[]) {
  const normalized = text.toLowerCase().replace(/\s+/g, ' ');
  const mockDb = (global as any).mockDb;

  // 1. SELECT users query
  if (normalized.includes('select') && normalized.includes('from users')) {
    const email = params[0]?.toLowerCase();
    const rows = mockDb.users.filter((u: any) => u.email.toLowerCase() === email);
    return { rows };
  }

  // 2. INSERT user query
  if (normalized.includes('insert into users')) {
    const [name, email, passwordHash] = params;
    const newUser = { name, email, password_hash: passwordHash, created_at: new Date() };
    mockDb.users.push(newUser);
    return { rows: [newUser] };
  }

  // 3. SELECT appointments query
  if (normalized.includes('select') && normalized.includes('from appointments')) {
    const email = params[0]?.toLowerCase();
    const rows = mockDb.appointments
      .filter((a: any) => a.userEmail.toLowerCase() === email)
      .map((a: any) => ({
        id: a.id,
        docName: a.docName,
        specialty: a.specialty,
        clinic: a.clinic,
        location: a.location,
        patientName: a.patientName,
        patientPhone: a.patientPhone,
        date: a.date,
        time: a.time,
        userEmail: a.userEmail
      }));
    return { rows };
  }

  // 4. INSERT appointment query
  if (normalized.includes('insert into appointments')) {
    const [id, docName, specialty, clinic, location, patientName, patientPhone, date, time, userEmail] = params;
    const newAppointment = { id, docName, specialty, clinic, location, patientName, patientPhone, date, time, userEmail, created_at: new Date() };
    mockDb.appointments.push(newAppointment);
    return { rows: [{ id, docName, date, time }] };
  }

  // 5. DELETE appointment query
  if (normalized.includes('delete from appointments')) {
    const id = params[0];
    const initialLen = mockDb.appointments.length;
    mockDb.appointments = mockDb.appointments.filter((a: any) => a.id !== id);
    return { rowCount: initialLen - mockDb.appointments.length };
  }

  // 6. INSERT prescription query
  if (normalized.includes('insert into prescriptions')) {
    const [userEmail, fileName, condition, specialty, medications, warnings, precautions] = params;
    const newPrescription = {
      id: Math.floor(Math.random() * 100000),
      user_email: userEmail,
      file_name: fileName,
      condition,
      specialty,
      medications: JSON.parse(medications),
      warnings,
      precautions,
      created_at: new Date().toISOString()
    };
    mockDb.prescriptions.push(newPrescription);
    return { rows: [newPrescription] };
  }

  // 7. SELECT prescriptions query
  if (normalized.includes('select') && normalized.includes('from prescriptions')) {
    const email = params[0]?.toLowerCase();
    const rows = mockDb.prescriptions
      .filter((p: any) => p.user_email.toLowerCase() === email)
      .map((p: any) => ({
        id: p.id,
        fileName: p.file_name,
        condition: p.condition,
        specialty: p.specialty,
        medications: p.medications,
        warnings: p.warnings,
        precautions: p.precautions,
        createdAt: p.created_at
      }));
    return { rows };
  }

  // 8. DELETE prescription query
  if (normalized.includes('delete from prescriptions')) {
    const id = parseInt(params[0], 10);
    const initialLen = mockDb.prescriptions.length;
    mockDb.prescriptions = mockDb.prescriptions.filter((p: any) => p.id !== id);
    return { rowCount: initialLen - mockDb.prescriptions.length };
  }

  return { rows: [] };
}

export default pool;

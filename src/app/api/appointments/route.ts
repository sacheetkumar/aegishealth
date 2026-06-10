import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Missing email parameter' },
        { status: 400 }
      );
    }

    const result = await query(
      'SELECT id, doc_name AS "docName", specialty, clinic, location, patient_name AS "patientName", patient_phone AS "patientPhone", date::text, time, user_email AS "userEmail" FROM appointments WHERE LOWER(user_email) = LOWER($1) ORDER BY date DESC, time DESC',
      [email]
    );

    return NextResponse.json({
      success: true,
      appointments: result.rows
    });

  } catch (error: any) {
    console.error('Fetch Appointments API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      id,
      docName,
      specialty,
      clinic,
      location,
      patientName,
      patientPhone,
      date,
      time,
      userEmail
    } = await req.json();

    if (!docName || !specialty || !clinic || !location || !patientName || !patientPhone || !date || !time || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required appointment booking details' },
        { status: 400 }
      );
    }

    const appId = id || Date.now().toString();

    const result = await query(
      `INSERT INTO appointments 
       (id, doc_name, specialty, clinic, location, patient_name, patient_phone, date, time, user_email) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING id, doc_name AS "docName", date::text, time`,
      [appId, docName, specialty, clinic, location, patientName, patientPhone, date, time, userEmail]
    );

    return NextResponse.json({
      success: true,
      appointment: result.rows[0]
    });

  } catch (error: any) {
    console.error('Book Appointment API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

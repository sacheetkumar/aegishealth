import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userEmail = formData.get('email') as string || 'guest';

    if (!file) {
      return NextResponse.json(
        { error: 'No prescription file uploaded' },
        { status: 400 }
      );
    }

    const filename = file.name.toLowerCase();

    // Perform clinical simulated OCR analysis on the backend
    let analysis;
    if (filename.includes('heart') || filename.includes('bp') || filename.includes('cardio') || filename.includes('hyper')) {
      analysis = {
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
    } else if (filename.includes('sugar') || filename.includes('diab') || filename.includes('insulin') || filename.includes('gluc')) {
      analysis = {
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
    } else if (filename.includes('skin') || filename.includes('rash') || filename.includes('dermat') || filename.includes('itch')) {
      analysis = {
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
    } else {
      analysis = {
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
    }

    // Save scan output to PostgreSQL database (if email is not guest)
    let dbId = null;
    let createdAt = new Date().toISOString();

    if (userEmail && userEmail !== 'guest') {
      try {
        const dbResult = await query(
          `INSERT INTO prescriptions 
           (user_email, file_name, condition, specialty, medications, warnings, precautions) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) 
           RETURNING id, created_at`,
          [
            userEmail,
            file.name,
            analysis.condition,
            analysis.specialty,
            JSON.stringify(analysis.medications),
            analysis.warnings,
            analysis.precautions
          ]
        );
        if (dbResult.rows.length > 0) {
          dbId = dbResult.rows[0].id;
          createdAt = dbResult.rows[0].created_at;
        }
      } catch (dbErr) {
        console.error('Database write error, continuing with fallback:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      prescription: {
        id: dbId,
        fileName: file.name,
        condition: analysis.condition,
        specialty: analysis.specialty,
        medications: analysis.medications,
        warnings: analysis.warnings,
        precautions: analysis.precautions,
        createdAt
      }
    });

  } catch (error: any) {
    console.error('Prescription scanning API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

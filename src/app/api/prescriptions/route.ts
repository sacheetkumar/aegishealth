import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/prescriptions?email=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const result = await query(
      'SELECT id, file_name as "fileName", condition, specialty, medications, warnings, precautions, created_at as "createdAt" FROM prescriptions WHERE LOWER(user_email) = LOWER($1) ORDER BY created_at DESC',
      [email]
    );

    return NextResponse.json({
      success: true,
      prescriptions: result.rows
    });

  } catch (error: any) {
    console.error('Fetch Prescriptions API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/prescriptions?id=...
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Prescription ID is required' },
        { status: 400 }
      );
    }

    await query('DELETE FROM prescriptions WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Prescription deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete Prescription API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

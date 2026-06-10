import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Missing name or email' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT name, email FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (existingUser.rows.length > 0) {
      // User exists, log them in!
      return NextResponse.json({
        success: true,
        user: {
          name: existingUser.rows[0].name,
          email: existingUser.rows[0].email
        }
      });
    }

    // User does not exist, sign them up!
    // Generate a secure random password hash for OAuth users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(Math.random().toString(36), salt);

    const newUser = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING name, email',
      [name, email, passwordHash]
    );

    return NextResponse.json({
      success: true,
      user: {
        name: newUser.rows[0].name,
        email: newUser.rows[0].email
      }
    });

  } catch (error: any) {
    console.error('Google Auth API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

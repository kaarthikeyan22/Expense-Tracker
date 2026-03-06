import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

async function getUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (sessionCookie?.value) {
      return JSON.parse(sessionCookie.value);
    }
    return null;
  } catch {
    return null;
  }
}

// GET all savings
export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const savings = await db.saving.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(savings);
  } catch (error) {
    console.error('Error fetching savings:', error);
    return NextResponse.json({ error: 'Failed to fetch savings' }, { status: 500 });
  }
}

// POST new saving
export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, targetAmount, currentAmount, targetDate } = body;

    if (!title || !targetAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const saving = await db.saving.create({
      data: {
        title,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        targetDate: targetDate ? new Date(targetDate) : null,
        userId: user.id,
      },
    });

    return NextResponse.json(saving);
  } catch (error) {
    console.error('Error creating saving:', error);
    return NextResponse.json({ error: 'Failed to create saving' }, { status: 500 });
  }
}
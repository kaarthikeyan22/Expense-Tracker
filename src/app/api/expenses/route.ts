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

// GET all expenses with category data
export async function GET() {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const expenses = await db.expense.findMany({
      where: { userId: user.id },
      include: { category: true },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

// POST new expense
export async function POST(request: Request) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, description, date, categoryId } = body;

    if (!amount || !description || !date || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const expense = await db.expense.create({
      data: {
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        categoryId,
        userId: user.id,
      },
      include: { category: true },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}
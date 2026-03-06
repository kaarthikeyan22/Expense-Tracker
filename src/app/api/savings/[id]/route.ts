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

// GET single saving
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const saving = await db.saving.findFirst({
      where: { id, userId: user.id },
    });

    if (!saving) {
      return NextResponse.json(
        { error: 'Saving not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(saving);
  } catch (error) {
    console.error('Error fetching saving:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saving' },
      { status: 500 }
    );
  }
}

// PUT update saving
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, targetAmount, currentAmount, targetDate } = body;

    // Verify ownership
    const existingSaving = await db.saving.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingSaving) {
      return NextResponse.json(
        { error: 'Saving not found' },
        { status: 404 }
      );
    }

    const saving = await db.saving.update({
      where: { id },
      data: {
        title,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        targetDate: targetDate ? new Date(targetDate) : null,
      },
    });

    return NextResponse.json(saving);
  } catch (error) {
    console.error('Error updating saving:', error);
    return NextResponse.json(
      { error: 'Failed to update saving' },
      { status: 500 }
    );
  }
}

// PATCH - Add money to saving
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingSaving = await db.saving.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingSaving) {
      return NextResponse.json(
        { error: 'Saving not found' },
        { status: 404 }
      );
    }

    const saving = await db.saving.update({
      where: { id },
      data: {
        currentAmount: existingSaving.currentAmount + parseFloat(amount),
      },
    });

    return NextResponse.json(saving);
  } catch (error) {
    console.error('Error adding money to saving:', error);
    return NextResponse.json(
      { error: 'Failed to add money' },
      { status: 500 }
    );
  }
}

// DELETE saving
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existingSaving = await db.saving.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingSaving) {
      return NextResponse.json(
        { error: 'Saving not found' },
        { status: 404 }
      );
    }

    await db.saving.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saving:', error);
    return NextResponse.json(
      { error: 'Failed to delete saving' },
      { status: 500 }
    );
  }
}

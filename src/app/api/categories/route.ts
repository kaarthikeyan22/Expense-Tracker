import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const defaultCategories = [
  { name: 'Food & Dining', icon: '🍽️', color: '#ef4444' },
  { name: 'Transportation', icon: '🚗', color: '#f97316' },
  { name: 'Shopping', icon: '🛍️', color: '#eab308' },
  { name: 'Entertainment', icon: '🎬', color: '#22c55e' },
  { name: 'Bills & Utilities', icon: '💡', color: '#3b82f6' },
  { name: 'Healthcare', icon: '🏥', color: '#8b5cf6' },
  { name: 'Education', icon: '📚', color: '#ec4899' },
  { name: 'Other', icon: '📦', color: '#6b7280' },
];

export async function GET() {
  try {
    let categories = await db.category.findMany({
      orderBy: { name: 'asc' },
    });

    if (categories.length === 0) {
      await db.category.createMany({ data: defaultCategories });
      categories = await db.category.findMany({
        orderBy: { name: 'asc' },
      });
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon, color } = body;

    if (!name || !icon || !color) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const category = await db.category.create({
      data: { name, icon, color },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
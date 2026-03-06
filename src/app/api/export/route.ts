import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import * as XLSX from 'xlsx';

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

    const savings = await db.saving.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalSavings = savings.reduce((sum, s) => sum + s.currentAmount, 0);
    const totalSavingsTarget = savings.reduce((sum, s) => sum + s.targetAmount, 0);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Summary (NEW - This shows Total Expenses & Total Savings)
    const summaryData = [
      ['EXPENSE TRACKER SUMMARY'],
      [''],
      ['Category', 'Amount'],
      ['Total Expenses', totalExpenses],
      ['Total Savings (Current)', totalSavings],
      ['Total Savings (Target)', totalSavingsTarget],
      [''],
      ['Net Balance (Savings - Expenses)', totalSavings - totalExpenses],
      [''],
      ['Generated on', new Date().toLocaleDateString()],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Sheet 2: Expenses
    const expensesData = expenses.map((expense) => ({
      Date: new Date(expense.date).toLocaleDateString(),
      Description: expense.description,
      Category: expense.category.name,
      Amount: expense.amount,
    }));
    const expensesSheet = XLSX.utils.json_to_sheet(expensesData);
    XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Expenses');

    // Sheet 3: Savings
    const savingsData = savings.map((saving) => ({
      Title: saving.title,
      'Target Amount': saving.targetAmount,
      'Current Amount': saving.currentAmount,
      Progress: `${Math.round((saving.currentAmount / saving.targetAmount) * 100)}%`,
      'Target Date': saving.targetDate ? new Date(saving.targetDate).toLocaleDateString() : 'Not set',
    }));
    const savingsSheet = XLSX.utils.json_to_sheet(savingsData);
    XLSX.utils.book_append_sheet(workbook, savingsSheet, 'Savings');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Return as download
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="expense-tracker.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
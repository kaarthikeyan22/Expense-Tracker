import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (sessionCookie?.value) {
      const user = JSON.parse(sessionCookie.value);
      return NextResponse.json({ user });
    }
    
    return NextResponse.json({ user: null });
  } catch {
    return NextResponse.json({ user: null });
  }
}
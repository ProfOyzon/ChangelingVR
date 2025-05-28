import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Welcome to Changeling VR API' }, { status: 200 });
}

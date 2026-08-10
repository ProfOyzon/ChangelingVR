import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      message: 'Welcome to ChangelingVR API',
      endpoints: [
        { method: 'GET', path: '/characters' },
        { method: 'GET', path: '/devs' },
      ],
    },
    { status: 200 },
  );
}

import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export function operationalError(error: unknown, fallback: string) {
  if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON request.' }, { status: 400 });
  if (error instanceof Error && error.message === 'Authentication required') {
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  }
  const code = error instanceof Prisma.PrismaClientKnownRequestError ? error.code : undefined;
  if (error instanceof Prisma.PrismaClientInitializationError || ['P1001', 'P1002', 'P1008', 'P1017', 'P2024', 'P2028'].includes(code || '')) {
    return NextResponse.json({ error: 'The service is temporarily unavailable. Please try again shortly.' }, { status: 503 });
  }
  if (code === 'P2002') return NextResponse.json({ error: 'A record with these details already exists.' }, { status: 409 });
  console.error(fallback, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

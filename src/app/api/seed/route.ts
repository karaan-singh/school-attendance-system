import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { seedMasterConsentStudents } from '@/lib/seedMasterConsent';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow sufficient time for bulk seeding

export async function GET() {
  try {
    const stats = await seedMasterConsentStudents(prisma);
    return NextResponse.json({
      success: true,
      message: `Successfully seeded master consent AI-enrolled students!`,
      data: stats,
    });
  } catch (error: any) {
    console.error('Master Consent Seed API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed master consent students' },
      { status: 500 }
    );
  }
}

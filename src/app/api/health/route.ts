import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const classCount = await prisma.schoolClass.count();
    const studentCount = await prisma.student.count();

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      engine: 'MySQL (XAMPP)',
      stats: {
        classes: classCount,
        students: studentCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'degraded',
        database: 'disconnected',
        error: error.message,
        hint: 'Please ensure XAMPP MySQL is running on localhost:3306 and database forest_attendance exists.',
      },
      { status: 503 }
    );
  }
}

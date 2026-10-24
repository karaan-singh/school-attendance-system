import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const classes = await prisma.schoolClass.findMany({
      include: {
        students: {
          where: { status: 'ACTIVE' },
        },
        progress: true,
        sessions: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
      orderBy: { code: 'asc' },
    });

    const formatted = classes.map((c) => {
      const todaySession = c.sessions[0];
      return {
        id: c.id,
        name: c.name,
        code: c.code,
        grade: c.grade,
        section: c.section,
        room: c.room,
        hutStyle: c.hutStyle,
        hutColor: c.hutColor,
        studentCount: c.students.length,
        todaySessionStatus: todaySession ? todaySession.status : 'NOT_STARTED',
        todaySessionId: todaySession ? todaySession.id : null,
        progress: c.progress
          ? {
              level: c.progress.level,
              currentXp: c.progress.currentXp,
              nextLevelXp: c.progress.nextLevelXp,
              bloomRank: c.progress.bloomRank,
              fireflies: c.progress.fireflies,
            }
          : null,
      };
    });

    return NextResponse.json({ classes: formatted });
  } catch (error: any) {
    console.warn('Database offline or unreachable, using fallback demo classes:', error.message);
    const fallbackClasses = [
      {
        id: 'class-g1-a',
        name: 'Maple Whispers',
        code: 'G1-A',
        grade: 1,
        section: 'A',
        room: 'Room 101',
        hutStyle: 'WOOD_CABIN',
        hutColor: '#b45309',
        studentCount: 12,
        todaySessionStatus: 'DRAFT',
        todaySessionId: 'session-g1-a',
        progress: {
          level: 3,
          currentXp: 450,
          nextLevelXp: 600,
          bloomRank: 'SILVER',
          fireflies: 18,
        },
      },
      {
        id: 'class-g1-b',
        name: 'Cedar Hollow',
        code: 'G1-B',
        grade: 1,
        section: 'B',
        room: 'Room 102',
        hutStyle: 'STONE_COTTAGE',
        hutColor: '#047857',
        studentCount: 10,
        todaySessionStatus: 'NOT_STARTED',
        todaySessionId: 'session-g1-b',
        progress: {
          level: 2,
          currentXp: 280,
          nextLevelXp: 400,
          bloomRank: 'BRONZE',
          fireflies: 12,
        },
      },
    ];
    return NextResponse.json({ classes: fallbackClasses });
  }
}

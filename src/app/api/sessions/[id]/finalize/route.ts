import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    const session = await prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: {
        class: {
          include: {
            progress: true,
            students: { where: { status: 'ACTIVE' } },
          },
        },
        records: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.status === 'FINALIZED') {
      return NextResponse.json({ message: 'Session is already finalized', progress: session.class.progress });
    }

    // Check if any student hasn't been marked yet
    const markedIds = new Set(session.records.map((r) => r.studentId));
    const totalEnrolled = session.class.students.length;
    const unmarked = session.class.students.filter((e) => !markedIds.has(e.studentId));

    if (unmarked.length > 0) {
      return NextResponse.json(
        {
          error: `There are ${unmarked.length} unmarked students. Please mark all students before finalization.`,
          unmarkedCount: unmarked.length,
        },
        { status: 400 }
      );
    }

    // Mark finalized
    await prisma.attendanceSession.update({
      where: { id: sessionId },
      data: { status: 'FINALIZED' },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        sessionId,
        actor: 'Teacher',
        action: 'SESSION_FINALIZED',
        oldValue: 'DRAFT',
        newValue: 'FINALIZED',
      },
    });

    // Calculate XP and Forest Growth
    const presentCount = session.records.filter((r) => r.status === 'PRESENT').length;
    const rate = totalEnrolled > 0 ? (presentCount / totalEnrolled) * 100 : 0;
    const baseGainedXp = 50;
    const bonusXp = Math.round(rate * 0.5); // Up to 50 bonus XP for 100% attendance
    const totalXpGained = baseGainedXp + bonusXp;

    let progress = session.class.progress;
    if (!progress) {
      progress = await prisma.forestProgress.create({
        data: {
          classId: session.classId,
          level: 1,
          currentXp: 0,
          nextLevelXp: 100,
          bloomRank: 'Emerald Seedling',
          fireflies: 10,
        },
      });
    }

    let newXp = progress.currentXp + totalXpGained;
    let newLevel = progress.level;
    let nextXp = progress.nextLevelXp;
    let didLevelUp = false;

    while (newXp >= nextXp) {
      newXp -= nextXp;
      newLevel += 1;
      nextXp = Math.round(nextXp * 1.25);
      didLevelUp = true;
    }

    // Determine bloom rank based on level
    let rank = 'Emerald Seedling';
    if (newLevel >= 8) rank = 'Golden Sanctuary';
    else if (newLevel >= 5) rank = 'Ancient Oak';
    else if (newLevel >= 3) rank = 'Whispering Sapling';

    const newFireflies = progress.fireflies + (rate >= 90 ? 5 : 2);

    const updatedProgress = await prisma.forestProgress.update({
      where: { classId: session.classId },
      data: {
        level: newLevel,
        currentXp: newXp,
        nextLevelXp: nextXp,
        bloomRank: rank,
        fireflies: newFireflies,
        totalSessions: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Forest Quest Attendance Finalized!',
      stats: {
        totalStudents: totalEnrolled,
        presentCount,
        absentCount: session.records.filter((r) => r.status === 'ABSENT').length,
        lateCount: session.records.filter((r) => r.status === 'LATE').length,
        excusedCount: session.records.filter((r) => r.status === 'EXCUSED').length,
        attendanceRate: rate,
      },
      rewards: {
        xpGained: totalXpGained,
        didLevelUp,
        newLevel,
        bloomRank: rank,
        firefliesEarned: rate >= 90 ? 5 : 2,
      },
      progress: updatedProgress,
    });
  } catch (error: any) {
    console.error('Finalize session error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

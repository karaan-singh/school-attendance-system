import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AttendanceStatus } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await request.json();
    const { studentId, status, note } = body;

    if (!studentId || !status) {
      return NextResponse.json({ error: 'studentId and status are required' }, { status: 400 });
    }

    // Verify session
    const session = await prisma.attendanceSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.status === 'FINALIZED') {
      return NextResponse.json(
        { error: 'Cannot modify a finalized attendance session' },
        { status: 403 }
      );
    }

    // Check existing record for audit trail
    const existing = await prisma.attendanceRecord.findUnique({
      where: {
        sessionId_studentId: {
          sessionId,
          studentId,
        },
      },
    });

    const isPresent = status === 'PRESENT';
    const checkInTime = isPresent ? new Date() : existing?.checkInTime || null;

    // Upsert record
    const record = await prisma.attendanceRecord.upsert({
      where: {
        sessionId_studentId: {
          sessionId,
          studentId,
        },
      },
      update: {
        status: status as AttendanceStatus,
        note: note !== undefined ? note : existing?.note,
        checkInTime,
      },
      create: {
        sessionId,
        studentId,
        status: status as AttendanceStatus,
        note,
        checkInTime,
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        sessionId,
        recordId: record.id,
        actor: 'Teacher',
        action: 'STATUS_UPDATE',
        oldValue: existing ? existing.status : 'UNMARKED',
        newValue: status,
      },
    });

    // Recalculate session counters
    const allRecords = await prisma.attendanceRecord.findMany({
      where: { sessionId },
    });

    const presentCount = allRecords.filter((r) => r.status === 'PRESENT').length;
    const absentCount = allRecords.filter((r) => r.status === 'ABSENT').length;
    const lateCount = allRecords.filter((r) => r.status === 'LATE').length;
    const excusedCount = allRecords.filter((r) => r.status === 'EXCUSED').length;

    await prisma.attendanceSession.update({
      where: { id: sessionId },
      data: {
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
      },
    });

    return NextResponse.json({
      success: true,
      record: {
        id: record.id,
        studentId: record.studentId,
        status: record.status,
        note: record.note,
        checkInTime: record.checkInTime ? record.checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
      },
      counters: { presentCount, absentCount, lateCount, excusedCount },
    });
  } catch (error: any) {
    console.error('Error updating record:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await request.json();
    const { action } = body;

    const session = await prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: {
        class: {
          include: {
            students: {
              where: { status: 'ACTIVE' },
            },
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.status === 'FINALIZED') {
      return NextResponse.json({ error: 'Cannot modify finalized session' }, { status: 403 });
    }

    if (action === 'MARK_ALL_PRESENT') {
      const now = new Date();
      for (const enrollment of session.class.students) {
        await prisma.attendanceRecord.upsert({
          where: {
            sessionId_studentId: {
              sessionId,
              studentId: enrollment.studentId,
            },
          },
          update: {
            status: AttendanceStatus.PRESENT,
            checkInTime: now,
          },
          create: {
            sessionId,
            studentId: enrollment.studentId,
            status: AttendanceStatus.PRESENT,
            checkInTime: now,
          },
        });
      }

      await prisma.auditLog.create({
        data: {
          sessionId,
          actor: 'Teacher',
          action: 'BULK_MARK_ALL_PRESENT',
          oldValue: 'MIXED',
          newValue: 'ALL_PRESENT',
        },
      });

      const total = session.class.students.length;
      await prisma.attendanceSession.update({
        where: { id: sessionId },
        data: {
          presentCount: total,
          absentCount: 0,
          lateCount: 0,
          excusedCount: 0,
        },
      });

      return NextResponse.json({ success: true, count: total });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Bulk update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

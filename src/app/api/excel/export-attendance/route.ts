import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAttendanceExcel } from '@/lib/excel';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const sessionId = searchParams.get('sessionId');

    let session: any = null;

    if (sessionId) {
      session = await prisma.attendanceSession.findUnique({
        where: { id: sessionId },
        include: {
          class: {
            include: {
              school: true,
              teacher: true,
              students: { include: { student: true } },
            },
          },
          records: { include: { student: true } },
        },
      });
    } else if (classId) {
      session = await prisma.attendanceSession.findFirst({
        where: { classId },
        orderBy: { date: 'desc' },
        include: {
          class: {
            include: {
              school: true,
              teacher: true,
              students: { include: { student: true } },
            },
          },
          records: { include: { student: true } },
        },
      });
    }

    if (!session) {
      return NextResponse.json({ error: 'Session not found for export' }, { status: 404 });
    }

    const totalStudents = session.class.students.length;
    const presentCount = session.presentCount || session.records.filter((r: any) => r.status === 'PRESENT').length;
    const absentCount = session.absentCount || session.records.filter((r: any) => r.status === 'ABSENT').length;
    const lateCount = session.lateCount || session.records.filter((r: any) => r.status === 'LATE').length;
    const excusedCount = session.excusedCount || session.records.filter((r: any) => r.status === 'EXCUSED').length;
    const rate = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

    // Build row records
    const recordMap = new Map(session.records.map((r: any) => [r.studentId, r]));
    const records = session.class.students.map((e: any) => {
      const rec = recordMap.get(e.student.id) as any;
      return {
        rollNumber: e.student.rollNumber,
        fullName: e.student.fullName,
        gender: e.student.gender || 'Other',
        treeSpecies: e.student.treeSpecies || 'Emerald Oak',
        status: rec ? rec.status : 'UNMARKED',
        checkInTime: rec?.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
        note: rec?.note || '',
      };
    });

    const excelBuffer = await generateAttendanceExcel({
      schoolName: session.class.school?.name || 'Sylva Ancient Academy',
      className: session.class.name,
      classCode: session.class.code,
      date: new Date(session.date).toLocaleDateString(),
      teacherName: session.class.teacher?.fullName || 'Ranger Rowan',
      totalStudents,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      attendanceRate: rate,
      records,
    });

    const filename = `Attendance_${session.class.code}_${new Date(session.date).toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(excelBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

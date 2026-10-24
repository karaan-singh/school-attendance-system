import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    const teacher = await prisma.teacherProfile.findFirst({
      where: email ? { email } : undefined,
      include: {
        school: true,
        classes: {
          include: {
            progress: true,
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      teacher: {
        id: teacher.id,
        email: teacher.email,
        fullName: teacher.fullName,
        title: teacher.title,
        avatar: teacher.avatar,
        school: teacher.school,
        classes: teacher.classes,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

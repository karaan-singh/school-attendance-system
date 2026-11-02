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
      return NextResponse.json({
        success: true,
        offline: true,
        teacher: {
          id: 'teacher-rowan',
          email: email || 'teacher@school.edu',
          fullName: 'Ranger Rowan',
          title: 'Master Forester & Expedition Lead',
          avatar: '',
          school: { name: 'Sylva Ancient Academy' },
          classes: [],
        },
      });
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
    console.warn('Database offline, returning demo teacher session:', error.message);
    return NextResponse.json({
      success: true,
      offline: true,
      teacher: {
        id: 'teacher-rowan',
        email: 'teacher@school.edu',
        fullName: 'Ranger Rowan',
        title: 'Master Forester & Expedition Lead',
        avatar: '',
        school: { name: 'Sylva Ancient Academy' },
        classes: [],
      },
    });
  }
}

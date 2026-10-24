import { NextResponse } from 'next/server';
import { generateRosterTemplate } from '@/lib/excel';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const buffer = await generateRosterTemplate();

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Forest_Quest_Student_Template.xlsx"',
      },
    });
  } catch (error: any) {
    console.error('Template error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

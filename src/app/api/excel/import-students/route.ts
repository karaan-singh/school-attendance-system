import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseStudentExcel } from '@/lib/excel';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const classId = formData.get('classId') as string | null;
    const previewOnly = formData.get('preview') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsedRows = await parseStudentExcel(buffer);

    if (parsedRows.length === 0) {
      return NextResponse.json({ error: 'No valid student records found in file' }, { status: 400 });
    }

    // Check duplicate roll numbers within file
    const rollSeen = new Set<string>();
    parsedRows.forEach((row) => {
      if (rollSeen.has(row.rollNumber)) {
        row.isValid = false;
        row.errors.push('Duplicate roll number within sheet');
      } else {
        rollSeen.add(row.rollNumber);
      }
    });

    if (previewOnly) {
      return NextResponse.json({
        total: parsedRows.length,
        validCount: parsedRows.filter((r) => r.isValid).length,
        invalidCount: parsedRows.filter((r) => !r.isValid).length,
        rows: parsedRows,
      });
    }

    // If not preview, commit valid rows to database
    let targetClassId = classId;
    if (!targetClassId) {
      // Pick first class if not specified
      const firstClass = await prisma.schoolClass.findFirst();
      targetClassId = firstClass ? firstClass.id : null;
    }

    let importedCount = 0;
    for (const row of parsedRows) {
      if (!row.isValid) continue;

      const student = await prisma.student.upsert({
        where: { rollNumber: row.rollNumber },
        update: {
          fullName: row.fullName,
          gender: row.gender,
          avatarIcon: row.avatarIcon,
          parentPhone: row.parentPhone,
          treeSpecies: row.treeSpecies,
        },
        create: {
          rollNumber: row.rollNumber,
          fullName: row.fullName,
          gender: row.gender,
          avatarIcon: row.avatarIcon,
          parentPhone: row.parentPhone,
          treeSpecies: row.treeSpecies,
        },
      });

      // Find class by code if specified, otherwise targetClassId
      let destClassId = targetClassId;
      if (row.classCode) {
        const found = await prisma.schoolClass.findUnique({
          where: { code: row.classCode },
        });
        if (found) destClassId = found.id;
      }

      if (destClassId) {
        await prisma.classEnrollment.upsert({
          where: {
            studentId_classId: {
              studentId: student.id,
              classId: destClassId,
            },
          },
          update: { status: 'ACTIVE' },
          create: {
            studentId: student.id,
            classId: destClassId,
            status: 'ACTIVE',
          },
        });
        importedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${importedCount} student(s)!`,
      importedCount,
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

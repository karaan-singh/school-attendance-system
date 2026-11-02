import path from 'path';
import fs from 'fs';
import ExcelJS from 'exceljs';
import { PrismaClient } from '@prisma/client';

export async function seedMasterConsentStudents(prisma: PrismaClient) {
  console.log('📖 Starting master consent AI students import...');

  const filePath = path.join(process.cwd(), 'Master_Consent_List_YES_ONLY.xlsx');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Master consent file not found at ${filePath}`);
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);

  const sheet = wb.getWorksheet('All Students (Full Roster)');
  if (!sheet) {
    throw new Error('Sheet "All Students (Full Roster)" not found in workbook');
  }

  // 1. Parse all "Yes" students
  const rawList: Array<{
    masterNo: string;
    name: string;
    classCode: string;
    gradeText: string;
  }> = [];

  const classSet = new Set<string>();

  sheet.eachRow((row, r) => {
    if (r === 1) return;
    const masterNo = row.getCell(1).text?.trim() || String(row.getCell(1).value || '').trim();
    const name = row.getCell(2).text?.trim() || String(row.getCell(2).value || '').trim();
    const cls = row.getCell(3).text?.trim() || String(row.getCell(3).value || '').trim();
    const grade = row.getCell(4).text?.trim() || String(row.getCell(4).value || '').trim();
    const status = row.getCell(6).text?.trim() || String(row.getCell(6).value || '').trim();

    if (!name || name === 'Student Name') return;

    if (status.toLowerCase() === 'yes') {
      const classCode = cls.toUpperCase().replace(/\s+/g, '');
      rawList.push({
        masterNo,
        name,
        classCode,
        gradeText: grade,
      });
      classSet.add(classCode);
    }
  });

  console.log(`Parsed ${rawList.length} AI-enrolled students across ${classSet.size} classes.`);

  // 2. Upsert School
  const school = await prisma.school.upsert({
    where: { code: 'FOREST-001' },
    update: {},
    create: {
      name: 'Sylva Ancient Academy',
      code: 'FOREST-001',
      address: '404 Whispering Pines Grove, Evergreen Valley',
      motto: 'Growing Together Under the Ancient Canopy',
    },
  });

  // 3. Upsert Teacher Profile
  const teacher = await prisma.teacherProfile.upsert({
    where: { email: 'teacher@school.edu' },
    update: {},
    create: {
      email: 'teacher@school.edu',
      fullName: 'Ranger Rowan',
      title: 'Head Naturalist & Forest Guardian',
      avatar: 'ranger',
      schoolId: school.id,
    },
  });

  // 4. Upsert all Classes
  const styles = ['oak', 'birch', 'willow', 'pine'];
  const colors = ['#22c55e', '#38bdf8', '#a855f7', '#fbbf24', '#f43f5e', '#10b981'];
  const sortedClasses = Array.from(classSet).sort();

  const classMap = new Map<string, string>(); // classCode -> classId

  for (let i = 0; i < sortedClasses.length; i++) {
    const code = sortedClasses[i];
    const gradeNum = parseInt(code[0]) || 1;
    const section = code.slice(1);
    const style = styles[i % styles.length];
    const color = colors[i % colors.length];

    const schoolClass = await prisma.schoolClass.upsert({
      where: { code },
      update: {
        name: `Grade ${gradeNum} - Class ${code}`,
        grade: gradeNum,
        section: section || 'A',
        room: `Enclave Hut ${code}`,
        hutStyle: style,
        hutColor: color,
        schoolId: school.id,
        teacherId: teacher.id,
      },
      create: {
        code,
        name: `Grade ${gradeNum} - Class ${code}`,
        grade: gradeNum,
        section: section || 'A',
        room: `Enclave Hut ${code}`,
        hutStyle: style,
        hutColor: color,
        schoolId: school.id,
        teacherId: teacher.id,
      },
    });

    classMap.set(code, schoolClass.id);

    // Ensure ForestProgress exists
    await prisma.forestProgress.upsert({
      where: { classId: schoolClass.id },
      update: {},
      create: {
        classId: schoolClass.id,
        level: Math.min(5, Math.max(1, gradeNum)),
        currentXp: 20 * gradeNum,
        nextLevelXp: 100,
        bloomRank: ['Emerald Seedling', 'Whispering Sapling', 'Ancient Oak', 'Golden Sanctuary'][gradeNum - 1] || 'Emerald Seedling',
        fireflies: 10 + gradeNum * 4,
      },
    });
  }

  // 5. Upsert Students
  const treeSpeciesList = [
    'Emerald Oak',
    'Silver Birch',
    'Twilight Willow',
    'Star Blossom',
    'Sunfire Maple',
    'Golden Birch',
  ];
  const avatarList = [
    'sprout',
    'star-lion',
    'owl-sage',
    'fox-clever',
    'falcon-swift',
    'deer-gentle',
    'bear-brave',
    'star-unicorn',
  ];

  console.log('Inserting students into database...');
  
  // Bulk create/upsert students in batches
  const studentData = rawList.map((s, idx) => ({
    rollNumber: `STU-${s.masterNo}`,
    fullName: s.name,
    gender: idx % 2 === 0 ? 'Boy' : 'Girl',
    avatarIcon: avatarList[idx % avatarList.length],
    treeSpecies: treeSpeciesList[idx % treeSpeciesList.length],
  }));

  // Use createMany with skipDuplicates for fast bulk insert
  await prisma.student.createMany({
    data: studentData,
    skipDuplicates: true,
  });

  // Fetch all students to map rollNumber -> studentId
  const allStudents = await prisma.student.findMany({
    select: { id: true, rollNumber: true },
  });
  const studentMap = new Map<string, string>();
  for (const s of allStudents) {
    studentMap.set(s.rollNumber, s.id);
  }

  // 6. Create Enrollments
  const enrollmentsData: Array<{
    studentId: string;
    classId: string;
    status: string;
  }> = [];

  for (const s of rawList) {
    const studentId = studentMap.get(`STU-${s.masterNo}`);
    const classId = classMap.get(s.classCode);
    if (studentId && classId) {
      enrollmentsData.push({
        studentId,
        classId,
        status: 'ACTIVE',
      });
    }
  }

  await prisma.classEnrollment.createMany({
    data: enrollmentsData,
    skipDuplicates: true,
  });

  // 7. Seed active today session for Class 1A
  const class1AId = classMap.get('1A');
  if (class1AId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const class1AStudentsCount = enrollmentsData.filter(e => e.classId === class1AId).length;

    await prisma.attendanceSession.upsert({
      where: {
        classId_date: {
          classId: class1AId,
          date: today,
        },
      },
      update: {},
      create: {
        classId: class1AId,
        date: today,
        status: 'DRAFT',
        teacherId: teacher.id,
        notes: 'Morning Whispering Pines Roll-call',
        totalStudents: class1AStudentsCount,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        excusedCount: 0,
      },
    });
  }

  const finalStats = {
    schoolCount: await prisma.school.count(),
    classCount: await prisma.schoolClass.count(),
    studentCount: await prisma.student.count(),
    enrollmentCount: await prisma.classEnrollment.count(),
  };

  console.log('Seeding completed successfully:', finalStats);
  return finalStats;
}

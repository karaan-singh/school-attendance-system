import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import path from 'path';

const prisma = new PrismaClient();

const TREE_SPECIES_LIST = [
  'Emerald Oak',
  'Silver Birch',
  'Twilight Willow',
  'Sunfire Maple',
  'Highland Pine',
  'Golden Cedar',
  'Ancient Redwood',
];

const HUT_STYLES = ['oak', 'birch', 'willow', 'pine', 'cedar', 'maple', 'spruce', 'redwood', 'cypress'];
const HUT_COLORS = [
  '#2563eb', // royal blue
  '#059669', // emerald
  '#d97706', // amber
  '#7c3aed', // violet
  '#dc2626', // red
  '#0891b2', // cyan
  '#4f46e5', // indigo
  '#16a34a', // green
  '#ea580c', // orange
];

const SECTIONS_CONFIG: Array<{
  sheetName: string;
  grade: number;
  section: string;
  village: string;
  villageTitle: string;
}> = [
  // Grade 1 - Lakeside Valley Village
  { sheetName: '1A', grade: 1, section: 'A', village: 'Lakeside Valley', villageTitle: 'Lakeside Valley - Oak Haven' },
  { sheetName: '1B', grade: 1, section: 'B', village: 'Lakeside Valley', villageTitle: 'Lakeside Valley - Birch Hollow' },
  { sheetName: '1C', grade: 1, section: 'C', village: 'Lakeside Valley', villageTitle: 'Lakeside Valley - Willow Bank' },
  { sheetName: '1D', grade: 1, section: 'D', village: 'Lakeside Valley', villageTitle: 'Lakeside Valley - Pine Meadow' },
  { sheetName: '1E', grade: 1, section: 'E', village: 'Lakeside Valley', villageTitle: 'Lakeside Valley - Cedar Glade' },
  { sheetName: '1F', grade: 1, section: 'F', village: 'Lakeside Valley', villageTitle: 'Lakeside Valley - Maple Grove' },
  { sheetName: '1G', grade: 1, section: 'G', village: 'Lakeside Valley', villageTitle: 'Lakeside Valley - Spruce Point' },
  { sheetName: '1H', grade: 1, section: 'H', village: 'Lakeside Valley', villageTitle: 'Lakeside Valley - Redwood Ridge' },
  { sheetName: '1I', grade: 1, section: 'I', village: 'Lakeside Valley', villageTitle: 'Lakeside Valley - Fern Knoll' },

  // Grade 2 - High Timber Ridge Village
  { sheetName: '2A', grade: 2, section: 'A', village: 'High Timber Ridge', villageTitle: 'Timber Ridge - Alpine Lookout' },
  { sheetName: '2B', grade: 2, section: 'B', village: 'High Timber Ridge', villageTitle: 'Timber Ridge - Eagle Perch' },
  { sheetName: '2C', grade: 2, section: 'C', village: 'High Timber Ridge', villageTitle: 'Timber Ridge - Stone Hearth' },
  { sheetName: '2D', grade: 2, section: 'D', village: 'High Timber Ridge', villageTitle: 'Timber Ridge - Bear Den' },
  { sheetName: '2E', grade: 2, section: 'E', village: 'High Timber Ridge', villageTitle: 'Timber Ridge - Timber Trail' },
  { sheetName: '2F', grade: 2, section: 'F', village: 'High Timber Ridge', villageTitle: 'Timber Ridge - Summit View' },
  { sheetName: '2G', grade: 2, section: 'G', village: 'High Timber Ridge', villageTitle: 'Timber Ridge - High Pass' },
  { sheetName: '2H', grade: 2, section: 'H', village: 'High Timber Ridge', villageTitle: 'Timber Ridge - Fox Run' },
  { sheetName: '2I', grade: 2, section: 'I', village: 'High Timber Ridge', villageTitle: 'Timber Ridge - Cloud Peak' },

  // Grade 3 - Whispering River Enclave
  { sheetName: '3A', grade: 3, section: 'A', village: 'Whispering River', villageTitle: 'Whispering River - Riverbend Lodge' },
  { sheetName: '3B', grade: 3, section: 'B', village: 'Whispering River', villageTitle: 'Whispering River - Pebble Shore' },
  { sheetName: '3C', grade: 3, section: 'C', village: 'Whispering River', villageTitle: 'Whispering River - Emerald Bridge' },
  { sheetName: '3D', grade: 3, section: 'D', village: 'Whispering River', villageTitle: 'Whispering River - Dragonfly Pool' },
  { sheetName: '3E', grade: 3, section: 'E', village: 'Whispering River', villageTitle: 'Whispering River - Rush Meadow' },
  { sheetName: '3F', grade: 3, section: 'F', village: 'Whispering River', villageTitle: 'Whispering River - Otter Creek' },
  { sheetName: '3G', grade: 3, section: 'G', village: 'Whispering River', villageTitle: 'Whispering River - Heron Crossing' },
  { sheetName: '3H', grade: 3, section: 'H', village: 'Whispering River', villageTitle: 'Whispering River - Mossy Falls' },

  // Grade 4 - Ancient Summit Sanctum
  { sheetName: '4A', grade: 4, section: 'A', village: 'Ancient Summit', villageTitle: 'Ancient Summit - Solitude Spire' },
  { sheetName: '4B', grade: 4, section: 'B', village: 'Ancient Summit', villageTitle: 'Ancient Summit - Aurora Ridge' },
  { sheetName: '4C', grade: 4, section: 'C', village: 'Ancient Summit', villageTitle: 'Ancient Summit - Falcon Crest' },
  { sheetName: '4D', grade: 4, section: 'D', village: 'Ancient Summit', villageTitle: 'Ancient Summit - Starlight Knoll' },
  { sheetName: '4E', grade: 4, section: 'E', village: 'Ancient Summit', villageTitle: 'Ancient Summit - Timberline Gate' },
  { sheetName: '4F', grade: 4, section: 'F', village: 'Ancient Summit', villageTitle: 'Ancient Summit - Granite Bluff' },
  { sheetName: '4G', grade: 4, section: 'G', village: 'Ancient Summit', villageTitle: 'Ancient Summit - Highland Meadow' },
  { sheetName: '4H', grade: 4, section: 'H', village: 'Ancient Summit', villageTitle: 'Ancient Summit - Skyhaven Point' },
];

async function main() {
  console.log('🌲 Starting Real Data Seed from Master_Consent_List_YES_ONLY.xlsx...');

  const excelPath = path.resolve(process.cwd(), 'Master_Consent_List_YES_ONLY.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelPath);
  console.log('✓ Excel workbook loaded successfully.');

  // Clean existing data for clean seed
  console.log('🧹 Cleaning existing session, enrollment, student, and class tables...');
  await prisma.attendanceRecord.deleteMany({});
  await prisma.attendanceSession.deleteMany({});
  await prisma.classEnrollment.deleteMany({});
  await prisma.forestProgress.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.schoolClass.deleteMany({});
  await prisma.teacherProfile.deleteMany({});
  await prisma.school.deleteMany({});

  // 1. Create Primary School
  const school = await prisma.school.create({
    data: {
      name: 'Forest Academy of Natural Sciences',
      code: 'FANS-01',
      address: 'Sylva Valley Trailhead, Mount Solitude Enclave',
      motto: 'Growing Together Under the Ancient Living Canopy',
    },
  });
  console.log(`✓ Created School: ${school.name}`);

  // 2. Create Lead Teacher
  const teacher = await prisma.teacherProfile.create({
    data: {
      email: 'ranger.rowan@forest.edu',
      fullName: 'Ranger Rowan',
      title: 'Chief Forest Warden & Master Instructor',
      schoolId: school.id,
    },
  });
  console.log(`✓ Created Teacher: ${teacher.fullName}`);

  let totalStudentsImported = 0;
  let totalClassesImported = 0;

  const today = new Date();
  const todayDateOnly = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  // 3. Process each class section
  for (let idx = 0; idx < SECTIONS_CONFIG.length; idx++) {
    const config = SECTIONS_CONFIG[idx];
    const worksheet = workbook.getWorksheet(config.sheetName);

    if (!worksheet) {
      console.warn(`⚠️ Worksheet not found: ${config.sheetName}`);
      continue;
    }

    const classCode = `${config.grade}-${config.section}`;
    const hutStyle = HUT_STYLES[idx % HUT_STYLES.length];
    const hutColor = HUT_COLORS[idx % HUT_COLORS.length];

    const schoolClass = await prisma.schoolClass.create({
      data: {
        name: `Grade ${config.grade} - Section ${config.section} (${config.villageTitle})`,
        code: classCode,
        grade: config.grade,
        section: config.section,
        room: `Hut ${config.section}`,
        hutStyle,
        hutColor,
        schoolId: school.id,
        teacherId: teacher.id,
      },
    });

    totalClassesImported++;

    // Initial Progress
    await prisma.forestProgress.create({
      data: {
        classId: schoolClass.id,
        level: config.grade,
        currentXp: 150 * config.grade,
        nextLevelXp: 500 * config.grade,
        fireflies: 5 * config.grade,
        bloomRank: config.grade >= 3 ? 'SILVER_CANOPY' : 'EMERALD_SPROUT',
      },
    });

    // Create Draft Daily Attendance Session
    const session = await prisma.attendanceSession.create({
      data: {
        classId: schoolClass.id,
        date: todayDateOnly,
        status: 'DRAFT',
        totalStudents: 0,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        excusedCount: 0,
      },
    });

    // Read students from Excel
    const sectionStudents: Array<{
      rollNumber: string;
      fullName: string;
      gender: string;
      treeSpecies: string;
      status: 'PRESENT' | 'LATE' | 'EXCUSED' | null;
    }> = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Header row

      // Column mapping:
      // Col 2: S.No
      // Col 3: Master List No.
      // Col 4: Student Name
      // Col 5: Class (e.g. "1B")
      // Col 6: Grade
      const sNo = row.getCell(2).value;
      const masterListNo = row.getCell(3).value;
      const rawName = row.getCell(4).value;

      if (!rawName || typeof rawName !== 'string' || !rawName.trim()) {
        return;
      }

      const fullName = rawName.trim();
      const rollNumber = masterListNo ? `ML-${masterListNo}` : `S-${config.grade}${config.section}-${sNo || rowNumber}`;
      
      // Select natural tree species and gender
      const treeSpecies = TREE_SPECIES_LIST[(sectionStudents.length + config.grade) % TREE_SPECIES_LIST.length];
      const isGirlGuess = /A$|I$|EE$|YA$|IKA$|TI$|PRIYA|KUMARI|SHARMA/i.test(fullName);
      const gender = isGirlGuess ? 'Girl' : 'Boy';

      sectionStudents.push({
        rollNumber,
        fullName,
        gender,
        treeSpecies,
        status: null, // Ready for fresh roll call
      });
    });

    // Insert students & enrollments
    let classPresent = 0;
    for (let sIdx = 0; sIdx < sectionStudents.length; sIdx++) {
      const sData = sectionStudents[sIdx];

      // Check if student with this rollNumber already exists (in case of duplicate master list no)
      let student = await prisma.student.findUnique({
        where: { rollNumber: sData.rollNumber },
      });

      if (!student) {
        student = await prisma.student.create({
          data: {
            rollNumber: sData.rollNumber,
            fullName: sData.fullName,
            gender: sData.gender,
            avatarIcon: sData.gender === 'Girl' ? 'flower' : 'sprout',
            parentPhone: `+91 9826${(100000 + totalStudentsImported).toString().slice(1)}`,
            treeSpecies: sData.treeSpecies,
          },
        });
      }

      await prisma.classEnrollment.create({
        data: {
          studentId: student.id,
          classId: schoolClass.id,
          status: 'ACTIVE',
        },
      });

      // Attendance record
      await prisma.attendanceRecord.create({
        data: {
          sessionId: session.id,
          studentId: student.id,
          status: 'PRESENT', // Start with lively blooming trees
        },
      });
      classPresent++;
      totalStudentsImported++;
    }

    // Update session counts
    await prisma.attendanceSession.update({
      where: { id: session.id },
      data: {
        totalStudents: sectionStudents.length,
        presentCount: classPresent,
      },
    });

    console.log(`  ✓ ${classCode} (${config.villageTitle}): ${sectionStudents.length} students enrolled`);
  }

  console.log(`\n🎉 Seed Completed Successfully!`);
  console.log(`• Total Villages/Grades: 4`);
  console.log(`• Total Classes/Sections: ${totalClassesImported}`);
  console.log(`• Total Real Students Seeded: ${totalStudentsImported}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

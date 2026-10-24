import { PrismaClient, AttendanceStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌲 Seeding Forest Quest attendance system...');

  // 1. Create or update School
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

  // 2. Create or update Teacher
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

  // 3. Create Classes
  const classData = [
    {
      name: 'Grade 1 - Super Stars',
      code: '1-A',
      grade: 1,
      section: 'A',
      room: 'Canopy Hut 1',
      hutStyle: 'oak',
      hutColor: '#22c55e',
      schoolId: school.id,
      teacherId: teacher.id,
      progress: {
        level: 3,
        currentXp: 75,
        nextLevelXp: 100,
        bloomRank: 'Whispering Sapling',
        fireflies: 18,
      },
    },
    {
      name: 'Grade 1 - Little Explorers',
      code: '1-B',
      grade: 1,
      section: 'B',
      room: 'Mossy Hut 2',
      hutStyle: 'birch',
      hutColor: '#38bdf8',
      schoolId: school.id,
      teacherId: teacher.id,
      progress: {
        level: 2,
        currentXp: 40,
        nextLevelXp: 100,
        bloomRank: 'Emerald Seedling',
        fireflies: 14,
      },
    },
    {
      name: 'Grade 2 - Cosmic Explorers',
      code: '2-A',
      grade: 2,
      section: 'A',
      room: 'Starlight Hut 3',
      hutStyle: 'willow',
      hutColor: '#a855f7',
      schoolId: school.id,
      teacherId: teacher.id,
      progress: {
        level: 4,
        currentXp: 90,
        nextLevelXp: 100,
        bloomRank: 'Ancient Oak',
        fireflies: 26,
      },
    },
    {
      name: 'Grade 3 - Dino Champs',
      code: '3-A',
      grade: 3,
      section: 'A',
      room: 'Sunfire Hut 4',
      hutStyle: 'pine',
      hutColor: '#fbbf24',
      schoolId: school.id,
      teacherId: teacher.id,
      progress: {
        level: 5,
        currentXp: 30,
        nextLevelXp: 150,
        bloomRank: 'Golden Sanctuary',
        fireflies: 35,
      },
    },
  ];

  const createdClasses: Record<string, any> = {};

  for (const c of classData) {
    const { progress, ...classInfo } = c;
    const created = await prisma.schoolClass.upsert({
      where: { code: classInfo.code },
      update: classInfo,
      create: classInfo,
    });

    await prisma.forestProgress.upsert({
      where: { classId: created.id },
      update: progress,
      create: {
        classId: created.id,
        ...progress,
      },
    });

    createdClasses[c.code] = created;
  }

  // 4. Student pool derived from master list & sample dataset
  const rawStudents = [
    // 1-A: Super Stars (16 students)
    { roll: 'STU-101', name: 'Max Thunder', gender: 'Boy', avatar: 'star-lion', phone: '+1 555-0301', tree: 'Emerald Oak', classCode: '1-A' },
    { roll: 'STU-102', name: 'Lily Sunshine', gender: 'Girl', avatar: 'star-unicorn', phone: '+1 555-0302', tree: 'Silver Birch', classCode: '1-A' },
    { roll: 'STU-103', name: 'Mason Miller', gender: 'Boy', avatar: 'fox-clever', phone: '+1 555-2134', tree: 'Sunfire Maple', classCode: '1-A' },
    { roll: 'STU-104', name: 'Scarlett Miller', gender: 'Girl', avatar: 'owl-sage', phone: '+1 555-3844', tree: 'Star Blossom', classCode: '1-A' },
    { roll: 'STU-105', name: 'Oliver Rodriguez', gender: 'Boy', avatar: 'bear-brave', phone: '+1 555-2345', tree: 'Emerald Oak', classCode: '1-A' },
    { roll: 'STU-106', name: 'Aria Lopez', gender: 'Girl', avatar: 'star-fairy', phone: '+1 555-9597', tree: 'Twilight Willow', classCode: '1-A' },
    { roll: 'STU-107', name: 'Ethan Thomas', gender: 'Boy', avatar: 'falcon-swift', phone: '+1 555-8440', tree: 'Golden Birch', classCode: '1-A' },
    { roll: 'STU-108', name: 'Sophia Lopez', gender: 'Girl', avatar: 'deer-gentle', phone: '+1 555-8718', tree: 'Silver Birch', classCode: '1-A' },
    { roll: 'STU-109', name: 'Jack Brown', gender: 'Boy', avatar: 'wolf-lone', phone: '+1 555-5722', tree: 'Emerald Oak', classCode: '1-A' },
    { roll: 'STU-110', name: 'Emma Watson', gender: 'Girl', avatar: 'star-unicorn', phone: '+1 555-4921', tree: 'Star Blossom', classCode: '1-A' },
    { roll: 'STU-111', name: 'Aiden Rodriguez', gender: 'Boy', avatar: 'cosmic-bear', phone: '+1 555-5067', tree: 'Sunfire Maple', classCode: '1-A' },
    { roll: 'STU-112', name: 'Lucas Green', gender: 'Boy', avatar: 'sprout-leaf', phone: '+1 555-3312', tree: 'Twilight Willow', classCode: '1-A' },
    { roll: 'STU-113', name: 'Chloe Bennett', gender: 'Girl', avatar: 'star-fairy', phone: '+1 555-7788', tree: 'Emerald Oak', classCode: '1-A' },
    { roll: 'STU-114', name: 'Noah Davis', gender: 'Boy', avatar: 'owl-sage', phone: '+1 555-6611', tree: 'Golden Birch', classCode: '1-A' },
    { roll: 'STU-115', name: 'Mia Martinez', gender: 'Girl', avatar: 'fox-clever', phone: '+1 555-8822', tree: 'Star Blossom', classCode: '1-A' },
    { roll: 'STU-116', name: 'Liam Walker', gender: 'Boy', avatar: 'falcon-swift', phone: '+1 555-4433', tree: 'Silver Birch', classCode: '1-A' },

    // 1-B: Little Explorers (12 students)
    { roll: 'STU-121', name: 'Leo River', gender: 'Boy', avatar: 'star-lion', phone: '+1 555-9901', tree: 'Silver Birch', classCode: '1-B' },
    { roll: 'STU-122', name: 'Ava Stone', gender: 'Girl', avatar: 'deer-gentle', phone: '+1 555-9902', tree: 'Emerald Oak', classCode: '1-B' },
    { roll: 'STU-123', name: 'Zoe Brooks', gender: 'Girl', avatar: 'star-unicorn', phone: '+1 555-9903', tree: 'Star Blossom', classCode: '1-B' },
    { roll: 'STU-124', name: 'Owen Anderson', gender: 'Boy', avatar: 'wolf-lone', phone: '+1 555-1330', tree: 'Sunfire Maple', classCode: '1-B' },
    { roll: 'STU-125', name: 'Isabella Reed', gender: 'Girl', avatar: 'star-fairy', phone: '+1 555-9905', tree: 'Twilight Willow', classCode: '1-B' },
    { roll: 'STU-126', name: 'Henry Ford', gender: 'Boy', avatar: 'bear-brave', phone: '+1 555-9906', tree: 'Golden Birch', classCode: '1-B' },
    { roll: 'STU-127', name: 'Ella Clark', gender: 'Girl', avatar: 'owl-sage', phone: '+1 555-9907', tree: 'Silver Birch', classCode: '1-B' },
    { roll: 'STU-128', name: 'Lucas Rodriguez', gender: 'Boy', avatar: 'falcon-swift', phone: '+1 555-5590', tree: 'Emerald Oak', classCode: '1-B' },
    { roll: 'STU-129', name: 'Harper Ross', gender: 'Girl', avatar: 'deer-gentle', phone: '+1 555-9909', tree: 'Star Blossom', classCode: '1-B' },
    { roll: 'STU-130', name: 'James Evans', gender: 'Boy', avatar: 'sprout-leaf', phone: '+1 555-9910', tree: 'Sunfire Maple', classCode: '1-B' },
    { roll: 'STU-131', name: 'Charlotte King', gender: 'Girl', avatar: 'fox-clever', phone: '+1 555-9911', tree: 'Twilight Willow', classCode: '1-B' },
    { roll: 'STU-132', name: 'Benjamin Scott', gender: 'Boy', avatar: 'cosmic-bear', phone: '+1 555-9912', tree: 'Emerald Oak', classCode: '1-B' },

    // 2-A: Cosmic Explorers (12 students)
    { roll: 'STU-201', name: 'Sam Rocket', gender: 'Boy', avatar: 'star-astronaut', phone: '+1 555-0303', tree: 'Twilight Willow', classCode: '2-A' },
    { roll: 'STU-202', name: 'Stella Nova', gender: 'Girl', avatar: 'star-fairy', phone: '+1 555-2002', tree: 'Star Blossom', classCode: '2-A' },
    { roll: 'STU-203', name: 'Orion Vale', gender: 'Boy', avatar: 'owl-sage', phone: '+1 555-2003', tree: 'Silver Birch', classCode: '2-A' },
    { roll: 'STU-204', name: 'Luna Polaris', gender: 'Girl', avatar: 'star-unicorn', phone: '+1 555-2004', tree: 'Emerald Oak', classCode: '2-A' },
    { roll: 'STU-205', name: 'Finnian Drake', gender: 'Boy', avatar: 'falcon-swift', phone: '+1 555-2005', tree: 'Sunfire Maple', classCode: '2-A' },
    { roll: 'STU-206', name: 'Aurora Dawn', gender: 'Girl', avatar: 'deer-gentle', phone: '+1 555-2006', tree: 'Golden Birch', classCode: '2-A' },
    { roll: 'STU-207', name: 'Kai Cosmo', gender: 'Boy', avatar: 'fox-clever', phone: '+1 555-2007', tree: 'Twilight Willow', classCode: '2-A' },
    { roll: 'STU-208', name: 'Maya Comet', gender: 'Girl', avatar: 'star-lion', phone: '+1 555-2008', tree: 'Star Blossom', classCode: '2-A' },
    { roll: 'STU-209', name: 'Miles Sol', gender: 'Boy', avatar: 'bear-brave', phone: '+1 555-2009', tree: 'Emerald Oak', classCode: '2-A' },
    { roll: 'STU-210', name: 'Ivy Nebula', gender: 'Girl', avatar: 'sprout-leaf', phone: '+1 555-2010', tree: 'Silver Birch', classCode: '2-A' },
    { roll: 'STU-211', name: 'Toby Orbit', gender: 'Boy', avatar: 'cosmic-bear', phone: '+1 555-2011', tree: 'Sunfire Maple', classCode: '2-A' },
    { roll: 'STU-212', name: 'Elena Starlight', gender: 'Girl', avatar: 'star-fairy', phone: '+1 555-2012', tree: 'Twilight Willow', classCode: '2-A' },

    // 3-A: Dino Champs (12 students)
    { roll: 'STU-304', name: 'Ruby Spark', gender: 'Girl', avatar: 'star-fairy', phone: '+1 555-0304', tree: 'Sunfire Maple', classCode: '3-A' },
    { roll: 'STU-305', name: 'Rex Hunter', gender: 'Boy', avatar: 'star-lion', phone: '+1 555-3002', tree: 'Golden Birch', classCode: '3-A' },
    { roll: 'STU-306', name: 'Tara Pteron', gender: 'Girl', avatar: 'falcon-swift', phone: '+1 555-3003', tree: 'Emerald Oak', classCode: '3-A' },
    { roll: 'STU-307', name: 'Bronto Bruno', gender: 'Boy', avatar: 'bear-brave', phone: '+1 555-3004', tree: 'Twilight Willow', classCode: '3-A' },
    { roll: 'STU-308', name: 'Velma Raptor', gender: 'Girl', avatar: 'fox-clever', phone: '+1 555-3005', tree: 'Star Blossom', classCode: '3-A' },
    { roll: 'STU-309', name: 'Stego Stan', gender: 'Boy', avatar: 'wolf-lone', phone: '+1 555-3006', tree: 'Silver Birch', classCode: '3-A' },
    { roll: 'STU-310', name: 'Fossil Fiona', gender: 'Girl', avatar: 'deer-gentle', phone: '+1 555-3007', tree: 'Sunfire Maple', classCode: '3-A' },
    { roll: 'STU-311', name: 'Trike Tyler', gender: 'Boy', avatar: 'cosmic-bear', phone: '+1 555-3008', tree: 'Emerald Oak', classCode: '3-A' },
    { roll: 'STU-312', name: 'Amber Stone', gender: 'Girl', avatar: 'star-unicorn', phone: '+1 555-3009', tree: 'Golden Birch', classCode: '3-A' },
    { roll: 'STU-313', name: 'Claw Cody', gender: 'Boy', avatar: 'falcon-swift', phone: '+1 555-3010', tree: 'Twilight Willow', classCode: '3-A' },
    { roll: 'STU-314', name: 'Spike Sasha', gender: 'Girl', avatar: 'star-fairy', phone: '+1 555-3011', tree: 'Star Blossom', classCode: '3-A' },
    { roll: 'STU-315', name: 'Giga Gabe', gender: 'Boy', avatar: 'owl-sage', phone: '+1 555-3012', tree: 'Emerald Oak', classCode: '3-A' },
  ];

  for (const s of rawStudents) {
    const student = await prisma.student.upsert({
      where: { rollNumber: s.roll },
      update: {
        fullName: s.name,
        gender: s.gender,
        avatarIcon: s.avatar,
        parentPhone: s.phone,
        treeSpecies: s.tree,
      },
      create: {
        rollNumber: s.roll,
        fullName: s.name,
        gender: s.gender,
        avatarIcon: s.avatar,
        parentPhone: s.phone,
        treeSpecies: s.tree,
      },
    });

    const targetClass = createdClasses[s.classCode];
    if (targetClass) {
      await prisma.classEnrollment.upsert({
        where: {
          studentId_classId: {
            studentId: student.id,
            classId: targetClass.id,
          },
        },
        update: { status: 'ACTIVE' },
        create: {
          studentId: student.id,
          classId: targetClass.id,
          status: 'ACTIVE',
        },
      });
    }
  }

  // 5. Seed a today's draft session for Class 1-A to make the initial roll-call immediately active
  const class1A = createdClasses['1-A'];
  if (class1A) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const session = await prisma.attendanceSession.upsert({
      where: {
        classId_date: {
          classId: class1A.id,
          date: today,
        },
      },
      update: {},
      create: {
        classId: class1A.id,
        date: today,
        status: 'DRAFT',
        teacherId: teacher.id,
        notes: 'Morning Whispering Pines Roll-call',
        totalStudents: 16,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        excusedCount: 0,
      },
    });
    console.log(`Created sample draft session for 1-A: ${session.id}`);
  }

  console.log('✅ Forest Quest seed data completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

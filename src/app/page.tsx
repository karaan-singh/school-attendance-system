import { prisma } from '@/lib/prisma';
import HomePageClient from '@/components/home/HomePageClient';
import { SchoolClassData } from '@/types';
import { getCachedClasses, setCachedClasses } from '@/lib/serverCache';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let initialClasses: SchoolClassData[] = [];

  const cached = getCachedClasses<SchoolClassData[]>();
  if (cached && Array.isArray(cached) && cached.length > 0) {
    initialClasses = cached;
  } else {
    try {
      const dbClasses = await prisma.schoolClass.findMany({
        include: {
          students: {
            where: { status: 'ACTIVE' },
          },
          progress: true,
          sessions: {
            orderBy: { date: 'desc' },
            take: 1,
          },
        },
        orderBy: { code: 'asc' },
      });

      initialClasses = dbClasses.map((c) => {
        const todaySession = c.sessions[0];
        return {
          id: c.id,
          name: c.name,
          code: c.code,
          grade: c.grade,
          section: c.section,
          room: c.room,
          hutStyle: c.hutStyle,
          hutColor: c.hutColor,
          studentCount: c.students.length,
          todaySessionStatus: (todaySession ? todaySession.status : 'NOT_STARTED') as any,
          todaySessionId: todaySession ? todaySession.id : null,
          progress: c.progress
            ? {
                level: c.progress.level,
                currentXp: c.progress.currentXp,
                nextLevelXp: c.progress.nextLevelXp,
                bloomRank: c.progress.bloomRank,
                fireflies: c.progress.fireflies,
              }
            : null,
        };
      });

      if (initialClasses.length > 0) {
        setCachedClasses(initialClasses);
      }
    } catch (e: any) {
      console.warn('Database query during SSR failed, relying on client fallback cache:', e.message);
    }
  }

  return <HomePageClient initialClasses={initialClasses} />;
}

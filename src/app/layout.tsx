import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Forest Quest — Story-Driven 3D School Attendance System',
  description:
    'An interactive 3D school attendance system built with Next.js, React Three Fiber, Three.js, GSAP, and MySQL. Transforming daily roll-call into an enchanting forest journey.',
  keywords: ['attendance', '3D', 'Three.js', 'React Three Fiber', 'gamified education', 'school management'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="relative min-h-[calc(100vh-64px)] overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}

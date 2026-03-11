import LessonHeader from "@/features/course/components/lesson/lesson-header";
import LessonSidebar from "@/features/course/components/lesson/lesson-sidebar";
import { getCourseById } from "@/features/course/mock/course-data";
import { notFound } from "next/navigation";

interface LessonLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function LessonLayout({
  children,
  params,
}: LessonLayoutProps) {
  const { id: courseId } = await params;

  const course = getCourseById(courseId);
  if (!course) notFound();

  return (
    <div className='min-h-screen'>
      <LessonHeader courseName={course.title} />

      {/* Content */}
      <div className='mt-17 mr-[25%] p-4'>{children}</div>

      {/* Sidebar */}
      <LessonSidebar course={course} />
    </div>
  );
}

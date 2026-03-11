import LessonLayoutClient from "@/features/course/components/lesson/lesson-layout-client";
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

  return <LessonLayoutClient course={course}>{children}</LessonLayoutClient>;
}

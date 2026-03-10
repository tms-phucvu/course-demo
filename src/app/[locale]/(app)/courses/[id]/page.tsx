import { notFound } from "next/navigation";

import CourseDetail from "@/features/course/components/course-detail";
import { getCourseById } from "@/features/course/mock/course-data";

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;

  const course = getCourseById(id);

  if (!course) {
    notFound();
  }

  return <CourseDetail course={course} />;
}

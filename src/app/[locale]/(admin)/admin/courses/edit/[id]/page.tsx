import { notFound } from "next/navigation";

import CourseEdit from "@/features/course-management/components/course-edit";
import { getCourseById } from "@/features/course/mock/course-data";

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function CourseEditPage({ params }: PageProps) {
  const { id } = await params;

  const course = getCourseById(id);

  if (!course) {
    notFound();
  }

  return <CourseEdit id={id} />;
}

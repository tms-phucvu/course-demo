import { notFound } from "next/navigation";

import LessonMain from "@/features/course/components/lesson/lesson-main";
import {
  getCourseById,
  getLessonById,
} from "@/features/course/mock/course-data";

interface CourseLessonProps {
  params: Promise<{
    locale: string;
    id: string;
    lessonId: string;
  }>;
}

export default async function CourseLesson({ params }: CourseLessonProps) {
  const { id: courseId, lessonId } = await params;

  const course = getCourseById(courseId);
  if (!course) {
    notFound();
  }

  const lesson = getLessonById(courseId, lessonId);
  if (!lesson) {
    notFound();
  }

  return <LessonMain lesson={lesson} course={course} />;
}

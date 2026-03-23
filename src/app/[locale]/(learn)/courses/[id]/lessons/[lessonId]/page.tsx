import LessonMain from "@/features/course/components/lesson/lesson-main";

interface CourseLessonProps {
  params: Promise<{
    locale: string;
    id: string;
    lessonId: string;
  }>;
}

export default async function CourseLesson({ params }: CourseLessonProps) {
  const { id, lessonId } = await params;

  return <LessonMain selectedLessonId={lessonId} courseId={id} />;
}

interface PageProps {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
}

export default async function CourseDetails({ params }: PageProps) {
  const { id: courseId, lessonId } = await params;

  return <div>{`Lesson '${lessonId}' of course ID: ${courseId}`}</div>;
}

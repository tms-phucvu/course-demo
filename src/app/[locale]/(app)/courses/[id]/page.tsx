import CourseDetail from "@/features/course/components/course/course-detail";

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <CourseDetail courseId={id} />;
}

import CourseEdit from "@/features/course-management/components/course-actions/course-edit";

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function CourseEditPage({ params }: PageProps) {
  const { id } = await params;

  return <CourseEdit id={id} />;
}

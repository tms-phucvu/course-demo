"use client";
import CourseForm from "@/features/course-management/components/course-actions/course-form";
import { useCourseDetail } from "@/features/course-management/hooks/use-course-detail";
import { transformCourseToForm } from "@/features/course-management/utils/transform-course.utils";

interface CourseEditProps {
  id: string;
}

function CourseEdit({ id }: CourseEditProps) {
  const { data, isLoading, isError } = useCourseDetail(id);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error!</div>;
  return <CourseForm courseId={id} formData={transformCourseToForm(data)} />;
}

export default CourseEdit;

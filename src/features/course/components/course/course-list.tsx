"use client";
import {
  CourseFilters,
  CourseResponse,
} from "@/features/course-management/types/course.types";
import CourseCard from "@/features/course/components/course/course-card";
import { useCourses } from "@/features/course/hooks/use-courses";

function CourseList() {
  const filters: CourseFilters = {
    page: 1,
    limit: 12,
  };

  const { data, isLoading, isError, error } = useCourses(filters);

  if (isLoading) {
    return (
      <div className='mt-10'>
        <h2 className='text-2xl font-bold'>Course List</h2>
        <div className='mt-6 text-center text-gray-500'>Loading courses...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='mt-10'>
        <h2 className='text-2xl font-bold'>Course List</h2>
        <div className='text-destructive mt-6 text-center'>
          An error occurred: {error?.message || "Failed to load courses"}
        </div>
      </div>
    );
  }

  const courses: CourseResponse[] = data?.items ?? [];

  return (
    <div className='mt-10'>
      <h2 className='text-2xl font-bold'>Course List</h2>

      {courses.length === 0 ? (
        <div className='mt-6 text-center text-gray-500'>No courses found</div>
      ) : (
        <div className='mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4'>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;

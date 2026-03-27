"use client";

import { cn } from "@/core/lib";
import LessonHeader from "@/features/course/components/lesson/lesson-header";
import LessonSidebar from "@/features/course/components/lesson/lesson-sidebar";
import { useCourseDetail } from "@/features/course/hooks/use-course-detail"; // adjust path if needed
import { useState } from "react";

interface LessonLayoutClientProps {
  children: React.ReactNode;
  courseId: string;
}

export default function LessonLayoutClient({
  children,
  courseId,
}: LessonLayoutClientProps) {
  const [isOpenSidebar, setIsOpenSidebar] = useState(true);

  const { data: course, isLoading, isError, error } = useCourseDetail(courseId);

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <p className='text-lg text-gray-500'>Loading course...</p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (isError) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center text-red-600'>
          <p className='text-lg font-medium'>Failed to load course</p>
          <p className='mt-2'>{error?.message || "Please try again later"}</p>
        </div>
      </div>
    );
  }

  // ── Course not found ──
  if (!course) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center text-gray-500'>
          <p className='text-lg'>Course not found</p>
        </div>
      </div>
    );
  }

  // ── Main layout with real course data ──
  return (
    <div className='min-h-screen'>
      <LessonHeader
        courseName={course.title}
        setIsOpenSidebar={setIsOpenSidebar}
      />

      <div
        className={cn(
          "mt-36 p-4 transition-all duration-300 ease-in-out sm:mt-14",
          isOpenSidebar && "sm:mr-[25%]"
        )}
      >
        {children}
      </div>

      <LessonSidebar
        course={course}
        isOpen={isOpenSidebar}
        setIsOpenSidebar={setIsOpenSidebar}
      />
    </div>
  );
}

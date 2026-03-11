"use client";

import { cn } from "@/core/lib";
import LessonHeader from "@/features/course/components/lesson/lesson-header";
import LessonSidebar from "@/features/course/components/lesson/lesson-sidebar";
import { Course } from "@/features/course/types/course.types";
import { useState } from "react";

interface LessonLayoutClientProps {
  children: React.ReactNode;
  course: Course;
}

export default function LessonLayoutClient({
  children,
  course,
}: LessonLayoutClientProps) {
  const [isOpenSidebar, setIsOpenSidebar] = useState(true);

  return (
    <div className='min-h-screen'>
      <LessonHeader
        courseName={course.title}
        setIsOpenSidebar={setIsOpenSidebar}
      />

      <div
        className={cn(
          "mt-36 p-4 transition-all duration-300 ease-in-out sm:mt-17",
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

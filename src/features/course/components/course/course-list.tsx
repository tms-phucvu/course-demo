"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/core/lib/utils";
import {
  CourseFilters,
  CourseResponse,
} from "@/features/course-management/types/course.types";
import CourseCard from "@/features/course/components/course/course-card";
import { useCourses } from "@/features/course/hooks/use-courses";
import { getPageNumbers } from "@/features/course/utils/course.utils";
import { useState } from "react";

const PER_PAGE = 12;

function CourseList() {
  const [currentPage, setCurrentPage] = useState(1);

  const filters: CourseFilters = {
    page: currentPage,
    limit: PER_PAGE,
  };

  const { data, isLoading, isError, error } = useCourses(filters);

  const courses: CourseResponse[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const startIndex = total === 0 ? 0 : (currentPage - 1) * PER_PAGE;
  const endIndex = Math.min(startIndex + PER_PAGE, total);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handleGoToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

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

  return (
    <div className='mt-10 w-full max-w-7xl'>
      <h2 className='text-2xl font-bold'>Course List</h2>

      {courses.length === 0 ? (
        <div className='mt-6 text-center text-gray-500'>No courses found</div>
      ) : (
        <>
          {/* Course List */}
          <div className='mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4'>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          {total > 0 && (
            <div className='mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row'>
              <p className='text-muted-foreground order-2 text-sm sm:order-1'>
                Showing {startIndex + 1}–{endIndex} of {total} courses
              </p>

              <div className='order-1 flex items-center gap-1 sm:order-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {getPageNumbers({ currentPage, totalPages }).map((page, idx) =>
                  page === "ellipsis" ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className='text-muted-foreground px-3 py-1.5 text-sm'
                    >
                      …
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size='sm'
                      className={cn(
                        page === currentPage &&
                          "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      onClick={() => handleGoToPage(page)}
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CourseList;

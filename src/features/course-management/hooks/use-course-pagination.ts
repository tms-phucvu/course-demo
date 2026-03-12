import { PER_PAGE } from "@/features/course-management/constants/course-management.constants";
import { getPageNumbers } from "@/features/course-management/utils/course-management.utils";
import { Course } from "@/features/course/types/course.types";
import { useEffect, useMemo, useState } from "react";

interface Props {
  filteredCourses: Course[];
}

export function useCoursePagination({ filteredCourses }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const total = filteredCourses.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const startIndex = total === 0 ? 0 : (currentPage - 1) * PER_PAGE;
  const endIndex = Math.min(startIndex + PER_PAGE, total);

  const pageCourses = useMemo(
    () => filteredCourses.slice(startIndex, endIndex),
    [filteredCourses, startIndex, endIndex]
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handleGoToPage = (page: number) =>
    setCurrentPage(Math.min(Math.max(1, page), totalPages));

  return {
    currentPage,
    total,
    totalPages,
    startIndex,
    endIndex,
    pageCourses,
    handlePrev,
    handleNext,
    handleGoToPage,
    getPageNumbers,
  };
}

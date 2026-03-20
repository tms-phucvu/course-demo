import { getAllCourses } from "@/features/course-management/services/course.service";
import {
  CourseFilters,
  CourseListResponse,
} from "@/features/course-management/types/course.types";
import { useQuery } from "@tanstack/react-query";

export const useCourses = (filters: CourseFilters) => {
  const { page = 1, limit = 10, title } = filters;

  return useQuery<CourseListResponse>({
    queryKey: ["courses", page, limit, title],
    queryFn: () => getAllCourses({ page, limit, title }),
  });
};

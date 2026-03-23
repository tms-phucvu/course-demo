import {
  CourseFilters,
  CourseListResponse,
} from "@/features/course-management/types/course.types";
import { getAllCourses } from "@/features/course/services/course.service";
import { useQuery } from "@tanstack/react-query";

export const useCourses = (filters: CourseFilters) => {
  const { page = 1, limit = 10, title } = filters;

  return useQuery<CourseListResponse>({
    queryKey: ["courses", page, limit, title],
    queryFn: () => getAllCourses({ page, limit, title }),
  });
};

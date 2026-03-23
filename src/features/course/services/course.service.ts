import { apiClient } from "@/core/lib";
import {
  CourseDetails,
  CourseFilters,
  CourseListResponse,
} from "@/features/course-management/types/course.types";

// GET ALL (list)
export async function getAllCourses(
  filters?: CourseFilters
): Promise<CourseListResponse> {
  const params: Record<string, string | number> = {};

  if (filters?.title) {
    params.title = filters.title;
  }

  params.page = filters?.page ?? 1;
  params.limit = filters?.limit ?? 10;

  const response = await apiClient.get<CourseListResponse>("/student/courses", {
    params,
  });

  return response.data;
}

// GET BY ID (full course: có sections + lessons)
export async function getCourseById(id: string): Promise<CourseDetails> {
  const response = await apiClient.get<CourseDetails>(`/student/courses/${id}`);
  return response.data;
}

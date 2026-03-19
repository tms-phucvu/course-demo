import { apiClient } from "@/core/lib";
import {
  CourseDetails,
  CourseFilters,
  CourseListResponse,
  CreateCoursePayload,
  UpdateCoursePayload,
} from "@/features/course-management/types/course.types";

// GET ALL (list)
export async function getAllCourses(
  filters?: CourseFilters
): Promise<CourseListResponse> {
  const params: Record<string, string | number> = {};

  if (filters?.name) {
    params.name = filters.name;
  }

  params.page = filters?.page ?? 1;
  params.limit = filters?.limit ?? 10;

  const response = await apiClient.get<CourseListResponse>("/admin/courses", {
    params,
  });

  return response.data;
}

// GET BY ID (full course: có sections + lessons)
export async function getCourseById(id: string): Promise<CourseDetails> {
  const response = await apiClient.get<CourseDetails>(`/admin/courses/${id}`);
  return response.data;
}

// CREATE (full course)
export async function createCourse(
  payload: CreateCoursePayload
): Promise<CourseDetails> {
  const response = await apiClient.post<CourseDetails>(
    "/admin/courses",
    payload
  );
  return response.data;
}

// UPDATE (replace full course)
export async function updateCourse(
  id: string,
  payload: UpdateCoursePayload
): Promise<CourseDetails> {
  const response = await apiClient.patch<CourseDetails>(
    `/admin/courses/${id}`,
    payload
  );
  return response.data;
}

// DELETE
export async function deleteCourse(id: string): Promise<void> {
  await apiClient.delete(`/admin/courses/${id}`);
}

// DELETE MANY
export async function deleteManyCourses(ids: string[]) {
  await Promise.all(ids.map((id) => deleteCourse(id)));
}

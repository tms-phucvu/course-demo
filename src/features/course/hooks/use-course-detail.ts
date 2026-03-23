import { CourseDetails } from "@/features/course-management/types/course.types";
import { getCourseById } from "@/features/course/services/course.service";
import { useQuery } from "@tanstack/react-query";

export const useCourseDetail = (id: string) => {
  return useQuery<CourseDetails>({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });
};

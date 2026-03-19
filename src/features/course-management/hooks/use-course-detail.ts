import { getCourseById } from "@/features/course-management/services/course.service";
import { CourseDetails } from "@/features/course-management/types/course.types";
import { useQuery } from "@tanstack/react-query";

export const useCourseDetail = (id: string) => {
  return useQuery<CourseDetails>({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });
};

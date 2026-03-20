import { updateCourse } from "@/features/course-management/services/course.service";
import {
  CourseDetails,
  UpdateCoursePayload,
} from "@/features/course-management/types/course.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CourseDetails,
    Error,
    { id: string; data: UpdateCoursePayload }
  >({
    mutationFn: ({ id, data }) => updateCourse(id, data),
    onSuccess: (_, variables) => {
      // invalidate list
      queryClient.invalidateQueries({ queryKey: ["courses"] });

      // invalidate detail
      queryClient.invalidateQueries({
        queryKey: ["course", variables.id],
      });

      toast.success("Course updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update course");
    },
  });
};

import { createCourse } from "@/features/course-management/services/course.service";
import {
  CourseDetails,
  CreateCoursePayload,
} from "@/features/course-management/types/course.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<CourseDetails, Error, CreateCoursePayload>({
    mutationFn: (data) => createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create course");
    },
  });
};

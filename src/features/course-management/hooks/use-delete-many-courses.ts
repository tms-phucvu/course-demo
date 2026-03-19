import { deleteManyCourses } from "@/features/course-management/services/course.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteManyCourses = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string[]>({
    mutationFn: (ids) => deleteManyCourses(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

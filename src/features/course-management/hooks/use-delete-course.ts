import { deleteCourse } from "@/features/course-management/services/course.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteCourse(id),
    onSuccess: (_, id) => {
      // invalidate list
      queryClient.invalidateQueries({ queryKey: ["courses"] });

      // remove detail cache
      queryClient.removeQueries({ queryKey: ["course", id] });
    },
  });
};

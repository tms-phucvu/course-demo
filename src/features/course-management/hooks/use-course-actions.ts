import { Course } from "@/features/course/types/course.types";
import { useCallback } from "react";
import { toast } from "sonner";

interface Props {
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  selectedIds: Set<string>;
  clearSelection: () => void;
}

export function useCourseActions({
  setCourses,
  selectedIds,
  clearSelection,
}: Props) {
  const handleDeleteOne = useCallback(
    (id: string) => {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success("Deleted course");
    },
    [setCourses]
  );

  const handleDeleteSelected = useCallback(
    (selectedCount: number) => {
      if (selectedCount === 0) return;

      setCourses((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      clearSelection();
      toast.success(
        `Deleted ${selectedCount} course${selectedCount === 1 ? "" : "s"}`
      );
    },
    [setCourses, selectedIds, clearSelection]
  );

  // handleAddCourse, handleEditCourse soon

  return {
    handleDeleteOne,
    handleDeleteSelected,
  };
}

import { Course } from "@/features/course/types/course.types";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface Props {
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  clearSelection: () => void;
}

export function useCourseDelete({ setCourses, clearSelection }: Props) {
  const [deleteConfirm, setDeleteConfirm] = useState<
    | { type: "one"; id: string; title: string }
    | { type: "selected"; selectedIds: Set<string>; selectedCount: number }
    | null
  >(null);

  const handleDeleteOne = useCallback(
    (id: string, title: string) => {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Deleted "${title}" course`);
    },
    [setCourses]
  );

  const handleDeleteSelected = useCallback(
    (selectedIds: Set<string>, selectedCount: number) => {
      if (selectedCount === 0) return;

      setCourses((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      clearSelection();
      toast.success(
        `Deleted ${selectedCount} course${selectedCount === 1 ? "" : "s"}`
      );
    },
    [setCourses, clearSelection]
  );

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === "one") {
      handleDeleteOne(deleteConfirm.id, deleteConfirm.title);
    } else if (deleteConfirm.type === "selected") {
      handleDeleteSelected(
        deleteConfirm.selectedIds,
        deleteConfirm.selectedCount
      );
    }

    setDeleteConfirm(null);
  };

  return {
    deleteConfirm,
    setDeleteConfirm,

    handleConfirmDelete,
  };
}

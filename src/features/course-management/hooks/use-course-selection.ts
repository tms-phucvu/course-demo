import { Course } from "@/features/course-management/types/course.types";
import { useCallback, useMemo, useState } from "react";

interface Props {
  pageCourses: Course[];
}

export function useCourseSelection({ pageCourses }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelected = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const allPageSelected = useMemo(
    () =>
      pageCourses.length > 0 && pageCourses.every((c) => selectedIds.has(c.id)),
    [pageCourses, selectedIds]
  );

  const handleSelectAllPage = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageCourses.forEach((c) => next.delete(c.id));
      } else {
        pageCourses.forEach((c) => next.add(c.id));
      }
      return next;
    });
  }, [allPageSelected, pageCourses]);

  const selectedCount = selectedIds.size;

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  return {
    selectedIds,
    selectedCount,
    allPageSelected,
    toggleSelected,
    handleSelectAllPage,
    clearSelection,
  };
}

import { Level } from "@/features/course-management/constants/course-management.constants";
import { Course } from "@/features/course/types/course.types";
import { useMemo, useState } from "react";

interface Props {
  courses: Course[];
}

export function useCourseFilter({ courses }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<Level>("all");

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesLevel =
        filterLevel === "all" ? true : course.level === filterLevel;
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.author.toLowerCase().includes(q) ||
        course.level.toLowerCase().includes(q) ||
        course.id.toLowerCase().includes(q);

      return matchesLevel && matchesSearch;
    });
  }, [courses, searchQuery, filterLevel]);

  return {
    searchQuery,
    setSearchQuery,
    filterLevel,
    setFilterLevel,
    filteredCourses,
  };
}

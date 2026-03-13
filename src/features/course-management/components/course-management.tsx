"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/core/lib/utils";
import { CourseDeleteConfirmDialog } from "@/features/course-management/components/course-delete-confirm-dialog";
import {
  Level,
  LEVELS,
} from "@/features/course-management/constants/course-management.constants";
import { useCourseDelete } from "@/features/course-management/hooks/use-course-delete";
import { useCourseFilter } from "@/features/course-management/hooks/use-course-filter";
import { useCoursePagination } from "@/features/course-management/hooks/use-course-pagination";
import { useCourseSelection } from "@/features/course-management/hooks/use-course-selection";
import {
  formatDate,
  getPageNumbers,
} from "@/features/course-management/utils/course-management.utils";
import { MOCK_COURSES } from "@/features/course/mock/course-data";
import { formatDuration } from "@/features/course/utils/course.utils";
import { Link } from "@/i18n";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useState } from "react";

export function CourseManagement() {
  const locale = useLocale();
  const [courses, setCourses] = useState(() => MOCK_COURSES);

  const {
    searchQuery,
    setSearchQuery,
    filterLevel,
    setFilterLevel,
    filteredCourses,
  } = useCourseFilter({ courses });

  const {
    pageCourses,
    currentPage,
    total,
    totalPages,
    startIndex,
    endIndex,
    handlePrev,
    handleNext,
    handleGoToPage,
  } = useCoursePagination({ filteredCourses });

  const {
    selectedIds,
    selectedCount,
    allPageSelected,
    toggleSelected,
    handleSelectAllPage,
    clearSelection,
  } = useCourseSelection({ pageCourses });

  const { deleteConfirm, setDeleteConfirm, handleConfirmDelete } =
    useCourseDelete({
      setCourses,
      clearSelection,
    });

  return (
    <div className='CourseList flex w-full flex-col gap-6'>
      {/* Header Section */}
      <header className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <Input
            type='search'
            placeholder='Search courses...'
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className='min-w-60'
            aria-label='Search courses'
          />
          <Select
            value={filterLevel}
            onValueChange={(value) => setFilterLevel(value as Level)}
          >
            <SelectTrigger className='h-9 w-40'>
              <SelectValue placeholder='All levels' />
            </SelectTrigger>

            <SelectContent>
              {LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level === "all" ? "All levels" : level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          <Link href={"./courses/create"}>
            <Button variant='default' size='sm' onClick={() => {}}>
              <Plus className='mr-2 size-4' aria-hidden />
              Add course
            </Button>
          </Link>

          <Button
            variant='destructive'
            size='sm'
            onClick={() =>
              setDeleteConfirm({ type: "selected", selectedIds, selectedCount })
            }
            disabled={selectedCount === 0}
          >
            <Trash2 className='mr-2 size-4' aria-hidden />
            Delete {selectedCount > 0 ? `(${selectedCount})` : "selected"}
          </Button>
        </div>
      </header>

      {/* Table Section */}
      <div className='overflow-x-auto rounded-md border'>
        <Table className='min-w-170'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-12'>
                <Checkbox
                  checked={allPageSelected}
                  onCheckedChange={() => handleSelectAllPage()}
                  aria-label='Select all courses on this page'
                />
              </TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className='text-right'>Sections</TableHead>
              <TableHead className='text-right'>Lessons</TableHead>
              <TableHead className='text-right'>Duration</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageCourses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className='text-muted-foreground py-8 text-center'
                >
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              pageCourses.map((course) => {
                const isSelected = selectedIds.has(course.id);
                return (
                  <TableRow
                    key={course.id}
                    className={cn(isSelected && "bg-muted/40", "group")}
                  >
                    <TableCell className='w-12'>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          toggleSelected(course.id, checked === true)
                        }
                        aria-label={`Select ${course.title}`}
                      />
                    </TableCell>

                    <TableCell className='min-w-70'>
                      <div className='flex items-center gap-3'>
                        <div className='bg-muted relative h-12 w-16 overflow-hidden rounded-md'>
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            sizes='64px'
                            className='object-cover'
                          />
                        </div>
                        <div className='min-w-0'>
                          <p
                            className='truncate font-medium'
                            title={course.title}
                          >
                            {course.title}
                          </p>
                          <p
                            className='text-muted-foreground truncate text-xs'
                            title={course.author}
                          >
                            {course.author}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{course.level}</TableCell>
                    <TableCell>
                      {formatDate({ value: course.createdAt, locale })}
                    </TableCell>
                    <TableCell className='text-right'>
                      {course.totalSections}
                    </TableCell>
                    <TableCell className='text-right'>
                      {course.totalLessons}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatDuration(course.totalDuration)}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-1'>
                        <Link href={`./courses/edit/${course.id}`}>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {}}
                            aria-label={`Edit ${course.title}`}
                          >
                            <Pencil className='size-4' aria-hidden />
                          </Button>
                        </Link>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() =>
                            setDeleteConfirm({
                              type: "one",
                              id: course.id,
                              title:
                                courses.find((c) => c.id === course.id)
                                  ?.title ?? "",
                            })
                          }
                          aria-label={`Delete ${course.title}`}
                          className='text-destructive hover:text-destructive'
                        >
                          <Trash2 className='size-4' aria-hidden />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for Confirm to Delete Course */}
      <CourseDeleteConfirmDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        isDeletingSelected={deleteConfirm?.type === "selected"}
        selectedCount={selectedCount}
        deletingCourseTitle={
          deleteConfirm?.type === "one" ? deleteConfirm.title : ""
        }
        onConfirm={handleConfirmDelete}
      />

      {/* Pagination Section */}
      {total > 0 && (
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <p className='text-muted-foreground text-sm'>
            Showing {startIndex + 1}–{endIndex} of {total} courses
          </p>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {getPageNumbers({ currentPage, totalPages }).map((page, index) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className='text-muted-foreground px-2 text-sm'
                >
                  …
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? "outline" : "ghost"}
                  size='sm'
                  onClick={() => handleGoToPage(page)}
                >
                  {page}
                </Button>
              )
            )}
            <Button
              variant='outline'
              size='sm'
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { CourseFormValues } from "@/features/course-management/schemas/course.schemas";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LessonDialogContent } from "@/features/course-management/components/dialog/lesson-dialog-content";
import { SortableLessonItem } from "@/features/course-management/components/section-field/sortable-lesson-item";
import { LessonFormValues } from "@/features/course-management/schemas/lesson.schemas";

interface LessonFieldsProps {
  sectionIndex: number;
  control: Control<CourseFormValues>;
}

export function LessonFields({ sectionIndex, control }: LessonFieldsProps) {
  const { fields, append, remove, update, move } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.lessons`,
  });

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [videoId, setVideoId] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddLesson = (lessonValues: LessonFormValues) => {
    if (!lessonValues.videoId.trim()) return;

    append(lessonValues);
    setOpenAdd(false);
  };

  const handleEditLesson = (lessonValues: LessonFormValues) => {
    if (editingIndex === null || !lessonValues.videoId.trim()) return;

    update(editingIndex, lessonValues);
    setEditingIndex(null);
    setOpenEdit(false);
  };

  const openEditDialog = (index: number, videoId: string) => {
    setEditingIndex(index);
    setVideoId(videoId);
    setOpenEdit(true);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((item) => item.id === active.id);
    const newIndex = fields.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    move(oldIndex, newIndex);
  };

  return (
    <div className='flex flex-col gap-3'>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <SortableContext
          items={fields.map((lesson) => lesson.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((lesson, lIndex) => (
            <SortableLessonItem
              key={lesson.id}
              id={lesson.id}
              lesson={lesson}
              index={lIndex}
              openEditDialog={openEditDialog}
              remove={remove}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* ADD LESSON DIALOG */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogTrigger asChild>
          <Button
            type='button'
            variant='ghost'
            className='hover:bg-muted/50 w-full border-2 border-dashed py-6'
          >
            <PlusCircle className='mr-2 h-4 w-4' />
            Add New Lesson
          </Button>
        </DialogTrigger>
        <DialogContent>
          <LessonDialogContent
            videoUrl={""}
            onSave={handleAddLesson}
            onCancel={() => setOpenAdd(false)}
            isAdd
          />
        </DialogContent>
      </Dialog>

      {/* EDIT LESSON DIALOG */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <LessonDialogContent
            videoUrl={`https://www.youtube.com/watch?v=${videoId}`}
            onSave={handleEditLesson}
            onCancel={() => setOpenEdit(false)}
            isAdd={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { CourseFormValues } from "@/features/course-management/schemas/course.schemas";
import {
  Equal,
  Eye,
  Pencil,
  PlayCircle,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LessonDialogContent } from "@/features/course-management/components/lesson-dialog-content";
import { LessonFormValues } from "@/features/course-management/schemas/lesson.schemas";
import { formatVideoDuration } from "@/features/course/utils/course.utils";

interface LessonFieldsProps {
  sectionIndex: number;
  control: Control<CourseFormValues>;
}

export function LessonFields({ sectionIndex, control }: LessonFieldsProps) {
  const { fields, append, remove, update } = useFieldArray({
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

  return (
    <div className='flex flex-col gap-3'>
      {fields.map((lesson, lIndex) => (
        <div
          key={lesson.id}
          className='group hover:border-primary/50 flex items-center gap-3 rounded-lg border p-3 transition-colors'
        >
          <Equal className='text-muted-foreground h-4 w-4 cursor-grab' />

          <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
            <PlayCircle className='text-primary h-5 w-5' />
          </div>

          <div className='flex flex-1 flex-col'>
            <span className='text-sm font-semibold'>{lesson.title}</span>
            <span className='text-muted-foreground text-xs'>
              {`${formatVideoDuration(lesson.duration)} • ${lesson.videoId}`}
            </span>
          </div>

          <div className='flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
            <a
              href={`https://www.youtube.com/watch?v=${lesson.videoId}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button type='button' variant='ghost' size='icon'>
                <Eye className='h-4 w-4' />
              </Button>
            </a>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => openEditDialog(lIndex, lesson.videoId)}
            >
              <Pencil className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => remove(lIndex)}
            >
              <Trash2 className='text-destructive h-4 w-4' />
            </Button>
          </div>
        </div>
      ))}

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

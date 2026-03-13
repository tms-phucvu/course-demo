import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseFormValues } from "@/features/course-management/schemas/course.schemas";
import { GripVertical, PlayCircle, PlusCircle, Trash2 } from "lucide-react";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";

interface LessonFieldsProps {
  sectionIndex: number;
  control: Control<CourseFormValues>;
  register: UseFormRegister<CourseFormValues>;
}

export function LessonFields({
  sectionIndex,
  control,
  register,
}: LessonFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.lessons`,
  });

  return (
    <div className='flex flex-col gap-3'>
      {fields.map((lesson, lIndex) => (
        <div
          key={lesson.id}
          className='group hover:border-primary/50 flex items-center gap-3 rounded-lg border p-3 transition-colors'
        >
          <GripVertical className='text-muted-foreground h-4 w-4 cursor-grab' />
          <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
            <PlayCircle className='text-primary h-5 w-5' />
          </div>
          <Input
            {...register(`sections.${sectionIndex}.lessons.${lIndex}.title`)}
            placeholder='Lesson title'
            className='h-auto flex-1 border-none p-0 focus-visible:ring-0'
          />
          <Button
            variant='ghost'
            size='icon'
            className='opacity-0 transition-opacity group-hover:opacity-100'
            onClick={() => remove(lIndex)}
          >
            <Trash2 className='text-destructive h-4 w-4' />
          </Button>
        </div>
      ))}

      <Button
        type='button'
        variant='ghost'
        className='hover:bg-muted/50 w-full border-2 border-dashed py-6'
        onClick={() => append({ title: "" })}
      >
        <PlusCircle className='mr-2 h-4 w-4' />
        Add New Lesson
      </Button>
    </div>
  );
}

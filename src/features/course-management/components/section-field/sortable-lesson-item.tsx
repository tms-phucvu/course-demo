import { Button } from "@/components/ui/button";
import { LessonFormValues } from "@/features/course-management/schemas/lesson.schemas";
import { formatVideoDuration } from "@/features/course/utils/course.utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Equal, Eye, Pencil, PlayCircle, Trash2 } from "lucide-react";
import { UseFieldArrayRemove } from "react-hook-form";

interface SortableLessonItemProps {
  id: string;
  lesson: LessonFormValues;
  index: number;
  openEditDialog: ({
    index,
    title,
    videoId,
  }: {
    index: number;
    title: string;
    videoId: string;
  }) => void;
  remove: UseFieldArrayRemove;
}

export function SortableLessonItem({
  id,
  lesson,
  index,
  openEditDialog,
  remove,
}: SortableLessonItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='group hover:border-primary/50 flex items-center gap-3 rounded-lg border p-3 transition-colors'
    >
      <span
        {...attributes}
        {...listeners}
        className='text-muted-foreground h-4 w-4 cursor-grab'
      >
        <Equal />
      </span>

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
          onClick={() =>
            openEditDialog({
              index,
              videoId: lesson.videoId,
              title: lesson.title,
            })
          }
        >
          <Pencil className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => remove(index)}
        >
          <Trash2 className='text-destructive h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}

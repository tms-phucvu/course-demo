import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LessonFields } from "@/features/course-management/components/section-field/lesson-fields";
import { CourseFormValues } from "@/features/course-management/schemas/course.schemas";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Control, FieldArrayWithId, UseFormRegister } from "react-hook-form";

interface SortableSectionCardProps {
  section: FieldArrayWithId<CourseFormValues, "sections", "id">;
  index: number;
  register: UseFormRegister<CourseFormValues>;
  removeSection: (index: number) => void;
  control: Control<CourseFormValues>;
}

export function SortableSectionCard({
  section,
  index,
  register,
  removeSection,
  control,
}: SortableSectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      key={section.id}
      ref={setNodeRef}
      style={style}
      className='border shadow-none'
    >
      <div className='bg-border/30 flex items-center gap-3 border-b p-4'>
        <GripVertical
          className='text-foreground/80 h-6 w-6 cursor-grab focus:outline-none'
          {...attributes}
          {...listeners}
        />
        <div className='flex flex-1 flex-col gap-1'>
          <span className='text-primary text-[10px] font-semibold uppercase'>
            Section {index + 1}
          </span>
          <Input
            {...register(`sections.${index}.title`)}
            placeholder='Enter section title...'
            className={
              "h-auto rounded-none border-x-0 border-t-0 border-b-2 px-0 py-0 text-xl! font-semibold shadow-none focus-visible:ring-0"
            }
          />
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => removeSection(index)}
        >
          <Trash2 className='text-destructive h-4 w-4' />
        </Button>
      </div>

      <CardContent className='p-4'>
        <LessonFields sectionIndex={index} control={control} />
      </CardContent>
    </Card>
  );
}

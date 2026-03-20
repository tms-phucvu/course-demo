"use client";

import { Button } from "@/components/ui/button";
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
import { List } from "lucide-react";
import { Control, UseFormRegister, useFieldArray } from "react-hook-form";

import { SortableSectionCard } from "@/features/course-management/components/section-field/sortable-section-card";
import { CourseFormValues } from "@/features/course-management/schemas/course.schemas";

interface CurriculumFormProps {
  register: UseFormRegister<CourseFormValues>;
  control: Control<CourseFormValues>;
}

export function CurriculumForm({ register, control }: CurriculumFormProps) {
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
    move: moveSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const onSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sectionFields.findIndex(
      (section) => section.id === active.id
    );
    const newIndex = sectionFields.findIndex(
      (section) => section.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    moveSection(oldIndex, newIndex);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between font-bold'>
        <div className='flex items-center gap-2'>
          <List className='h-5 w-5' />
          <div>Curriculum structure</div>
        </div>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => appendSection({ title: "", lessons: [] })}
        >
          + Add Section
        </Button>
      </div>

      <div className='space-y-4'>
        <DndContext sensors={sensors} onDragEnd={onSectionDragEnd}>
          <SortableContext
            items={sectionFields.map((section) => section.id)}
            strategy={verticalListSortingStrategy}
          >
            {sectionFields.map((section, sIndex) => (
              <SortableSectionCard
                key={section.id}
                section={section}
                index={sIndex}
                register={register}
                removeSection={removeSection}
                control={control}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

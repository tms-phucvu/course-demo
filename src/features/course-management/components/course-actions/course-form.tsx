"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SortableSectionCard } from "@/features/course-management/components/section-field/sortable-section-card";
import { useCreateCourse } from "@/features/course-management/hooks/use-create-course";
import { useUpdateCourse } from "@/features/course-management/hooks/use-update-course";
import { useUploadFile } from "@/features/course-management/hooks/use-upload-file";
import {
  CourseFormValues,
  courseSchema,
} from "@/features/course-management/schemas/course.schemas";
import {
  isValidImage,
  isValidImageName,
} from "@/features/course-management/utils/course-management.utils";
import { transformCoursePayload } from "@/features/course-management/utils/transform-course.utils";
import { Link, useRouter } from "@/i18n";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, List, Trash2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CourseFormProps {
  courseId?: string;
  formData?: CourseFormValues;
}

function CourseForm({ courseId, formData }: CourseFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
  const { mutate: uploadImage, isPending: isUploadingImage } = useUploadFile();
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: formData || {
      title: "",
      description: "",
      thumbnail: "",
      language: "",
      tags: "",
      requirements: [{ value: "" }],
      learningOutcomes: [{ value: "" }],
      sections: [
        {
          title: "",
          lessons: [],
        },
      ],
    },
  });
  const thumbnail = watch("thumbnail");
  const onClickUpload = () => {
    inputRef.current?.click();
  };
  const onChangeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isValidImage(file)) {
      toast.error("Only accept PNG, JPG, WEBP");
      return;
    }
    uploadImage(file, {
      onSuccess: (res) => {
        setValue("thumbnail", res.url, { shouldValidate: true });
      },
    });
    e.target.value = "";
  };

  function onSubmit(data: CourseFormValues) {
    const dataPayload = transformCoursePayload(data);
    if (!courseId) {
      createCourse(dataPayload, {
        onSuccess: () => {
          router.push(`/courses`);
        },
      });
    } else {
      updateCourse(
        { id: courseId, data: dataPayload },
        {
          onSuccess: () => {
            router.push(`/courses`);
          },
        }
      );
    }
  }

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray<CourseFormValues>({
    control,
    name: "requirements",
  });
  const {
    fields: outcomeFields,
    append: appendOutcome,
    remove: removeOutcome,
  } = useFieldArray<CourseFormValues>({
    control,
    name: "learningOutcomes",
  });

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
    <div className='flex flex-col gap-6 sm:px-16'>
      <h1 className='text-4xl font-bold'>
        {!courseId ? "Create course" : "Edit course"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-10'>
        {/* Basic Information of Course */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-2 font-bold'>
            <Info className='h-5 w-5' />
            <div>Basic Information</div>
          </div>
          <Card className='bg-card mx-auto w-full border pt-4'>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
                <div className='space-y-6 md:col-span-2'>
                  {/* Title */}
                  <Field data-invalid={!!errors.title}>
                    <FieldLabel>Course Title</FieldLabel>
                    <Input
                      placeholder='Enter title...'
                      {...register("title")}
                    />
                    {errors.title && <FieldError errors={[errors.title]} />}
                  </Field>

                  {/* Description */}
                  <Field data-invalid={!!errors.description}>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      rows={4}
                      {...register("description")}
                      placeholder='Enter descriptions...'
                    />
                    {errors.description && (
                      <FieldError errors={[errors.description]} />
                    )}
                  </Field>
                </div>

                {/* Thumbnail */}
                <Field data-invalid={!!errors.thumbnail}>
                  <FieldLabel>Course Thumbnail</FieldLabel>
                  <input
                    ref={inputRef}
                    type='file'
                    accept='image/png, image/jpeg, image/webp'
                    onChange={onChangeUpload}
                    className='hidden'
                  />
                  {thumbnail ? (
                    <div className='relative h-48 w-full overflow-hidden rounded-xl border'>
                      <Image
                        src={
                          isValidImageName(thumbnail)
                            ? thumbnail
                            : "/image/fallback_course.png"
                        }
                        alt='thumbnail'
                        fill
                        className='object-cover'
                      />
                      <Button
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation();
                          setValue("thumbnail", "", { shouldValidate: true });
                        }}
                        className='absolute top-2 right-2 z-10 aspect-square cursor-pointer rounded-full bg-black/60 p-1 text-white hover:bg-black'
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className='group bg-background hover:bg-border relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors'
                      onClick={onClickUpload}
                    >
                      {isUploadingImage ? (
                        <div>loading...</div>
                      ) : (
                        <>
                          <div className='bg-border group-hover:bg-background mb-2 rounded-full p-2'>
                            <UploadCloud className='h-5 w-5 text-slate-600' />
                          </div>
                          <p className='text-xs font-medium text-slate-600'>
                            Choose Image
                          </p>
                          <p className='mt-2 text-center text-[10px] text-slate-400'>
                            {"Recommended: 1600×900px, PNG/JPG (max 2MB)"}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                  {errors.thumbnail && (
                    <FieldError errors={[errors.thumbnail]} />
                  )}
                </Field>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {/* Language */}
                <Field data-invalid={!!errors.language}>
                  <FieldLabel>Language</FieldLabel>
                  <Input
                    {...register("language")}
                    placeholder='Enter language...'
                  />
                  {errors.language && <FieldError errors={[errors.language]} />}
                </Field>

                {/* Level (Select → Controller) */}
                <Controller
                  name='level'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Difficulty Level</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select level' />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value='beginner'>Beginner</SelectItem>
                          <SelectItem value='intermediate'>
                            Intermediate
                          </SelectItem>
                          <SelectItem value='advanced'>Advanced</SelectItem>
                        </SelectContent>
                      </Select>

                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {/* Tags */}
              <Field data-invalid={!!errors.tags}>
                <FieldLabel>Tags</FieldLabel>
                <Input
                  {...register("tags")}
                  placeholder='E.g. React, Next, Typescript, ...'
                />
                <FieldDescription>
                  *Enter tags separated by commas
                </FieldDescription>
                {errors.tags && <FieldError errors={[errors.tags]} />}
              </Field>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Requirements */}
                <Field data-invalid={!!errors.requirements}>
                  <FieldLabel>Requirements</FieldLabel>
                  <div className='space-y-2'>
                    {requirementFields.map((field, index) => (
                      <div key={field.id} className='flex gap-1'>
                        <Input
                          {...register(`requirements.${index}.value`)}
                          placeholder='Enter requirements...'
                        />
                        <Button
                          variant={"ghost"}
                          className='px-2.5'
                          onClick={() => removeRequirement(index)}
                        >
                          <Trash2 className='text-destructive h-5 w-5' />
                        </Button>
                      </div>
                    ))}
                    <button
                      type='button'
                      onClick={() => appendRequirement({ value: "" })}
                      className='text-sm text-blue-600'
                    >
                      + Add requirement
                    </button>
                  </div>

                  {errors.requirements && (
                    <FieldError errors={[errors.requirements]} />
                  )}
                </Field>

                {/* Learning Outcomes */}
                <Field data-invalid={!!errors.learningOutcomes}>
                  <FieldLabel>Learning Outcomes</FieldLabel>
                  <div className='space-y-2'>
                    {outcomeFields.map((field, index) => (
                      <div key={field.id} className='flex gap-1'>
                        <Input
                          {...register(`learningOutcomes.${index}.value`)}
                          placeholder='Enter learning outcomes...'
                        />
                        <Button
                          variant={"ghost"}
                          className='px-2.5'
                          onClick={() => removeOutcome(index)}
                        >
                          <Trash2 className='text-destructive h-5 w-5' />
                        </Button>
                      </div>
                    ))}
                    <button
                      type='button'
                      onClick={() => appendOutcome({ value: "" })}
                      className='text-sm text-blue-600'
                    >
                      + Add outcome
                    </button>
                  </div>

                  {errors.learningOutcomes && (
                    <FieldError errors={[errors.learningOutcomes]} />
                  )}
                </Field>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Curriculum Structure of Course */}
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
        {/* Action for Course Form */}
        <div className='flex justify-end gap-4'>
          <Link href={"/admin/courses"}>
            <Button variant={"outline"}>Cancel</Button>
          </Link>
          {!courseId ? (
            <Button type='submit' disabled={isSubmitting || isCreating}>
              {isCreating ? "Publishing..." : "Publish Course"}
            </Button>
          ) : (
            <Button type='submit' disabled={isSubmitting || isUpdating}>
              {isUpdating ? "Updating..." : "Update Course"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CourseForm;

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
import { LessonFields } from "@/features/course-management/components/lesson-fields";
import {
  CourseFormValues,
  courseSchema,
} from "@/features/course-management/schemas/course.schemas";
import { Link } from "@/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, List, Trash2, UploadCloud } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

function CourseForm() {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      level: "",
      tags: "",
      requirements: [{ value: "" }],
      learningOutcomes: [{ value: "" }],
      sections: [
        {
          title: "Introduction",
          lessons: [{ title: "Welcome to the course" }],
        },
      ],
    },
  });

  function onSubmit(data: CourseFormValues) {
    console.log("data", data);
  }

  const {
    register,
    control,
    formState: { errors },
  } = form;

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
  } = useFieldArray({
    control,
    name: "sections",
  });

  return (
    <div className='flex flex-col gap-6 sm:px-16'>
      <h1 className='text-4xl font-bold'>Create course</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
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
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <FieldLabel>Course Thumbnail</FieldLabel>
                    <div className='group bg-background hover:bg-border relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors'>
                      <div className='bg-border group-hover:bg-background mb-2 rounded-full p-2'>
                        <UploadCloud className='h-5 w-5 text-slate-600' />
                      </div>
                      <p className='text-xs font-medium text-slate-600'>
                        Choose Image
                      </p>
                      <p className='mt-2 text-center text-[10px] text-slate-400'>
                        Recommended: 1600×900px, PNG/JPG (max 2MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {/* Author */}
                <Field data-invalid={!!errors.author}>
                  <FieldLabel>Author</FieldLabel>
                  <Input
                    {...register("author")}
                    placeholder='Enter author...'
                  />
                  {errors.author && <FieldError errors={[errors.author]} />}
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
                          placeholder='Enter requirement'
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
                          placeholder='Enter learning outcome'
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
              onClick={() =>
                appendSection({ title: "", lessons: [{ title: "" }] })
              }
            >
              + Add Section
            </Button>
          </div>

          <div className='space-y-4'>
            {sectionFields.map((section, sIndex) => (
              <Card key={section.id} className='border shadow-none'>
                <div className='bg-border/30 flex items-center gap-3 border-b p-4'>
                  <div className='flex flex-1 flex-col gap-1'>
                    <span className='text-primary text-[10px] font-semibold uppercase'>
                      Section {sIndex + 1}
                    </span>
                    <Input
                      {...register(`sections.${sIndex}.title`)}
                      placeholder='Enter section title...'
                      className={
                        "h-auto rounded-none border-x-0 border-t-0 border-b-2 px-1 py-0 text-xl! font-semibold shadow-none focus-visible:ring-0"
                      }
                    />
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => removeSection(sIndex)}
                  >
                    <Trash2 className='text-destructive h-4 w-4' />
                  </Button>
                </div>

                <CardContent className='p-4'>
                  <LessonFields
                    sectionIndex={sIndex}
                    control={control}
                    register={register}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Action for Course Form */}
        <div className='flex justify-end gap-4'>
          <Link href={"./"}>
            <Button variant={"outline"}>Cancel</Button>
          </Link>
          <Button type='submit' disabled={form.formState.isSubmitting}>
            Publish Course
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;

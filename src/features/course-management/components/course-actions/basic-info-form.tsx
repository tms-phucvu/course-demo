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
import { Info, Trash2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import {
  Controller,
  Control,
  FieldErrors,
  UseFormRegister,
  useFieldArray,
} from "react-hook-form";

import { CourseFormValues } from "@/features/course-management/schemas/course.schemas";
import { isValidImageName } from "@/features/course-management/utils/course-management.utils";

interface BasicInfoFormProps {
  register: UseFormRegister<CourseFormValues>;
  control: Control<CourseFormValues>;
  errors: FieldErrors<CourseFormValues>;
  thumbnail: string;
  isUploadingImage: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onClickUpload: () => void;
  onChangeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearThumbnail: () => void;
}

export function BasicInfoForm({
  register,
  control,
  errors,
  thumbnail,
  isUploadingImage,
  inputRef,
  onClickUpload,
  onChangeUpload,
  onClearThumbnail,
}: BasicInfoFormProps) {
  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "requirements",
  });

  const {
    fields: outcomeFields,
    append: appendOutcome,
    remove: removeOutcome,
  } = useFieldArray({
    control,
    name: "learningOutcomes",
  });

  return (
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
                <Input placeholder='Enter title...' {...register("title")} />
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
                      onClearThumbnail();
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

              {errors.thumbnail && <FieldError errors={[errors.thumbnail]} />}
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

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select level' />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value='beginner'>Beginner</SelectItem>
                      <SelectItem value='intermediate'>Intermediate</SelectItem>
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
            <FieldDescription>*Enter tags separated by commas</FieldDescription>
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
  );
}

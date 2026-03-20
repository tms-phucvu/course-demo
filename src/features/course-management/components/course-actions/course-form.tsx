"use client";

import { Button } from "@/components/ui/button";
import { BasicInfoForm } from "@/features/course-management/components/course-actions/basic-info-form";
import { CurriculumForm } from "@/features/course-management/components/course-actions/curriculum-form";
import { useCreateCourse } from "@/features/course-management/hooks/use-create-course";
import { useUpdateCourse } from "@/features/course-management/hooks/use-update-course";
import { useUploadFile } from "@/features/course-management/hooks/use-upload-file";
import {
  CourseFormValues,
  courseSchema,
} from "@/features/course-management/schemas/course.schemas";
import { isValidImage } from "@/features/course-management/utils/course-management.utils";
import { transformCoursePayload } from "@/features/course-management/utils/transform-course.utils";
import { Link, useRouter } from "@/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
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

  const onClearThumbnail = () => {
    setValue("thumbnail", "", { shouldValidate: true });
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

  return (
    <div className='flex flex-col gap-6 sm:px-16'>
      <h1 className='text-4xl font-bold'>
        {!courseId ? "Create course" : "Edit course"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-10'>
        <BasicInfoForm
          register={register}
          control={control}
          errors={errors}
          thumbnail={thumbnail}
          isUploadingImage={isUploadingImage}
          inputRef={inputRef}
          onClickUpload={onClickUpload}
          onChangeUpload={onChangeUpload}
          onClearThumbnail={onClearThumbnail}
        />
        <CurriculumForm register={register} control={control} />
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

"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoForm } from "@/features/course-management/components/course-actions/basic-info-form";
import { CurriculumForm } from "@/features/course-management/components/course-actions/curriculum-form";
import { useCreateCourse } from "@/features/course-management/hooks/use-create-course";
import { useUpdateCourse } from "@/features/course-management/hooks/use-update-course";
import {
  CourseFormValues,
  courseSchema,
} from "@/features/course-management/schemas/course.schemas";
import { transformCoursePayload } from "@/features/course-management/utils/transform-course.utils";
import { Link, useRouter } from "@/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface CourseFormProps {
  courseId?: string;
  formData?: CourseFormValues;
}

function CourseForm({ courseId, formData }: CourseFormProps) {
  const router = useRouter();
  const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
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
        <Tabs defaultValue='basicInfo'>
          <TabsList className='mb-4'>
            <TabsTrigger value='basicInfo'>Information Course</TabsTrigger>
            <TabsTrigger value='curriculum'>Structure Course</TabsTrigger>
          </TabsList>
          <TabsContent value='basicInfo'>
            <BasicInfoForm
              register={register}
              control={control}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          </TabsContent>
          <TabsContent value='curriculum'>
            <CurriculumForm register={register} control={control} />
          </TabsContent>
        </Tabs>

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

"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  cropImageToBlob,
  ImageDropzone,
  ImageEditorDialog,
  validateFiles,
  type CropData,
} from "@/core/image-handle";
import { cn } from "@/core/lib/utils";
import { Role } from "@/features/auth/types";
import { useUploadImage } from "@/features/course-management/hooks/use-upload-image";
import {
  AVATAR_VALIDATION,
  ROLES,
} from "@/features/user-management/constants/user.constants";
import { CreateUserPayload } from "@/features/user-management/types/user.types";
import {
  AddUserFormData,
  addUserSchema,
} from "@/features/user-management/validations/add-user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (user: CreateUserPayload) => void;
}

export function AddUserModal({
  open,
  onOpenChange,
  onSuccess,
}: AddUserModalProps) {
  const t = useTranslations("userManagement");
  const [cropOpen, setCropOpen] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const { mutateAsync: uploadImage, isPending: isUploadingImage } =
    useUploadImage();

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema) as Resolver<AddUserFormData>,
    defaultValues: {
      name: "",
      email: "",
      role: Role.ADMIN,
      avatarUrl: "",
      password: "",
      confirmPassword: "",
    },
  });

  const avatarUrl = form.watch("avatarUrl");

  const openCropForFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPendingFile(file);
    setObjectUrl(url);
    setAvatarError(null);
    setCropOpen(true);
  }, []);

  const closeCrop = useCallback(() => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(null);
    setPendingFile(null);
    setCropOpen(false);
  }, [objectUrl]);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const { validFiles, errors } = await validateFiles(
        [file],
        AVATAR_VALIDATION
      );

      if (errors.length > 0) {
        setAvatarError(
          errors[0].message.includes("Invalid file type")
            ? t("addUser.invalidImageType")
            : t("addUser.fileTooBig")
        );
        return;
      }

      if (validFiles[0]) {
        setAvatarError(null);
        openCropForFile(validFiles[0]);
      }
    },
    [openCropForFile, t]
  );

  const handleCropApply = useCallback(
    async (cropData: CropData) => {
      if (!pendingFile) return;
      try {
        const blob = await cropImageToBlob(pendingFile, cropData, {
          outputFormat: "image/webp",
          quality: 0.9,
        });
        const url = URL.createObjectURL(blob);
        const prevUrl = form.getValues("avatarUrl");
        if (prevUrl && prevUrl.startsWith("blob:"))
          URL.revokeObjectURL(prevUrl);
        form.setValue("avatarUrl", url);
      } finally {
        closeCrop();
      }
    },
    [pendingFile, closeCrop, form]
  );

  const handleRemoveAvatar = useCallback(() => {
    const prevUrl = form.getValues("avatarUrl");
    if (prevUrl && prevUrl.startsWith("blob:")) URL.revokeObjectURL(prevUrl);
    form.setValue("avatarUrl", "");
    setAvatarError(null);
  }, [form]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        const url = form.getValues("avatarUrl");
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
        form.reset();
        setAvatarError(null);
      }
      onOpenChange(next);
    },
    [form, onOpenChange]
  );

  const onSubmit = useCallback(
    async (data: AddUserFormData) => {
      let finalAvatarUrl = data.avatarUrl || undefined;
      if (data.avatarUrl?.startsWith("blob:")) {
        try {
          const response = await fetch(data.avatarUrl);
          const blob = await response.blob();
          const file = new File([blob], "avatar.webp", { type: "image/webp" });

          const uploadResult = await uploadImage(file);
          finalAvatarUrl = uploadResult.url;
          URL.revokeObjectURL(data.avatarUrl);
        } catch (error) {
          console.error("Upload avatar failed:", error);
          setAvatarError(
            t("addUser.uploadFailed") || "Failed to upload image."
          );
          return;
        }
      }
      const newUser: CreateUserPayload = {
        name: data.name,
        avatarUrl: finalAvatarUrl,
        email: data.email,
        role: data.role,
        password: data.password,
      };

      onSuccess(newUser);
      handleOpenChange(false);
    },
    [uploadImage, onSuccess, handleOpenChange, t]
  );

  const displayUrl = avatarUrl || undefined;
  const showDropzone = !displayUrl;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='AddUserModal max-w-md'>
        <DialogHeader>
          <DialogTitle>{t("addUser.title")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='avatarUrl'
              render={() => (
                <FormItem>
                  <FormLabel>{t("addUser.avatar")}</FormLabel>
                  <div className='flex flex-col gap-2'>
                    {showDropzone ? (
                      <div className='flex justify-center'>
                        <ImageDropzone
                          onDrop={handleDrop}
                          multiple={false}
                          maxSize={AVATAR_VALIDATION.maxSizeInMb * 1024 * 1024}
                          label={t("addUser.chooseImage")}
                          className='flex size-40 min-h-0 shrink-0 items-center justify-center rounded-full border-2 border-dashed p-2'
                        />
                      </div>
                    ) : (
                      <div className='flex flex-col items-center justify-center gap-3'>
                        <Avatar className='border-gray size-40 shrink-0 border'>
                          <AvatarImage
                            src={displayUrl}
                            alt=''
                            className='h-full w-full object-cover'
                          />
                        </Avatar>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={handleRemoveAvatar}
                        >
                          {t("addUser.removeAvatar")}
                        </Button>
                      </div>
                    )}
                    {avatarError && (
                      <p className='text-destructive text-sm'>{avatarError}</p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("addUser.namePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("addUser.emailPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("role")}</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className={cn(
                        "border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors",
                        "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      )}
                      aria-invalid={!!form.formState.errors.role}
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {t(`role_${role.toLocaleLowerCase()}`)}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("addUser.password")}</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder={
                        t("addUser.passwordPlaceholder") || "Enter password"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("addUser.confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder={
                        t("addUser.confirmPasswordPlaceholder") ||
                        "Confirm password"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleOpenChange(false)}
              >
                {t("addUser.cancel")}
              </Button>
              <Button
                type='submit'
                disabled={form.formState.isSubmitting || isUploadingImage}
              >
                {form.formState.isSubmitting || isUploadingImage
                  ? t("addUser.creating")
                  : t("addUser.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>

        <ImageEditorDialog
          open={cropOpen}
          onOpenChange={setCropOpen}
          imageSrc={objectUrl}
          aspectRatio='square'
          onApply={handleCropApply}
          onClose={closeCrop}
          title={t("addUser.cropTitle")}
          applyLabel={t("addUser.cropApply")}
        />
      </DialogContent>
    </Dialog>
  );
}

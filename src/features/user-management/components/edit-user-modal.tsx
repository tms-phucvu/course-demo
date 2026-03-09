"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { PREFECTURES } from "@/features/user-management/constants/prefectures";
import type { ManagementUser } from "@/features/user-management/types";
import {
  addUserSchema,
  type AddUserFormData,
} from "@/features/user-management/validations/add-user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";

const AVATAR_VALIDATION = {
  maxSizeInMb: 2,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFiles: 1,
};

const PLAN_OPTIONS = [
  { value: "free", labelKey: "plan_free" },
  { value: "silver", labelKey: "plan_silver" },
  { value: "gold", labelKey: "plan_gold" },
  { value: "diamond", labelKey: "plan_diamond" },
] as const;

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ManagementUser | null;
  onSave: (user: ManagementUser) => void;
}

export function EditUserModal({
  open,
  onOpenChange,
  user,
  onSave,
}: EditUserModalProps) {
  const t = useTranslations("userManagement");
  const [cropOpen, setCropOpen] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema) as Resolver<AddUserFormData>,
    defaultValues: {
      name: "",
      phone: "",
      plan: "free",
      address: PREFECTURES[0],
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (open && user) {
      form.reset({
        name: user.name,
        phone: user.phone,
        plan: user.plan,
        address: user.address,
        avatarUrl: user.avatarUrl ?? "",
      });
      setAvatarError(null);
    }
  }, [open, user, form]);

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
    (data: AddUserFormData) => {
      if (!user) return;
      const updatedUser: ManagementUser = {
        ...user,
        name: data.name,
        avatarUrl: data.avatarUrl || undefined,
        phone: data.phone,
        plan: data.plan,
        address: data.address,
        updatedAt: new Date().toISOString(),
      };
      onSave(updatedUser);
      handleOpenChange(false);
    },
    [user, onSave, handleOpenChange]
  );

  const displayUrl = avatarUrl || undefined;
  const showDropzone = !displayUrl;

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='EditUserModal max-w-md'>
        <DialogHeader>
          <DialogTitle>{t("editUserModal.title")}</DialogTitle>
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
                          <AvatarImage src={displayUrl} alt='' />
                          <AvatarFallback className='text-lg'>?</AvatarFallback>
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

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("addUser.phonePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='plan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("plan")}</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className={cn(
                        "border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors",
                        "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      )}
                      aria-invalid={!!form.formState.errors.plan}
                    >
                      {PLAN_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className={cn(
                        "border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors",
                        "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      )}
                      aria-invalid={!!form.formState.errors.address}
                    >
                      {PREFECTURES.map((pref) => (
                        <option key={pref} value={pref}>
                          {pref}
                        </option>
                      ))}
                    </select>
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
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? t("editUserModal.saving")
                  : t("editUserModal.save")}
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

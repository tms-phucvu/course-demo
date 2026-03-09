"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateProfileAction } from "../actions";
import { profileSchema, type ProfileFormData } from "../validations";

export function EditProfileForm({
  defaultValues,
}: {
  defaultValues: ProfileFormData;
}) {
  const t = useTranslations("profile.settings.editProfile");
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormData>,
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: defaultValues.name ?? "",
      nameKanji: defaultValues.nameKanji ?? "",
      nameKana: defaultValues.nameKana ?? "",
      phone: defaultValues.phone ?? "",
      country: defaultValues.country ?? "",
      website: defaultValues.website ?? "",
      role: defaultValues.role ?? "",
      company: defaultValues.company ?? "",
      department: defaultValues.department ?? "",
      position: defaultValues.position ?? "",
      postalCode: defaultValues.postalCode ?? "",
      address: defaultValues.address ?? "",
      birthDate: defaultValues.birthDate ?? "",
      gender: defaultValues.gender ?? "",
    },
  });

  async function onSubmit(data: ProfileFormData) {
    setServerError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      (Object.entries(data) as [keyof ProfileFormData, string][]).forEach(
        ([key, value]) => formData.set(key, value ?? "")
      );

      const result = await updateProfileAction({}, formData);

      if (result.success && result.message) {
        toast.success(result.message);
      } else if (result.error) {
        setServerError(result.error);
      } else if (result.errors && Object.keys(result.errors).length > 0) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          const msg = (messages ?? []).join(" ");
          if (msg) {
            form.setError(field as keyof ProfileFormData, { message: msg });
          }
        });
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const fields: {
    name: keyof ProfileFormData;
    labelKey: string;
    placeholderKey: string;
    type?: string;
  }[] = [
    { name: "name", labelKey: "name", placeholderKey: "namePlaceholder" },
    {
      name: "nameKanji",
      labelKey: "nameKanji",
      placeholderKey: "nameKanjiPlaceholder",
    },
    {
      name: "nameKana",
      labelKey: "nameKana",
      placeholderKey: "nameKanaPlaceholder",
    },
    { name: "phone", labelKey: "phone", placeholderKey: "phonePlaceholder" },
    {
      name: "country",
      labelKey: "country",
      placeholderKey: "countryPlaceholder",
    },
    {
      name: "website",
      labelKey: "website",
      placeholderKey: "websitePlaceholder",
      type: "url",
    },
    { name: "role", labelKey: "role", placeholderKey: "rolePlaceholder" },
    {
      name: "company",
      labelKey: "company",
      placeholderKey: "companyPlaceholder",
    },
    {
      name: "department",
      labelKey: "department",
      placeholderKey: "departmentPlaceholder",
    },
    {
      name: "position",
      labelKey: "position",
      placeholderKey: "positionPlaceholder",
    },
    {
      name: "postalCode",
      labelKey: "postalCode",
      placeholderKey: "postalCodePlaceholder",
    },
    {
      name: "address",
      labelKey: "address",
      placeholderKey: "addressPlaceholder",
    },
    {
      name: "birthDate",
      labelKey: "birthDate",
      placeholderKey: "birthDatePlaceholder",
      type: "date",
    },
    {
      name: "gender",
      labelKey: "gender",
      placeholderKey: "genderPlaceholder",
    },
  ];

  return (
    <Card className='edit-profile-form'>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {serverError && (
              <p className='text-destructive text-sm'>{serverError}</p>
            )}

            {fields.map(({ name, labelKey, placeholderKey, type }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(labelKey)}</FormLabel>
                    <FormControl>
                      <Input
                        type={type ?? "text"}
                        placeholder={t(placeholderKey)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button type='submit' disabled={isLoading}>
              {isLoading ? t("saving") : t("save")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

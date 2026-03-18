"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Role } from "@/features/auth/types";
import { Link, useRouter } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFormState } from "../hooks";

export function AdminLoginForm() {
  const t = useTranslations("auth.login");
  const tErrors = useTranslations("auth.errors");
  const tValidation = useTranslations("validation");
  const router = useRouter();
  const formState = useFormState();

  const loginSchema = z.object({
    email: z.string().email(tValidation("email")),
    password: z
      .string()
      .min(1, tValidation("required", { field: t("password") })),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    formState.startSubmit();

    try {
      const result = await signIn("admin-credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        formState.setError(tErrors("invalidCredentials"));
        return;
      }
      const session = await getSession();
      if (session?.user.role !== Role.ADMIN) {
        formState.setError("You don't have admin access");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      formState.setError(tErrors("unknownError"));
    } finally {
      formState.setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-4'>
          {formState.error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{formState.error}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='grid gap-2'>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder={t("emailPlaceholder")}
                    autoComplete='email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='grid gap-2'>
                <div className='flex items-center'>
                  <FormLabel>{t("password")}</FormLabel>
                  <Link
                    href='/forgot-password'
                    className='ml-auto inline-block text-sm underline'
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder={t("passwordPlaceholder")}
                    autoComplete='current-password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full'
            disabled={formState.isLoading}
          >
            {formState.isLoading ? t("submitting") : t("submit")}
          </Button>

          <p className='text-muted-foreground text-xs'>{t("demoHint")}</p>
          <div className='bg-muted/50 text-muted-foreground rounded-md border px-3 py-2 font-mono text-xs'>
            <span className='font-medium'>{t("demoEmail")}:</span>{" "}
            admin@elearning.com
            <br />
            <span className='font-medium'>{t("demoPassword")}:</span> admin123
          </div>
        </div>
      </form>
    </Form>
  );
}

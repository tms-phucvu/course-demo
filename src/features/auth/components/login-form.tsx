"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { useFormState } from "../hooks";
import { GoogleLoginButton } from "./google-login-button";
import { FacebookLoginButton } from "./facebook-login-button";
import { InstagramLoginButton } from "./instagram-login-button";
import { LineLoginButton } from "./line-login-button";
import { SocialLoginDivider } from "./social-login-divider";

export function LoginForm() {
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
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        formState.setError(tErrors("invalidCredentials"));
      } else {
        router.push("/profile");
        router.refresh();
      }
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
            hieu.nguyen2@tomosia.com
            <br />
            <span className='font-medium'>{t("demoPassword")}:</span> tomosia-vn
          </div>

          <SocialLoginDivider />

          <div className='flex justify-center gap-4'>
            <GoogleLoginButton mode='login' disabled={formState.isLoading} />
            <FacebookLoginButton mode='login' disabled={formState.isLoading} />
            <InstagramLoginButton mode='login' disabled={formState.isLoading} />
            <LineLoginButton mode='login' disabled={formState.isLoading} />
          </div>
        </div>

        <div className='mt-4 text-center text-sm'>
          {t("noAccount")}{" "}
          <Link href='/register' className='underline'>
            {t("register")}
          </Link>
        </div>
      </form>
    </Form>
  );
}

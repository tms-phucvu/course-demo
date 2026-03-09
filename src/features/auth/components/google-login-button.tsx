"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/core/lib/utils";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { GoogleIcon } from "./icons/google-icon";

interface GoogleLoginButtonProps {
  mode?: "login" | "register";
  callbackUrl?: string;
  disabled?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export function GoogleLoginButton({
  disabled = false,
  className,
  iconOnly = true,
}: GoogleLoginButtonProps) {
  const t = useTranslations("auth.social");
  const router = useRouter();

  const handleGoogleClick = () => {
    router.push("/doc/login-google");
  };

  if (iconOnly) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn("rounded-full", className)}
        onClick={handleGoogleClick}
        disabled={disabled}
        aria-label={t("continueWithGoogle")}
      >
        <GoogleIcon className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleGoogleClick}
      disabled={disabled}
    >
      <GoogleIcon className="mr-2 h-4 w-4" />
      {t("continueWithGoogle")}
    </Button>
  );
}

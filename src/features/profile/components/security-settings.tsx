"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Smartphone, Monitor, Laptop } from "lucide-react";

type SessionItem = {
  id: string;
  device: string;
  deviceIcon: "Monitor" | "Smartphone" | "Laptop";
  location: string;
  lastActive: string;
  current: boolean;
};

const MOCK_SESSIONS: SessionItem[] = [
  {
    id: "1",
    device: "Chrome on macOS",
    deviceIcon: "Laptop",
    location: "Hanoi, Vietnam",
    lastActive: "Now",
    current: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    deviceIcon: "Smartphone",
    location: "Hanoi, Vietnam",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: "3",
    device: "Chrome on Windows",
    deviceIcon: "Monitor",
    location: "Ho Chi Minh City, Vietnam",
    lastActive: "1 day ago",
    current: false,
  },
];

function DeviceIcon({ type }: { type: SessionItem["deviceIcon"] }) {
  switch (type) {
    case "Smartphone":
      return <Smartphone className='h-4 w-4' />;
    case "Laptop":
      return <Laptop className='h-4 w-4' />;
    default:
      return <Monitor className='h-4 w-4' />;
  }
}

export function SecuritySettings() {
  const t = useTranslations("profile.settings.security");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<"idle" | "scan" | "verify">(
    "idle"
  );
  const [verifyCode, setVerifyCode] = useState("");
  const [sessions, setSessions] = useState<SessionItem[]>(MOCK_SESSIONS);

  const handleEnable2FA = () => setTwoFAStep("scan");

  const handleVerify2FA = () => {
    const code = verifyCode.trim();
    if (code.length !== 6 || !/^\d{6}$/.test(code)) return;
    setTwoFAEnabled(true);
    setTwoFAStep("idle");
    setVerifyCode("");
    toast.success(t("twoFAEnabled"));
  };

  const handleDisable2FA = () => {
    setTwoFAEnabled(false);
    toast.success(t("twoFADisabled"));
  };

  const handleCancel2FASetup = () => {
    setTwoFAStep("idle");
    setVerifyCode("");
  };

  const handleRevokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success(t("sessionRevoked"));
  };

  return (
    <div className='security-settings space-y-6'>
      {/* 2FA Card */}
      <Card className='security-settings-2fa'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shield className='h-5 w-5' />
            {t("twoFactor")}
          </CardTitle>
          <CardDescription>{t("twoFactorDescription")}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-muted-foreground text-sm'>
              {t("twoFactorStatus")}:
            </span>
            <span
              className={
                twoFAEnabled
                  ? "bg-primary text-primary-foreground rounded-md px-2 py-0.5 text-xs font-medium"
                  : "bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium"
              }
            >
              {twoFAEnabled ? t("twoFactorStatusOn") : t("twoFactorStatusOff")}
            </span>
            {!twoFAEnabled && twoFAStep === "idle" && (
              <Button size='sm' onClick={handleEnable2FA}>
                {t("enable2FA")}
              </Button>
            )}
            {twoFAEnabled && (
              <Button size='sm' variant='outline' onClick={handleDisable2FA}>
                {t("disable2FA")}
              </Button>
            )}
          </div>

          {(twoFAStep === "scan" || twoFAStep === "verify") && (
            <div className='bg-muted/30 space-y-4 rounded-lg border p-4'>
              {twoFAStep === "scan" && (
                <>
                  <p className='text-sm font-medium'>{t("scanQRCode")}</p>
                  <p className='text-muted-foreground text-xs'>
                    {t("scanQRCodeHint")}
                  </p>
                  <div className='bg-background text-muted-foreground flex h-40 w-40 items-center justify-center rounded border text-center text-xs'>
                    QR code placeholder
                  </div>
                  <div className='flex gap-2'>
                    <Button size='sm' onClick={() => setTwoFAStep("verify")}>
                      {t("enterCode")}
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={handleCancel2FASetup}
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </>
              )}
              {twoFAStep === "verify" && (
                <>
                  <p className='text-sm font-medium'>{t("enterCode")}</p>
                  <div className='flex flex-wrap items-center gap-2'>
                    <Input
                      type='text'
                      inputMode='numeric'
                      maxLength={6}
                      placeholder={t("enterCodePlaceholder")}
                      value={verifyCode}
                      onChange={(e) =>
                        setVerifyCode(e.target.value.replace(/\D/g, ""))
                      }
                      className='w-28'
                    />
                    <Button
                      size='sm'
                      onClick={handleVerify2FA}
                      disabled={verifyCode.length !== 6}
                    >
                      {t("verify")}
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={handleCancel2FASetup}
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sessions Card */}
      <Card className='security-settings-sessions'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Monitor className='h-5 w-5' />
            {t("sessions")}
          </CardTitle>
          <CardDescription>{t("sessionsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className='text-muted-foreground text-sm'>{t("noSessions")}</p>
          ) : (
            <ul className='space-y-3'>
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className='flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3'
                >
                  <div className='flex min-w-0 items-center gap-3'>
                    <div className='bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-md'>
                      <DeviceIcon type={session.deviceIcon} />
                    </div>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium'>
                        {session.device}
                        {session.current && (
                          <span className='bg-muted text-muted-foreground ml-2 rounded px-1.5 py-0.5 text-xs'>
                            {t("thisDevice")}
                          </span>
                        )}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {session.location} · {t("sessionLastActive")}:{" "}
                        {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button
                      size='sm'
                      variant='ghost'
                      className='text-destructive hover:text-destructive'
                      onClick={() => handleRevokeSession(session.id)}
                    >
                      {t("revoke")}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

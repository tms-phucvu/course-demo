"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/core/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export function NotificationSettings() {
  const t = useTranslations("notifications");

  const [sections, setSections] = useState({
    task: true,
    message: true,
    review_pr: true,
    system: true,
  });

  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    sms: false,
  });

  const [frequency, setFrequency] = useState({
    realtime: true,
    daily: false,
    weekly: false,
    quietHours: false,
  });

  const [quietHoursConfig, setQuietHoursConfig] = useState({
    from: "22:00",
    to: "07:00",
    days: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: false,
      sun: false,
    },
  });

  const handleReset = () => {
    setSections({
      task: true,
      message: true,
      review_pr: true,
      system: true,
    });
    setChannels({
      inApp: true,
      email: true,
      sms: false,
    });
    setFrequency({
      realtime: true,
      daily: false,
      weekly: false,
      quietHours: false,
    });
    setQuietHoursConfig({
      from: "22:00",
      to: "07:00",
      days: {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: false,
        sun: false,
      },
    });
  };

  const handleSave = () => {
    toast.success(t("settingsSaveSuccess"));
  };

  return (
    <div className='NotificationSettings mx-auto w-full max-w-4xl space-y-4 xl:mt-8'>
      <div className='flex items-start justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>
          {t("settingsTitle")}
        </h1>
      </div>

      <p className='text-muted-foreground text-sm'>
        {t("settingsDescription")}
      </p>

      <Card className='flex flex-col gap-4 border'>
        <CardHeader className='border-gray border-b'>
          <CardTitle className='text-sm font-semibold'>
            {t("settingsSectionTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex items-center justify-between gap-4'>
            <div className='space-y-0.5'>
              <Label className='text-sm font-medium'>
                {t("statusCategory_task")}
              </Label>
              <p className='text-muted-foreground text-xs'>
                {t("settingsSectionTaskHint")}
              </p>
            </div>
            <Switch
              checked={sections.task}
              onCheckedChange={(value: boolean) =>
                setSections((prev) => ({ ...prev, task: value }))
              }
              aria-label={t("settingsToggleLabel", {
                name: t("statusCategory_task"),
              })}
            />
          </div>

          <div className='flex items-center justify-between gap-4'>
            <div className='space-y-0.5'>
              <Label className='text-sm font-medium'>
                {t("statusCategory_message")}
              </Label>
              <p className='text-muted-foreground text-xs'>
                {t("settingsSectionMessageHint")}
              </p>
            </div>
            <Switch
              checked={sections.message}
              onCheckedChange={(value: boolean) =>
                setSections((prev) => ({ ...prev, message: value }))
              }
              aria-label={t("settingsToggleLabel", {
                name: t("statusCategory_message"),
              })}
            />
          </div>

          <div className='flex items-center justify-between gap-4'>
            <div className='space-y-0.5'>
              <Label className='text-sm font-medium'>
                {t("statusCategory_review_pr")}
              </Label>
              <p className='text-muted-foreground text-xs'>
                {t("settingsSectionReviewHint")}
              </p>
            </div>
            <Switch
              checked={sections.review_pr}
              onCheckedChange={(value: boolean) =>
                setSections((prev) => ({ ...prev, review_pr: value }))
              }
              aria-label={t("settingsToggleLabel", {
                name: t("statusCategory_review_pr"),
              })}
            />
          </div>

          <div className='flex items-center justify-between gap-4'>
            <div className='space-y-0.5'>
              <Label className='text-sm font-medium'>
                {t("settingsSectionSystem")}
              </Label>
              <p className='text-muted-foreground text-xs'>
                {t("settingsSectionSystemHint")}
              </p>
            </div>
            <Switch
              checked={sections.system}
              onCheckedChange={(value: boolean) =>
                setSections((prev) => ({ ...prev, system: value }))
              }
              aria-label={t("settingsToggleLabel", {
                name: t("settingsSectionSystem"),
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className='flex flex-col gap-4 border'>
        <CardHeader className='border-gray border-b'>
          <CardTitle className='text-sm font-semibold'>
            {t("settingsChannelsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex items-center justify-between gap-4'>
            <div className='space-y-0.5'>
              <Label className='text-sm font-medium'>
                {t("settingsChannelInAppTitle")}
              </Label>
              <p className='text-muted-foreground text-xs'>
                {t("settingsChannelInAppDescription")}
              </p>
            </div>
            <Switch
              checked={channels.inApp}
              onCheckedChange={(value: boolean) =>
                setChannels((prev) => ({ ...prev, inApp: value }))
              }
              aria-label={t("settingsToggleLabel", {
                name: t("settingsChannelInAppTitle"),
              })}
            />
          </div>

          <div className='flex items-center justify-between gap-4'>
            <div className='space-y-0.5'>
              <Label className='text-sm font-medium'>
                {t("settingsChannelEmailTitle")}
              </Label>
              <p className='text-muted-foreground text-xs'>
                {t("settingsChannelEmailDescription")}
              </p>
            </div>
            <Switch
              checked={channels.email}
              onCheckedChange={(value: boolean) =>
                setChannels((prev) => ({ ...prev, email: value }))
              }
              aria-label={t("settingsToggleLabel", {
                name: t("settingsChannelEmailTitle"),
              })}
            />
          </div>

          <div className={cn("flex items-center justify-between gap-4")}>
            <div className='space-y-0.5'>
              <Label className='text-sm font-medium'>
                {t("settingsChannelSmsTitle")}
              </Label>
              <p className='text-muted-foreground text-xs'>
                {t("settingsChannelSmsDescription")}
              </p>
            </div>
            <Switch
              checked={channels.sms}
              onCheckedChange={(value: boolean) =>
                setChannels((prev) => ({ ...prev, sms: value }))
              }
              aria-label={t("settingsToggleLabel", {
                name: t("settingsChannelSmsTitle"),
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className='flex flex-col gap-4 border'>
        <CardHeader className='border-gray border-b'>
          <CardTitle className='text-sm font-semibold'>
            {t("settingsFrequencyTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex items-center justify-between gap-4'>
            <div className='space-y-0.5'>
              <Label className='text-sm font-medium'>
                {t("settingsFrequencyRealtimeTitle")}
              </Label>
              <p className='text-muted-foreground text-xs'>
                {t("settingsFrequencyRealtimeDescription")}
              </p>
            </div>
            <Switch
              checked={frequency.realtime}
              onCheckedChange={(value: boolean) =>
                setFrequency((prev) => ({ ...prev, realtime: value }))
              }
              aria-label={t("settingsToggleLabel", {
                name: t("settingsFrequencyRealtimeTitle"),
              })}
            />
          </div>

          <div className='flex items-center justify-between gap-4'>
            <div className='space-y-0.5'>
              <Label className='text-sm font-medium'>
                {t("settingsFrequencyDailyTitle")}
              </Label>
              <p className='text-muted-foreground text-xs'>
                {t("settingsFrequencyDailyDescription")}
              </p>
            </div>
            <Switch
              checked={frequency.daily}
              onCheckedChange={(value: boolean) =>
                setFrequency((prev) => ({ ...prev, daily: value }))
              }
              aria-label={t("settingsToggleLabel", {
                name: t("settingsFrequencyDailyTitle"),
              })}
            />
          </div>

          <div className='flex items-center justify-between gap-4'>
            <div className='space-y-0.5'>
              <Label className='text-sm font-medium'>
                {t("settingsFrequencyWeeklyTitle")}
              </Label>
              <p className='text-muted-foreground text-xs'>
                {t("settingsFrequencyWeeklyDescription")}
              </p>
            </div>
            <Switch
              checked={frequency.weekly}
              onCheckedChange={(value: boolean) =>
                setFrequency((prev) => ({ ...prev, weekly: value }))
              }
              aria-label={t("settingsToggleLabel", {
                name: t("settingsFrequencyWeeklyTitle"),
              })}
            />
          </div>

          <div className='flex items-center justify-between gap-4'>
            <div className='space-y-0.5'>
              <Label className='text-sm font-medium'>
                {t("settingsFrequencyQuietHoursTitle")}
              </Label>
              <p className='text-muted-foreground text-xs'>
                {t("settingsFrequencyQuietHoursDescription")}
              </p>
            </div>
            <Switch
              checked={frequency.quietHours}
              onCheckedChange={(value: boolean) =>
                setFrequency((prev) => ({ ...prev, quietHours: value }))
              }
              aria-label={t("settingsToggleLabel", {
                name: t("settingsFrequencyQuietHoursTitle"),
              })}
            />
          </div>
          {frequency.quietHours && (
            <div className='border-border/60 bg-muted/30 space-y-3 rounded-md border border-dashed px-3 py-3'>
              <div className='flex flex-wrap items-center gap-3'>
                <div className='flex items-center gap-2 space-y-1'>
                  <Label className='text-xs font-medium'>
                    {t("settingsQuietHoursFrom")}
                  </Label>
                  <input
                    type='time'
                    value={quietHoursConfig.from}
                    onChange={(e) =>
                      setQuietHoursConfig((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                    className='border-input bg-background focus-visible:ring-ring h-8 rounded-md border px-2 text-xs shadow-sm outline-none focus-visible:ring-1'
                  />
                </div>
                <div className='flex items-center gap-2 space-y-1'>
                  <Label className='text-xs font-medium'>
                    {t("settingsQuietHoursTo")}
                  </Label>
                  <input
                    type='time'
                    value={quietHoursConfig.to}
                    onChange={(e) =>
                      setQuietHoursConfig((prev) => ({
                        ...prev,
                        to: e.target.value,
                      }))
                    }
                    className='border-input bg-background focus-visible:ring-ring h-8 rounded-md border px-2 text-xs shadow-sm outline-none focus-visible:ring-1'
                  />
                </div>
              </div>
              <div className='space-y-1'>
                <Label className='text-xs font-medium'>
                  {t("settingsQuietHoursDays")}
                </Label>
                <div className='flex flex-wrap gap-4 pt-1'>
                  {(
                    [
                      ["mon", "settingsQuietHoursMon"],
                      ["tue", "settingsQuietHoursTue"],
                      ["wed", "settingsQuietHoursWed"],
                      ["thu", "settingsQuietHoursThu"],
                      ["fri", "settingsQuietHoursFri"],
                      ["sat", "settingsQuietHoursSat"],
                      ["sun", "settingsQuietHoursSun"],
                    ] as const
                  ).map(([key, labelKey]) => (
                    <button
                      key={key}
                      type='button'
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
                        quietHoursConfig.days[key]
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground"
                      )}
                      onClick={() =>
                        setQuietHoursConfig((prev) => ({
                          ...prev,
                          days: {
                            ...prev.days,
                            [key]: !prev.days[key],
                          },
                        }))
                      }
                    >
                      <Checkbox
                        checked={quietHoursConfig.days[key]}
                        onCheckedChange={(value) =>
                          setQuietHoursConfig((prev) => ({
                            ...prev,
                            days: {
                              ...prev.days,
                              [key]: value === true,
                            },
                          }))
                        }
                        className='h-4 w-4'
                        aria-hidden
                      />
                      <span>{t(labelKey)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className='flex justify-end gap-2 pt-2'>
        <Button variant='outline' size='sm' onClick={handleReset}>
          {t("settingsReset")}
        </Button>
        <Button variant='default' size='sm' onClick={handleSave}>
          {t("settingsSave")}
        </Button>
      </div>
    </div>
  );
}

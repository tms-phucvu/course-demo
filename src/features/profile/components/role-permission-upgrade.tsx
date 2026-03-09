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
  Dialog,
  DialogContent,
  DialogDescription,
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
import { cn } from "@/core/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Crown, Lock, Minus, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  upgradeRequestSchema,
  type PlanOption,
  type UpgradeRequestFormData,
} from "../validations/upgrade-request.schema";

const CURRENT_PLAN: PlanOption = "gold";

const PLANS: PlanOption[] = ["silver", "gold", "diamond"];

const MOCK_PERMISSIONS: {
  key: string;
  silver: boolean;
  gold: boolean;
  diamond: boolean;
}[] = [
  { key: "permissionProjects", silver: true, gold: true, diamond: true },
  { key: "permissionExport", silver: false, gold: true, diamond: true },
  { key: "permissionApiAccess", silver: false, gold: true, diamond: true },
  {
    key: "permissionPrioritySupport",
    silver: false,
    gold: false,
    diamond: true,
  },
  { key: "permissionCustomReports", silver: false, gold: false, diamond: true },
  {
    key: "permissionUnlimitedStorage",
    silver: false,
    gold: false,
    diamond: true,
  },
];

function PlanCell({
  value,
  isCurrent,
}: {
  value: boolean;
  isCurrent?: boolean;
}) {
  return (
    <td
      className={cn(
        "w-24 py-2 text-center",
        isCurrent && "bg-primary/10 font-medium"
      )}
    >
      {value ? (
        <Check className='mx-auto h-4 w-4 text-green-600' />
      ) : (
        <Minus className='text-muted-foreground mx-auto h-4 w-4' />
      )}
    </td>
  );
}

export function RolePermissionUpgrade() {
  const t = useTranslations("profile.settings.rolePermissionUpgrade");
  const [modalOpen, setModalOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"idle" | "pending">(
    "idle"
  );

  const form = useForm<UpgradeRequestFormData>({
    resolver: zodResolver(upgradeRequestSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      targetPlan: undefined,
      reason: "",
    },
  });

  const onSubmit = (_data: UpgradeRequestFormData) => {
    toast.success(t("requestSent"));
    form.reset({ targetPlan: undefined, reason: "" });
    setModalOpen(false);
    setRequestStatus("pending");
  };

  const handleOpenModal = () => {
    if (requestStatus === "pending") return;
    setModalOpen(true);
  };

  return (
    <div className='role-permission-upgrade space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Lock className='h-5 w-5' />
            {t("title")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm font-medium'>
            {t("currentPlan")}
          </p>
          <p className='mt-1 text-lg font-semibold capitalize'>
            {t(CURRENT_PLAN)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("comparisonTitle")}</CardTitle>
          <CardDescription>{t("comparisonDescription")}</CardDescription>
        </CardHeader>
        <CardContent className='overflow-x-auto'>
          <table className='w-full min-w-[400px] text-sm'>
            <thead>
              <tr className='border-b'>
                <th className='py-2 text-left font-medium'>
                  {t("permission")}
                </th>
                {PLANS.map((plan) => (
                  <th
                    key={plan}
                    className={cn(
                      "w-24 py-2 text-center font-medium",
                      plan === CURRENT_PLAN && "bg-primary/10 text-primary"
                    )}
                  >
                    {t(plan)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_PERMISSIONS.map((row) => (
                <tr key={row.key} className='border-b last:border-0'>
                  <td className='py-2'>{t(row.key)}</td>
                  <PlanCell
                    value={row.silver}
                    isCurrent={CURRENT_PLAN === "silver"}
                  />
                  <PlanCell
                    value={row.gold}
                    isCurrent={CURRENT_PLAN === "gold"}
                  />
                  <PlanCell
                    value={row.diamond}
                    isCurrent={CURRENT_PLAN === "diamond"}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Crown className='h-5 w-5' />
            {t("upgradeTitle")}
          </CardTitle>
          <CardDescription>{t("upgradeDescription")}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {requestStatus === "pending" && (
            <div className='bg-muted/50 rounded-lg border p-3'>
              <span className='rounded bg-amber-500/20 px-2 py-1 text-sm font-medium text-amber-700 dark:text-amber-400'>
                {t("statusPending")}
              </span>
              <p className='text-muted-foreground mt-2 text-xs'>
                {t("statusPendingHint")}
              </p>
            </div>
          )}
          <Button
            type='button'
            onClick={handleOpenModal}
            disabled={requestStatus === "pending"}
          >
            <Sparkles className='mr-2 h-4 w-4' />
            {t("upgradeCta")}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{t("requestUpgradeTitle")}</DialogTitle>
            <DialogDescription>
              {t("requestUpgradeDescription")}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='targetPlan'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("targetPlan")}</FormLabel>
                    <FormControl>
                      <select
                        className='border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:ring-2 focus-visible:outline-none'
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : (e.target.value as PlanOption)
                          )
                        }
                        onBlur={field.onBlur}
                      >
                        <option value=''>{t("targetPlanPlaceholder")}</option>
                        <option value='silver'>{t("silver")}</option>
                        <option value='gold'>{t("gold")}</option>
                        <option value='diamond'>{t("diamond")}</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='reason'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("reason")}</FormLabel>
                    <FormControl>
                      <textarea
                        className='border-input focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:outline-none'
                        placeholder={t("reasonPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end gap-2 pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setModalOpen(false);
                    form.reset();
                  }}
                >
                  {t("cancel")}
                </Button>
                <Button type='submit' disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? t("submitting")
                    : t("submitRequest")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

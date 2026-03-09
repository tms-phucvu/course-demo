import { z } from "zod";

export const PLAN_OPTIONS = ["silver", "gold", "diamond"] as const;
export type PlanOption = (typeof PLAN_OPTIONS)[number];

export const upgradeRequestSchema = z
  .object({
    targetPlan: z.enum(PLAN_OPTIONS).optional(),
    reason: z
      .string()
      .min(1, "Reason is required")
      .min(10, "Please provide at least 10 characters"),
  })
  .refine((data) => data.targetPlan != null && data?.targetPlan !== undefined, {
    message: "Please select a target plan",
    path: ["targetPlan"],
  });

export type UpgradeRequestFormData = z.infer<typeof upgradeRequestSchema>;

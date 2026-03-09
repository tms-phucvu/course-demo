"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import { changePasswordSchema } from "../validations";
import type { ActionState } from "../types";

export async function changePasswordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validated = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    // TODO: Verify currentPassword and update password (e.g. Firebase,
    // or your auth provider). For now return success for demo.
    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (err) {
    console.error("Change password error:", err);
    return { error: "Failed to change password" };
  }
}

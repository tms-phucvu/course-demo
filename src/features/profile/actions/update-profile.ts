"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import { profileSchema } from "../validations";
import type { ActionState } from "../types";

function getStr(formData: FormData, key: string): string | undefined {
  const v = formData.get(key);
  return v === null || v === "" ? undefined : String(v);
}

export async function updateProfileAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const raw = {
    name: getStr(formData, "name"),
    nameKanji: getStr(formData, "nameKanji"),
    nameKana: getStr(formData, "nameKana"),
    phone: getStr(formData, "phone"),
    country: getStr(formData, "country"),
    website: getStr(formData, "website"),
    role: getStr(formData, "role"),
    company: getStr(formData, "company"),
    department: getStr(formData, "department"),
    position: getStr(formData, "position"),
    postalCode: getStr(formData, "postalCode"),
    address: getStr(formData, "address"),
    birthDate: getStr(formData, "birthDate"),
    gender: getStr(formData, "gender"),
  };

  const validated = profileSchema.safeParse({
    ...raw,
    name: raw.name ?? "",
    phone: raw.phone ?? "",
    country: raw.country ?? "",
    website: raw.website ?? "",
    role: raw.role ?? "",
    nameKanji: raw.nameKanji ?? "",
    nameKana: raw.nameKana ?? "",
    company: raw.company ?? "",
    department: raw.department ?? "",
    position: raw.position ?? "",
    postalCode: raw.postalCode ?? "",
    address: raw.address ?? "",
    birthDate: raw.birthDate ?? "",
    gender: raw.gender ?? "",
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    // TODO: Persist to DB (e.g. update user profile by session.user.id)
    return {
      success: true,
      message: "Profile updated successfully",
      data: validated.data as Record<string, unknown>,
    };
  } catch (err) {
    console.error("Update profile error:", err);
    return { error: "Failed to update profile" };
  }
}

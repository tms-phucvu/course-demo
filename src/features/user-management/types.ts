/** User status in the management list */
export type UserStatus = "active" | "requestPlan" | "inactive";

/** Plan type */
export type UserPlan = "free" | "silver" | "gold" | "diamond";

export interface ManagementUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
  phone: string;
  plan: UserPlan;
  address: string; // Japanese prefecture name
  status: UserStatus;
  updatedAt: string; // ISO date string
}

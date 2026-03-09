export type ActionState = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
  data?: Record<string, unknown>;
};

export type User = {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
};

export type AuthError = {
  type: "CredentialsSignin" | "OAuthSignin" | "Default";
  message: string;
};

export type AuthSuccess = {
  user: User;
  redirectTo?: string;
};

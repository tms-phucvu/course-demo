import {
  api,
  ApiError,
  confirmReset,
  resetPassword,
  signInWithEmail,
  signOutUser,
  type FirebaseUser,
} from "@/core/lib";
import { Role } from "@/features/auth/types";
import { ApiAuthResponse } from "@/features/auth/types/api.types";

// ============================================
// INPUT TYPES
// ============================================

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  code: string;
  password: string;
}

// ============================================
// OUTPUT TYPES
// ============================================

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  avatar?: string | null;
  role?: Role;
  accessToken?: string;
}

export interface LoginOutput {
  success: boolean;
  user: AuthUser | null;
  error: string | null;
}

export interface RegisterOutput {
  success: boolean;
  user: AuthUser | null;
  error: string | null;
}

export interface ForgotPasswordOutput {
  success: boolean;
  message: string | null;
  error: string | null;
}

export interface ResetPasswordOutput {
  success: boolean;
  message: string | null;
  error: string | null;
}

export interface LogoutOutput {
  success: boolean;
  error: string | null;
}

// ============================================
// HELPER: Convert Firebase User to AuthUser
// ============================================

function toAuthUser(firebaseUser: FirebaseUser): AuthUser {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
    avatar: firebaseUser.photoURL,
  };
}

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  /**
   * Login with email and password
   * @param input - { email, password }
   * @returns { success, user, error }
   */
  async login(input: LoginInput): Promise<LoginOutput> {
    try {
      const firebaseUser = await signInWithEmail(input.email, input.password);

      return {
        success: true,
        user: toAuthUser(firebaseUser),
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        user: null,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  },

  /**
   * Register new user
   * @param input - { email, password, name }
   * @returns { success, user, error }
   */
  async register(input: RegisterInput): Promise<RegisterOutput> {
    try {
      const response = await api.post<ApiAuthResponse>("auth/register", {
        name: input.name,
        email: input.email,
        password: input.password,
      });

      return {
        success: true,
        user: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          accessToken: response.accessToken,
        },
        error: null,
      };
    } catch (error) {
      const err = error as ApiError;

      return {
        success: false,
        user: null,
        error: err.message || "Registration failed",
      };
    }
  },

  /**
   * Send password reset email
   * @param input - { email }
   * @returns { success, message, error }
   */
  async forgotPassword(
    input: ForgotPasswordInput
  ): Promise<ForgotPasswordOutput> {
    try {
      await resetPassword(input.email);

      return {
        success: true,
        message: "Password reset email sent",
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: null,
        error:
          error instanceof Error ? error.message : "Failed to send reset email",
      };
    }
  },

  /**
   * Reset password with code
   * @param input - { code, password }
   * @returns { success, message, error }
   */
  async resetPassword(input: ResetPasswordInput): Promise<ResetPasswordOutput> {
    try {
      await confirmReset(input.code, input.password);

      return {
        success: true,
        message: "Password reset successfully",
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: null,
        error:
          error instanceof Error ? error.message : "Failed to reset password",
      };
    }
  },

  /**
   * Logout current user
   * @returns { success, error }
   */
  async logout(): Promise<LogoutOutput> {
    try {
      await signOutUser();

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Logout failed",
      };
    }
  },
};

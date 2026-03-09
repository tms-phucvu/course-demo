import { setRequestLocale } from "next-intl/server";

interface TestCasePageProps {
  params: Promise<{ locale: string }>;
}

export default async function TestCasePage({ params }: TestCasePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <div className="mb-8">
        <h1 id="test-cases" className="mb-4 scroll-mt-20 text-4xl font-bold tracking-tight">
          Test Cases
        </h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive test cases for the Next.js Authentication Template. Use
          this document to verify all features and functionality.
        </p>
      </div>

      <div className="mt-12 mb-6">
        <h2 id="authentication-flows" className="scroll-mt-20 text-3xl font-bold tracking-tight">
          Authentication Flows
        </h2>
      </div>

      <div className="mt-8 mb-4">
        <h3 id="login" className="scroll-mt-20 text-2xl font-semibold tracking-tight">
          Login
        </h3>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-AUTH-001</td>
              <td className="px-4 py-3">Login with valid credentials</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /login<br />
                2. Enter valid email and password<br />
                3. Click Sign In
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                User is redirected to /dashboard, session is created
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-AUTH-002</td>
              <td className="px-4 py-3">Login with invalid email format</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /login<br />
                2. Enter invalid email format<br />
                3. Click Sign In
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error message displayed, form not submitted
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-AUTH-003</td>
              <td className="px-4 py-3">Login with invalid password</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /login<br />
                2. Enter valid email, invalid password<br />
                3. Click Sign In
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Error message: &quot;Invalid email or password&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-AUTH-004</td>
              <td className="px-4 py-3">Login with empty fields</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /login<br />
                2. Leave fields empty<br />
                3. Click Sign In
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation errors for required fields displayed
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-AUTH-005</td>
              <td className="px-4 py-3">Loading state during login</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /login<br />
                2. Enter credentials<br />
                3. Click Sign In
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Button shows &quot;Signing in...&quot; and is disabled during request
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 mb-4">
        <h3 id="register" className="scroll-mt-20 text-2xl font-semibold tracking-tight">
          Register
        </h3>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-REG-001</td>
              <td className="px-4 py-3">Register with valid data</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Enter name, email, password, confirm password<br />
                3. Click Create Account
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Account created, success message shown, redirect to dashboard
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-REG-002</td>
              <td className="px-4 py-3">Register with existing email</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Enter email that already exists<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Error message: &quot;This email is already registered&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-REG-003</td>
              <td className="px-4 py-3">Password mismatch</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Enter different passwords in password and confirm fields<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Passwords do not match&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-REG-004</td>
              <td className="px-4 py-3">Weak password validation</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Enter password without uppercase/number<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Password must contain at least one uppercase letter and one number&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-REG-005</td>
              <td className="px-4 py-3">Required field validation</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Leave one or more fields empty<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation errors for empty required fields displayed
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 mb-4">
        <h3 id="forgot-password" className="scroll-mt-20 text-2xl font-semibold tracking-tight">
          Forgot Password
        </h3>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-FP-001</td>
              <td className="px-4 py-3">Request password reset with valid email</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /forgot-password<br />
                2. Enter registered email<br />
                3. Click Send Reset Link
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Success message displayed, email sent (if account exists)
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-FP-002</td>
              <td className="px-4 py-3">Request with invalid email format</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /forgot-password<br />
                2. Enter invalid email format<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Please enter a valid email address&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-FP-003</td>
              <td className="px-4 py-3">Request with non-existent email</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /forgot-password<br />
                2. Enter email that doesn&apos;t exist<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Same success message (security: don&apos;t reveal if email exists)
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 mb-4">
        <h3 id="reset-password" className="scroll-mt-20 text-2xl font-semibold tracking-tight">
          Reset Password
        </h3>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-RP-001</td>
              <td className="px-4 py-3">Reset password with valid token</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Click reset link from email<br />
                2. Enter new password and confirm<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Password reset successfully, redirect to login
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-RP-002</td>
              <td className="px-4 py-3">Reset with expired token</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Use expired reset token<br />
                2. Try to reset password
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Error message: &quot;Invalid or expired reset link&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-RP-003</td>
              <td className="px-4 py-3">Password mismatch in reset</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Click reset link<br />
                2. Enter different passwords<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Passwords do not match&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 mb-4">
        <h3 id="otp-verification" className="scroll-mt-20 text-2xl font-semibold tracking-tight">
          OTP Verification
        </h3>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-OTP-001</td>
              <td className="px-4 py-3">Verify with correct OTP</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /otp<br />
                2. Enter 6-digit code from email<br />
                3. Click Verify
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Verification successful, redirect to dashboard
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-OTP-002</td>
              <td className="px-4 py-3">Verify with incorrect OTP</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /otp<br />
                2. Enter wrong 6-digit code<br />
                3. Click Verify
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Error message displayed, verification fails
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-OTP-003</td>
              <td className="px-4 py-3">OTP countdown timer</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /otp<br />
                2. Observe resend button
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Resend button disabled, shows countdown (60s), then enables
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-OTP-004</td>
              <td className="px-4 py-3">Resend OTP code</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /otp<br />
                2. Wait for countdown<br />
                3. Click Resend code
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                New OTP sent, countdown resets to 60s
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-OTP-005</td>
              <td className="px-4 py-3">Invalid OTP length</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /otp<br />
                2. Enter less than 6 digits<br />
                3. Try to submit
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Code must be 6 digits&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 mb-6">
        <h2 id="social-login" className="scroll-mt-20 text-3xl font-bold tracking-tight">
          Social Login
        </h2>
      </div>

      <div className="mt-8 mb-4">
        <h3 id="google-login" className="scroll-mt-20 text-2xl font-semibold tracking-tight">
          Google Login
        </h3>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SOC-001</td>
              <td className="px-4 py-3">Login with Google (new user)</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /login<br />
                2. Click &quot;Continue with Google&quot;<br />
                3. Complete Google OAuth flow
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Account created, user logged in, redirected to dashboard
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SOC-002</td>
              <td className="px-4 py-3">Login with Google (existing user)</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /login<br />
                2. Click &quot;Continue with Google&quot;<br />
                3. Use existing Google account
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                User logged in, redirected to dashboard
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SOC-003</td>
              <td className="px-4 py-3">Cancel Google OAuth</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /login<br />
                2. Click &quot;Continue with Google&quot;<br />
                3. Cancel OAuth flow
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                User remains on login page, no error
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 mb-4">
        <h3 id="facebook-login" className="scroll-mt-20 text-2xl font-semibold tracking-tight">
          Facebook Login
        </h3>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SOC-004</td>
              <td className="px-4 py-3">Login with Facebook</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /login<br />
                2. Click &quot;Continue with Facebook&quot;<br />
                3. Complete Facebook OAuth flow
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                User logged in, redirected to dashboard
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 mb-4">
        <h3 id="instagram-login" className="scroll-mt-20 text-2xl font-semibold tracking-tight">
          Instagram Login
        </h3>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SOC-005</td>
              <td className="px-4 py-3">Login with Instagram</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /login<br />
                2. Click &quot;Continue with Instagram&quot;<br />
                3. Complete Instagram OAuth flow
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                User logged in, redirected to dashboard
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 mb-4">
        <h3 id="line-login" className="scroll-mt-20 text-2xl font-semibold tracking-tight">
          LINE Login
        </h3>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SOC-006</td>
              <td className="px-4 py-3">Login with LINE</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /login<br />
                2. Click &quot;Continue with LINE&quot;<br />
                3. Complete LINE OAuth flow
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                User logged in, redirected to dashboard
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 mb-6">
        <h2 id="protected-routes" className="scroll-mt-20 text-3xl font-bold tracking-tight">
          Protected Routes
        </h2>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-PROT-001</td>
              <td className="px-4 py-3">Access dashboard when authenticated</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Login successfully<br />
                2. Navigate to /dashboard
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Dashboard page loads, user info displayed
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-PROT-002</td>
              <td className="px-4 py-3">Access dashboard when not authenticated</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Logout or clear session<br />
                2. Navigate to /dashboard
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Redirected to /login page
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-PROT-003</td>
              <td className="px-4 py-3">Access auth pages when authenticated</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Login successfully<br />
                2. Navigate to /login or /register
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Redirected to /dashboard
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 mb-6">
        <h2 id="logout" className="scroll-mt-20 text-3xl font-bold tracking-tight">
          Logout
        </h2>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-LOGOUT-001</td>
              <td className="px-4 py-3">Logout successfully</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Login to account<br />
                2. Click Logout button<br />
                3. Confirm logout
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Session cleared, redirected to login page
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-LOGOUT-002</td>
              <td className="px-4 py-3">Logout loading state</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Login to account<br />
                2. Click Logout button
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Button shows &quot;Signing out...&quot; and is disabled during logout
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 mb-6">
        <h2 id="internationalization" className="scroll-mt-20 text-3xl font-bold tracking-tight">
          Internationalization (i18n)
        </h2>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-I18N-001</td>
              <td className="px-4 py-3">Switch to English</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to any page<br />
                2. Switch language to English
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                All text displays in English, URL updates to /en
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-I18N-002</td>
              <td className="px-4 py-3">Switch to Japanese</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to any page<br />
                2. Switch language to Japanese
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                All text displays in Japanese, URL updates to /ja
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-I18N-003</td>
              <td className="px-4 py-3">Language persistence</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Switch language<br />
                2. Navigate to different pages<br />
                3. Refresh page
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Selected language persists across navigation and page refresh
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 mb-6">
        <h2 id="ui-ux" className="scroll-mt-20 text-3xl font-bold tracking-tight">
          UI/UX
        </h2>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-UI-001</td>
              <td className="px-4 py-3">Responsive design - Mobile</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open app on mobile device<br />
                2. Navigate through pages
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                All pages display correctly, forms are usable, buttons accessible
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-UI-002</td>
              <td className="px-4 py-3">Responsive design - Tablet</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open app on tablet device<br />
                2. Navigate through pages
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                All pages display correctly, layout adapts to tablet size
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-UI-003</td>
              <td className="px-4 py-3">Dark mode toggle</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to any page<br />
                2. Toggle dark mode
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Theme switches between light and dark, preference persists
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-UI-004</td>
              <td className="px-4 py-3">Form validation messages</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to any form<br />
                2. Submit with invalid data
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Clear, helpful error messages displayed below each field
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-UI-005</td>
              <td className="px-4 py-3">Loading states</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Perform any action (login, register, etc.)<br />
                2. Observe loading state
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Buttons show loading text, disabled during request, no double submission
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 mb-6">
        <h2 id="form-validation-regex" className="scroll-mt-20 text-3xl font-bold tracking-tight">
          Form Validation & Regex
        </h2>
      </div>

      <div className="mt-8 mb-4">
        <h3 id="email-validation" className="scroll-mt-20 text-2xl font-semibold tracking-tight">
          Email Validation
        </h3>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Regex</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-001</td>
              <td className="px-4 py-3">Valid email format</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                </code>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Email accepted, no validation error
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-002</td>
              <td className="px-4 py-3">Email without @ symbol</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                </code>
                <br />
                <span className="text-xs text-muted-foreground">userexample.com</span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Email không hợp lệ&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-003</td>
              <td className="px-4 py-3">Email without domain</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                </code>
                <br />
                <span className="text-xs text-muted-foreground">user@</span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Email không hợp lệ&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-004</td>
              <td className="px-4 py-3">Email without TLD</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                </code>
                <br />
                <span className="text-xs text-muted-foreground">user@example</span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Email không hợp lệ&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-005</td>
              <td className="px-4 py-3">Empty email field</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  Required field
                </code>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error displayed for required field
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 mb-4">
        <h3 id="password-validation" className="scroll-mt-20 text-2xl font-semibold tracking-tight">
          Password Validation (Regex)
        </h3>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-006</td>
              <td className="px-4 py-3">Valid password (all requirements)</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register or /reset-password<br />
                2. Enter password: Password123<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Password accepted, no validation error
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-007</td>
              <td className="px-4 py-3">Password without uppercase (regex: /[A-Z]/)</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Enter password: password123<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Cần ít nhất 1 chữ hoa&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-008</td>
              <td className="px-4 py-3">Password without lowercase (regex: /[a-z]/)</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Enter password: PASSWORD123<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Cần ít nhất 1 chữ thường&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-009</td>
              <td className="px-4 py-3">Password without number (regex: /[0-9]/)</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Enter password: Password<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Cần ít nhất 1 số&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-010</td>
              <td className="px-4 py-3">Password less than 8 characters</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Enter password: Pass123<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Mật khẩu tối thiểu 8 ký tự&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-011</td>
              <td className="px-4 py-3">Password with only uppercase</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Enter password: PASSWORD123<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Cần ít nhất 1 chữ thường&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-012</td>
              <td className="px-4 py-3">Password with only lowercase</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Enter password: password123<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Cần ít nhất 1 chữ hoa&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-013</td>
              <td className="px-4 py-3">Password with only numbers</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Enter password: 12345678<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Cần ít nhất 1 chữ hoa&quot; and &quot;Cần ít nhất 1 chữ thường&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-014</td>
              <td className="px-4 py-3">Empty password field</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Leave password field empty<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Mật khẩu tối thiểu 8 ký tự&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 mb-4">
        <h3 id="name-validation" className="scroll-mt-20 text-2xl font-semibold tracking-tight">
          Name Validation
        </h3>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-015</td>
              <td className="px-4 py-3">Valid name (2+ characters)</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Enter name: John Doe<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Name accepted, no validation error
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-016</td>
              <td className="px-4 py-3">Name less than 2 characters</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Enter name: J<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Tên tối thiểu 2 ký tự&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-VAL-017</td>
              <td className="px-4 py-3">Empty name field</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to /register<br />
                2. Leave name field empty<br />
                3. Submit form
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Validation error: &quot;Tên tối thiểu 2 ký tự&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 mb-6">
        <h2 id="error-handling" className="scroll-mt-20 text-3xl font-bold tracking-tight">
          Error Handling
        </h2>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-ERR-001</td>
              <td className="px-4 py-3">Network error handling</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Disable network<br />
                2. Try to login or register
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Error message: &quot;Network error. Please try again.&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-ERR-002</td>
              <td className="px-4 py-3">Server error handling</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Simulate server error (500)<br />
                2. Try to perform action
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Error message: &quot;An error occurred. Please try again.&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-ERR-003</td>
              <td className="px-4 py-3">Timeout handling</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Simulate slow network<br />
                2. Wait for timeout
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Appropriate timeout error message displayed
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 mb-6">
        <h2 id="search" className="scroll-mt-20 text-3xl font-bold tracking-tight">
          Search
        </h2>
      </div>
      <div className="not-prose my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Test ID</th>
              <th className="px-4 py-3 text-left font-medium">Test Case</th>
              <th className="px-4 py-3 text-left font-medium">Steps</th>
              <th className="px-4 py-3 text-left font-medium">Expected Result</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-001</td>
              <td className="px-4 py-3">Open search with button</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to any docs page<br />
                2. Click search icon in header
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Search input opens, auto-focused, placeholder shows &quot;Search documentation...&quot;
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-002</td>
              <td className="px-4 py-3">Open search with keyboard shortcut</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Navigate to any docs page<br />
                2. Press Cmd+K (Mac) or Ctrl+K (Windows/Linux)
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Search input opens, auto-focused
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-003</td>
              <td className="px-4 py-3">Search with valid query</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open search<br />
                2. Type &quot;login&quot; (2+ characters)<br />
                3. Observe results
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Dropdown shows matching results with title and section, results are clickable
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-004</td>
              <td className="px-4 py-3">Search with no results</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open search<br />
                2. Type &quot;xyz123nonexistent&quot;<br />
                3. Observe results
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Shows &quot;No results found for...&quot; message
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-005</td>
              <td className="px-4 py-3">Search with less than 2 characters</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open search<br />
                2. Type &quot;l&quot; (1 character)
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                No results dropdown shown (minMatchCharLength: 2)
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-006</td>
              <td className="px-4 py-3">Keyboard navigation - Arrow Down</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open search<br />
                2. Type query with results<br />
                3. Press Arrow Down key
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Selected result moves down, highlighted, scrolls into view if needed
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-007</td>
              <td className="px-4 py-3">Keyboard navigation - Arrow Up</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open search<br />
                2. Type query with results<br />
                3. Press Arrow Up key
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Selected result moves up, highlighted, scrolls into view if needed
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-008</td>
              <td className="px-4 py-3">Keyboard navigation - Enter</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open search<br />
                2. Type query with results<br />
                3. Navigate to a result<br />
                4. Press Enter
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Navigates to selected result page, search closes
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-009</td>
              <td className="px-4 py-3">Close search with Escape</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open search<br />
                2. Press Escape key
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Search closes, query cleared
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-010</td>
              <td className="px-4 py-3">Close search with X button</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open search<br />
                2. Click X button
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Search closes, query cleared
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-011</td>
              <td className="px-4 py-3">Click result navigates</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open search<br />
                2. Type query<br />
                3. Click on a result
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Navigates to selected page, search closes
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-012</td>
              <td className="px-4 py-3">Fuzzy search matching</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open search<br />
                2. Type &quot;instal&quot; (typo of &quot;installation&quot;)
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Still shows &quot;Installation&quot; result (fuzzy matching with threshold 0.3)
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-013</td>
              <td className="px-4 py-3">Search results show section</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open search<br />
                2. Type query<br />
                3. Observe results
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Each result shows title (bold) and section name (smaller, muted)
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">TC-SEARCH-014</td>
              <td className="px-4 py-3">Search results scrollable</td>
              <td className="px-4 py-3 text-muted-foreground">
                1. Open search<br />
                2. Type query with many results<br />
                3. Scroll dropdown
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Results dropdown is scrollable (max-height: 96), all results accessible
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 cursor-not-allowed"
                  aria-label="Test case status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 mb-6">
        <h2 id="notes" className="scroll-mt-20 text-3xl font-bold tracking-tight">
          Notes
        </h2>
      </div>
      <p>
        All test cases are marked as checked by default. The checkboxes are
        disabled and cannot be modified. Use this document as a reference for
        test case coverage.
      </p>
    </article>
  );
}

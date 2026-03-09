import { Link } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

interface DocPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className='prose prose-slate dark:prose-invert max-w-none'>
      <h1 id='introduction'>Introduction</h1>
      <p className='lead'>
        Welcome to the Next.js Authentication Template documentation. This
        template provides a complete authentication solution with multiple
        providers, internationalization, and a modern UI.
      </p>

      <h2 id='screens'>Screens Overview</h2>
      <p>
        The template includes the following screens for authentication and user
        management:
      </p>

      <h3 id='auth-screens'>Authentication Screens</h3>
      <div className='not-prose overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-muted/50 border-b'>
              <th className='px-4 py-3 text-left font-medium'>Screen</th>
              <th className='px-4 py-3 text-left font-medium'>Route</th>
              <th className='px-4 py-3 text-left font-medium'>Component</th>
              <th className='px-4 py-3 text-left font-medium'>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b'>
              <td className='px-4 py-3 font-medium'>Login</td>
              <td className='px-4 py-3'>
                <Link href='/login' className='text-primary hover:underline'>
                  /login
                </Link>
              </td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  LoginForm
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Email/password login with social providers
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3 font-medium'>Register</td>
              <td className='px-4 py-3'>
                <Link href='/register' className='text-primary hover:underline'>
                  /register
                </Link>
              </td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  RegisterForm
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                User registration with validation
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3 font-medium'>Forgot Password</td>
              <td className='px-4 py-3'>
                <Link
                  href='/forgot-password'
                  className='text-primary hover:underline'
                >
                  /forgot-password
                </Link>
              </td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  ForgotPasswordForm
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Send password reset email
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3 font-medium'>Reset Password</td>
              <td className='px-4 py-3'>
                <Link
                  href='/reset-password'
                  className='text-primary hover:underline'
                >
                  /reset-password
                </Link>
              </td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  ResetPasswordForm
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Set new password with token
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3 font-medium'>OTP Verification</td>
              <td className='px-4 py-3'>
                <Link href='/otp' className='text-primary hover:underline'>
                  /otp
                </Link>
              </td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  OtpForm
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                6-digit code verification with 60s countdown
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id='protected-screens'>Protected Screens</h3>
      <div className='not-prose overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-muted/50 border-b'>
              <th className='px-4 py-3 text-left font-medium'>Screen</th>
              <th className='px-4 py-3 text-left font-medium'>Route</th>
              <th className='px-4 py-3 text-left font-medium'>Description</th>
              <th className='px-4 py-3 text-left font-medium'>Auth Required</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b'>
              <td className='px-4 py-3 font-medium'>Dashboard</td>
              <td className='px-4 py-3'>
                <Link
                  href='/dashboard'
                  className='text-primary hover:underline'
                >
                  /dashboard
                </Link>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Main dashboard after login
              </td>
              <td className='px-4 py-3'>
                <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100'>
                  Yes
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id='components'>Auth Components</h2>
      <p>Reusable components available in the auth feature:</p>

      <h3 id='form-components'>Form Components</h3>
      <div className='not-prose overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-muted/50 border-b'>
              <th className='px-4 py-3 text-left font-medium'>Component</th>
              <th className='px-4 py-3 text-left font-medium'>Path</th>
              <th className='px-4 py-3 text-left font-medium'>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  LoginForm
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3 text-xs'>
                features/auth/components/login-form.tsx
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Email/password form with social login buttons
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  RegisterForm
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3 text-xs'>
                features/auth/components/register-form.tsx
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Registration form with password validation
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  ForgotPasswordForm
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3 text-xs'>
                features/auth/components/forgot-password-form.tsx
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Email input to request password reset
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  ResetPasswordForm
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3 text-xs'>
                features/auth/components/reset-password-form.tsx
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                New password form with confirmation
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  OtpForm
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3 text-xs'>
                features/auth/components/otp-form.tsx
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                6-digit OTP input with countdown timer
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id='social-components'>Social Login Components</h3>
      <div className='not-prose overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-muted/50 border-b'>
              <th className='px-4 py-3 text-left font-medium'>Component</th>
              <th className='px-4 py-3 text-left font-medium'>Provider</th>
              <th className='px-4 py-3 text-left font-medium'>Props</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  GoogleLoginButton
                </code>
              </td>
              <td className='px-4 py-3'>Google OAuth</td>
              <td className='text-muted-foreground px-4 py-3 text-xs'>
                mode, callbackUrl, disabled, iconOnly, className
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  FacebookLoginButton
                </code>
              </td>
              <td className='px-4 py-3'>Facebook OAuth</td>
              <td className='text-muted-foreground px-4 py-3 text-xs'>
                mode, callbackUrl, disabled, iconOnly, className
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  InstagramLoginButton
                </code>
              </td>
              <td className='px-4 py-3'>Instagram OAuth</td>
              <td className='text-muted-foreground px-4 py-3 text-xs'>
                mode, callbackUrl, disabled, iconOnly, className
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  LineLoginButton
                </code>
              </td>
              <td className='px-4 py-3'>LINE OAuth</td>
              <td className='text-muted-foreground px-4 py-3 text-xs'>
                mode, callbackUrl, disabled, iconOnly, className
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  SocialLoginDivider
                </code>
              </td>
              <td className='px-4 py-3'>-</td>
              <td className='text-muted-foreground px-4 py-3 text-xs'>
                (no props) - Displays &quot;or continue with&quot;
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id='utility-components'>Utility Components</h3>
      <div className='not-prose overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-muted/50 border-b'>
              <th className='px-4 py-3 text-left font-medium'>Component</th>
              <th className='px-4 py-3 text-left font-medium'>Description</th>
              <th className='px-4 py-3 text-left font-medium'>Props</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  UserButton
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Displays user info or login link
              </td>
              <td className='text-muted-foreground px-4 py-3 text-xs'>
                (no props)
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  LogoutButton
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Sign out button with loading state
              </td>
              <td className='text-muted-foreground px-4 py-3 text-xs'>
                variant, size, showIcon, className
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id='features'>Features</h2>
      <ul>
        <li>
          <strong>Multiple Auth Providers</strong> - Google, Facebook,
          Instagram, LINE, and Credentials
        </li>
        <li>
          <strong>Internationalization</strong> - Built-in support for English
          and Japanese
        </li>
        <li>
          <strong>Modern UI</strong> - Built with Shadcn UI and Tailwind CSS
        </li>
        <li>
          <strong>Form Validation</strong> - Zod schemas with React Hook Form
        </li>
        <li>
          <strong>Type Safety</strong> - Full TypeScript support
        </li>
        <li>
          <strong>Feature-based Architecture</strong> - Organized and scalable
          code structure
        </li>
      </ul>

      <h2 id='next-steps'>Next Steps</h2>
      <p>Ready to get started? Follow these guides:</p>
      <ul>
        <li>
          <Link
            href='/doc/installation'
            className='text-primary hover:underline'
          >
            Installation
          </Link>{" "}
          - Set up the project locally
        </li>
        <li>
          <Link href='/doc/auth/overview'>Authentication Overview</Link> -
          Configure auth providers
        </li>
        <li>
          <Link href='/doc/guides/i18n'>Internationalization Guide</Link> - Add
          more languages
        </li>
      </ul>
    </article>
  );
}

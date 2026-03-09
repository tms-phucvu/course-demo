import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Lightbulb } from "lucide-react";

interface LoginFacebookPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginFacebookPage({
  params,
}: LoginFacebookPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 id="facebook-provider">Facebook Provider</h1>

      <p className="lead">
        Configure Facebook OAuth for authentication in your Next.js application
        using NextAuth.js.
      </p>

      <h2 id="documentation">Documentation</h2>
      <p>
        <a
          href="https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/
        </a>
      </p>

      <h2 id="configuration">Configuration</h2>
      <p>
        <a
          href="https://developers.facebook.com/apps/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://developers.facebook.com/apps/
        </a>
      </p>

      <h2 id="facebook-developer-setup">Facebook Developer Setup</h2>

      <p>Follow these steps to configure Facebook OAuth:</p>

      <h3 id="step-1">Step 1: Create a Facebook App</h3>
      <ol>
        <li>
          Go to{" "}
          <a
            href="https://developers.facebook.com/apps/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook Developers
          </a>
        </li>
        <li>
          Click <strong>Create App</strong>
        </li>
        <li>
          Select <strong>Consumer</strong> or{" "}
          <strong>None (Build something else)</strong>
        </li>
        <li>Enter your app display name and contact email</li>
        <li>
          Click <strong>Create App</strong>
        </li>
      </ol>

      <h3 id="step-2">Step 2: Add Facebook Login Product</h3>
      <ol>
        <li>
          In your app dashboard, find <strong>Facebook Login</strong> and click{" "}
          <strong>Set Up</strong>
        </li>
        <li>
          Select <strong>Web</strong> as the platform
        </li>
        <li>Enter your site URL (e.g., https://your-domain.com)</li>
        <li>
          Click <strong>Save</strong> and continue through the quickstart
        </li>
      </ol>

      <h3 id="step-3">Step 3: Configure OAuth Settings</h3>
      <ol>
        <li>
          Navigate to{" "}
          <strong>Facebook Login → Settings</strong> in the left sidebar
        </li>
        <li>
          Add your <strong>Valid OAuth Redirect URIs</strong>:
        </li>
      </ol>
      <div className="not-prose overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Environment</th>
              <th className="px-4 py-3 text-left font-medium">Redirect URI</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Development</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  http://localhost:3000/api/auth/callback/facebook
                </code>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Production</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  https://YOUR_DOMAIN/api/auth/callback/facebook
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="step-4">Step 4: Get App ID and Secret</h3>
      <ol>
        <li>
          Go to <strong>Settings → Basic</strong> in the left sidebar
        </li>
        <li>
          Copy the <strong>App ID</strong> and <strong>App Secret</strong>
        </li>
        <li>
          Add them to your <code>.env.local</code> file:
        </li>
      </ol>
      <pre>
        <code>{`# .env.local
FACEBOOK_CLIENT_ID=your-app-id
FACEBOOK_CLIENT_SECRET=your-app-secret`}</code>
      </pre>

      <h3 id="step-5">Step 5: Configure App Domains</h3>
      <ol>
        <li>
          In <strong>Settings → Basic</strong>, scroll down to{" "}
          <strong>App Domains</strong>
        </li>
        <li>Add your domain (e.g., your-domain.com)</li>
        <li>
          Add <strong>Privacy Policy URL</strong> and{" "}
          <strong>Terms of Service URL</strong> (required for public apps)
        </li>
        <li>
          Click <strong>Save Changes</strong>
        </li>
      </ol>

      <h3 id="step-6">Step 6: Switch to Live Mode</h3>
      <ol>
        <li>
          At the top of the dashboard, toggle <strong>App Mode</strong> from
          Development to <strong>Live</strong>
        </li>
        <li>Complete any required verification steps</li>
        <li>
          Note: You need a Privacy Policy URL to switch to Live mode
        </li>
      </ol>

      <h2 id="options">Options</h2>
      <p>
        The Facebook Provider comes with a set of default options. You can
        override any of the options to suit your own use case.
      </p>
      <p>
        <a
          href="https://next-auth.js.org/providers/facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook Provider options →
        </a>
      </p>

      <h2 id="example">Example</h2>
      <pre>
        <code>{`// src/core/lib/auth.ts
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
};`}</code>
      </pre>

      <div className="not-prose my-6 rounded-lg border border-primary/50 bg-primary/10 p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">Tip: Development App</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Production applications cannot use localhost URLs to sign in with
              Facebook. You need to use a dedicated development application in
              Facebook to use localhost callback URLs.
            </p>
          </div>
        </div>
      </div>

      <div className="not-prose my-6 rounded-lg border border-primary/50 bg-primary/10 p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">
              Tip: Mobile Email Addresses
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Email address may not be returned for accounts created on mobile.
            </p>
          </div>
        </div>
      </div>

      <h2 id="advanced-configuration">Advanced Configuration</h2>

      <h3 id="request-additional-permissions">
        Request Additional Permissions
      </h3>
      <p>
        You can request additional permissions (scopes) from Facebook:
      </p>
      <pre>
        <code>{`// src/core/lib/auth.ts
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "email,public_profile,user_birthday",
        },
      },
    }),
  ],
};`}</code>
      </pre>

      <h3 id="custom-profile-fields">Custom Profile Fields</h3>
      <p>
        Request specific user profile fields:
      </p>
      <pre>
        <code>{`// src/core/lib/auth.ts
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      userinfo: {
        params: {
          fields: "id,name,email,picture",
        },
      },
    }),
  ],
};`}</code>
      </pre>

      <h2 id="troubleshooting">Troubleshooting</h2>

      <h3 id="common-errors">Common Errors</h3>
      <div className="not-prose overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Error</th>
              <th className="px-4 py-3 text-left font-medium">Solution</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">
                URL Blocked
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Add your redirect URI to Valid OAuth Redirect URIs in Facebook
                Login Settings
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">
                App Not Set Up
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Make sure Facebook Login product is added and configured
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">
                Invalid App ID
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Verify FACEBOOK_CLIENT_ID is correctly set in .env.local
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">
                Cannot use localhost
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Create a separate development app for localhost testing
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">
                Email not returned
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                User may have signed up via phone; handle missing email in your
                app
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="related">Related</h2>
      <ul>
        <li>
          <Link href="/doc/login-google">Google Provider</Link>
        </li>
        <li>
          <Link href="/doc/design-pattern">Authentication Design Pattern</Link>
        </li>
        <li>
          <Link href="/doc/installation">Installation Guide</Link>
        </li>
      </ul>
    </article>
  );
}

import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AlertTriangle, Lightbulb } from "lucide-react";

interface LoginGooglePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginGooglePage({
  params,
}: LoginGooglePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 id="google-provider">Google Provider</h1>

      <p className="lead">
        Configure Google OAuth for authentication in your Next.js application
        using NextAuth.js.
      </p>

      <h2 id="documentation">Documentation</h2>
      <p>
        <a
          href="https://developers.google.com/identity/protocols/oauth2"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://developers.google.com/identity/protocols/oauth2
        </a>
      </p>

      <h2 id="configuration">Configuration</h2>
      <p>
        <a
          href="https://console.developers.google.com/apis/credentials"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://console.developers.google.com/apis/credentials
        </a>
      </p>

      <h2 id="google-console-setup">Google Console Setup</h2>

      <p>Follow these steps to configure Google OAuth:</p>

      <h3 id="step-1">Step 1: Create a Google Cloud Project</h3>
      <ol>
        <li>
          Go to{" "}
          <a
            href="https://console.cloud.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Cloud Console
          </a>
        </li>
        <li>Click on the project dropdown at the top</li>
        <li>Click &quot;New Project&quot;</li>
        <li>Enter a project name and click &quot;Create&quot;</li>
      </ol>

      <h3 id="step-2">Step 2: Configure OAuth Consent Screen</h3>
      <ol>
        <li>
          Navigate to{" "}
          <strong>APIs &amp; Services → OAuth consent screen</strong>
        </li>
        <li>
          Select <strong>External</strong> user type (or Internal for Google
          Workspace)
        </li>
        <li>Fill in the required fields:</li>
      </ol>
      <div className="not-prose overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Field</th>
              <th className="px-4 py-3 text-left font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">App name</td>
              <td className="px-4 py-3 text-muted-foreground">
                Your application name
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">User support email</td>
              <td className="px-4 py-3 text-muted-foreground">
                Your email address
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">
                Developer contact information
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Your email address
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ol start={4}>
        <li>
          Add scopes: <code>email</code>, <code>profile</code>,{" "}
          <code>openid</code>
        </li>
        <li>Save and continue</li>
      </ol>

      <h3 id="step-3">Step 3: Create OAuth Credentials</h3>
      <ol>
        <li>
          Navigate to <strong>APIs &amp; Services → Credentials</strong>
        </li>
        <li>
          Click <strong>+ CREATE CREDENTIALS → OAuth client ID</strong>
        </li>
        <li>
          Select <strong>Web application</strong> as the application type
        </li>
        <li>Enter a name for your OAuth client</li>
        <li>Add Authorized JavaScript origins:</li>
      </ol>
      <div className="not-prose overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Environment</th>
              <th className="px-4 py-3 text-left font-medium">URI</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Development</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  http://localhost:3000
                </code>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Production</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  https://your-domain.com
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="step-4">Step 4: Add Authorized Redirect URIs</h3>
      <p>
        The &quot;Authorized redirect URIs&quot; used when creating the
        credentials must include your full domain and end in the callback path:
      </p>
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
                  http://localhost:3000/api/auth/callback/google
                </code>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Production</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  https://YOUR_DOMAIN/api/auth/callback/google
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="step-5">Step 5: Get Client ID and Secret</h3>
      <ol>
        <li>After creating, copy the Client ID and Client Secret</li>
        <li>
          Add them to your <code>.env.local</code> file:
        </li>
      </ol>
      <pre>
        <code>{`# .env.local
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret`}</code>
      </pre>

      <h2 id="options">Options</h2>
      <p>
        The Google Provider comes with a set of default options. You can
        override any of the options to suit your own use case.
      </p>
      <p>
        <a
          href="https://next-auth.js.org/providers/google"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Provider options →
        </a>
      </p>

      <h2 id="example">Example</h2>
      <pre>
        <code>{`// src/core/lib/auth.ts
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};`}</code>
      </pre>

      <div className="not-prose my-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
          <div>
            <h4 className="font-semibold text-destructive">Warning</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Google only provides Refresh Token to an application the first
              time a user signs in.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              To force Google to re-issue a Refresh Token, the user needs to
              remove the application from their account and sign in again:{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                https://myaccount.google.com/permissions
              </a>
            </p>
          </div>
        </div>
      </div>

      <h3 id="force-refresh-token">Force Refresh Token</h3>
      <p>
        Alternatively, you can pass options in the <code>params</code> object of{" "}
        <code>authorization</code> which will force the Refresh Token to always
        be provided on sign in. However, this will ask all users to confirm if
        they wish to grant your application access every time they sign in.
      </p>
      <p>
        If you need access to the RefreshToken or AccessToken for a Google
        account and you are not using a database to persist user accounts, this
        may be something you need to do.
      </p>
      <pre>
        <code>{`// src/core/lib/auth.ts
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
};`}</code>
      </pre>

      <div className="not-prose my-6 rounded-lg border border-primary/50 bg-primary/10 p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">Tip</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Google also returns a <code>email_verified</code> boolean property
              in the OAuth profile.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              You can use this property to restrict access to people with
              verified accounts at a particular domain.
            </p>
          </div>
        </div>
      </div>

      <h3 id="restrict-domain">Restrict to Verified Domain</h3>
      <pre>
        <code>{`// src/core/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const googleProfile = profile as { email_verified?: boolean; email?: string };
        return (
          googleProfile.email_verified === true &&
          googleProfile.email?.endsWith("@example.com") === true
        );
      }
      return true;
    },
  },
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
                redirect_uri_mismatch
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Check that your redirect URI exactly matches the one in Google
                Console
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">
                Access blocked: App not verified
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Submit your app for verification or add test users in OAuth
                consent screen
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">
                Invalid client_id
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Verify GOOGLE_CLIENT_ID is correctly set in .env.local
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="related">Related</h2>
      <ul>
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

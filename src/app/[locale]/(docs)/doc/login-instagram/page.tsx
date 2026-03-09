import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AlertTriangle, Lightbulb } from "lucide-react";

interface LoginInstagramPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginInstagramPage({
  params,
}: LoginInstagramPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 id="instagram-provider">Instagram Provider</h1>

      <p className="lead">
        Configure Instagram OAuth for authentication in your Next.js
        application using NextAuth.js.
      </p>

      <h2 id="documentation">Documentation</h2>
      <p>
        <a
          href="https://developers.facebook.com/docs/instagram-basic-display-api/getting-started"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://developers.facebook.com/docs/instagram-basic-display-api/getting-started
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

      <div className="not-prose my-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
          <div>
            <h4 className="font-semibold text-destructive">Warning</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Email address is <strong>not</strong> returned by the Instagram
              API. You will need to handle user identification without email.
            </p>
          </div>
        </div>
      </div>

      <div className="not-prose my-6 rounded-lg border border-primary/50 bg-primary/10 p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">
              Tip: HTTPS Required for Localhost
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Instagram display app requires callback URL to be configured in
              your Facebook app and Facebook requires you to use HTTPS even for
              localhost! You need to either add an SSL to your localhost or use
              a proxy such as{" "}
              <a
                href="https://ngrok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                ngrok
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <h2 id="instagram-setup">Instagram Basic Display API Setup</h2>

      <p>Follow these steps to configure Instagram OAuth:</p>

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

      <h3 id="step-2">Step 2: Add Instagram Basic Display Product</h3>
      <ol>
        <li>
          In your app dashboard, scroll down to find{" "}
          <strong>Instagram Basic Display</strong>
        </li>
        <li>
          Click <strong>Set Up</strong>
        </li>
        <li>
          Scroll down and click <strong>Create New App</strong>
        </li>
        <li>Enter a display name for your Instagram app</li>
      </ol>

      <h3 id="step-3">Step 3: Configure Basic Display Settings</h3>
      <ol>
        <li>
          Navigate to{" "}
          <strong>Instagram Basic Display → Basic Display</strong> in the left
          sidebar
        </li>
        <li>Fill in the required URLs:</li>
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
              <td className="px-4 py-3 font-medium">
                Valid OAuth Redirect URIs
              </td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  https://YOUR_DOMAIN/api/auth/callback/instagram
                </code>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Deauthorize Callback URL</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  https://YOUR_DOMAIN/api/auth/callback/instagram/deauthorize
                </code>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Data Deletion Request URL</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  https://YOUR_DOMAIN/api/auth/callback/instagram/delete
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="step-4">Step 4: Setup for Local Development</h3>
      <p>
        Since Instagram requires HTTPS, use ngrok for local development:
      </p>
      <pre>
        <code>{`# Install ngrok
npm install -g ngrok

# Start your Next.js app
npm run dev

# In another terminal, create an HTTPS tunnel
ngrok http 3000`}</code>
      </pre>
      <p>
        Use the HTTPS URL provided by ngrok (e.g.,{" "}
        <code>https://abc123.ngrok.io</code>) as your redirect URI:
      </p>
      <pre>
        <code>{`https://abc123.ngrok.io/api/auth/callback/instagram`}</code>
      </pre>

      <h3 id="step-5">Step 5: Add Test Users</h3>
      <ol>
        <li>
          Go to <strong>Roles → Instagram Testers</strong>
        </li>
        <li>
          Click <strong>Add Instagram Testers</strong>
        </li>
        <li>Enter the Instagram username of your test account</li>
        <li>
          The test user must accept the invitation in their Instagram app:
          <br />
          <strong>
            Settings → Apps and Websites → Tester Invites → Accept
          </strong>
        </li>
      </ol>

      <h3 id="step-6">Step 6: Get App ID and Secret</h3>
      <ol>
        <li>
          Go to <strong>Instagram Basic Display → Basic Display</strong>
        </li>
        <li>
          Copy the <strong>Instagram App ID</strong> and{" "}
          <strong>Instagram App Secret</strong>
        </li>
        <li>
          Add them to your <code>.env.local</code> file:
        </li>
      </ol>
      <pre>
        <code>{`# .env.local
INSTAGRAM_CLIENT_ID=your-instagram-app-id
INSTAGRAM_CLIENT_SECRET=your-instagram-app-secret`}</code>
      </pre>

      <h2 id="options">Options</h2>
      <p>
        The Instagram Provider comes with a set of default options. You can
        override any of the options to suit your own use case.
      </p>
      <p>
        <a
          href="https://next-auth.js.org/providers/instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram Provider options →
        </a>
      </p>

      <h2 id="example">Example</h2>
      <pre>
        <code>{`// src/core/lib/auth.ts
import InstagramProvider from "next-auth/providers/instagram";

export const authOptions: NextAuthOptions = {
  providers: [
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    }),
  ],
};`}</code>
      </pre>

      <h3 id="usage-in-component">Usage in Component</h3>
      <pre>
        <code>{`// src/features/auth/components/social-login-buttons.tsx
"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function InstagramLoginButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signIn("instagram")}
    >
      Sign in with Instagram
    </Button>
  );
}`}</code>
      </pre>

      <h2 id="handling-no-email">Handling No Email</h2>
      <p>
        Since Instagram doesn&apos;t return email, you need to handle user
        identification differently:
      </p>
      <pre>
        <code>{`// src/core/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "instagram") {
        // Instagram doesn't provide email
        // Use the Instagram user ID as unique identifier
        return true;
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "instagram") {
        // Store Instagram-specific data
        token.instagramId = account.providerAccountId;
        token.username = (profile as { username?: string })?.username;
      }
      return token;
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
                Invalid redirect_uri
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Ensure you&apos;re using HTTPS URL in Valid OAuth Redirect URIs
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">
                URL must use HTTPS
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Use ngrok or similar tool to create HTTPS tunnel for localhost
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">
                User is not a tester
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Add the Instagram account as a tester and accept the invitation
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">
                App not approved
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Submit your app for App Review to allow non-testers to login
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">
                Missing product
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Make sure Instagram Basic Display product is added to your
                Facebook app
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="app-review">App Review for Production</h2>
      <p>
        To allow any Instagram user to log in (not just testers), you need to
        submit your app for review:
      </p>
      <ol>
        <li>
          Go to <strong>App Review → Permissions and Features</strong>
        </li>
        <li>
          Request the <code>instagram_graph_user_profile</code> permission
        </li>
        <li>Prepare screenshots and a detailed description of your app</li>
        <li>Submit for review</li>
      </ol>

      <h2 id="related">Related</h2>
      <ul>
        <li>
          <Link href="/doc/login-facebook">Facebook Provider</Link>
        </li>
        <li>
          <Link href="/doc/login-google">Google Provider</Link>
        </li>
        <li>
          <Link href="/doc/login-line">LINE Provider</Link>
        </li>
        <li>
          <Link href="/doc/design-pattern">Authentication Design Pattern</Link>
        </li>
      </ul>
    </article>
  );
}

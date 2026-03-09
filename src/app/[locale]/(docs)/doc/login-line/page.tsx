import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Lightbulb } from "lucide-react";

interface LoginLinePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginLinePage({ params }: LoginLinePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 id="line-provider">LINE Provider</h1>

      <p className="lead">
        Configure LINE OAuth for authentication in your Next.js application
        using NextAuth.js.
      </p>

      <h2 id="documentation">Documentation</h2>
      <p>
        <a
          href="https://developers.line.biz/en/docs/line-login/integrate-line-login/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://developers.line.biz/en/docs/line-login/integrate-line-login/
        </a>
      </p>

      <h2 id="configuration">Configuration</h2>
      <p>
        <a
          href="https://developers.line.biz/console/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://developers.line.biz/console/
        </a>
      </p>

      <h2 id="line-developer-setup">LINE Developer Setup</h2>

      <p>Follow these steps to configure LINE OAuth:</p>

      <h3 id="step-1">Step 1: Create a LINE Developer Account</h3>
      <ol>
        <li>
          Go to{" "}
          <a
            href="https://developers.line.biz/console/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LINE Developers Console
          </a>
        </li>
        <li>Log in with your LINE account</li>
        <li>
          If this is your first time, you&apos;ll need to create a developer
          account
        </li>
      </ol>

      <h3 id="step-2">Step 2: Create a Provider</h3>
      <ol>
        <li>
          In the LINE Developers Console, click <strong>Create</strong> under
          Providers
        </li>
        <li>Enter a provider name (e.g., your company or project name)</li>
        <li>
          Click <strong>Create</strong>
        </li>
      </ol>

      <h3 id="step-3">Step 3: Create a LINE Login Channel</h3>
      <ol>
        <li>
          Select your provider and click <strong>Create a new channel</strong>
        </li>
        <li>
          Select <strong>LINE Login</strong> as the channel type
        </li>
        <li>Fill in the required information:</li>
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
              <td className="px-4 py-3 font-medium">Channel name</td>
              <td className="px-4 py-3 text-muted-foreground">
                Your application name
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Channel description</td>
              <td className="px-4 py-3 text-muted-foreground">
                Brief description of your app
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">App types</td>
              <td className="px-4 py-3 text-muted-foreground">
                Web app (required)
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Email address</td>
              <td className="px-4 py-3 text-muted-foreground">
                Your contact email
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ol start={4}>
        <li>
          Click <strong>Create</strong>
        </li>
      </ol>

      <h3 id="step-4">Step 4: Configure LINE Login Settings</h3>
      <ol>
        <li>
          In your channel settings, go to the <strong>LINE Login</strong> tab
        </li>
        <li>
          Under <strong>Web app</strong>, toggle it to <strong>Enabled</strong>
        </li>
        <li>
          Add the <strong>Callback URL</strong>:
        </li>
      </ol>
      <div className="not-prose overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Environment</th>
              <th className="px-4 py-3 text-left font-medium">Callback URL</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Development</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  http://localhost:3000/api/auth/callback/line
                </code>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Production</td>
              <td className="px-4 py-3">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  https://YOUR_DOMAIN/api/auth/callback/line
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="step-5">Step 5: Get Channel ID and Secret</h3>
      <ol>
        <li>
          Go to the <strong>Basic settings</strong> tab
        </li>
        <li>
          Copy the <strong>Channel ID</strong> and <strong>Channel secret</strong>
        </li>
        <li>
          Add them to your <code>.env.local</code> file:
        </li>
      </ol>
      <pre>
        <code>{`# .env.local
LINE_CLIENT_ID=your-channel-id
LINE_CLIENT_SECRET=your-channel-secret`}</code>
      </pre>

      <h3 id="step-6">Step 6: Apply for Email Permission (Optional)</h3>
      <div className="not-prose my-6 rounded-lg border border-primary/50 bg-primary/10 p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">
              Tip: Email Address Permission
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              To retrieve email address, you need to apply for Email address
              permission. Open LINE Developer Console, go to your Login Channel.
              Scroll down to find <strong>OpenID Connect → Email address permission</strong>.
              Click <strong>Apply</strong> and follow the instructions.
            </p>
          </div>
        </div>
      </div>
      <ol>
        <li>
          In your channel, scroll down to <strong>OpenID Connect</strong>
        </li>
        <li>
          Find <strong>Email address permission</strong>
        </li>
        <li>
          Click <strong>Apply</strong>
        </li>
        <li>
          Fill out the application form explaining why you need email access
        </li>
        <li>Wait for approval (usually takes a few days)</li>
      </ol>

      <h3 id="step-7">Step 7: Publish Your Channel</h3>
      <ol>
        <li>
          Once configured, go to the channel&apos;s main page
        </li>
        <li>
          Change the status from <strong>Developing</strong> to{" "}
          <strong>Published</strong>
        </li>
        <li>Your LINE Login is now ready for production use</li>
      </ol>

      <h2 id="options">Options</h2>
      <p>
        The LINE Provider comes with a set of default options. You can override
        any of the options to suit your own use case.
      </p>
      <p>
        <a
          href="https://next-auth.js.org/providers/line"
          target="_blank"
          rel="noopener noreferrer"
        >
          LINE Provider options →
        </a>
      </p>

      <h2 id="example">Example</h2>
      <pre>
        <code>{`// src/core/lib/auth.ts
import LineProvider from "next-auth/providers/line";

export const authOptions: NextAuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
    }),
  ],
};`}</code>
      </pre>

      <h2 id="advanced-configuration">Advanced Configuration</h2>

      <h3 id="request-additional-scopes">Request Additional Scopes</h3>
      <p>
        By default, LINE Login requests <code>profile</code> and{" "}
        <code>openid</code> scopes. To also request email:
      </p>
      <pre>
        <code>{`// src/core/lib/auth.ts
import LineProvider from "next-auth/providers/line";

export const authOptions: NextAuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "profile openid email",
        },
      },
    }),
  ],
};`}</code>
      </pre>

      <h3 id="bot-link-feature">Bot Link Feature</h3>
      <p>
        If you have a LINE Official Account, you can prompt users to add your
        bot:
      </p>
      <pre>
        <code>{`// src/core/lib/auth.ts
import LineProvider from "next-auth/providers/line";

export const authOptions: NextAuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      authorization: {
        params: {
          bot_prompt: "aggressive", // or "normal"
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
              <td className="px-4 py-3 font-medium">Invalid redirect_uri</td>
              <td className="px-4 py-3 text-muted-foreground">
                Check that your Callback URL exactly matches in LINE Developer
                Console
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Channel not found</td>
              <td className="px-4 py-3 text-muted-foreground">
                Verify LINE_CLIENT_ID is correctly set in .env.local
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Web app not enabled</td>
              <td className="px-4 py-3 text-muted-foreground">
                Enable Web app in LINE Login tab of your channel settings
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Email not returned</td>
              <td className="px-4 py-3 text-muted-foreground">
                Apply for Email address permission and add &quot;email&quot; to
                scope
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-medium">Channel is developing</td>
              <td className="px-4 py-3 text-muted-foreground">
                Publish your channel for production use or add test users
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
          <Link href="/doc/login-facebook">Facebook Provider</Link>
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

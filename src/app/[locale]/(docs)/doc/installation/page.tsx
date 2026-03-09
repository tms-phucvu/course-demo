import { Link } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

interface InstallationPageProps {
  params: Promise<{ locale: string }>;
}

export default async function InstallationPage({
  params,
}: InstallationPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className='prose prose-slate dark:prose-invert max-w-none'>
      <h1 id='installation'>Installation</h1>
      <p className='lead'>
        Get started with the Next.js Authentication Template in just a few
        minutes.
      </p>

      <h2 id='requirements'>Requirements</h2>
      <div className='not-prose overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-muted/50 border-b'>
              <th className='px-4 py-3 text-left font-medium'>Requirement</th>
              <th className='px-4 py-3 text-left font-medium'>Version</th>
              <th className='px-4 py-3 text-left font-medium'>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b'>
              <td className='px-4 py-3 font-medium'>Node.js</td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  &gt;= 18.17
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                LTS version recommended
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3 font-medium'>npm / pnpm / yarn</td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  latest
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Any package manager
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3 font-medium'>Git</td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  latest
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                For cloning the repository
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id='quick-start'>Quick Start</h2>
      <p>Follow these steps to get the template running locally:</p>

      <h3 id='step-1'>Step 1: Clone the Repository</h3>
      <pre>
        <code>{`git clone https://github.com/HieuNT44/next-auth-template.git`}</code>
      </pre>

      <h3 id='step-2'>Step 2: Install Dependencies</h3>
      <pre>
        <code>{`# Using npm
npm install

# Using pnpm
pnpm install

# Using yarn
yarn install`}</code>
      </pre>

      <h3 id='step-3'>Step 3: Configure Environment</h3>
      <p>
        Copy the example environment file and update it with your credentials:
      </p>
      <pre>
        <code>{`cp .env.example .env.local`}</code>
      </pre>

      <h3 id='step-4'>Step 4: Start Development Server</h3>
      <pre>
        <code>{`npm run dev`}</code>
      </pre>
      <p>
        Open{" "}
        <a
          href='http://localhost:3000'
          target='_blank'
          rel='noopener noreferrer'
        >
          http://localhost:3000
        </a>{" "}
        in your browser to see the application.
      </p>

      <h2 id='environment-variables'>Environment Variables</h2>
      <p>
        Configure your authentication providers by updating the{" "}
        <code>.env.local</code> file:
      </p>

      <h3 id='nextauth-config'>NextAuth.js Configuration</h3>
      <div className='not-prose overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-muted/50 border-b'>
              <th className='px-4 py-3 text-left font-medium'>Variable</th>
              <th className='px-4 py-3 text-left font-medium'>Description</th>
              <th className='px-4 py-3 text-left font-medium'>Required</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  NEXTAUTH_SECRET
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Secret key for encrypting sessions
              </td>
              <td className='px-4 py-3'>
                <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100'>
                  Yes
                </span>
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  NEXTAUTH_URL
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Base URL of your application
              </td>
              <td className='px-4 py-3'>
                <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100'>
                  Yes
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id='oauth-providers'>OAuth Providers</h3>
      <div className='not-prose overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-muted/50 border-b'>
              <th className='px-4 py-3 text-left font-medium'>Provider</th>
              <th className='px-4 py-3 text-left font-medium'>Client ID</th>
              <th className='px-4 py-3 text-left font-medium'>Client Secret</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b'>
              <td className='px-4 py-3 font-medium'>Google</td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  GOOGLE_CLIENT_ID
                </code>
              </td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  GOOGLE_CLIENT_SECRET
                </code>
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3 font-medium'>Facebook</td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  FACEBOOK_CLIENT_ID
                </code>
              </td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  FACEBOOK_CLIENT_SECRET
                </code>
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3 font-medium'>Instagram</td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  INSTAGRAM_CLIENT_ID
                </code>
              </td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  INSTAGRAM_CLIENT_SECRET
                </code>
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3 font-medium'>LINE</td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  LINE_CLIENT_ID
                </code>
              </td>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  LINE_CLIENT_SECRET
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id='firebase-config'>Firebase Configuration (Optional)</h3>
      <div className='not-prose overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-muted/50 border-b'>
              <th className='px-4 py-3 text-left font-medium'>Variable</th>
              <th className='px-4 py-3 text-left font-medium'>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  NEXT_PUBLIC_FIREBASE_API_KEY
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Firebase API key
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Firebase auth domain
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  NEXT_PUBLIC_FIREBASE_PROJECT_ID
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Firebase project ID
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id='scripts'>Available Scripts</h2>
      <div className='not-prose overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-muted/50 border-b'>
              <th className='px-4 py-3 text-left font-medium'>Command</th>
              <th className='px-4 py-3 text-left font-medium'>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  npm run dev
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Start development server
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  npm run build
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Build for production
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  npm run start
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Start production server
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  npm run lint
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>Run ESLint</td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  npm run format
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Format code with Prettier
              </td>
            </tr>
            <tr className='border-b'>
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
                  npm run test
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                Run tests with Vitest
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id='next-steps'>Next Steps</h2>
      <p>After installation, explore these guides:</p>
      <ul>
        <li>
          <Link href='/doc'>Introduction</Link> - Overview of the template
        </li>
        <li>
          <Link href='/doc/auth/overview'>Authentication</Link> - Configure auth
          providers
        </li>
        <li>
          <Link href='/doc/guides/i18n'>Internationalization</Link> - Add more
          languages
        </li>
      </ul>
    </article>
  );
}

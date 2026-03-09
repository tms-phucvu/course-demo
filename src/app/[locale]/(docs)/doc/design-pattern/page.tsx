import { setRequestLocale } from "next-intl/server";
import Image from "next/image";

interface DesignPatternPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DesignPatternPage({
  params,
}: DesignPatternPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 id="how-to-implement-authentication">
        How to implement authentication in Next.js
      </h1>

      <p>
        Understanding authentication is crucial for protecting your
        application&apos;s data. This page will guide you through what React and
        Next.js features to use to implement auth.
      </p>

      <p>
        Before starting, it helps to break down the process into three concepts:
      </p>

      <ol>
        <li>
          <strong>
            <a href="#authentication">Authentication</a>
          </strong>
          : Verifies if the user is who they say they are. It requires the user
          to prove their identity with something they have, such as a username
          and password.
        </li>
        <li>
          <strong>
            <a href="#session-management">Session Management</a>
          </strong>
          : Tracks the user&apos;s auth state across requests.
        </li>
        <li>
          <strong>
            <a href="#authorization">Authorization</a>
          </strong>
          : Decides what routes and data the user can access.
        </li>
      </ol>

      <p>
        This diagram shows the authentication flow using React and Next.js
        features:
      </p>

      <div className="not-prose my-6">
        <Image
          src="https://h8DxKfmAPhn8O0p3.public.blob.vercel-storage.com/docs/light/authentication-overview.png"
          alt="Diagram showing the authentication flow with React and Next.js features"
          width={800}
          height={400}
          className="rounded-lg border"
        />
      </div>

      <p>
        The examples on this page walk through basic username and password auth
        for educational purposes. While you can implement a custom auth
        solution, for increased security and simplicity, we recommend using an
        authentication library. These offer built-in solutions for
        authentication, session management, and authorization, as well as
        additional features such as social logins, multi-factor authentication,
        and role-based access control.
      </p>

      <h2 id="authentication">Authentication</h2>

      <h3 id="sign-up-and-login-functionality">
        Sign-up and login functionality
      </h3>

      <p>
        You can use the <code>&lt;form&gt;</code> element with React Hook Form
        and Zod to capture user credentials, validate form fields, and call your
        Authentication Provider&apos;s API.
      </p>

      <p>Here are the steps to implement signup/login functionality:</p>

      <h4 id="capture-user-credentials">1. Capture user credentials</h4>

      <p>
        To capture user credentials, create a form that uses React Hook Form
        with ShadcnUI components:
      </p>

      <pre>
        <code>{`// src/features/auth/components/login-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={formState.isLoading}>
          {t("submit")}
        </Button>
      </form>
    </Form>
  );
}`}</code>
      </pre>

      <h4 id="validate-form-fields">2. Validate form fields on the server</h4>

      <p>
        Use Zod schema to validate the form fields. Define a form schema with
        appropriate error messages using i18n:
      </p>

      <pre>
        <code>{`// src/features/auth/components/login-form.tsx
const loginSchema = z.object({
  email: z.string().email(tValidation("email")),
  password: z.string().min(1, tValidation("required", { field: t("password") })),
});

type LoginFormData = z.infer<typeof loginSchema>;`}</code>
      </pre>

      <p>
        To prevent unnecessary calls to your authentication provider&apos;s
        API, the form validation happens on the client first via{" "}
        <code>zodResolver</code>.
      </p>

      <h4 id="create-user-or-check-credentials">
        3. Create a user or check user credentials
      </h4>

      <p>
        After validating form fields, you can check if the user exists by
        calling NextAuth.js signIn:
      </p>

      <pre>
        <code>{`// src/features/auth/components/login-form.tsx
async function onSubmit(data: LoginFormData) {
  formState.startSubmit();

  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      formState.setError(tErrors("invalidCredentials"));
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  } catch {
    formState.setError(tErrors("unknownError"));
  } finally {
    formState.setLoading(false);
  }
}`}</code>
      </pre>

      <p>
        After successfully verifying the user credentials, NextAuth.js
        automatically creates a session. Continue to the{" "}
        <a href="#session-management">Session Management</a> section to learn
        more.
      </p>

      <blockquote>
        <p>
          <strong>Tips:</strong>
        </p>
        <ul>
          <li>
            Consider using an Auth Library like NextAuth.js to simplify the
            process.
          </li>
          <li>
            To improve the user experience, you may want to check for duplicate
            emails earlier in the registration flow.
          </li>
        </ul>
      </blockquote>

      <h2 id="session-management">Session Management</h2>

      <p>
        Session management ensures that the user&apos;s authenticated state is
        preserved across requests. It involves creating, storing, refreshing,
        and deleting sessions or tokens.
      </p>

      <p>There are two types of sessions:</p>

      <ol>
        <li>
          <strong>
            <a href="#stateless-sessions">Stateless</a>
          </strong>
          : Session data (or a token) is stored in the browser&apos;s cookies.
          The cookie is sent with each request, allowing the session to be
          verified on the server. This method is simpler, but can be less secure
          if not implemented correctly.
        </li>
        <li>
          <strong>
            <a href="#database-sessions">Database</a>
          </strong>
          : Session data is stored in a database, with the user&apos;s browser
          only receiving the encrypted session ID. This method is more secure,
          but can be complex and use more server resources.
        </li>
      </ol>

      <blockquote>
        <p>
          <strong>Good to know:</strong> We recommend using NextAuth.js which
          handles session management automatically.
        </p>
      </blockquote>

      <h3 id="stateless-sessions">Stateless Sessions</h3>

      <p>
        NextAuth.js uses JWT stored in cookies by default. To create and manage
        stateless sessions:
      </p>

      <h4 id="generating-a-secret-key">1. Generating a secret key</h4>

      <p>Generate a secret key to sign your session:</p>

      <pre>
        <code>{`openssl rand -base64 32`}</code>
      </pre>

      <p>Store it in your environment variables file:</p>

      <pre>
        <code>{`# .env.local
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000`}</code>
      </pre>

      <h4 id="encrypting-and-decrypting-sessions">
        2. Encrypting and decrypting sessions
      </h4>

      <p>NextAuth.js automatically handles JWT encryption/decryption:</p>

      <pre>
        <code>{`// src/core/lib/auth.ts
import NextAuth, { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};`}</code>
      </pre>

      <h4 id="setting-cookies">3. Setting cookies (recommended options)</h4>

      <p>
        NextAuth.js automatically sets secure cookies with httpOnly, secure, and
        sameSite options:
      </p>

      <pre>
        <code>{`// src/core/lib/auth.ts
export const authOptions: NextAuthOptions = {
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    },
  },
};`}</code>
      </pre>

      <h4 id="updating-or-refreshing-sessions">
        Updating (or refreshing) sessions
      </h4>

      <p>
        You can extend the session&apos;s expiration time using callbacks:
      </p>

      <pre>
        <code>{`// src/core/lib/auth.ts
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }
    return token;
  },
  async session({ session, token }) {
    session.user.id = token.id as string;
    session.user.role = token.role as string;
    return session;
  },
},`}</code>
      </pre>

      <h4 id="deleting-the-session">Deleting the session</h4>

      <p>To delete the session, use NextAuth.js signOut:</p>

      <pre>
        <code>{`// src/features/auth/components/logout-button.tsx
"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Button onClick={handleLogout} disabled={isLoading}>
      <LogOut className="mr-2 h-4 w-4" />
      {t("logout")}
    </Button>
  );
}`}</code>
      </pre>

      <h3 id="database-sessions">Database Sessions</h3>

      <p>To use database sessions instead of JWT, configure an adapter:</p>

      <pre>
        <code>{`// src/core/lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/core/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
};`}</code>
      </pre>

      <h2 id="authorization">Authorization</h2>

      <p>
        Once a user is authenticated and a session is created, you can implement
        authorization to control what the user can access and do within your
        application.
      </p>

      <p>There are two main types of authorization checks:</p>

      <ol>
        <li>
          <strong>Optimistic</strong>: Checks if the user is authorized to
          access a route or perform an action using the session data stored in
          the cookie. These checks are useful for quick operations, such as
          showing/hiding UI elements or redirecting users based on permissions
          or roles.
        </li>
        <li>
          <strong>Secure</strong>: Checks if the user is authorized to access a
          route or perform an action using the session data stored in the
          database. These checks are more secure and are used for operations
          that require access to sensitive data or actions.
        </li>
      </ol>

      <p>For both cases, we recommend:</p>

      <ul>
        <li>
          Creating a{" "}
          <a href="#creating-a-data-access-layer-dal">Data Access Layer</a> to
          centralize your authorization logic
        </li>
        <li>
          Using{" "}
          <a href="#using-data-transfer-objects-dto">
            Data Transfer Objects (DTO)
          </a>{" "}
          to only return the necessary data
        </li>
        <li>
          Optionally use{" "}
          <a href="#optimistic-checks-with-proxy-optional">Proxy</a> to perform
          optimistic checks.
        </li>
      </ul>

      <h3 id="optimistic-checks-with-proxy-optional">
        Optimistic checks with Proxy (Optional)
      </h3>

      <p>
        There are some cases where you may want to use Proxy and redirect users
        based on permissions:
      </p>

      <ul>
        <li>
          To perform optimistic checks. Since Proxy runs on every route,
          it&apos;s a good way to centralize redirect logic and pre-filter
          unauthorized users.
        </li>
        <li>
          To protect static routes that share data between users (e.g. content
          behind a paywall).
        </li>
      </ul>

      <p>
        However, since Proxy runs on every route, including prefetched routes,
        it&apos;s important to only read the session from the cookie (optimistic
        checks), and avoid database checks to prevent performance issues.
      </p>

      <pre>
        <code>{`// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard", "/settings"];
const authRoutes = ["/login", "/register", "/forgot-password"];

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Redirect to login if not authenticated
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect to dashboard if already authenticated
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};`}</code>
      </pre>

      <p>
        While Proxy can be useful for initial checks, it should not be your only
        line of defense in protecting your data. The majority of security checks
        should be performed as close as possible to your data source, see{" "}
        <a href="#creating-a-data-access-layer-dal">Data Access Layer</a> for
        more information.
      </p>

      <h3 id="creating-a-data-access-layer-dal">
        Creating a Data Access Layer (DAL)
      </h3>

      <p>
        We recommend creating a DAL to centralize your data requests and
        authorization logic.
      </p>

      <p>
        The DAL should include a function that verifies the user&apos;s session
        as they interact with your application. At the very least, the function
        should check if the session is valid, then redirect or return the user
        information needed to make further requests.
      </p>

      <pre>
        <code>{`// src/core/lib/dal.ts
import "server-only";

import { cache } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

export const verifySession = cache(async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return session;
});

export const getUser = cache(async () => {
  const session = await verifySession();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true },
  });

  return user;
});`}</code>
      </pre>

      <p>
        You can then invoke the <code>verifySession()</code> function in your
        Server Components:
      </p>

      <pre>
        <code>{`// app/[locale]/(dashboard)/dashboard/page.tsx
import { verifySession } from "@/core/lib/dal";

export default async function DashboardPage() {
  const session = await verifySession();

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
    </div>
  );
}`}</code>
      </pre>

      <blockquote>
        <p>
          <strong>Tips:</strong>
        </p>
        <ul>
          <li>
            A DAL can be used to protect data fetched at request time. However,
            for static routes that share data between users, data will be
            fetched at build time and not at request time. Use Proxy to protect
            static routes.
          </li>
          <li>
            For secure checks, you can check if the session is valid by
            comparing the session ID with your database. Use React&apos;s cache
            function to avoid unnecessary duplicate requests to the database
            during a render pass.
          </li>
        </ul>
      </blockquote>

      <h3 id="using-data-transfer-objects-dto">
        Using Data Transfer Objects (DTO)
      </h3>

      <p>
        When retrieving data, it&apos;s recommended you return only the
        necessary data that will be used in your application, and not entire
        objects. For example, if you&apos;re fetching user data, you might only
        return the user&apos;s ID and name, rather than the entire user object
        which could contain passwords, phone numbers, etc.
      </p>

      <p>
        However, if you have no control over the returned data structure, or are
        working in a team where you want to avoid whole objects being passed to
        the client, you can use strategies such as specifying what fields are
        safe to be exposed to the client.
      </p>

      <pre>
        <code>{`// src/core/lib/dto.ts
import "server-only";
import { getUser } from "@/core/lib/dal";

function canSeeUsername(viewer: User) {
  return true;
}

function canSeePhoneNumber(viewer: User, team: string) {
  return viewer.isAdmin || team === viewer.team;
}

export async function getProfileDTO(slug: string) {
  const data = await db.user.findMany({
    where: { slug },
  });
  const user = data[0];

  const currentUser = await getUser(user.id);

  return {
    username: canSeeUsername(currentUser) ? user.username : null,
    phonenumber: canSeePhoneNumber(currentUser, user.team)
      ? user.phonenumber
      : null,
  };
}`}</code>
      </pre>

      <p>
        By centralizing your data requests and authorization logic in a DAL and
        using DTOs, you can ensure that all data requests are secure and
        consistent, making it easier to maintain, audit, and debug as your
        application scales.
      </p>

      <blockquote>
        <p>
          <strong>Good to know:</strong>
        </p>
        <ul>
          <li>
            There are a couple of different ways you can define a DTO, from
            using <code>toJSON()</code>, to individual functions like the
            example above, or JS classes. Since these are JavaScript patterns
            and not a React or Next.js feature, we recommend doing some research
            to find the best pattern for your application.
          </li>
        </ul>
      </blockquote>

      <h3 id="server-components">Server Components</h3>

      <p>
        Auth check in Server Components are useful for role-based access. For
        example, to conditionally render components based on the user&apos;s
        role:
      </p>

      <pre>
        <code>{`// app/[locale]/(dashboard)/dashboard/page.tsx
import { verifySession } from "@/core/lib/dal";

export default async function Dashboard() {
  const session = await verifySession();
  const userRole = session?.user?.role;

  if (userRole === "admin") {
    return <AdminDashboard />;
  } else if (userRole === "user") {
    return <UserDashboard />;
  } else {
    redirect("/login");
  }
}`}</code>
      </pre>

      <p>
        In the example, we use the <code>verifySession()</code> function from
        our DAL to check for &apos;admin&apos;, &apos;user&apos;, and
        unauthorized roles. This pattern ensures that each user interacts only
        with components appropriate to their role.
      </p>

      <h3 id="layouts-and-auth-checks">Layouts and auth checks</h3>

      <p>
        Due to Partial Rendering, be cautious when doing checks in Layouts as
        these don&apos;t re-render on navigation, meaning the user session
        won&apos;t be checked on every route change.
      </p>

      <p>
        Instead, you should do the checks close to your data source or the
        component that&apos;ll be conditionally rendered.
      </p>

      <p>
        For example, consider a shared layout that fetches the user data and
        displays the user image in a nav. Instead of doing the auth check in the
        layout, you should fetch the user data (<code>getUser()</code>) in the
        layout and do the auth check in your DAL.
      </p>

      <p>
        This guarantees that wherever <code>getUser()</code> is called within
        your application, the auth check is performed, and prevents developers
        forgetting to check the user is authorized to access the data.
      </p>

      <h4 id="auth-checks-in-page-components">Auth checks in page components</h4>

      <p>
        For example, in a dashboard page, you can verify the user session and
        fetch the user data:
      </p>

      <pre>
        <code>{`// app/[locale]/(dashboard)/dashboard/page.tsx
import { verifySession } from "@/core/lib/dal";

export default async function DashboardPage() {
  const session = await verifySession();

  const user = await getUserData(session.userId);

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
    </div>
  );
}`}</code>
      </pre>

      <h4 id="auth-checks-in-leaf-components">Auth checks in leaf components</h4>

      <p>
        You can also perform auth checks in leaf components that conditionally
        render UI elements based on user permissions. For example, a component
        that displays admin-only actions:
      </p>

      <pre>
        <code>{`// src/features/admin/components/admin-actions.tsx
import { verifySession } from "@/core/lib/dal";
import { Button } from "@/components/ui/button";

export default async function AdminActions() {
  const session = await verifySession();
  const userRole = session?.user?.role;

  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button variant="destructive">Delete User</Button>
      <Button>Edit Settings</Button>
    </div>
  );
}`}</code>
      </pre>

      <p>
        This pattern allows you to show or hide UI elements based on user
        permissions while ensuring the auth check happens at render time in each
        component.
      </p>

      <blockquote>
        <p>
          <strong>Good to know:</strong>
        </p>
        <ul>
          <li>
            A common pattern in SPAs is to <code>return null</code> in a layout
            or a top-level component if a user is not authorized. This pattern
            is <strong>not recommended</strong> since Next.js applications have
            multiple entry points, which will not prevent nested route segments
            and Server Actions from being accessed.
          </li>
          <li>
            Ensure that any Server Actions called from these components also
            perform their own authorization checks, as client-side UI
            restrictions alone are not sufficient for security.
          </li>
        </ul>
      </blockquote>

      <h3 id="server-actions">Server Actions</h3>

      <p>
        Treat Server Actions with the same security considerations as
        public-facing API endpoints, and verify if the user is allowed to
        perform a mutation.
      </p>

      <p>
        In the example below, we check the user&apos;s role before allowing the
        action to proceed:
      </p>

      <pre>
        <code>{`// src/features/admin/actions/admin-actions.ts
"use server";
import { verifySession } from "@/core/lib/dal";

export async function deleteUser(formData: FormData) {
  const session = await verifySession();
  const userRole = session?.user?.role;

  if (userRole !== "admin") {
    return { error: "Unauthorized" };
  }

  // Proceed with the action for authorized users
  const userId = formData.get("userId");
  await db.user.delete({ where: { id: userId } });

  return { success: true };
}`}</code>
      </pre>

      <h3 id="route-handlers">Route Handlers</h3>

      <p>
        Treat Route Handlers with the same security considerations as
        public-facing API endpoints, and verify if the user is allowed to access
        the Route Handler.
      </p>

      <p>For example:</p>

      <pre>
        <code>{`// app/api/admin/users/route.ts
import { verifySession } from "@/core/lib/dal";

export async function GET() {
  const session = await verifySession();

  if (!session) {
    return new Response(null, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return new Response(null, { status: 403 });
  }

  const users = await db.user.findMany();
  return Response.json(users);
}`}</code>
      </pre>

      <p>
        The example above demonstrates a Route Handler with a two-tier security
        check. It first checks for an active session, and then verifies if the
        logged-in user is an &apos;admin&apos;.
      </p>

      <h3 id="context-providers">Context Providers</h3>

      <p>
        Using context providers for auth works due to interleaving. However,
        React <code>context</code> is not supported in Server Components, making
        them only applicable to Client Components.
      </p>

      <p>
        This works, but any child Server Components will be rendered on the
        server first, and will not have access to the context provider&apos;s
        session data:
      </p>

      <pre>
        <code>{`// app/[locale]/layout.tsx
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}`}</code>
      </pre>

      <pre>
        <code>{`// src/features/auth/components/user-button.tsx
"use client";

import { useSession } from "next-auth/react";

export function UserButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!session) {
    return <Link href="/login">Sign In</Link>;
  }

  return <Avatar src={session.user.image} alt={session.user.name} />;
}`}</code>
      </pre>

      <p>
        If session data is needed in Client Components (e.g. for client-side
        data fetching), use React&apos;s <code>taintUniqueValue</code> API to
        prevent sensitive session data from being exposed to the client.
      </p>
    </article>
  );
}

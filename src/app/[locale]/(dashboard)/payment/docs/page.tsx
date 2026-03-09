import { authOptions } from "@/core/lib/auth";
import { Link } from "@/i18n/routing";
import { getServerSession } from "next-auth";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

interface PaymentDocsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PaymentDocsPage({
  params,
}: PaymentDocsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  return (
    <article className='prose prose-slate dark:prose-invert max-w-none'>
      <h1 id='payment-docs'>Payment integration docs</h1>
      <p className='lead'>
        This page documents how payments are integrated in the dashboard using
        Stripe and GMO. These docs are meant for internal use inside the
        dashboard.
      </p>

      <h2 id='providers'>Providers</h2>
      <p>Choose a provider below to see its integration details.</p>
      <div className='not-prose mb-6 flex flex-wrap gap-2'>
        <a
          href='#stripe'
          className='bg-muted text-foreground hover:bg-muted/80 rounded-full border px-3 py-1 text-xs font-medium'
        >
          Stripe
        </a>
        <a
          href='#gmo'
          className='bg-muted text-foreground hover:bg-muted/80 rounded-full border px-3 py-1 text-xs font-medium'
        >
          GMO
        </a>
      </div>

      <h2 id='stripe'>Stripe</h2>
      <p>
        The dashboard uses{" "}
        <Link href='/payment/stripe' className='text-primary hover:underline'>
          /payment/stripe
        </Link>{" "}
        and the Billing screen to start a one-time Checkout Session in Stripe.
        This integration is configured in{" "}
        <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
          src/features/payment/stripe
        </code>
        .
      </p>
      <ul>
        <li>
          Server SDK set up in{" "}
          <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
            stripe/config.ts
          </code>{" "}
          using <code>STRIPE_SECRET_KEY</code> and{" "}
          <code>STRIPE_WEBHOOK_SECRET</code>.
        </li>
        <li>
          Checkout Session is created via the route handler{" "}
          <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
            app/api/payment/stripe/checkout/route.ts
          </code>
          .
        </li>
        <li>
          Webhooks are handled at{" "}
          <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
            app/api/payment/stripe/webhook/route.ts
          </code>{" "}
          to trigger fulfillment when <code>checkout.session.completed</code> or{" "}
          <code>checkout.session.async_payment_succeeded</code> fires.
        </li>
        <li>
          The UI card for starting Stripe Checkout lives in{" "}
          <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
            src/features/payment/stripe/components/stripe-checkout-card.tsx
          </code>
          .
        </li>
      </ul>
      <p>
        For local testing, set <code>STRIPE_SECRET_KEY</code> and{" "}
        <code>STRIPE_WEBHOOK_SECRET</code> in{" "}
        <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
          .env.local
        </code>{" "}
        and use Stripe test cards (for example <code>4242 4242 4242 4242</code>
        ).
      </p>

      <h2 id='gmo'>GMO (coming soon)</h2>
      <p>
        GMO integration is planned but not yet implemented. The feature folder
        is already reserved at{" "}
        <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
          src/features/payment/gmo
        </code>
        .
      </p>
      <p>
        When implementing GMO, follow the same patterns as the Stripe
        integration:
      </p>
      <ul>
        <li>Create a dedicated feature folder under payment.</li>
        <li>
          Expose route handlers in{" "}
          <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
            app/api/payment/gmo
          </code>
          .
        </li>
        <li>
          Add a dedicated dashboard page under{" "}
          <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
            app/[locale]/(dashboard)/payment/gmo
          </code>
          .
        </li>
        <li>
          Reuse existing UI primitives from{" "}
          <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>
            src/components/ui
          </code>{" "}
          for a consistent look and feel.
        </li>
      </ul>
    </article>
  );
}

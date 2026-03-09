import GMOPG from "gmopg";

const siteId = process.env.GMO_SITE_ID;
const sitePass = process.env.GMO_SITE_PASS;
const shopId = process.env.GMO_SHOP_ID;
const shopPass = process.env.GMO_SHOP_PASS;
const baseUrl = process.env.GMO_ENDPOINT ?? "https://pt01.mul-pay.jp";

if (
  typeof window === "undefined" &&
  (!siteId || !sitePass || !shopId || !shopPass)
) {
  console.warn(
    "GMO Payment Gateway env (GMO_SITE_ID, GMO_SITE_PASS, GMO_SHOP_ID, GMO_SHOP_PASS) is not set. GMO payment APIs will not work."
  );
}

/**
 * Server-side GMO PG client. Use only in API routes or server components.
 * Never expose credentials to the client.
 */
export function getGmoClient(): InstanceType<typeof GMOPG> | null {
  if (!siteId || !sitePass || !shopId || !shopPass) return null;
  return new GMOPG({
    baseUrl,
    SiteID: siteId,
    SitePass: sitePass,
    ShopID: shopId,
    ShopPass: shopPass,
  }) as InstanceType<typeof GMOPG>;
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.linqu.es";
export const SITE_HOST = new URL(SITE_URL).host.replace(/^www\./, "");

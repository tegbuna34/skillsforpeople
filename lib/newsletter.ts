/**
 * Public newsletter link. Set NEXT_PUBLIC_NEWSLETTER_URL to Toby's Kit page.
 * Until that exists, the button points at a placeholder so we don't invent a URL.
 */
export const NEWSLETTER_URL_PLACEHOLDER = "#newsletter-todo";

export function newsletterUrl(): string {
  const value = process.env.NEXT_PUBLIC_NEWSLETTER_URL?.trim();
  return value || NEWSLETTER_URL_PLACEHOLDER;
}

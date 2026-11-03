/**
 * Best-effort Kit (ConvertKit) subscriber upsert.
 * No-op when KIT_API_KEY is unset. Failures are logged and never thrown,
 * so signup and the waitlist still succeed when Kit is down or unconfigured.
 *
 * Tag env names follow the spec's tag list. The private SFSB repo was not
 * readable from this environment, so these are the SFP names (KIT_TAG_*):
 *   KIT_TAG_SFP_MEMBER
 *   KIT_TAG_WAITLIST_PEOPLE_BUILDERS
 *   KIT_TAG_PRIVATE_COHORT_INTEREST
 *   KIT_TAG_FOUNDING_COHORT
 */

const KIT_API = "https://api.kit.com/v4";
const TIMEOUT_MS = 2500;

export type KitTag = "member" | "waitlist" | "private" | "founding";

const TAG_ENV: Record<KitTag, string> = {
  member: "KIT_TAG_SFP_MEMBER",
  waitlist: "KIT_TAG_WAITLIST_PEOPLE_BUILDERS",
  private: "KIT_TAG_PRIVATE_COHORT_INTEREST",
  founding: "KIT_TAG_FOUNDING_COHORT",
};

export async function syncKitSubscriber(input: {
  email: string;
  firstName?: string | null;
  fields?: Record<string, string>;
  tags?: KitTag[];
}): Promise<void> {
  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) return;

  try {
    const subscriberId = await upsertSubscriber(apiKey, input.email, input.firstName, input.fields);
    if (!subscriberId || !input.tags?.length) return;
    await Promise.all(input.tags.map((tag) => tagSubscriber(apiKey, tag, subscriberId)));
  } catch (error) {
    console.error("[kit] sync failed:", error instanceof Error ? error.message : error);
  }
}

async function upsertSubscriber(
  apiKey: string,
  email: string,
  firstName?: string | null,
  fields?: Record<string, string>
): Promise<number | null> {
  const body: Record<string, unknown> = { email_address: email };
  if (firstName) body.first_name = firstName;
  const cleanFields = fields
    ? Object.fromEntries(Object.entries(fields).filter(([, value]) => value))
    : undefined;

  let res = await kitFetch(apiKey, "/subscribers", {
    ...body,
    ...(cleanFields && Object.keys(cleanFields).length > 0 ? { fields: cleanFields } : {}),
  });

  // Unknown custom-field keys can 422. Retry without fields so the person is still added.
  if (!res.ok && cleanFields) {
    res = await kitFetch(apiKey, "/subscribers", body);
  }
  if (!res.ok) {
    console.error("[kit] subscriber upsert failed:", res.status);
    return null;
  }
  const json = (await res.json().catch(() => null)) as { subscriber?: { id?: number } } | null;
  return json?.subscriber?.id ?? null;
}

async function tagSubscriber(apiKey: string, tag: KitTag, subscriberId: number): Promise<void> {
  const tagId = process.env[TAG_ENV[tag]];
  if (!tagId) return;
  const res = await kitFetch(apiKey, `/tags/${encodeURIComponent(tagId)}/subscribers/${subscriberId}`, {});
  if (!res.ok) {
    console.error(`[kit] tag ${tag} failed:`, res.status);
  }
}

function kitFetch(apiKey: string, path: string, body: unknown): Promise<Response> {
  return fetch(`${KIT_API}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kit-Api-Key": apiKey,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

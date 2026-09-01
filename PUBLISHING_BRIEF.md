# Publishing a new skill to skillsforpeople.com

This is the operator brief for adding a skill (and, when needed, its
contributor and source episode) to the site. As of the Notion → Supabase
migration in September 2026, the site reads exclusively from Supabase. Notion
is no longer part of the runtime; the old Notion databases still exist but are
not consulted.

If you're a Claude session running the [episode-to-skill-pipeline
skill](https://github.com/anthropics/skills) or any similar workflow, follow
this document to know where each piece of data belongs.

---

## Where things live

**Supabase project:** `Skills for People`
Project ref: `zihcxmfvxugobrvygmny`
URL: `https://zihcxmfvxugobrvygmny.supabase.co`
Dashboard: <https://supabase.com/dashboard/project/zihcxmfvxugobrvygmny>

**Credentials** (server-only; never expose to a browser):
- `SUPABASE_URL` — the URL above
- `SUPABASE_SERVICE_ROLE_KEY` — the `service_role` secret from Supabase → Settings → API
- (Optional) `NOTION_TOKEN` + `NOTION_*_DATA_SOURCE_ID` — only if you're re-running the historical migration script

**Site source:** local at `~/Documents/Claude/skillsforpeople/site`
Deployed via Vercel from `github.com/tegbuna34/skillsforpeople`

---

## Data model

Three content tables, all in schema `public`. The site's [lib/skills.ts](lib/skills.ts)
and [lib/contributors.ts](lib/contributors.ts) are the only reader modules;
match their expectations.

### `contributors`

The person a skill is attributed to.

| Column          | Type          | Notes                                                                 |
| --------------- | ------------- | --------------------------------------------------------------------- |
| `id`            | uuid          | Primary key. Generate with `gen_random_uuid()` if writing raw SQL.    |
| `slug`          | text UNIQUE   | Required. Kebab-case. Determines the URL: `/contributors/<slug>`.     |
| `name`          | text          | Required. Full name as it should display.                             |
| `title`         | text          | Current job title. Empty string if unknown.                           |
| `company`       | text          | Current company. Empty string if unknown.                             |
| `photo_url`     | text nullable | Absolute URL to a headshot, or null. Public web URLs preferred.       |
| `linkedin_url`  | text nullable | Absolute URL, or null.                                                |
| `bio`           | text          | Short bio. Empty string if not writing one.                           |
| `notion_id`     | text UNIQUE   | The Notion page id if this row was originally migrated; else null.    |

### `episodes`

The podcast episode a skill was inspired by. Every published skill must link
to one — the site treats attribution as core to credibility and filters out
skills with no `episode_id`.

| Column                 | Type          | Notes                                                            |
| ---------------------- | ------------- | ---------------------------------------------------------------- |
| `id`                   | uuid          | Primary key.                                                     |
| `podcast`              | text          | Podcast name.                                                    |
| `title`                | text          | Episode title. Required.                                         |
| `url`                  | text          | Direct episode URL. Empty string if none.                        |
| `date`                 | date nullable | Air date.                                                        |
| `guest_contributor_id` | uuid nullable | Optional back-reference to the contributor. Best effort.         |
| `notion_id`            | text UNIQUE   | Original Notion id if applicable; else null.                     |

### `skills`

The unit users actually browse and download.

| Column               | Type            | Notes                                                                                                |
| -------------------- | --------------- | ---------------------------------------------------------------------------------------------------- |
| `id`                 | uuid            | Primary key.                                                                                         |
| `slug`               | text UNIQUE     | Required. Kebab-case. URL: `/skills/<slug>`. Also names the folder in `public/skills/<slug>/`.       |
| `name`               | text            | Required. Display name.                                                                              |
| `vertical`           | text            | HR vertical, e.g. `Talent Acquisition & Sourcing`. Used as a filter facet.                           |
| `description`        | text            | One-line teaser. Shown on cards.                                                                     |
| `what_it_does`       | text            | 1–3 sentence explanation on the detail page.                                                         |
| `process_steps`      | text[]          | Ordered array of step strings. Displayed as numbered list.                                           |
| `definition_of_done` | text            | Not shown on site; goes into the downloadable `.md`.                                                 |
| `common_pitfalls`    | text            | Not shown on site; goes into the downloadable `.md`.                                                 |
| `full_description`   | text            | Long-form. Used by search.                                                                           |
| `skill_file_url`     | text nullable   | Optional external URL for the `.skill` file. Usually left null — file lives on disk (see below).     |
| `prompt_file_url`    | text nullable   | Same idea for the `.md`.                                                                             |
| `compatible_tools`   | text[]          | e.g. `['ChatGPT','Claude']`. Empty defaults to a friendly fallback in the UI.                        |
| `tags`               | text[]          | Freeform.                                                                                            |
| `contributor_id`     | uuid            | FK → `contributors.id`. Required for the page to render a byline.                                    |
| `episode_id`         | uuid            | FK → `episodes.id`. Required for the skill to appear on the site.                                    |
| `status`             | text            | `'published'` to appear on the site. `'draft'` to hide it. No other values.                          |
| `date_published`     | timestamptz     | Newest-first ordering on the library page. Also determines the free-6 gate. Default to `now()`.      |
| `notion_id`          | text UNIQUE     | Nullable. Only set for rows that came out of the historical migration.                               |

---

## Skill files on disk

The site's [lib/skills.ts](lib/skills.ts) `resolveDownloadUrl()` prefers files
on disk over the DB URL columns. So when a skill has an authored `.skill` or
`.md`, drop them here:

```
site/public/skills/<slug>/<slug>.skill
site/public/skills/<slug>/<slug>.md
```

The file's existence on disk is the ground truth for the Download button. If
the file is not there, the site synthesizes a `.md` prompt from the DB fields
so download-as-`.md` still works. `.skill` cannot be synthesized — if there's
no file, the Download-skill button is disabled.

The `slug` in both the folder name and the filename must match the skill's
`slug` column exactly.

---

## The right order of operations when publishing

Do the writes in this order — every skill row references a contributor and an
episode, so those have to exist first.

1. **Contributor** — insert into `contributors` if the person isn't already
   there (look up by `slug`; if found, reuse the row's `id`). Skip if the
   contributor row already exists.
2. **Episode** — insert into `episodes`. Set `guest_contributor_id` to the
   contributor's `id` from step 1 when possible. If a matching episode row
   already exists (same podcast + title, or same `url`), reuse it.
3. **Files** — if there's a `.skill` or `.md` to ship, write them to
   `site/public/skills/<slug>/<slug>.<ext>`.
4. **Skill** — insert into `skills` with `contributor_id`, `episode_id`,
   `status = 'published'`, and `date_published = now()`.
5. **Commit + push** the file changes to GitHub. Vercel picks up the push and
   rebuilds; the new skill appears on `/skills` on the next deploy.

If the files are already committed and only the DB row is new, no deploy is
strictly required — the site fetches skills at build time, so a fresh row
won't appear until the next Vercel build. Trigger a rebuild if you need the
new skill live immediately (Vercel dashboard → project → redeploy).

---

## Writing to Supabase — recommended path

Use the `@supabase/supabase-js` client with the service role key. Never write
raw SQL that hardcodes ids you didn't just receive from an insert.

Minimal end-to-end example (`tsx`):

```ts
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// 1. Contributor — upsert on slug so re-runs don't duplicate.
const { data: contrib } = await sb
  .from("contributors")
  .upsert(
    {
      slug: "jane-doe",
      name: "Jane Doe",
      title: "VP People",
      company: "Example Co",
      bio: "…",
    },
    { onConflict: "slug" }
  )
  .select("id")
  .single();

// 2. Episode — insert (or dedupe on url if you have it).
const { data: ep } = await sb
  .from("episodes")
  .insert({
    podcast: "People First",
    title: "Reshaping performance reviews with Jane Doe",
    url: "https://example.com/ep-42",
    date: "2026-08-15",
    guest_contributor_id: contrib!.id,
  })
  .select("id")
  .single();

// 3. Skill — status 'published' and both foreign keys are required.
await sb.from("skills").insert({
  slug: "performance-review-rewriter",
  name: "Performance Review Rewriter",
  vertical: "Performance Management",
  description: "Rewrites a performance review draft to remove bias-loaded language.",
  what_it_does: "…",
  process_steps: [
    "Paste the draft review into the tool.",
    "Identify bias-loaded phrases against a checklist.",
    "Propose neutral alternatives that keep the underlying critique.",
  ],
  definition_of_done: "…",
  common_pitfalls: "…",
  full_description: "…",
  compatible_tools: ["Claude", "ChatGPT"],
  tags: ["performance", "bias"],
  contributor_id: contrib!.id,
  episode_id: ep!.id,
  status: "published",
  date_published: new Date().toISOString(),
});
```

For a full working example that does this at scale (13 contributors + 13
episodes + 16 skills), see
[scripts/migrate-notion-to-supabase.ts](scripts/migrate-notion-to-supabase.ts).

---

## Do not touch

- **`users` and `sessions` tables.** These are the auth store for the library
  gate. Only [lib/session.ts](lib/session.ts) and the `/api/auth/*` routes
  should ever write to them.
- **`notion_id` on existing rows.** It's the idempotency key for the
  historical migration. Leave it alone on rows that already have one; leave
  it `null` on new rows unless you're re-running the migration script.
- **Row-Level Security policies.** RLS is enabled on every table with no
  policies, which means only the service role can read/write. That's
  intentional. If you find yourself wanting to add an anon-key policy, stop
  and reconsider — the site never uses the anon key.

---

## When something goes wrong

- **New skill doesn't show up on `/skills`** — check `status = 'published'`
  and that `episode_id` is not null. The site silently drops rows missing
  either. It logs a warning at build time (Vercel build logs) naming the
  excluded slugs.
- **Skill page renders but Download-skill is disabled** — the `.skill` file
  isn't in `public/skills/<slug>/<slug>.skill`. Add it and redeploy.
- **The site is empty** — likely `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY`
  is missing in Vercel env, or `USE_MOCK_SKILLS=1` is set in prod (never do
  that).
- **New skill exists in Supabase but not live yet** — trigger a Vercel
  redeploy. The site fetches at build time, not per-request.

---

## Related docs in this repo

- [README.md](README.md) — top-level project overview.
- [.env.example](.env.example) — every env var the app reads.
- [lib/skills.ts](lib/skills.ts) — the data-access module. Keeps its own
  documentation for how each column maps to the `Skill` interface.
- [scripts/migrate-notion-to-supabase.ts](scripts/migrate-notion-to-supabase.ts)
  — the historical one-shot; a working reference for how to insert linked
  rows correctly.

# Skills for People — site

Next.js (App Router) + TypeScript + Tailwind. Deploys to Vercel. Content lives in Notion; the
site fetches at build time and only refreshes on a new deploy.

## Local dev

```bash
npm install
cp .env.example .env.local
# Edit .env.local — see "Environment" below
npm run dev
```

Open http://localhost:3000.

To iterate on layout without a Notion connection, set `USE_MOCK_SKILLS=1` in `.env.local`. The
site then reads from `lib/skills.mock.ts` instead of Notion. **Never set this in production.**

## Environment

Server-side only. Set these in Vercel → Settings → Environment Variables (Production).

| Name | Purpose |
| --- | --- |
| `NOTION_TOKEN` | Internal integration secret from `notion.so/my-integrations`. Grant the integration access to both the Skills and Episodes databases. |
| `NOTION_SKILLS_DATA_SOURCE_ID` | `d17b22f5-50c8-4b51-9d62-5e4c4bc34478` |
| `NOTION_EPISODES_DATA_SOURCE_ID` | `b2ab01ce-aaec-4c42-af08-c6f38c69b404` |

If `NOTION_TOKEN` is missing at build time, `getPublishedSkills()` returns `[]` and the site
renders its empty state. It does not fall back to mock data outside of `USE_MOCK_SKILLS=1`.

## Data-access rule (load-bearing)

`lib/skills.ts` is the **only** module that talks to Notion. Every page and component consumes
the `Skill` / `Episode` types from that file — never Notion's raw shape. When the source of truth
migrates to Supabase (or anything else), this file is the only place that needs to change.

Verify with:

```bash
grep -rE "@notionhq/client|notion\." app components lib | grep -v "lib/skills.ts"
# should produce no output
```

## Publishing a new skill

1. In Notion, finish the skill and flip **Status** to **Published**.
2. Commit the skill's downloadable files into `public/skills/<slug>/`:
   - `public/skills/<slug>/<slug>.skill`
   - `public/skills/<slug>/<slug>.md`
3. Set the Notion **Skill File URL** and **Prompt File URL** to the matching paths
   (e.g. `/skills/interviewer-scorecard-builder/interviewer-scorecard-builder.skill`).
4. Trigger a redeploy via the **Vercel Deploy Hook** (see below) — one click, no code push.

If a skill's file URL is missing, the corresponding button falls back to a generated `.md` built
from the Notion fields so the button never dead-ends.

## Vercel deploy hook (one-click redeploy)

Vercel → Project → Settings → Git → Deploy Hooks → Create Hook (branch: `main`, name:
"publish"). Save the URL somewhere bookmarkable — e.g. a browser bookmarklet or a raycast
snippet. Hitting that URL triggers a rebuild against `main`.

## Analytics

Vercel Analytics is wired in the root layout. Custom events:

- `skill_download` — fires on the Detail page's "Download skill" and "Download .md" buttons.
  Properties: `{ slug, vertical, format: "skill" | "md" | "skill-generated" | "md-generated" }`.
- `skill_copy_prompt` — fires on the "Copy prompt" button. Properties: `{ slug, vertical }`.
- `contribute_prompt_copy` — fires on the Contribute page's extraction-prompt copy button.

Enable Analytics on the Vercel project once deployed; the client emits events regardless.

## Pages

- `/` — landing (hero, how it works, library preview).
- `/skills` — full directory with search + vertical filter (client-side, over the pre-fetched
  list — no separate search index).
- `/skills/[slug]` — detail. Statically generated for every Published slug.
- `/about` — static.
- `/contribute` — static. CTAs point to `https://tally.so/r/9qAx2K`.

## Empty states

- Zero Published skills in Notion → landing + directory show a "Coming soon" empty state.
- Missing `Skill File URL` / `Prompt File URL` → button falls back to generated markdown.
- Missing `Source Episode` → the skill is **excluded from the site entirely**, and the build logs
  a warning listing every excluded slug. Named-source attribution is the site's core credibility
  premise; a sourceless skill should not render. Source is podcast-only today — a broader source
  model (newsletters, talks, user submissions) is deferred to the Supabase migration.
  Components still hide the byline defensively if something ever slips through, but that is a
  fallback, not the intended path.

## Notion field mapping

`lib/skills.ts` reads these fields — **names must match Notion exactly.** Note "Guest TItle" is
intentionally that spelling on the Episodes DB.

Skills:
- Skill Name (title)
- Skill Slug (rich text) — join key + URL slug
- HR Vertical (select)
- One-line Description (rich text)
- What This Skill Does (rich text)
- Process Steps (display) (rich text) — numbered/bulleted or newline-separated
- Definition of Done (rich text)
- Common Pitfalls (display) (rich text)
- Full Description (rich text)
- Skill File URL (url)
- Prompt File URL (url)
- Compatible Tools (multi-select)
- Tags (multi-select)
- Source Episode (relation → Episodes)
- Status (select) — only "Published" is rendered
- Date Published (date) — used for sort

Episodes:
- Episode Title (title)
- Podcast Name (rich text)
- Guest Name (rich text)
- Guest TItle (rich text) — sic
- Guest Company (rich text)
- userDefined:URL (url)
- Date of Podcast (date)

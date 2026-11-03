# Site copy

Exact wording currently shown to visitors. Nothing here is rewritten. Text in braces, such as {email} or {name}, is filled in when the page renders. The path under each string is the file that owns it.

Home, the library, and skill pages also print skill names, descriptions, and guest names from the published skills in the database. Those records are not hardcoded. This file includes the page chrome, one filled-in skill as an example, and a field template for the rest.

## Metadata

The root layout sets the default title, the title template, and the default description. A page title of `Every skill, free` is shown in the browser as `Every skill, free · Skills for People`.

**Default title**

<small>app/layout.tsx</small>

Skills for People — Practical AI skills for People Leaders

**Title template**

<small>app/layout.tsx</small>

%s · Skills for People

**Default meta description**

<small>app/layout.tsx</small>

A library of practical AI skills for People leaders, built from workflows real practitioners have already run.

**Open Graph title**

<small>app/layout.tsx</small>

Skills for People

**Open Graph description**

<small>app/layout.tsx</small>

A library of practical AI skills for People leaders, built from workflows real practitioners have already run.

**Open Graph image alt**

<small>app/layout.tsx</small>

Skills for People. Practical AI skills for People Leaders, built from what worked.

**Twitter title**

<small>app/layout.tsx</small>

Skills for People

**Twitter description**

<small>app/layout.tsx</small>

A library of practical AI skills for People leaders, built from workflows real practitioners have already run.

Home has no page-level title or description. It uses the defaults above.

**Library title**

<small>app/skills/page.tsx</small>

Every skill, free

**Library meta description**

<small>app/skills/page.tsx</small>

AI skills for People leaders, sorted by function. Browse all of it free. You need a free account to download.

**Skill detail title**

<small>app/skills/[slug]/page.tsx</small>

{skill name}

**Skill detail meta description**

<small>app/skills/[slug]/page.tsx</small>

{skill description, or what it does if the description is empty}

**Missing skill title**

<small>app/skills/[slug]/page.tsx</small>

Skill not found

**People Builders title**

<small>app/people-builders/page.tsx</small>

People Builders

**People Builders meta description**

<small>app/people-builders/page.tsx</small>

A 4-week live program for People leaders on Claude or ChatGPT. Think like a founder. Build your own tools.

**About title**

<small>app/about/page.tsx</small>

About

**About meta description**

<small>app/about/page.tsx</small>

Toby Egbuna on why every People team needs a builder, and why Skills for People exists.

**Unknown URL title**

<small>Next.js default. There is no app/not-found.tsx in this repo.</small>

404: This page could not be found.

## Global navigation

The same header is on every page. Logged-out and logged-in states differ.

### Logged out, desktop

**Logo alt**

<small>components/Nav.tsx</small>

Skills for People

**Logo link, accessible name**

<small>components/Nav.tsx</small>

Skills for People home

**Link**

<small>components/Nav.tsx</small>

People Builders

**Link**

<small>components/Nav.tsx</small>

About

**Button**

<small>components/Nav.tsx</small>

Log in / Sign up

### Logged out, small screens

**Button, visible label**

<small>components/Nav.tsx</small>

Log in

**Button, accessible name**

<small>components/Nav.tsx</small>

Log in or sign up

**Menu button, accessible name**

<small>components/Nav.tsx</small>

Menu

**Close menu, accessible name**

<small>components/Nav.tsx</small>

Close menu

**Close menu, visible character**

<small>components/Nav.tsx</small>

×

**Menu logo alt**

<small>components/Nav.tsx</small>

Skills for People

**Menu links**

<small>components/Nav.tsx</small>

People Builders

About

**Menu button**

<small>components/Nav.tsx</small>

Log in / Sign up

### Logged in

Skill Library is added before the shared links. The desktop account button shows the person’s first name, or `Account` if there is no first name. The menu item and the small-screen button both say:

<small>components/Nav.tsx</small>

Log out

**Extra link**

<small>components/Nav.tsx</small>

Skill Library

## Footer

There is no email address and no newsletter form in the footer.

**Logo alt**

<small>components/Footer.tsx</small>

Skills for People

**Tagline**

<small>components/Footer.tsx</small>

AI skills for People leaders, from Toby Egbuna.

**Links**

<small>components/Footer.tsx</small>

Skill Library

Contribute a skill

People Builders

About

**Copyright. The year is the current year.**

<small>components/Footer.tsx</small>

© {year} Skills for People. All rights reserved.

## Home

### Logged out

**Eyebrow**

<small>app/page.tsx</small>

AI skills for People leaders

**Heading**

<small>app/page.tsx</small>

Get this week’s free AI skill for People leaders.

**Lead**

<small>app/page.tsx</small>

One ready-to-use skill every Tuesday, built from a workflow a People leader shared. Drop it into Claude or ChatGPT and run it this week.

**Email field placeholder**

<small>app/page.tsx</small>

Your work email

**Email field label (screen reader)**

<small>components/EmailSignup.tsx</small>

Your work email

**Button**

<small>app/page.tsx</small>

Get this week’s skill →

**Button while sending**

<small>components/EmailSignup.tsx</small>

Sending…

**Fine print**

<small>app/page.tsx</small>

Get this skill now, plus a new one every Tuesday. Unsubscribe anytime.

**Hero document, static labels**

<small>components/mockups/SkillDocument.tsx</small>

Skill

What it does

From the file

**Hero badge**

<small>components/mockups/SkillDocument.tsx</small>

This week’s skill

{skill name}

Opens with your free account

The filename, title, "what it does" paragraph, and up to four step titles are read from that skill’s markdown file. See the example under the skill detail section. If no skill is published, the fallback is:

<small>app/page.tsx</small>

This week’s skill

skill.md

A ready-to-use workflow a People leader shared, written so you can run it in Claude or ChatGPT.

**How it works, eyebrow**

<small>app/page.tsx</small>

How it works

**How it works, heading**

<small>app/page.tsx</small>

From your inbox to Claude or ChatGPT

**How it works, list label**

<small>components/mockups/HowItWorks.tsx</small>

How it works, in three steps

**Step 1 heading**

<small>components/mockups/HowItWorks.tsx</small>

Get the skill

**Step 1 body**

<small>components/mockups/HowItWorks.tsx</small>

Enter your work email. This week’s skill opens now, and a new one arrives every Tuesday, plus one tip from me.

**Step 1 inbox art, other rows**

<small>components/mockups/HowItWorks.tsx</small>

Benefits renewal

Tue

Toby Egbuna

This week’s skill: {skill name}

Plus one tip: write prompts like job descriptions.

Calendar

Mon

**Step 1 inbox, accessible name**

<small>components/mockups/HowItWorks.tsx</small>

An email in an inbox from Toby Egbuna. Subject: This week’s skill, {skill name}.

**Step 2 heading**

<small>components/mockups/HowItWorks.tsx</small>

Download the file

**Step 2 body**

<small>components/mockups/HowItWorks.tsx</small>

One file per skill: the intake questions, the steps, and how to know it worked.

**Step 2 file art**

<small>components/mockups/HowItWorks.tsx</small>

ta-portfolio-scorecard-prune.md

Intake questions

Steps

8

Definition of done

Common pitfalls

Download skill

**Step 2 file, accessible name**

<small>components/mockups/HowItWorks.tsx</small>

A skill file named ta-portfolio-scorecard-prune.md. It contains intake questions, 8 steps, a definition of done, and common pitfalls.

**Step 3 heading**

<small>components/mockups/HowItWorks.tsx</small>

Run it in Claude or ChatGPT

**Step 3 body**

<small>components/mockups/HowItWorks.tsx</small>

Upload the file, add your team’s data, and work through the steps.

**Step 3 chat art**

<small>components/mockups/HowItWorks.tsx</small>

Run the skill on our initiative list.

14 initiatives, 5 with no owner.

Referral bonus pilot

No owner

Interviewer training v2

Owned

**Step 3 chat, accessible name**

<small>components/mockups/HowItWorks.tsx</small>

A chat reply: 14 initiatives found, 5 with no owner, with two rows of a results table.

**Sound familiar, notes label**

<small>app/page.tsx</small>

Three problems People teams run into

**Notes**

<small>app/page.tsx</small>

“I asked for a simple tool months ago and it’s still in the IT queue.”

“Our HRIS has the data, but every Monday I export it to a spreadsheet and clean it by hand.”

“Leadership wants an AI plan for HR and I don’t know where to start.”

**Heading**

<small>app/page.tsx</small>

Sound familiar?

**Lead**

<small>app/page.tsx</small>

Every skill here starts with a problem like these.

**Link**

<small>app/page.tsx</small>

Browse the skills ↓

**Library teaser heading**

<small>app/page.tsx</small>

A few of the skills you get free

The teaser shows the first 6 published skills (`HOME_TEASER_COUNT` in `lib/home.ts`). On a narrow screen the fourth card onward is hidden. Each card uses the template in the library section, with `View →` and without the date. If the list is empty:

<small>app/page.tsx</small>

The first skills are on the way.

**Button, logged out. Opens the library sign-in modal.**

<small>components/SeeLibraryButton.tsx</small>

See the full library

**People Builders eyebrow**

<small>app/page.tsx</small>

People Builders

**Heading**

<small>app/page.tsx</small>

Want to build your own tools?

**Lead**

<small>app/page.tsx</small>

A 4-week live program for People leaders on Claude or ChatGPT, capped at 10 people. You build two automated workflows and two apps.

**Button**

<small>app/page.tsx</small>

Join the waitlist →

**Cohort preview, accessible name**

<small>components/mockups/CohortPreview.tsx</small>

People Builders cohort preview

**Cohort preview heading**

<small>components/mockups/CohortPreview.tsx</small>

People Builders · 4 weeks · live

What you build, week by week

**Seats**

<small>components/mockups/CohortPreview.tsx</small>

10 seats per cohort

**Weeks**

<small>components/mockups/CohortPreview.tsx</small>

Week 1

Opportunity mapping

Week 2

Automations

Week 3

An application

Week 4

Think like a founder, and demo day

**Week 1 art**

<small>components/mockups/CohortPreview.tsx</small>

Recruiting

Interview scheduling

Find panel times

Automate

Send invites

Automate

Debrief

Keep

**Week 1, accessible name**

<small>components/mockups/CohortPreview.tsx</small>

A map of one workstream. Recruiting breaks into the interview scheduling workflow, which breaks into three tasks. Two are marked automate, one is marked keep.

**Week 2 art**

<small>components/mockups/CohortPreview.tsx</small>

When

Offer signed in the ATS

Then

Build the onboarding checklist

Then

Email the hiring manager

**Week 2, accessible name**

<small>components/mockups/CohortPreview.tsx</small>

An automated workflow in three steps. When an offer is signed in the ATS, build the onboarding checklist, then email the hiring manager.

**Week 3 art**

<small>components/mockups/CohortPreview.tsx</small>

Interview scorecard

Candidate

Candidate 014

Role fit

Submit

**Week 3, accessible name**

<small>components/mockups/CohortPreview.tsx</small>

A small app window called Interview scorecard, with a candidate field, a 1 to 5 rating, and a submit button.

**Week 4 art**

<small>components/mockups/CohortPreview.tsx</small>

Demo day

Interview scorecard

What I built

Who uses it

What I’d build next

**Week 4, accessible name**

<small>components/mockups/CohortPreview.tsx</small>

A demo slide with three headings: what I built, who uses it, and what I’d build next.

**Cohort footer**

<small>components/mockups/CohortPreview.tsx</small>

You walk out with

2 automated workflows

2 apps

A map of your team’s work

A demo for your manager

**Founder eyebrow**

<small>app/page.tsx</small>

Who’s behind this

**Photo alt**

<small>app/page.tsx</small>

Toby Egbuna

**Story**

<small>app/page.tsx</small>

I’m Toby Egbuna. In 2021 I co-founded Chezie, an HR-tech platform for managing internal communities, and built the first version myself in a no-code tool. Today we work with customers like Airbnb and the NBA, and I still lead our technical work, mostly by using AI to build things that used to be too technical for me.

**Link**

<small>app/page.tsx</small>

Read my full story →

### Logged in

The marketing sections above are replaced by this welcome and the library directory. The directory copy is in the library section.

**Heading, when a first name is stored**

<small>app/page.tsx</small>

Welcome back, {name}.

**Heading, otherwise**

<small>app/page.tsx</small>

Welcome back.

**Lead, when a skill is published**

<small>app/page.tsx</small>

{skill name} is this week’s skill.

**Lead, otherwise**

<small>app/page.tsx</small>

A new skill lands every Tuesday.

**Button, only when a skill is published**

<small>app/page.tsx</small>

Open this week’s skill

**Button**

<small>app/page.tsx</small>

Browse the library

**Waitlist banner, only if this email is not already on the program waitlist**

<small>app/page.tsx</small>

People Builders waitlist is open.

Join the waitlist →

**Library button, logged in. Goes to /skills instead of opening the modal.**

<small>components/SeeLibraryButton.tsx</small>

See the full library

### Email form errors on this page

These replace the form, or sit under the field, depending on the state.

**Invalid email**

<small>components/EmailSignup.tsx</small>

Enter a valid email address.

**Auth is not configured**

<small>components/EmailSignup.tsx</small>

Accounts open soon. Check back in a few days.

**Rate limit**

<small>components/EmailSignup.tsx</small>

Too many attempts. Wait a minute and try again.

**Any other send failure**

<small>components/EmailSignup.tsx</small>

Something went wrong. Try again.

**After the link is sent, heading**

<small>components/EmailSignup.tsx</small>

Check your email

**After the link is sent, body**

<small>components/EmailSignup.tsx</small>

I sent a sign-in link to {email} from toby@tobyegbuna.com. Open it on this device and you’ll land back where you were.

**After the link is sent, help**

<small>components/EmailSignup.tsx</small>

Didn’t get it? Check spam, or send it again.

**Resend button while sending**

<small>components/EmailSignup.tsx</small>

sending it again…

## Skill library

`/skills` uses the same copy whether the visitor is logged out or logged in. Logged-out visitors also get the sticky signup bar. Logged-in visitors do not.

**Eyebrow**

<small>app/skills/page.tsx</small>

Skill Library

**Heading**

<small>app/skills/page.tsx</small>

Every skill, free

**Lead**

<small>app/skills/page.tsx</small>

AI skills for People leaders, sorted by function. Browse all of it free. You need a free account to download. Every skill credits the practitioner whose work it’s built from.

**Search placeholder**

<small>app/skills/DirectoryClient.tsx</small>

Search skills, e.g. onboarding

**Filter pill that is always present. The other pills are the skill verticals, sorted A to Z.**

<small>app/skills/DirectoryClient.tsx</small>

All

**Count, one skill**

<small>app/skills/DirectoryClient.tsx</small>

1 skill

**Count, more than one**

<small>app/skills/DirectoryClient.tsx</small>

{N} skills

**Count suffix, when at least one skill matches**

<small>app/skills/DirectoryClient.tsx</small>

· Want to add one? Contribute a skill →

**Count, when the search or filter matches nothing**

<small>app/skills/DirectoryClient.tsx</small>

No results

**Empty search**

<small>app/skills/DirectoryClient.tsx</small>

No skills match that search.

### Empty library

Shown when no published skills come back. There is no separate loading sentence. The page is rendered on the server.

**Heading**

<small>app/skills/DirectoryClient.tsx</small>

Coming soon

**Body**

<small>app/skills/DirectoryClient.tsx</small>

The first skills are being finalized. Check back shortly, or contribute one of your own.

**Button**

<small>app/skills/DirectoryClient.tsx</small>

Contribute a skill

### Skill card template

<small>components/SkillCard.tsx</small>

{vertical}

{name}

{description}

Inspired by {guest name}

View →

**Date, library only.** "New" is added when the skill was published in the last 7 days. The date line is `today`, `yesterday`, `{n}d ago` for the rest of that week, then a short date such as `Sep 3`.

<small>lib/format.ts</small>

New

today

yesterday

{n}d ago

## Skill detail

### Fields that change per skill

The page chrome is fixed. These values come from the published skill record, read in `lib/skills.ts` and printed by `app/skills/[slug]/page.tsx`.

- Vertical, shown as a label and in the breadcrumb.
- Name, shown as the heading and the last breadcrumb.
- Description, under the heading.
- Guest name, title, and company, in the "Inspired by" line.
- What it does. If that field is empty, the description is used again.
- Process steps. Each one is printed as `Step {n}. ` plus the step text. A leading `Step {n} —` already stored on the step is removed so it is not printed twice.
- Podcast name, in `Heard on {podcast}`.
- Episode link and guest LinkedIn link, when those URLs exist. The link labels are fixed.
- Definition of done and common pitfalls are not printed in full. If either exists, one sentence says the download includes them.

**Breadcrumb**

<small>app/skills/[slug]/page.tsx</small>

Browse skills

/

{vertical}

/

{name}

**Inspired-by line under the heading**

<small>app/skills/[slug]/page.tsx</small>

Inspired by {guest name}

·

{guest title}

·

{guest company}

**Section heading**

<small>app/skills/[slug]/page.tsx</small>

What this skill does

**Section heading**

<small>app/skills/[slug]/page.tsx</small>

What’s included

**Included items**

<small>app/skills/[slug]/page.tsx</small>

Customization intake

A short set of questions about your process and data access.

Step-by-step implementation process

The exact steps to build this from your own data.

Definition of done

How to know the output is producing a usable, defensible signal.

Common pitfalls

Where teams usually get this wrong, and how to avoid it.

**Section heading**

<small>app/skills/[slug]/page.tsx</small>

The process

**Note under the steps, when a definition of done or common pitfalls exist**

<small>app/skills/[slug]/page.tsx</small>

The download also includes the full definition of done and common pitfalls.

**Section heading**

<small>app/skills/[slug]/page.tsx</small>

Where this came from

**Source line**

<small>lib/format.ts</small>

Inspired by {guest name}, {title} at {company}

**Podcast line**

<small>app/skills/[slug]/page.tsx</small>

Heard on {podcast}

**Links**

<small>app/skills/[slug]/page.tsx</small>

Listen to episode ↗

Guest’s LinkedIn ↗

**Credit**

<small>app/skills/[slug]/page.tsx</small>

I built this skill from {guest name}’s public remarks. They did not write or review it.

### Example: TA Portfolio Scorecard & Prune

This is the newest published skill, so it is also "this week’s skill" on the home page. Field text is the published record. The credit line is the current page, not the older production sentence.

**Breadcrumb**

Browse skills / Talent Acquisition & Sourcing / TA Portfolio Scorecard & Prune

**Label and heading**

Talent Acquisition & Sourcing

TA Portfolio Scorecard & Prune

**Description**

Turn a TA function’s pile of concurrent initiatives into a governed portfolio with one owner and real outcome metrics per initiative, plus pre-agreed scale/hold/kill thresholds and a retirement ritual that actually reclaims bandwidth.

**Inspired by**

Inspired by Blair Bennett · Senior Vice President, Global Talent Acquisition · PepsiCo

**What this skill does**

Inventories every active TA initiative, assigns a single accountable owner and two to three real hiring outcome metrics to each, sets a baseline and decision horizon, fixes scale/hold/kill thresholds in advance, then stands up a recurring review forum and a retirement ritual that formally reclaims the capacity of anything killed.

**The process**

Step 1. Build the exhaustive initiative inventory, including the half-finished and unowned work.

Step 2. Classify each initiative by type and name exactly one accountable owner.

Step 3. Attach two to three real outcome metrics per initiative, drawn from what leadership actually judges TA on.

Step 4. Establish a baseline and a dated decision horizon for every row.

Step 5. Write the scale / hold / kill thresholds in advance and get them agreed by the approval chain.

Step 6. Run the first scoring pass and produce the ranked portfolio view.

Step 7. Stand up the review cadence and the retirement ritual, including where freed capacity goes.

Step 8. Offer to persist this context for next time.

**Where this came from**

Inspired by Blair Bennett, Senior Vice President, Global Talent Acquisition at PepsiCo

Heard on HR Leaders Podcast

Listen to episode ↗

Guest’s LinkedIn ↗

I built this skill from Blair Bennett’s public remarks. They did not write or review it.

**Hero excerpt of this same skill, on the logged-out home page**

<small>components/mockups/SkillDocument.tsx and lib/skill-excerpt.ts, from content/skills/ta-portfolio-scorecard-prune/ta-portfolio-scorecard-prune.md</small>

ta-portfolio-scorecard-prune.md

Skill

TA Portfolio Scorecard & Prune

What it does

I want you to help me build a TA initiative portfolio scorecard and a prune mechanism.

From the file

Build the exhaustive initiative inventory

Classify each initiative and name one accountable owner

Attach two to three real outcome metrics per initiative

Establish a baseline and a decision horizon for each row

This week’s skill

TA Portfolio Scorecard & Prune

Opens with your free account

### Logged out: lock card

Shown beside the skill. The rest of the page is still visible.

**Heading**

<small>app/skills/[slug]/DetailActions.tsx</small>

Get this skill free

**Body**

<small>app/skills/[slug]/DetailActions.tsx</small>

Enter your email and I’ll send you a sign-in link. Click it and you’ll come back to this page with the download ready.

**Placeholder**

<small>app/skills/[slug]/DetailActions.tsx</small>

you@company.com

**Button**

<small>app/skills/[slug]/DetailActions.tsx</small>

Send my link

**Fine print**

<small>app/skills/[slug]/DetailActions.tsx</small>

You’ll also get one new skill every Tuesday. Unsubscribe anytime.

The same form errors and "Check your email" state as the home form apply here. See Home, email form errors.

### Logged in: download

**Primary button**

<small>app/skills/[slug]/DetailActions.tsx</small>

Download skill

**Primary button while the file is preparing**

<small>app/skills/[slug]/DetailActions.tsx</small>

Preparing…

**Helper**

<small>app/skills/[slug]/DetailActions.tsx</small>

Upload the file to your AI of choice as a custom skill or instructions.

**Copy button**

<small>app/skills/[slug]/DetailActions.tsx</small>

Copy prompt

**Copy button after a successful copy**

<small>app/skills/[slug]/DetailActions.tsx</small>

Copied!

**Secondary download**

<small>app/skills/[slug]/DetailActions.tsx</small>

Download .md

**Format row**

<small>app/skills/[slug]/DetailActions.tsx</small>

Format

.skill / .md

**Compatibility row. The tools are the skill’s own list. If that list is empty, the fallback is used.**

<small>app/skills/[slug]/DetailActions.tsx</small>

Compatible with

ChatGPT, Claude, Other

**Program link**

<small>app/skills/[slug]/DetailActions.tsx</small>

Want to build tools like this yourself? See People Builders →

**Failure**

<small>app/skills/[slug]/DetailActions.tsx</small>

Something went wrong. Try again.

A successful `.skill` or `.md` download has no success sentence. The browser saves `{slug}.skill` or `{slug}.md`.

### Download while logged out (401)

Clicking a download control while logged out does not print an error. It opens the library sign-in modal (`Get the full library free`). The API body is `{ "error": "login_required" }` and is not shown.

<small>app/skills/[slug]/DetailActions.tsx</small>

<small>app/api/skills/[slug]/download/route.ts</small>

### Missing skill

This is the page for an unknown skill address, not the site-wide 404.

**Eyebrow**

<small>app/skills/[slug]/not-found.tsx</small>

Skill not found

**Heading**

<small>app/skills/[slug]/not-found.tsx</small>

We couldn’t find that skill.

**Body**

<small>app/skills/[slug]/not-found.tsx</small>

It may have been unpublished or the link may be out of date.

**Button**

<small>app/skills/[slug]/not-found.tsx</small>

Browse every skill

## People Builders

### Page

**Eyebrow**

<small>app/people-builders/page.tsx</small>

People Builders · 4 weeks · live · 10 people max

**Heading**

<small>app/people-builders/page.tsx</small>

Think like a founder. Build your own tools.

**Lead**

<small>app/people-builders/page.tsx</small>

A 4-week live program for People leaders on Claude or ChatGPT. You walk out with two automated workflows and two apps that save your team time, and you learn to be the person on your team who builds.

**Button**

<small>app/people-builders/page.tsx</small>

Join the waitlist

**Price line**

<small>app/people-builders/page.tsx</small>

The next cohort is $2,500 a seat. People on the waitlist hear first.

**Heading**

<small>app/people-builders/page.tsx</small>

Who it’s for

**Bullets**

<small>app/people-builders/page.tsx</small>

You lead or work in Talent Acquisition, People Ops, L&D, People Analytics, or Total Rewards.

Your company already pays for Claude or ChatGPT, and you mostly use it for emails and writing.

Your team has problems it has lived with for years, and nobody has had the time or the know-how to fix them.

It’s the wrong program if you want HR policy or compliance training. I’m not an HR expert and I don’t teach HR.

**Heading**

<small>app/people-builders/page.tsx</small>

What you’ll walk out with

**Bullets**

<small>app/people-builders/page.tsx</small>

Two automated workflows that save your team time.

Two apps your team can use.

A map of your team’s work that shows what to build next.

A demo of what you built, ready to show your manager.

**Heading**

<small>app/people-builders/page.tsx</small>

The 4 weeks

**Weeks**

<small>app/people-builders/page.tsx</small>

1

Week 1: Opportunity mapping

Break your team’s work into workstreams, then workflows, then tasks, and find the ones worth automating or building for.

2

Week 2: Automations

Build automated workflows for the repetitive tasks you mapped in week 1.

3

Week 3: An application

Turn a process your team runs by hand into an app they can use.

4

Week 4: Think like a founder, and demo day

Decide what to build next the way a founder decides what to ship, then demo what you built to the group.

**Heading**

<small>app/people-builders/page.tsx</small>

Format and price

**Rows**

<small>app/people-builders/page.tsx</small>

Length. 4 weeks.

Each week. One live session and one office hour. About 2 hours live, plus your build time.

Group size. 10 people max.

Price. $2,500 a seat.

Built for. Teams on Claude or ChatGPT.

Teams. Want to bring your team? Pick “A private cohort for my team” on the form and I’ll follow up.

**Heading**

<small>app/people-builders/page.tsx</small>

Why I teach this

**Body**

<small>app/people-builders/page.tsx</small>

I’m Toby Egbuna. In 2021 I co-founded Chezie, an HR-tech platform for managing internal communities, and built the first version myself in a no-code tool. Today we work with customers like Airbnb and the NBA, and I still lead our technical work, mostly by using AI to build things that used to be too technical for me.

For a long time I was intimidated by anything that involved the word “code.” Now I use AI to build things that used to be way too technical for me. People Builders teaches you to do the same for your team. You bring the People expertise. I bring the building.

**Heading**

<small>app/people-builders/page.tsx</small>

Getting your company to pay

**Lead**

<small>app/people-builders/page.tsx</small>

Most companies have an L&D or training budget that covers a program like this. Here’s a note you can send your manager.

**Note**

<small>app/people-builders/CopyNote.tsx</small>

Hi [manager], I’d like to join People Builders, a 4-week live program that teaches People teams to build with the Claude or ChatGPT licenses we already have. It costs $2,500. I’d spend about 2 hours a week in sessions and come out with two automated workflows and two apps for our team, starting with [workflow], which takes us about [hours] a week today. Can we use L&D budget for this? Details: skillsforpeople.com/people-builders

**Copy button**

<small>app/people-builders/CopyNote.tsx</small>

Copy note

**Copy button after a successful copy**

<small>app/people-builders/CopyNote.tsx</small>

Copied

**FAQ heading**

<small>app/people-builders/page.tsx</small>

FAQ

The first answer is open. The others show `+` until opened, then `−`.

<small>app/work-with-us/Faq.tsx</small>

**Questions and answers**

<small>app/people-builders/page.tsx</small>

Do I need to know how to code?

No. You’ll learn the technical pieces you need, in HR terms, as you build.

What do I need to have?

A Claude or ChatGPT account. People Builders is built for teams on either one.

How much time does it take?

About 2 hours a week live, plus the time you spend building.

Can I use my company’s data?

[Your data guidance, e.g. build with sample or anonymized data in sessions, and follow your company’s AI policy.]

When is the next cohort?

People on the waitlist hear the dates first.

Can my team do it together?

Yes. Pick “A private cohort for my team” on the waitlist form and I’ll follow up.

Questions?

Email me at toby@tobyegbuna.com.

**Form heading**

<small>app/people-builders/page.tsx</small>

Join the waitlist

**Under the form**

<small>app/people-builders/page.tsx</small>

Questions?

toby@tobyegbuna.com

### Waitlist form, default

Required fields show a red asterisk. Selects start on `Choose one`.

**Labels**

<small>app/people-builders/WaitlistForm.tsx</small>

First name

Work email

Job title

HR function

Company size

Which does your team use?

What would you build first?

Who would pay?

I’m interested in

**Empty select**

<small>app/people-builders/WaitlistForm.tsx</small>

Choose one

**HR function options**

<small>lib/program.ts</small>

Talent Acquisition

People Ops / HR Ops

L&D

People Analytics

Total Rewards

Employee Relations

HRBP / Generalist

Other

**Company size options**

<small>lib/program.ts</small>

1-50

51-200

201-1,000

1,001-5,000

5,000+

**Tool options**

<small>lib/program.ts</small>

Claude

ChatGPT

Both

Neither yet

**Who pays options**

<small>lib/program.ts</small>

My company

Me

Not sure yet

**Interest options**

<small>lib/program.ts</small>

The next cohort

A private cohort for my team

**Button**

<small>app/people-builders/WaitlistForm.tsx</small>

Join the waitlist

**Button while sending**

<small>app/people-builders/WaitlistForm.tsx</small>

Joining…

### Waitlist form, success

The form is replaced by the message.

**New signup**

<small>app/api/waitlist/route.ts</small>

You’re on the list. I’ll email you the next cohort’s dates before anyone else hears them.

**Email already on the list**

<small>app/api/waitlist/route.ts</small>

You’re already on the list. I’ll email you when dates are set.

### Waitlist form, error

**Shown by the form when the request fails with no message**

<small>app/people-builders/WaitlistForm.tsx</small>

Something went wrong. Try again.

**Shown by the form when the browser cannot reach the server**

<small>app/people-builders/WaitlistForm.tsx</small>

Network error. Try again.

**Returned by the API and shown on the form**

<small>app/api/waitlist/route.ts</small>

Enter your first name.

Enter a valid work email.

Pick your HR function.

Pick what you’re interested in.

Pick a company size from the list.

Pick which tool your team uses.

Pick who would pay.

Invalid body.

The waitlist isn’t available in this environment yet.

The waitlist isn’t open yet. Email toby@tobyegbuna.com and I’ll add you.

Something went wrong. Try again.

### Unlisted founding page

`/people-builders/founding` is not in the nav. It uses the same form, with a different button.

**Heading**

<small>app/people-builders/founding/page.tsx</small>

People Builders: founding cohort

**Body**

<small>app/people-builders/founding/page.tsx</small>

You’re invited to the first cohort, free. In return, you build a real project, track a baseline number, and let me publish a case study once you and your employer approve it.

Mondays Nov 16, Nov 23, Nov 30 and Dec 7, 2026. One live session and one office hour each week.

**Button**

<small>app/people-builders/WaitlistForm.tsx</small>

Confirm my spot

**Page title. No meta description is set.**

<small>app/people-builders/founding/page.tsx</small>

People Builders founding cohort

## About

**Eyebrow**

<small>app/about/page.tsx</small>

About

**Heading**

<small>app/about/page.tsx</small>

Every People team needs a builder. I want it to be you.

**Body**

<small>app/about/page.tsx</small>

I’m Toby Egbuna. In 2021, I co-founded Chezie, an HR-tech platform for managing internal communities.

When I started Chezie, I wasn’t technical. Like most non-technical people, I was intimidated for a long time by building an app, setting up an automation, or doing anything that involved the word “code.”

What I was, though, was resourceful. So I built the first version of Chezie by myself in a no-code platform. Today, we work with customers like Airbnb and the NBA, and though we’ve since brought on an engineering team, I still lead our technical work, using AI to turn things that used to be way too technical for me into things I can do.

As AI exploded, I mostly used it for the same things most People leaders use it for: handling emails, acting as a thought partner for strategic work, maybe to draft a document to share externally. I knew it could handle coding for me, but talked myself out of using it because I’m not “technical.”

Then one day I clicked into Claude Code and asked Claude to teach me how to build an internal app for our product roadmap, because a bunch of our customers kept asking for it. It took a few hours of back-and-forth, but that night, I got it live.

(Section break: a thin horizontal rule, not a dash character.)

Having spoken to over 1,000 HR and People leaders since launching Chezie, I’ve seen just how under-resourced these teams are.

However, now that almost every company is handing out ChatGPT and Claude licenses, things are changing. AI is the great equalizer for any team that didn’t have the resources to build an automation that saves hours every week, or a custom internal app that answers employees’ questions. The resources are finally here. What’s missing is the know-how.

Every company should and will have someone on the team who acts as its internal product manager and internal builder. That person takes the problems the team has lived with for years and solves them with automations, custom apps, reusable skills, and AI. People Builders exists to make you that person, for yourself and for your team.

I’ve been building HR tech for years. I know the work, and I know how to build for it with AI. People Builders teaches you to do the same, so you become the person your team goes to when something needs building.

**Photo alt**

<small>app/about/page.tsx</small>

Toby Egbuna

**Signature**

<small>app/about/page.tsx</small>

Toby Egbuna, Founder, Skills for People

**Links**

<small>app/about/page.tsx</small>

LinkedIn

Chezie

toby@tobyegbuna.com

**Heading**

<small>app/about/page.tsx</small>

Get one free skill every week.

**Email placeholder**

<small>app/about/page.tsx</small>

Your work email

**Button**

<small>app/about/page.tsx</small>

Get this week’s skill →

**Link**

<small>app/about/page.tsx</small>

Want to be your team’s builder? See People Builders →

The form uses the same errors and "Check your email" state as the home form.

## 404

There is no custom site-wide 404. An address that matches no page uses the Next.js default. A missing skill uses the skill page above, not this one.

**Page title**

<small>Next.js default. There is no app/not-found.tsx in this repo.</small>

404: This page could not be found.

**Heading**

<small>Next.js default. There is no app/not-found.tsx in this repo.</small>

404

**Body**

<small>Next.js default. There is no app/not-found.tsx in this repo.</small>

This page could not be found.

## Sign-in and magic-link modal

One modal, three headings. Close button accessible name is `Close`. The visible character is `×`.

<small>components/LoginModal.tsx</small>

### From the nav (Log in / Sign up)

**Heading**

<small>components/LoginModal.tsx</small>

Log in or sign up

**Body**

<small>components/LoginModal.tsx</small>

New or returning, you’ll get the same sign-in link.

**Placeholder**

<small>components/LoginModal.tsx</small>

you@company.com

**Button**

<small>components/LoginModal.tsx</small>

Send my sign-in link

**Fine print**

<small>components/LoginModal.tsx</small>

You’ll also get one new skill every Tuesday. Unsubscribe anytime.

### From "See the full library", and from a download while logged out

**Heading**

<small>components/LoginModal.tsx</small>

Get the full library free

**Body**

<small>components/LoginModal.tsx</small>

Enter your email and I’ll send you a sign-in link. No password.

**Button**

<small>components/LoginModal.tsx</small>

Send my sign-in link

**Fine print**

<small>components/LoginModal.tsx</small>

You’ll also get one new skill every Tuesday. Unsubscribe anytime.

### Second skill

Opens when a logged-out visitor opens a second distinct skill. The first skill does not open it.

**Heading**

<small>components/LoginModal.tsx</small>

Want this one too?

**Body**

<small>components/LoginModal.tsx</small>

Make a free account and you can read and download every skill in the library. All it takes is your email.

**Button**

<small>components/LoginModal.tsx</small>

Send my sign-in link

**Link**

<small>components/LoginModal.tsx</small>

Back to the library

This mode has no fine print.

### Enter email, errors

Same four messages as the home form.

<small>components/EmailSignup.tsx</small>

Enter a valid email address.

Accounts open soon. Check back in a few days.

Too many attempts. Wait a minute and try again.

Something went wrong. Try again.

**Button while sending**

<small>components/EmailSignup.tsx</small>

Sending…

### Check your inbox

The form is replaced by this block.

**Heading**

<small>components/EmailSignup.tsx</small>

Check your email

**Body**

<small>components/EmailSignup.tsx</small>

I sent a sign-in link to {email} from toby@tobyegbuna.com. Open it on this device and you’ll land back where you were.

**Help**

<small>components/EmailSignup.tsx</small>

Didn’t get it? Check spam, or send it again.

### Link expired or error

An expired, used, or invalid magic link returns to the page with the modal open. The red line replaces the normal body. The heading stays "Log in or sign up".

<small>components/LoginModal.tsx</small>

That link expired. Enter your email and I’ll send a new one.

## Welcome questions

Shown after the first sign-in, until the person saves or skips.

**Heading**

<small>components/WelcomeModal.tsx</small>

You’re in. Your skill is ready.

**Body**

<small>components/WelcomeModal.tsx</small>

Three quick questions so I send you skills that fit your job. All optional.

**Question**

<small>components/WelcomeModal.tsx</small>

What’s your HR function?

**Options**

<small>lib/program.ts</small>

Talent Acquisition

People Ops / HR Ops

L&D

People Analytics

Total Rewards

Employee Relations

HRBP / Generalist

Other

**Question**

<small>components/WelcomeModal.tsx</small>

How big is your company?

**Options**

<small>lib/program.ts</small>

1-50

51-200

201-1,000

1,001-5,000

5,000+

**Question**

<small>components/WelcomeModal.tsx</small>

If you could build one tool for your team, what would it do?

**Placeholder**

<small>components/WelcomeModal.tsx</small>

e.g. turn interview notes into scorecards

**Checkbox**

<small>components/WelcomeModal.tsx</small>

Tell me when People Builders opens

**Buttons**

<small>components/WelcomeModal.tsx</small>

Save

Skip for now

**Save button while saving**

<small>components/WelcomeModal.tsx</small>

Saving…

**Error, save failed**

<small>components/WelcomeModal.tsx</small>

Something went wrong. You can skip for now.

**Error, answers could not be stored**

<small>components/WelcomeModal.tsx</small>

I couldn’t store those answers yet. You can skip for now.

**Error, network**

<small>components/WelcomeModal.tsx</small>

Network error. You can skip for now.

## Sticky signup bar

Logged out only. Hidden on People Builders, hidden for 30 days after dismiss, and hidden while another email form is on screen.

**Label, hidden on the smallest screens**

<small>components/SignupBar.tsx</small>

One free AI skill for People leaders, every Tuesday.

**Placeholder**

<small>components/SignupBar.tsx</small>

Work email

**Button**

<small>components/SignupBar.tsx</small>

Send it to me

**After the link is sent, the row becomes**

<small>components/EmailSignup.tsx</small>

Check {email}

**Dismiss, accessible name. Visible character is ×.**

<small>components/SignupBar.tsx</small>

Dismiss

Errors on the bar are announced to screen readers and use the same four messages as the home form.

## Bio popup

Only for a logged-out visit with `?utm_medium=bio`, after 5 seconds, once.

**Heading**

<small>components/BioPopup.tsx</small>

Came from LinkedIn?

**Body**

<small>components/BioPopup.tsx</small>

Get the skill I posted about, plus one new skill every Tuesday.

**Placeholder**

<small>components/BioPopup.tsx</small>

Your work email

**Button**

<small>components/BioPopup.tsx</small>

Send it to me

**Close, accessible name**

<small>components/BioPopup.tsx</small>

Close

The form uses the same errors and "Check your email" state as the home form.

## Magic-link email

This email is sent by Supabase Auth. It is not a file in this repo, so changing this document does not change the email. The From address stays `toby@tobyegbuna.com`.

The subject and body below are the template specified for that email. Confirm they match the live Supabase template before treating them as what people receive today.

**From**

Toby at Skills for People <toby@tobyegbuna.com>

**Subject**

Your Skills for People sign-in link

**Body**

Click below to sign in to Skills for People. [Sign in] The link expires in 1 hour. If you didn’t ask for it, you can ignore this email.

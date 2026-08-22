# AI Interview-Notes Bias Scrubber — Prompt Version

Copy everything below into ChatGPT, Gemini, or any other AI tool to use this skill without Claude's native skill format.

---

**Instructions for the AI:** Act as an expert Talent Acquisition operations consultant. Your job is to help me design and pilot an AI-assisted interview-notes cleanup process that automatically strips bias-coded language (family/caregiving status, gender pronouns, age or health references) out of interview transcripts and notes before they reach the hiring manager — validated through a two-stage pilot before I roll it out organization-wide.

**Do not skip intake.** Before designing anything, actively gather context from me:

**First, ask if I have any of these documents, and have me paste them in before asking further questions** (extract what you can instead of re-asking):
- Any existing interview guide, interview scorecard, or structured interview question set
- A sample (anonymized) interview transcript or notes document, if one exists
- Vendor documentation or a contract/SOW for any AI notetaker or interview-intelligence tool I've already purchased or am evaluating
- Any EEO/compliance guidance or legal review notes my organization has on interview documentation
- Current interviewer training materials on what not to ask or document

**Then ask me, one at a time, whatever isn't already answered:**

1. What company do I work for, and roughly what size (employee headcount, and how many interviews does my talent acquisition team run per month)?
2. How many recruiters/interviewers would be involved in an initial pilot, and who owns the relationship with my AI notetaker vendor (if I have one) or would own vendor selection (if I don't)?
3. What's my budget or approval status for an AI interview-intelligence tool — already purchased, budgeted but not selected, or do I need to build the business case first?
4. What tools do I currently use to capture interview notes today (manual notes, a generic AI notetaker, nothing standardized)?
5. What's my specific pain point in my own words — recruiters can't stay present with candidates while note-taking, hiring managers are seeing bias-coded details they shouldn't, a legal/compliance concern about documentation, or something else?
6. Are there specific categories of language I'm most worried about leaking into notes (family/caregiving status, age, religion, health/disability, immigration status, something else specific to my industry)?
7. What's my realistic timeline — do I need something running in weeks, or can this be a multi-month, two-pilot validation process?
8. Who reviews and signs off on interview notes before they reach the hiring manager today, if anyone, and would that same person own quality-checking the AI's scrubbing accuracy during the pilot?
9. Is there anything unique about my context — a regulated industry, a union environment, high-volume/hourly hiring, multilingual interviews — that should shape how I configure or validate this?

**Do not give me a generic template with blanks.** Every part of your output should visibly reflect my specific answers above.

## Framework to follow after intake

**Step 1 — Define what "clean" notes mean for my organization.** Using the risk categories I named, help me write an explicit list of language categories the tool must detect and remove, paired with a rule for what to preserve. Core principle: delete the reasoning/personal detail, keep the substantive job-relevant answer. Example: if a candidate says "my husband works first shift and we don't have daycare, so I can only work second shift," the output should read only "candidate can work second shift."

**Step 2 — Choose or configure the tool against my actual vendor situation.** Branch based on my answer to Question 3: if I already have a tool, help me check whether it supports custom redaction rules versus only fixed categories, and document the gap. If I'm still choosing a vendor, turn my Step 1 rule list into an evaluation checklist, specifically testing whether each candidate tool can be taught custom rules and whether it replaces pronouns with a neutral term (e.g., "candidate") rather than just deleting them. If I have no budget yet, help me build the business case framing this as documentation-quality and legal-risk reduction, not just efficiency.

**Step 3 — Treat the ruleset as trained, not static.** Help me set up a weekly feedback loop during the pilot where my note-quality reviewer compares scrubbed notes against raw transcripts, flags false negatives (bias language that slipped through) and false positives (job-relevant content wrongly deleted), and feeds each example back as a rule refinement I log over time.

**Step 4 — Run Pilot 1: narrow scope, manual verification.** Scope this to the interviewer/recruiter group and volume I named in intake. For every interview, have my reviewer manually compare the raw transcript against the scrubbed output. Keep human-written notes as the official record during this stage — scrubbed output is a parallel test only. Track rule accuracy rate, categories still slipping through, and any interviewer/candidate complaints about the process.

**Step 5 — Refine rules, then run Pilot 2: hand off to hiring managers.** Only start this once Pilot 1 shows the rules reliably catching my target categories. In Pilot 2, let scrubbed notes actually reach hiring managers and collect their explicit feedback: did anything feel missing or over-stripped? Did anything concerning slip through? Use my stated timeline to set a realistic pilot duration rather than compressing it.

**Step 6 — Decide the rollout gate.** Help me define, explicitly and in advance, the accuracy bar that has to be hit before this becomes standard process for all interviews, name who has authority to make that call, and flag if legal/compliance sign-off is needed given the language categories involved.

**Step 7 — Offer to persist this context.** At the end, tell me you now have a working profile of my interview-notes setup (company size, vendor status, risk categories, timeline), and ask whether I want to (a) save this context in a saved Project/Custom GPT for next time, or (b) have you regenerate this prompt with my setup's specific details written into a "Known Context" section so it's pre-populated next time.

## Output I want

A written implementation plan customized to my answers, including: an explicit scrub/preserve rule list, a vendor evaluation or configuration path matched to my budget situation, a two-stage pilot plan with entry/exit criteria for each stage, a feedback-loop process for refining the rules, and a defined rollout gate naming who owns the go/no-go decision.

## Common pitfalls to warn me about

- Rolling a raw AI transcript straight to hiring managers without any scrubbing step
- Deleting pronouns/personal references so aggressively that sentences become unreadable or job-relevant facts get lost too
- Skipping the two-pilot structure and going straight to org-wide rollout before accuracy is validated
- Treating the ruleset as a one-time setup instead of something trained and refined from real flagged examples
- Letting hiring managers see scrubbed notes as their primary record before Pilot 1 has validated accuracy
- Not naming who owns the rollout go/no-go decision, so the pilot runs indefinitely
- Forgetting to offer to persist my context at the end

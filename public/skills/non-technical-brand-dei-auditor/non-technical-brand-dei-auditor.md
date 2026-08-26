Copy everything below into ChatGPT (Custom GPT instructions or a new chat) or Claude (Project instructions or a new chat) to get started.

---

Instructions for the AI: Help me build a simple, zero-code AI workflow that regularly audits my public company web pages for DEI compliance, brand tone, and unintended AI-generated copy.

Non-technical teams often struggle to ensure their external web footprint reflects current DEI guidelines and brand standards — especially when decentralized teams publish copy using generic AI tools.

Help me build a light, no-code monitoring routine inside ChatGPT or Claude. Rather than setting up complex scraper scripts (like Firecrawler or headless browsers), combine a free visual change-monitoring tool (like PageCrawl or RSS.app) with a Custom GPT / Claude Project. Once a week, the tool should flag page changes and feed the new text directly into a custom AI assistant to audit for:
- Unapproved, outdated, or insensitive DEI language.
- Unfiltered ChatGPT/LLM output pasted onto the site by internal teams.
- Unintended changes to core employer brand or DEI statements.

This should create a sustainable, automated quality-control loop without requiring a single line of code or engineering ticket.

## MANDATORY: Run intake before producing anything

Do not skip ahead to writing audit prompts. Actively gather context before producing any plan — do not assume or default.

**Step 0a — Ask for existing documentation first.** Ask whether I have any of the following, and have me paste or upload it before asking further questions:
- My current corporate DEI style guide or list of preferred vs. discouraged terms.
- A list of high-priority URLs to monitor (e.g., Careers page, DEI landing page, Culture blog).
- A sample of past text that was mistakenly published on the site that I wish had been caught.

**Step 0b — Ask whatever isn't answered by the documentation above, one question at a time.** Every answer needs to be a real, typed sentence or backed by an uploaded document — not a one-word pick. If this interface offers quick-select buttons or chips for any of these, ignore that and ask me to elaborate in my own words instead.

1. What company do I work for, and what specific brand or DEI footprint am I responsible for keeping an eye on?
2. Walk me through which platform I'm using for this — ChatGPT Enterprise, Claude Enterprise, or standard Pro — and describe why that's the one available to me.
3. Describe how many specific web pages I need to watch — a handful of critical pages, or dozens of blog posts — and walk me through which ones matter most and why.
4. Walk me through who else at my company has edit access to these pages — a centralized marketing team, regional recruiters, agency partners, someone else. Describe how that access actually works today.
5. Describe my primary pain point right now — catching generic AI corporate jargon, outdated DEI terminology, unauthorized page edits, or something else? Tell me what I'm actually seeing, not just which category fits.
6. Walk me through how I'd prefer to run this — manually pasting text into a Custom GPT once a week, or having a free email alert automatically digest site changes for me? Describe which fits my actual workflow.

If any of my answers come back thin or generic — a single word, a vague generality, an obvious placeholder — you may nudge me once: name specifically what's missing, give one concrete example of the kind of detail that would help, and explicitly offer me the choice to add more or move on. Don't nudge a second time on the same question — take whatever I give you after that and proceed.

**Before you start drafting anything, recap what you've gathered back to me in a compact list and ask me to confirm it's accurate or fix anything.** Only move into the framework below once I've confirmed.

Do not produce a generic output with placeholders. Every step and system prompt must reflect my explicit tools, company context, and terms.

## Step-by-step implementation

### Step 1: Establish the "No-Code" web change trigger
Because I'm non-technical, do not set up Python scripts, APIs, or scraping pipelines. Set up a visual, zero-code monitoring tool:
1. Select up to 5 key public URLs (e.g., `company.com/diversity`, `company.com/careers`).
2. Have me create a free account on a visual change-detection tool (e.g., **PageCrawl.io**, **Visualping**, or **RSS.app**).
3. Set the check frequency to **Weekly**.
4. Set the alert filter to trigger only on **Text Changes** (ignoring minor layout or CSS changes) and send an email digest when changes occur.

### Step 2: Build the System Knowledge & Style Guide
Help me gather all internal DEI rules and brand expectations into a single reference document (e.g., `DEI_Brand_Guardrails.txt`). Ensure it contains four explicit categories:
- **Approved Terms:** Standard phrases and preferred framing.
- **Discouraged/Prohibited Terms:** Outdated terms, offensive phrasing, or tone-deaf language.
- **AI Jargon Flags:** Common generic LLM filler words (e.g., *tapestry, delve, beacon, testaments to our commitment, spearheading*) that indicate someone blindly pasted AI copy onto the live site.
- **Required Context:** Specific guidelines (e.g., "If mentioning our emerging leaders program, always link to the official application form").

### Step 3: Configure the Custom GPT / Claude Project Prompt
Help me build a dedicated Custom GPT (or Claude Project) named **"Brand & DEI Auditor"**. Upload `DEI_Brand_Guardrails.txt` as knowledge files, and set the system instructions to the following logic:

```text
You are an expert DEI Compliance and Employer Brand Auditor for [Company Name].
Your job is to review raw web copy provided by the user and determine if it meets our brand standards.

Instructions:
1. Compare the provided text against the uploaded `DEI_Brand_Guardrails.txt`.
2. Scan specifically for:
   a. Prohibited or discouraged DEI phrasing.
   b. Indicators of unedited AI copy (e.g., overused buzzwords like 'delve', 'testament', 'tapestry').
   c. Missing mandatory links, disclaimers, or required context.
3. Output your feedback strictly in three structured sections:
   - 🚨 Red Flags (Action Required): Severe policy or DEI guide violations that should be taken down or edited immediately.
   - ⚠️ Yellow Flags (Review Suggested): Unedited AI jargon, awkward phrasing, or minor brand misalignment.
   - ✅ Clean Pass: A 1-sentence confirmation of what looks good.
4. For every Flag raised, provide:
   - The exact string of text found.
   - Why it fails our guidelines.
   - A recommended alternative rewrite.
```

### Step 4: Define the weekly 5-minute review loop
Help me set up this non-technical operating routine:
1. **Monday alert:** I receive an email from the change detector showing highlighted text changes from the past week.
2. **Copy & paste:** I copy the new text snippet.
3. **Run skill:** I paste the text into the custom "Brand & DEI Auditor" GPT/Project with the prompt: "Audit this new copy from our Careers page."
4. **Resolution:** If Red or Yellow flags come back, I forward the recommended rewrite directly to the web/marketing team.

### Step 5: Offer to persist this context
Once the workflow is finalized, tell me: "I now have a working profile of your DEI brand guidelines, monitored URLs, and preferred AI environment. To save this configuration for future updates, I can generate an updated version of this prompt with your specific company guardrails and URL list filled in." If I agree, regenerate the prompt with my answers written in.

## Output I want

A working zero-code alert set up on my key web pages, a custom AI assistant loaded with my specific DEI and brand guardrails, and a weekly 5-minute process to catch and correct unapproved messaging or unedited AI text without needing IT or engineering.

## Common pitfalls to warn me about

- Recommending complex developer tools (scrapers, APIs, GitHub repos) instead of keeping the collection step completely visual/email-based
- Treating DEI rules as generic instead of forcing an explicit knowledge file (`DEI_Brand_Guardrails.txt`)
- Setting change detectors to trigger on every minor HTML edit instead of just plain text shifts, causing alert fatigue
- Forgetting to build explicit AI-jargon buzzword flagging into the system instructions
- Forgetting to offer to persist my context at the end

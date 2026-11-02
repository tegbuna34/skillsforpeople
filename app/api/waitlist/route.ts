import { NextResponse } from "next/server";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import { isMissingTable, isUniqueViolation } from "@/lib/db-errors";
import { syncKitSubscriber } from "@/lib/kit";
import {
  AI_TOOLS,
  COMPANY_SIZES,
  HR_FUNCTIONS,
  WAITLIST_INTERESTS,
  WHO_PAYS,
  isOneOf,
} from "@/lib/program";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALREADY = "You're already on the list. I'll email you when dates are set.";

export async function POST(request: Request) {
  let body: {
    firstName?: string;
    email?: string;
    jobTitle?: string;
    hrFunction?: string;
    companySize?: string;
    aiTools?: string;
    buildFirst?: string;
    whoPays?: string;
    interest?: string;
    founding?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const firstName = (body.firstName || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const jobTitle = (body.jobTitle || "").trim();
  const hrFunction = (body.hrFunction || "").trim();
  const companySize = (body.companySize || "").trim();
  const aiTools = (body.aiTools || "").trim();
  const buildFirst = (body.buildFirst || "").trim().slice(0, 4000);
  const whoPays = (body.whoPays || "").trim();
  const interest = (body.interest || "").trim();
  const founding = Boolean(body.founding);

  if (!firstName) return NextResponse.json({ error: "Enter your first name." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Enter a valid work email." }, { status: 400 });
  if (!isOneOf(hrFunction, HR_FUNCTIONS)) {
    return NextResponse.json({ error: "Pick your HR function." }, { status: 400 });
  }
  if (!isOneOf(interest, WAITLIST_INTERESTS)) {
    return NextResponse.json({ error: "Pick what you're interested in." }, { status: 400 });
  }
  if (companySize && !isOneOf(companySize, COMPANY_SIZES)) {
    return NextResponse.json({ error: "Pick a company size from the list." }, { status: 400 });
  }
  if (aiTools && !isOneOf(aiTools, AI_TOOLS)) {
    return NextResponse.json({ error: "Pick which tool your team uses." }, { status: 400 });
  }
  if (whoPays && !isOneOf(whoPays, WHO_PAYS)) {
    return NextResponse.json({ error: "Pick who would pay." }, { status: 400 });
  }

  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      { error: "The waitlist isn't available in this environment yet." },
      { status: 503 }
    );
  }

  const sb = supabase();
  const existing = await sb.from("program_waitlist").select("id").eq("email", email).maybeSingle();
  if (existing.error && isMissingTable(existing.error)) {
    return NextResponse.json(
      { error: "The waitlist isn't open yet. Email toby@tobyegbuna.com and I'll add you." },
      { status: 503 }
    );
  }
  if (existing.error) {
    console.error("[waitlist] lookup failed:", existing.error.message);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
  if (existing.data) {
    return NextResponse.json({ ok: true, already: true, message: ALREADY });
  }

  const inserted = await sb.from("program_waitlist").insert({
    email,
    first_name: firstName,
    job_title: jobTitle || null,
    hr_function: hrFunction,
    company_size: companySize || null,
    ai_tools: aiTools || null,
    build_first: buildFirst || null,
    who_pays: whoPays || null,
    interest,
    founding,
  });

  if (inserted.error && isUniqueViolation(inserted.error)) {
    return NextResponse.json({ ok: true, already: true, message: ALREADY });
  }
  if (inserted.error && isMissingTable(inserted.error)) {
    return NextResponse.json(
      { error: "The waitlist isn't open yet. Email toby@tobyegbuna.com and I'll add you." },
      { status: 503 }
    );
  }
  if (inserted.error) {
    console.error("[waitlist] insert failed:", inserted.error.message);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }

  const tags: Array<"waitlist" | "private" | "founding"> = ["waitlist"];
  if (interest === "A private cohort for my team") tags.push("private");
  if (founding) tags.push("founding");
  await syncKitSubscriber({
    email,
    firstName,
    tags,
    fields: {
      hr_function: hrFunction,
      company_size: companySize,
      job_title: jobTitle,
      interest,
      founding: founding ? "true" : "false",
    },
  });

  return NextResponse.json({
    ok: true,
    already: false,
    message: "You're on the list. I'll email you the next cohort's dates before anyone else hears them.",
  });
}

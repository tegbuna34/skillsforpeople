import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { WELCOME_COOKIE, getCurrentUser, saveWelcomeAnswers } from "@/lib/account";
import { COMPANY_SIZES, HR_FUNCTIONS, isOneOf } from "@/lib/program";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "login_required" }, { status: 401 });

  let body: {
    skip?: boolean;
    hrFunction?: string;
    companySize?: string;
    wantsToBuild?: string;
    programInterest?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const skip = Boolean(body.skip);
  const hrFunction = (body.hrFunction || "").trim();
  const companySize = (body.companySize || "").trim();
  const wantsToBuild = (body.wantsToBuild || "").trim().slice(0, 2000);

  if (!skip) {
    if (hrFunction && !isOneOf(hrFunction, HR_FUNCTIONS)) {
      return NextResponse.json({ error: "Pick an HR function from the list." }, { status: 400 });
    }
    if (companySize && !isOneOf(companySize, COMPANY_SIZES)) {
      return NextResponse.json({ error: "Pick a company size from the list." }, { status: 400 });
    }
  }

  const saved = await saveWelcomeAnswers({
    email: user.email,
    hrFunction: hrFunction || null,
    companySize: companySize || null,
    wantsToBuild: wantsToBuild || null,
    programInterest: Boolean(body.programInterest),
    skip,
  });

  cookies().set(WELCOME_COOKIE, "", { path: "/", maxAge: 0 });

  if (!saved.ok) {
    return NextResponse.json(
      { ok: false, degraded: Boolean(saved.degraded), error: saved.degraded ? "not_ready" : "save_failed" },
      { status: saved.degraded ? 200 : 500 }
    );
  }
  return NextResponse.json({ ok: true });
}

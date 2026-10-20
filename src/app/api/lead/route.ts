/**
 * The contact form's lead capture: a same-origin hop to the insights service.
 *
 * ─── WHY A ROUTE HANDLER AND NOT A DIRECT BROWSER FETCH ────────────────────
 * Either would work. This one keeps the insights origin out of the client
 * bundle, avoids CORS entirely, and gives spam filtering (Turnstile, a honeypot,
 * a rate limit) exactly one place to live when it lands. Nothing about the
 * endpoint is secret — the cost of the direct call is not exposure, it is that
 * the browser would then own a cross-origin contract we cannot change without
 * shipping a new bundle.
 *
 * ─── 🔴 THE UPSTREAM URL IS NEVER GUESSED ──────────────────────────────────
 * `INSIGHTS_URL` has no default and no fallback. The public insights origin has
 * to be confirmed before it is set, and an unconfirmed guess here would not
 * fail — it would POST a real person's name and email at whatever host the
 * guess happened to name. A missing variable answers 503 and says so in the
 * log; it does not invent a recipient for someone else's contact details.
 *
 * Server-side on purpose: NOT `NEXT_PUBLIC_`, so it stays out of the bundle.
 * On OpenNext this reads a Worker var (`vars` in wrangler.jsonc). An empty
 * value is the same as a missing one, which is how wrangler.jsonc turns the
 * proxy off until a Zoorik insights host exists.
 */

/** The upstream's own cap; mirrored so an oversized body never leaves the Worker. */
const MAX_FIELD = 255;

interface LeadBody {
  readonly name?: unknown;
  readonly email?: unknown;
}

function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_FIELD) return null;
  return trimmed;
}

export async function POST(request: Request): Promise<Response> {
  const upstream = process.env.INSIGHTS_URL;
  if (!upstream) {
    console.error("[lead] INSIGHTS_URL is not set — refusing to guess an upstream");
    return Response.json({ error: "unconfigured" }, { status: 503 });
  }

  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const name = clean(body.name);
  const email = clean(body.email);
  /* The service validates too — this is the cheap rejection, not the real one.
     A blank submit should not cost a cross-service round trip. */
  if (!name || !email || !email.includes("@")) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(`${upstream}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
      /* `fetch` has no default timeout. A hung insights leaves the visitor
         watching a spinner with no way to know it will never resolve. */
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    /* 🔴 THE UPSTREAM'S FAILURE IS NOT THE VISITOR'S FAULT, and 502 says so.
       Answering 400 here would make the form tell someone their own details
       were wrong when the truth is that we could not reach our own service. */
    console.error("[lead] insights unreachable:", error);
    return Response.json({ error: "upstream" }, { status: 502 });
  }

  if (response.status === 201) return Response.json({ ok: true }, { status: 201 });
  /* A 400 from upstream IS about the input, so it passes through. Anything else
     — a 404 while the endpoint is still unmerged, a 500 — is ours, not theirs. */
  if (response.status === 400) return Response.json({ error: "invalid" }, { status: 400 });
  console.error(`[lead] insights answered ${response.status}`);
  return Response.json({ error: "upstream" }, { status: 502 });
}

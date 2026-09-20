import { handleBetaSignup } from "../../../lib/beta/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleBetaSignup(request);
}

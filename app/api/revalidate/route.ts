import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/content";

/**
 * POST /api/revalidate
 * Revalidate cache tags for on-demand cache invalidation
 * Called by assymo-frontend admin when content is saved
 *
 * Body: { tag: "pages" | "solutions" | "filters" | "navigation" | "site-parameters", secret: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { tag, secret } = await request.json();

    // Verify secret to prevent unauthorized cache invalidation
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    // Validate tag
    const validTags = Object.values(CACHE_TAGS);
    if (!validTags.includes(tag)) {
      return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
    }

    // Revalidate the cache tag
    revalidateTag(tag);

    return NextResponse.json({ revalidated: true, tag });
  } catch (error) {
    console.error("Revalidation failed:", error);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`SELECT COUNT(*) as count FROM sites`;
    return NextResponse.json({
      status: "ok",
      database: "connected",
      sites: rows[0]?.count,
      hasDbUrl: !!process.env.DATABASE_URL,
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      database: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      hasDbUrl: !!process.env.DATABASE_URL,
    }, { status: 500 });
  }
}

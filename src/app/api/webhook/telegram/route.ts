import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      body: await request.json(),
      path: request.nextUrl.pathname,
      query: request.nextUrl.search,
      cookies: request.cookies.getAll(),
    },
    {
      status: 200,
    }
  );
}

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.search) return NextResponse.next();
  const searchParams = new URLSearchParams(request.nextUrl.search);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.next();
  const slot = searchParams.get("slot");
  const url = `/cardapio/${slug}?slot=${slot}`;
  return NextResponse.redirect(new URL(url, request.url));
}

export const config = {
  matcher: "/cardapio/",
};

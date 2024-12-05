import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.search) {
    return NextResponse.next();
  }
  const searchParams = new URLSearchParams(request.nextUrl.search);
  const slug = searchParams.get("slug");
  const slot = searchParams.get("slot");
  if (!slug) {
    return NextResponse.next();
  }
  return NextResponse.redirect(
    new URL(`/cardapio/${slug}?slot=${slot}`, request.url)
  );
}

export const config = {
  matcher: "/cardapio/",
};

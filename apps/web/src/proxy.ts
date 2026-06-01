import { NextRequest, NextResponse } from "next/server";

export const proxy = (request: NextRequest) => {
  const token = request.cookies.get("access_token");
  if (!token) {
    return NextResponse.redirect(new URL("/masuk", request.url));
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/kelola/:path*"],
};

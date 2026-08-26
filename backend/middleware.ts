import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = [
  "http://localhost:5173",
  "https://startmore.vercel.app",
  "https://artemore-ecommerce.vercel.app",
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  const isAllowedOrigin =
    origin && allowedOrigins.includes(origin);

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, {
      status: 204,
    });

    if (isAllowedOrigin) {
      response.headers.set(
        "Access-Control-Allow-Origin",
        origin
      );

      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );

      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-User-Id"
      );

      response.headers.set(
        "Access-Control-Allow-Credentials",
        "true"
      );

      response.headers.set(
        "Access-Control-Max-Age",
        "86400"
      );
    }

    return response;
  }

  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set(
      "Access-Control-Allow-Origin",
      origin
    );

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );

    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-User-Id"
    );

    response.headers.set(
      "Access-Control-Allow-Credentials",
      "true"
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};

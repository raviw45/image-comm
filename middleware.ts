import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Ensure admin users are not forced to always stay at /admin
    if (token?.role === "admin" && pathname === "/") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow webhook endpoint
        if (pathname.startsWith("/api/webhook")) return true;

        // Allow authentication-related routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;
        }

        // Publicly accessible routes
        if (
          pathname === "/" ||
          pathname.startsWith("/api/product") ||
          pathname.startsWith("/api/voucher") ||
          pathname.startsWith("/product/") ||
          pathname.startsWith("/public/") ||
          pathname.startsWith("/favicon.ico")
        ) {
          return true;
        }

        if (
          pathname.startsWith("/api/cart") ||
          pathname.startsWith("/api/orders")
        )
          return true;

        // Allow access to /admin only for admins
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }

        // Default: allow access if the user has a token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};

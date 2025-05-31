import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const publicRoutes = [
  {
    path: "/login",
    whenAuthenticated: "redirect",
  },
  {
    path: "/register",
    whenAuthenticated: "redirect",
  },
  {path: "/reset-password",
    whenAuthenticated: "redirect",
  }
] as const;

const REDIRECT_WHEN_UNAUTHORIZED = "/login";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoute = publicRoutes.find((route) => pathname.startsWith(route.path));

  console.log("publicRoute", publicRoute);
  const authToken = req.cookies.get("tokenClinitt");

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectResponse = req.nextUrl.clone();

    redirectResponse.pathname = REDIRECT_WHEN_UNAUTHORIZED;
    return NextResponse.redirect(redirectResponse);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    const redirectResponse = req.nextUrl.clone();
    redirectResponse.pathname = "/dashboard";
    return NextResponse.redirect(redirectResponse);
  }

  if (authToken && !publicRoute) {
    const now = Math.floor(Date.now() / 1000);
    const decoded = authToken?.value && jwt.decode(authToken.value);

    if (decoded && typeof decoded !== "string" && decoded.exp) {
      if (decoded.exp < now) {
        const redirectResponse = req.nextUrl.clone();
        redirectResponse.pathname = REDIRECT_WHEN_UNAUTHORIZED;
        return NextResponse.redirect(redirectResponse);
      }
    }
  }
  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

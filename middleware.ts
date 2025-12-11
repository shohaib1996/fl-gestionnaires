import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set(name, value, options);
        },
        remove(name) {
          response.cookies.delete(name);
        },
      },
    }
  );

  // Fetch user session
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  const pathname = request.nextUrl.pathname;

  // ------------------------------------------
  // 1) User is NOT logged in → Protect dashboard routes
  // ------------------------------------------
  if (!user && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ------------------------------------------
  // 2) User IS logged in → Prevent access to login page
  // ------------------------------------------
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};

import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  /* ----------------------------------------
   * 1️⃣ Not logged in → protect dashboard & projects
   * ---------------------------------------- */
  if (
    !user &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/projects"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  /* ----------------------------------------
   * 2️⃣ Dashboard → only admin & super_admin
   * ---------------------------------------- */
  if (user && pathname.startsWith("/dashboard")) {
    const { data: profile, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const allowedRoles = ["admin", "super_admin"];

    if (!allowedRoles.includes(profile.role)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  /* ----------------------------------------
   * 3️⃣ Logged in → prevent login & root
   * ---------------------------------------- */
  if (user && (pathname === "/login" || pathname === "/")) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/projects/:path*", "/login", "/"],
};

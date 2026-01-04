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
   * 2️⃣ Get user profile for logged-in users
   * ---------------------------------------- */
  let userRole = null;
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    userRole = profile?.role;
  }

  /* ----------------------------------------
   * 3️⃣ Dashboard → only admin & super_admin
   * ---------------------------------------- */
  if (user && pathname.startsWith("/dashboard")) {
    const allowedRoles = ["admin", "super_admin"];

    if (!userRole || !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/projects", request.url));
    }
  }

  /* ----------------------------------------
   * 4️⃣ Logged in → redirect from root based on role
   * ---------------------------------------- */
  if (user && pathname === "/") {
    // Redirect based on role
    if (userRole === "admin" || userRole === "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/projects", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/projects/:path*", "/"],
};

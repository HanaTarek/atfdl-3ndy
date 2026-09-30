import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, cacheHeaders) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );

          // Prevent CDNs/browsers from caching a response that carries a
          // refreshed session cookie — otherwise one user's session can
          // leak to another. See Supabase's SSR caching guidance.
          Object.entries(cacheHeaders || {}).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
          });
        },
      },
    },
  );

  // IMPORTANT: getClaims() verifies the JWT signature. Never use
  // getSession() here — it reads the cookie without verifying it,
  // which means it can be forged.
   let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    user = null;
  }
  // Admin-only route guard
  if (request.nextUrl.pathname.startsWith("/admin")) {
        
    if (!user) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const userId = user.id;
    console.log("is there user.iddd???" , userId);

    const { data: admin, error } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();


    console.log("am i admin ?????" , admin);
    console.log("is there error ?????", error);
    if (!admin) {
      console.log("entered the ifff condddd")
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
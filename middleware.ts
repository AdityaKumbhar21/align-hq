import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in',
  '/sign-up',
  "/api/webhooks/register"
]);

export default clerkMiddleware(async (auth:any, req: NextRequest) => {
    const { userId, sessionClaims } = await auth();
    const pathName = req.nextUrl.pathname;

    const role = sessionClaims?.metadata?.role;

    if (!userId) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    if (isPublicRoute(req)) {

        if (userId && (pathName === '/' || pathName === '/sign-in' || pathName === '/sign-up')) {
            let redirectTo = "/dashboard"; 

            if (role === "Admin") redirectTo = "/admin/dashboard";
            else if (role === "Manager") redirectTo = "/manager/dashboard";
            else if (role === "Team Member") redirectTo = "/dashboard";

            return NextResponse.redirect(new URL(redirectTo, req.url));
        }

        return NextResponse.next();
    }


    if (pathName.startsWith("/admin") && role !== "Admin") {
        let redirectTo = "/dashboard"

        if(role === "Manager") redirectTo = "/manager/dashboard"
        if(role === "Team Member") redirectTo = "/dashboard"
        return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    if (pathName.startsWith("/manager") && role === "Team Member") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
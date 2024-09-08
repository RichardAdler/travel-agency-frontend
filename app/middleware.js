// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'; // Assuming you are using next-auth or any other auth token handling

// This function can be marked as `async` if you need to use `await` inside
export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Only apply this middleware for the admin routes
    if (pathname.startsWith('/dashboard/admin')) {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        // Check if token exists and if the user role is admin
        if (token?.role !== 'admin') {
            // Redirect to homepage if not admin
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Continue if not navigating to the admin dashboard or if the user is an admin
    return NextResponse.next();
}

// Export matcher if you only want to apply this middleware to specific routes
export const config = {
    matcher: '/dashboard/admin/:path*',
};

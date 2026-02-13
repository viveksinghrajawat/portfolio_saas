import { auth } from "@/auth"
import { NextResponse } from "next/server"

const rateLimitMap = new Map();

export default auth((req) => {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const limit = 100; // requests per minute
    const windowMs = 60 * 1000;

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 0, lastReset: Date.now() });
    }

    const ipData = rateLimitMap.get(ip);

    if (Date.now() - ipData.lastReset > windowMs) {
        ipData.count = 0;
        ipData.lastReset = Date.now();
    }

    if (ipData.count >= limit) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    ipData.count += 1;

    // Simple analytics tracking (fire and forget)
    // In production, use a proper background worker or specific analytics service
    if (req.method === "GET" && !req.nextUrl.pathname.startsWith("/api") && !req.nextUrl.pathname.startsWith("/_next") && !req.nextUrl.pathname.startsWith("/static")) {
        // We can't easily import Prisma here due to Edge runtime limitations in middleware
        // So we'll hit an API endpoint to record the visit
        fetch(`${req.nextUrl.origin}/api/analytics/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: req.nextUrl.pathname,
                userAgent: req.headers.get('user-agent')
            })
        }).catch(err => console.error("Analytics Error", err));
    }

    return NextResponse.next();
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

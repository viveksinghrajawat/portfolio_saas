import { NextResponse } from "next/server";
import { trackVisit } from "@/lib/analytics";

export async function POST(req) {
    try {
        const body = await req.json();
        await trackVisit(body.path, body.userAgent);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to track" }, { status: 500 });
    }
}

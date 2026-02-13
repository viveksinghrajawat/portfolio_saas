import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/analytics";
import { auth } from "@/auth";

export async function GET(req) {
    const session = await auth();

    // Basic Admin Check (replace with specific email or role check in production)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getAnalytics();
    return NextResponse.json(data);
}

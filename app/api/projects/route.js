import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const projects = await prisma.project.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                updatedAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                description: true,
                repoUrl: true,
                liveUrl: true,
                isPublic: true,
                downloads: true,
                views: true,
                updatedAt: true
            }
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error("Fetch Projects Error:", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

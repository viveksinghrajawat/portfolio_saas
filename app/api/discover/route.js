import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all'; // 'official', 'community', 'all'
    const search = searchParams.get('search') || '';

    try {
        let whereCondition = {
            OR: [
                { isTemplate: true }, // Official templates (if marked so)
                { isPublic: true }    // Community public projects
            ]
        };

        if (type === 'official') {
            whereCondition = {
                isTemplate: true,
                // In future, filtering by admin user ID or specific flag
            };
        } else if (type === 'community') {
            whereCondition = {
                isPublic: true,
                isTemplate: false // Assuming community projects are just public projects, not curated templates yet
            };
        }

        if (search) {
            whereCondition.AND = {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            };
        }

        const projects = await prisma.project.findMany({
            where: whereCondition,
            orderBy: {
                downloads: 'desc' // Sort by popularity
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            },
            take: 50
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error("Discover Error:", error);
        return NextResponse.json({ error: "Failed to load discover page" }, { status: 500 });
    }
}

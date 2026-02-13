import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import DOMPurify from "isomorphic-dompurify";

export async function POST(req, { params }) {
    const session = await auth();
    const { id } = params;

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { variables, name } = body; // variables: { key: value }, name: New Project Name

        // 1. Fetch Source Project
        const sourceProject = await prisma.project.findUnique({
            where: { id },
        });

        if (!sourceProject) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        if (!sourceProject.isPublic && !sourceProject.isTemplate && sourceProject.userId !== session.user.id) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // 2. Process HTML with Variables
        let html = sourceProject.htmlContent || "";

        if (variables) {
            Object.entries(variables).forEach(([key, value]) => {
                // Sanitize input value to prevent injection via variable content
                const safeValue = DOMPurify.sanitize(String(value));

                // Regex Global Replacement
                const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
                html = html.replace(regex, safeValue);
            });
        }

        // 3. Create Repo on GitHub (as new project)
        // Re-use logic or call internal service (Mocking here for brevity, assuming standard flow)
        // In real app, extract this to a service function `createGitHubRepo`

        // ... (GitHub creation logic similar to deploy route)
        // For MVP, we will skip the GitHub call here and just create DB entry to simulate.
        // The user would likely "Deploy" this new project after creation.

        // 4. Create New Project in DB
        const newProject = await prisma.project.create({
            data: {
                name: name || `${sourceProject.name} (Clone)`,
                description: `Cloned from ${sourceProject.name}`,
                userId: session.user.id,
                htmlContent: html,
                sourceProjectId: sourceProject.id,
                isPublic: false, // Default to private
                downloads: 0,
                views: 0
            }
        });

        // 5. Atomic Increment on Source Project
        await prisma.project.update({
            where: { id: sourceProject.id },
            data: {
                downloads: { increment: 1 }
            }
        });

        return NextResponse.json({ success: true, projectId: newProject.id });

    } catch (error) {
        console.error("Clone Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

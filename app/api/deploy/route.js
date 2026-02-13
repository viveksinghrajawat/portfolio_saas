import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { deploySchema } from "@/lib/validations";

export async function POST(req) {
    const session = await auth();

    if (!session?.user || !session?.accessToken) {
        return NextResponse.json({ error: "Unauthorized or missing GitHub permissions" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // 1. Validation
        const validation = deploySchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }

        const { repoName, html, description } = validation.data;

        // 2. Rate Limiting (Simple Header Check)
        // In production, use Vercel KV or similar.
        // This is a placeholder as persistent storage was flaky. 

        // 3. Create Repository on GitHub
        const createRepoRes = await fetch("https://api.github.com/user/repos", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: repoName,
                description: description || "Created via MySaaS Portfolio",
                auto_init: true, // Initialize with README
                private: false,  // Pages usually needs public for free accounts
            }),
        });

        if (!createRepoRes.ok) {
            const error = await createRepoRes.json();
            throw new Error(`GitHub Error: ${error.message}`);
        }

        const repoData = await createRepoRes.json();

        // 2. Upload index.html
        // We need to commit the file. 
        // Simplified: PUT /repos/{owner}/{repo}/contents/{path}
        const contentEncoded = Buffer.from(html).toString("base64");

        const uploadRes = await fetch(`https://api.github.com/repos/${repoData.full_name}/contents/index.html`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Initial commit from SaaS Platform",
                content: contentEncoded,
            }),
        });

        if (!uploadRes.ok) throw new Error("Failed to upload file to GitHub");

        // 3. Enable GitHub Pages (Optional - might require different permissions/setup)
        // For now, we'll return the Repo URL and the likely Pages URL
        const pagesUrl = `https://${repoData.owner.login}.github.io/${repoData.name}/`;

        // 4. Save to Database
        /* 
        // DB interactions commented out until DB is stable
        await prisma.project.create({
          data: {
            name: repoName,
            description,
            userId: session.user.id,
            repoUrl: repoData.html_url,
            liveUrl: pagesUrl
          }
        });
        */

        return NextResponse.json({
            success: true,
            repoUrl: repoData.html_url,
            pagesUrl: pagesUrl,
            message: "Repository created! GitHub Pages main take a minute to activate."
        });

    } catch (error) {
        console.error("Deployment Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

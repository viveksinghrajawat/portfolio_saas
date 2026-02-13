import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { deploySchema } from "@/lib/validations";
import DOMPurify from "isomorphic-dompurify";
import { JSDOM } from "jsdom";

export async function POST(req) {
    const session = await auth();

    if (!session?.user || !session?.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // 1. Validation
        // We manually validate new fields for now or update schema
        const { repoName, html, description, isPublic, isTemplate, templateFields } = body;

        if (!repoName || !html) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 2. Security: HTML Sanitization
        // Allow-list approach. Strip <script>, event handlers, forms, etc.
        const cleanHtml = DOMPurify.sanitize(html, {
            USE_PROFILES: { html: true },
            FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
            FORBID_ATTR: ['onclick', 'onmouseover', 'onload', 'onerror', 'style'], // style is debatable, maybe allow simple styles
        });

        // 3. Template Fields Validation
        if (isTemplate && templateFields) {
            if (!Array.isArray(templateFields)) {
                return NextResponse.json({ error: "Invalid template fields format" }, { status: 400 });
            }
            // Validate structure
            const isValid = templateFields.every(f => f.key && f.label && f.type);
            if (!isValid) {
                return NextResponse.json({ error: "Invalid template fields structure" }, { status: 400 });
            }
        }

        // 4. Create Repository on GitHub
        const createRepoRes = await fetch("https://api.github.com/user/repos", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: repoName,
                description: description || "Created via MySaaS Portfolio",
                auto_init: true,
                private: !isPublic,
            }),
        });

        if (!createRepoRes.ok) {
            const error = await createRepoRes.json();
            throw new Error(`GitHub Error: ${error.message}`);
        }

        const repoData = await createRepoRes.json();

        // 5. Upload index.html
        const contentEncoded = Buffer.from(cleanHtml).toString("base64");

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

        const pagesUrl = `https://${repoData.owner.login}.github.io/${repoData.name}/`;

        // 6. Save to Database
        await prisma.project.create({
            data: {
                name: repoName,
                description,
                userId: session.user.id,
                repoUrl: repoData.html_url,
                liveUrl: pagesUrl,
                isPublic: !!isPublic,
                isTemplate: !!isTemplate,
                htmlContent: cleanHtml,
                templateFields: templateFields || [],
                downloads: 0,
                views: 0
            }
        });

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

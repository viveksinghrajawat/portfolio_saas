import { z } from "zod";

export const deploySchema = z.object({
    repoName: z.string().min(3).max(100).regex(/^[a-zA-Z0-9._-]+$/, "Only letters, numbers, hyphens, and underscores allowed"),
    html: z.string().min(1, "HTML content cannot be empty"),
    description: z.string().optional(),
});

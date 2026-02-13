"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Rocket } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function UploadPage() {
    const [html, setHtml] = useState("<h1>My Custom Site</h1>")
    const [name, setName] = useState("")
    const [isDeploying, setIsDeploying] = useState(false)
    const router = useRouter()

    const onDeploy = async () => {
        if (!name || !html) return toast.error("Please fill in all fields")

        setIsDeploying(true)
        try {
            const res = await fetch("/api/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repoName: `custom-${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
                    html: html,
                    description: "Custom HTML Upload"
                })
            })

            const result = await res.json()
            if (!res.ok) throw new Error(result.error || "Deployment failed")

            toast.success("Deployed successfully! Check your GitHub.")
            router.push("/dashboard")

        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsDeploying(false)
        }
    }

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Upload / Paste HTML</h1>

            <div className="space-y-6 border p-6 rounded-xl">
                <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input placeholder="My Cool Site" value={name} onChange={e => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                    <Label>HTML Code</Label>
                    <Textarea
                        className="h-64 font-mono"
                        placeholder="Paste your index.html content here..."
                        value={html}
                        onChange={e => setHtml(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">For MVP, this only supports a single index.html file.</p>
                </div>

                <Button onClick={onDeploy} disabled={isDeploying} className="w-full">
                    {isDeploying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
                    Deploy to GitHub
                </Button>
            </div>
        </div>
    )
}

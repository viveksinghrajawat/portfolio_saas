"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { getTemplate } from "@/lib/templates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Rocket } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function EditorPage({ params }) {
    const [template, setTemplate] = useState(null)
    const [html, setHtml] = useState("")
    const [isDeploying, setIsDeploying] = useState(false)
    const router = useRouter()

    // params is a Promise in Next.js 15+ (if using latest), but for 14 it's an object. 
    // Handling both just in case, but usually params.templateId is accessible.
    // We'll treat it as resolved for this standard setup or wrap in useEffect if needed.
    const templateId = params.templateId;

    const { register, watch, handleSubmit } = useForm({
        defaultValues: {
            name: "Your Name",
            role: "Developer",
            about: "Tell us about yourself...",
            email: "",
            github: "",
            linkedin: ""
        }
    })

    // Load Template
    useEffect(() => {
        const t = getTemplate(templateId)
        if (t) {
            setTemplate(t)
            // Initial generation
            setHtml(t.generate({ name: "Your Name", role: "Developer", about: "Tell us", email: "", github: "", linkedin: "" }))
        }
    }, [templateId])

    // Real-time Preview Update
    useEffect(() => {
        if (!template) return
        const subscription = watch((value) => {
            const newHtml = template.generate(value)
            setHtml(newHtml)
        })
        return () => subscription.unsubscribe()
    }, [watch, template])

    const onDeploy = async (data) => {
        setIsDeploying(true)
        try {
            // 1. Generate final HTML
            const finalHtml = template.generate(data)

            // 2. Call Deploy API
            const res = await fetch("/api/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repoName: `portfolio-${data.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
                    html: finalHtml,
                    description: `Portfolio for ${data.name}`
                })
            })

            const result = await res.json()

            if (!res.ok) throw new Error(result.error || "Deployment failed")

            toast.success("Deployment initiated!")
            router.push("/dashboard")

        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsDeploying(false)
        }
    }

    if (!template) return <div className="p-10">Loading template...</div>

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="border-b p-4 flex justify-between items-center bg-background">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/templates">
                        <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
                    </Link>
                    <h1 className="font-bold">Editing: {template.name}</h1>
                </div>
                <Button onClick={handleSubmit(onDeploy)} disabled={isDeploying}>
                    {isDeploying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
                    {isDeploying ? "Deploying..." : "Deploy Live"}
                </Button>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor Panel */}
                <div className="w-1/3 border-r overflow-y-auto p-6 bg-muted/10">
                    <h2 className="font-semibold mb-6">Content</h2>
                    <div className="space-y-6">
                        {template.fields.map(field => (
                            <div key={field.name} className="space-y-2">
                                <Label htmlFor={field.name}>{field.label}</Label>
                                {field.type === 'textarea' ? (
                                    <Textarea id={field.name} placeholder={field.placeholder} {...register(field.name)} />
                                ) : (
                                    <Input id={field.name} type={field.type} placeholder={field.placeholder} {...register(field.name)} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="flex-1 bg-muted p-8 flex flex-col">
                    <div className="text-sm text-center mb-2 text-muted-foreground">Live Preview</div>
                    <div className="flex-1 border-4 border-gray-800 rounded-xl overflow-hidden bg-white shadow-2xl">
                        <iframe
                            srcDoc={html}
                            className="w-full h-full"
                            title="Preview"
                            sandbox="allow-scripts"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

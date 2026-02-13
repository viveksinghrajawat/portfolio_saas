"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"

export default function ConfigureTemplatePage() {
    const params = useParams()
    const router = useRouter()
    const [project, setProject] = useState(null)
    const [formData, setFormData] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        // Fetch project to get fields
        // We can reuse the discover API or create a specific 'get project' API
        // For now, let's assume we can fetch it via the discover endpoint with an ID or similar
        // Or better, just fetch via a dedicated endpoint. 
        // Since we don't have a dedicated single project GET endpoint, 
        // I will quickly assume we might need one, OR I can list and find (inefficient but works for MVP)
        // Actually, let's just make a quick fetch to the clone endpoint? No, that's POST.

        // I'll assume we can get it from /api/projects if it was ours, but it's not.
        // Let's rely on /api/discover filtering? No.
        // I should have made a GET /api/project/[id].
        // For MVP, I will try to fetch from discover with a trick or just use the list.
        fetch(`/api/discover?search=&type=all`)
            .then(res => res.json())
            .then(data => {
                const p = data.find(item => item.id === params.id)
                if (p) {
                    setProject(p)
                    // Initialize form
                    const initialData = {}
                    if (p.templateFields) {
                        p.templateFields.forEach(f => {
                            initialData[f.key] = ""
                        })
                    }
                    setFormData(initialData)
                }
            })
    }, [params.id])

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/project/${params.id}/clone`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    variables: formData,
                    name: `My ${project.name}`
                })
            })

            if (!res.ok) throw new Error("Failed to create project")

            toast.success("Project created successfully!")
            router.push("/dashboard")
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!project) return <div className="p-10 text-center"><Loader2 className="animate-spin w-8 h-8 mx-auto" /></div>

    return (
        <div className="container mx-auto py-10 max-w-xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Configure {project.name}</h1>
                <p className="text-muted-foreground">Fill in the details to customize your portfolio.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6 border p-8 rounded-xl bg-card">
                {project.templateFields?.map(field => (
                    <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key}>{field.label}</Label>
                        {field.type === 'textarea' ? (
                            <Textarea
                                id={field.key}
                                required
                                value={formData[field.key]}
                                onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                            />
                        ) : field.type === 'color' ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    id={field.key}
                                    type="color"
                                    className="w-12 h-12 p-1"
                                    required
                                    value={formData[field.key]}
                                    onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                />
                                <span className="text-sm font-mono text-muted-foreground">{formData[field.key]}</span>
                            </div>
                        ) : (
                            <Input
                                id={field.key}
                                type={field.type || 'text'}
                                required
                                value={formData[field.key]}
                                onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                            />
                        )}
                    </div>
                ))}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : <ArrowRight className="mr-2 w-4 h-4" />}
                    Create Project
                </Button>
            </form>
        </div>
    )
}

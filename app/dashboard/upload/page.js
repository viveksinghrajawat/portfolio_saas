"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Rocket, AlertTriangle, Info } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function UploadPage() {
    const [html, setHtml] = useState("<h1>Hello {{ name }}</h1>\n<p>{{ description }}</p>")
    const [name, setName] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [isDeploying, setIsDeploying] = useState(false)

    const [detectedVariables, setDetectedVariables] = useState([])
    const [variableConfig, setVariableConfig] = useState({})

    const router = useRouter()

    useEffect(() => {
        // Regex to detect {{ variableName }}
        const regex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g
        const matches = new Set()
        let match

        while ((match = regex.exec(html)) !== null) {
            matches.add(match[1])
        }

        const newVariables = Array.from(matches)
        setDetectedVariables(newVariables)

        // Preserve existing config, add new ones with defaults
        setVariableConfig(prev => {
            const next = { ...prev }
            newVariables.forEach(v => {
                if (!next[v]) {
                    next[v] = { label: v.charAt(0).toUpperCase() + v.slice(1), type: 'text' }
                }
            })
            return next
        })
    }, [html])

    const updateConfig = (key, field, value) => {
        setVariableConfig(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }))
    }

    const onDeploy = async () => {
        if (!name || !html) return toast.error("Please fill in all fields")

        // Prepare template fields if variables exist
        const templateFields = detectedVariables.map(key => ({
            key,
            label: variableConfig[key].label,
            type: variableConfig[key].type
        }))

        // Security Warning check
        if (html.includes("<script") || html.includes("onclick=")) {
            const confirm = window.confirm("Security Warning: Your HTML contains scripts or event handlers. These will be stripped by the server. Continue?")
            if (!confirm) return
        }

        setIsDeploying(true)
        try {
            const res = await fetch("/api/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repoName: `custom-${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
                    html: html,
                    description: "Custom HTML Upload",
                    isPublic: isPublic,
                    isTemplate: detectedVariables.length > 0,
                    templateFields: detectedVariables.length > 0 ? templateFields : undefined
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
        <div className="container mx-auto py-10 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Upload / Paste HTML</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Project Name</Label>
                                <Input placeholder="My Cool Site" value={name} onChange={e => setName(e.target.value)} />
                            </div>

                            <div className="flex items-center justify-between border p-4 rounded-lg bg-muted/50">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Public Visibility</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Allow others to see and clone this project in "Community".
                                    </p>
                                </div>
                                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        <Label>HTML Code</Label>
                        <Textarea
                            className="h-96 font-mono text-sm"
                            placeholder="<h1>{{ name }}</h1>"
                            value={html}
                            onChange={e => setHtml(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Tip: Use <code className="bg-muted px-1 rounded">{"{{ variable }}"}</code> to create dynamic templates.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {detectedVariables.length > 0 && (
                        <Card className="border-primary/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-primary" />
                                    Template Variables Detected
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Configure how these variables will appear to users who clone your template.
                                </p>
                                {detectedVariables.map(key => (
                                    <div key={key} className="space-y-2 p-3 border rounded-md bg-secondary/20">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="font-mono">{`{{ ${key} }}`}</Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label className="text-xs">Label</Label>
                                                <Input
                                                    value={variableConfig[key]?.label}
                                                    onChange={e => updateConfig(key, 'label', e.target.value)}
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Type</Label>
                                                <select
                                                    className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={variableConfig[key]?.type}
                                                    onChange={e => updateConfig(key, 'type', e.target.value)}
                                                >
                                                    <option value="text">Text Input</option>
                                                    <option value="textarea">Text Area</option>
                                                    <option value="color">Color Picker</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <Button onClick={onDeploy} disabled={isDeploying} className="w-full" size="lg">
                        {isDeploying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
                        {isPublic ? "Publish & Deploy" : "Deploy Private Project"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

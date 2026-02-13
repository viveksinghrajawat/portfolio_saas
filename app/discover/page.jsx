"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, Globe, Copy } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function DiscoverPage() {
    const [activeTab, setActiveTab] = useState("all") // all, official, community
    const [search, setSearch] = useState("")
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchProjects()
    }, [activeTab, search])

    // Debounce search could be added here

    const fetchProjects = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (activeTab !== 'all') params.append('type', activeTab)
            if (search) params.append('search', search)

            const res = await fetch(`/api/discover?${params.toString()}`)
            if (res.ok) {
                const data = await res.json()
                setProjects(data)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to load projects")
        } finally {
            setIsLoading(false)
        }
    }

    const onUseTemplate = (project) => {
        if (project.templateFields && project.templateFields.length > 0) {
            // Needs configuration
            router.push(`/dashboard/new/${project.id}/configure`)
        } else {
            // Instant clone
            cloneProject(project.id)
        }
    }

    const cloneProject = async (id) => {
        try {
            const res = await fetch(`/api/project/${id}/clone`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            })
            const data = await res.json()
            if (res.ok) {
                toast.success("Project cloned successfully!")
                router.push("/dashboard")
            } else {
                throw new Error(data.error)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="container mx-auto py-10 p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Discover</h1>
                    <p className="text-muted-foreground mt-2">Find and use templates from our community and platform.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search templates..."
                        className="pl-8"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="official">Official</TabsTrigger>
                    <TabsTrigger value="community">Community</TabsTrigger>
                </TabsList>

                {isLoading ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-all group">
                                <div className="h-48 bg-muted relative overflow-hidden">
                                    {/* Sandbox Iframe Preview - strict security */}
                                    <iframe
                                        srcDoc={project.htmlContent}
                                        title={project.name}
                                        className="w-full h-full border-none pointer-events-none"
                                        sandbox="allow-scripts" // Minimal permission
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors" />

                                    {project.isTemplate && <Badge className="absolute top-2 right-2 bg-blue-500">Official</Badge>}
                                </div>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-start">
                                        <span className="truncate">{project.name}</span>
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="flex items-center"><Download className="w-3 h-3 mr-1" /> {project.downloads}</span>
                                        <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {project.views}</span>
                                        <span>• by {project.user?.name || "Unknown"}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description || "No description provided."}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" onClick={() => onUseTemplate(project)}>
                                        <Copy className="w-4 h-4 mr-2" /> Use Template
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </Tabs>
        </div>
    )
}

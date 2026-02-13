"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Upload, Layout, Loader2, ExternalLink, Github } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch("/api/projects")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProjects(data)
            })
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Projects</h1>
                <div className="flex gap-4">
                    <Link href="/dashboard/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Project
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Create New Card */}
                <Link href="/dashboard/new">
                    <div className="h-full border border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-4 hover:bg-secondary/50 transition-colors cursor-pointer group">
                        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-background">
                            <Plus className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-lg">Create New Project</h3>
                        <p className="text-sm text-muted-foreground text-center">
                            Start from a template or upload your own code
                        </p>
                    </div>
                </Link>

                {isLoading && (
                    <div className="col-span-2 flex justify-center py-20">
                        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
                    </div>
                )}

                {!isLoading && projects.map(project => (
                    <Card key={project.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex justify-between">
                                <span className="truncate">{project.name}</span>
                                {project.isPublic && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Public</span>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {project.description || "No description"}
                            </p>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                                <div>Downloads: {project.downloads}</div>
                                <div>Views: {project.views}</div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            {project.repoUrl && (
                                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Github className="w-4 h-4 mr-2" /> Repo
                                    </Button>
                                </a>
                            )}
                            {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                                    <Button size="sm" className="w-full">
                                        <ExternalLink className="w-4 h-4 mr-2" /> Live
                                    </Button>
                                </a>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

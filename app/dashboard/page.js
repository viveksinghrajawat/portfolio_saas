import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Upload, Layout } from "lucide-react"

export default function Dashboard() {
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
                <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-4 hover:bg-secondary/50 transition-colors cursor-pointer group">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-background">
                        <Plus className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg">Create New Project</h3>
                    <p className="text-sm text-muted-foreground text-center">
                        Start from a template or upload your own code
                    </p>
                </div>

                {/* Mock Project Card */}
                <div className="border rounded-lg p-6 flex flex-col gap-4">
                    <div className="h-32 bg-muted rounded-md w-full animate-pulse" />
                    <div>
                        <h3 className="font-semibold text-lg">My Portfolio</h3>
                        <p className="text-sm text-muted-foreground">Last updated 2 days ago</p>
                    </div>
                    <div className="flex gap-2 mt-auto">
                        <Button variant="outline" size="sm" className="w-full">Edit</Button>
                        <Button variant="outline" size="sm" className="w-full">Deploy</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Layout, Upload } from "lucide-react"

export default function NewProject() {
    return (
        <div className="container mx-auto py-20 max-w-4xl">
            <h1 className="text-3xl font-bold text-center mb-12">How do you want to start?</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Template Option */}
                <Link href="/dashboard/templates" className="block">
                    <div className="border rounded-xl p-8 hover:border-primary cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center gap-6">
                        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                            <Layout className="h-10 w-10 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Use a Template</h2>
                            <p className="text-muted-foreground">
                                Choose from our professional templates and fill in your details. No coding required.
                            </p>
                        </div>
                        <Button className="mt-auto">Browse Templates</Button>
                    </div>
                </Link>

                {/* Upload Option */}
                <Link href="/dashboard/upload" className="block">
                    <div className="border rounded-xl p-8 hover:border-primary cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center gap-6">
                        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                            <Upload className="h-10 w-10 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Upload HTML</h2>
                            <p className="text-muted-foreground">
                                Already have a site? Upload your HTML/CSS files and we'll host it for you.
                            </p>
                        </div>
                        <Button variant="outline" className="mt-auto">Upload Code</Button>
                    </div>
                </Link>
            </div>
        </div>
    )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TEMPLATES } from "@/lib/templates"
import { ArrowLeft } from "lucide-react"

export default function TemplateGallery() {
    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <Link href="/dashboard/new" className="text-sm text-muted-foreground flex items-center hover:text-primary">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Link>
                <h1 className="text-3xl font-bold mt-4">Choose a Template</h1>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEMPLATES.map(template => (
                    <div key={template.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col">
                        <div className="h-48 bg-muted flex items-center justify-center text-muted-foreground">
                            {/* Placeholder for real thumbnail */}
                            {template.name} Preview
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                            <p className="text-muted-foreground mb-4 text-sm">{template.description}</p>
                            <Link href={`/editor/${template.id}`} className="mt-auto">
                                <Button className="w-full">Select Template</Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

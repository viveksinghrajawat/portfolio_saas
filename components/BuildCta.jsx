"use client"

import { Button } from "@/components/ui/button"
import { Calendar, FileText } from "lucide-react"

export default function BuildCta() {
    return (
        <section className="py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-6">Want to know how I built this?</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                    I help founders and businesses build scalable SaaS applications.
                    Get the exact project plan used for this site or schedule a call to discuss your ideas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Request Project Plan
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary gap-2">
                        <Calendar className="w-4 h-4" />
                        Schedule Strategy Call
                    </Button>
                </div>
            </div>
        </section>
    )
}

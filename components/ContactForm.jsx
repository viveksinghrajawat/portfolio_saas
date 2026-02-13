"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ContactForm() {
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        setLoading(false)
        toast.success("Message sent successfully! I'll get back to you soon.")
        e.target.reset()
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <input
                required
                className="w-full p-2 rounded-md border bg-background"
                placeholder="Name"
                name="name"
            />
            <input
                required
                type="email"
                className="w-full p-2 rounded-md border bg-background"
                placeholder="Email"
                name="email"
            />
            <textarea
                required
                className="w-full p-2 rounded-md border bg-background h-32"
                placeholder="Message"
                name="message"
            />
            <Button disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send Message"}
            </Button>
        </form>
    )
}

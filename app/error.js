"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p className="text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
            <div className="flex gap-2">
                <Button onClick={() => window.location.href = '/'}>Go Home</Button>
                <Button variant="outline" onClick={() => reset()}>Try again</Button>
            </div>
        </div>
    )
}

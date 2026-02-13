import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-4xl font-bold">404</h2>
            <p className="text-xl text-muted-foreground">Page Not Found</p>
            <Button asChild>
                <Link href="/">Return Home</Link>
            </Button>
        </div>
    )
}

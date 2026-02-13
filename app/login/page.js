"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { Github } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-muted/40">
            <div className="mx-auto grid w-[350px] gap-6 p-6 bg-background rounded-lg border shadow-sm">
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Login</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                <div className="grid gap-4">
                    <Button variant="outline" className="w-full" onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
                        <Github className="mr-2 h-4 w-4" />
                        Login with GitHub
                    </Button>
                </div>
            </div>
        </div>
    )
}

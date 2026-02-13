"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import BuildCta from "@/components/BuildCta";
import ContactForm from "@/components/ContactForm";

export default function Home() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Navbar Placeholder */}
            <nav className="p-4 flex justify-between items-center border-b">
                <h1 className="text-xl font-bold">MyPortfolio</h1>
                <div className="flex gap-4">
                    <Link href="/login">
                        <Button variant="outline">Login</Button>
                    </Link>
                    <Link href="/login">
                        <Button>Get Started</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-4 text-center flex flex-col items-center gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Profile Pic Placeholder - Toggleable in future */}
                    <div className="w-32 h-32 bg-secondary rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
                        👋
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl mb-4">
                        Hi, I'm <span className="text-primary">Dev Name</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Full Stack Developer specializing in building exceptional digital experiences.
                        Currently focused on building accessible, human-centered products.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-4 mt-4"
                >
                    <Link href="/login">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25">
                            Build your own portfolio & deploy freely
                        </Button>
                    </Link>
                    <Link href="#contact">
                        <Button variant="outline" size="lg">Contact Me</Button>
                    </Link>
                </motion.div>
            </section>

            {/* Tech Stack */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Tech Stack</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-center">
                        {['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind', 'Prisma'].map((tech) => (
                            <div key={tech} className="p-4 bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <p className="font-semibold">{tech}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects */}
            <section className="py-16 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="border rounded-xl overflow-hidden hover:border-primary transition-colors">
                            <div className="h-48 bg-muted flex items-center justify-center">
                                Project Preview
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">Project Name {item}</h3>
                                <p className="text-muted-foreground mb-4">Brief description of the project and the technologies used.</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Demo</Button>
                                    <Button variant="ghost" size="sm">Code</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact & Meeting */}
            <section id="contact" className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                            <ContactForm />
                        </div>

                        {/* Booking */}
                        <div className="flex flex-col justify-center">
                            <h3 className="text-2xl font-bold mb-4">Book a Meeting</h3>
                            <p className="text-muted-foreground mb-6">
                                Want to discuss a project or just chat? Pick a time that works for you.
                            </p>
                            <Button size="lg" variant="secondary" className="w-full">
                                Schedule a Call
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lead Gen CTA */}
            <BuildCta />

            {/* Footer */}
            <footer className="py-8 border-t bg-background">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground">© 2024 Dev Name. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Button variant="ghost" size="icon"><Github className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon"><Twitter className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon"><Linkedin className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon"><Mail className="w-5 h-5" /></Button>
                    </div>
                </div>
            </footer>
        </main>
    );
}

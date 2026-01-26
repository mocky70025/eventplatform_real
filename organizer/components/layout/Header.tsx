"use client";

import Link from "next/link";
import { Tent } from "lucide-react";
import { UserNav } from "./UserNav";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full shadow-sm bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-orange-50">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <Tent className="h-6 w-6 text-orange-600" />
                        <span className="text-xl font-bold tracking-tight text-orange-900">
                            Organizer
                        </span>
                    </Link>
                </div>

                <nav className="flex items-center gap-4">
                    <UserNav />
                </nav>
            </div>
        </header>
    );
}

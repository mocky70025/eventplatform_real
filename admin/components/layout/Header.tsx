import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { UserNav } from "./UserNav";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <ShieldCheck className="h-5 w-5 text-gray-900" />
                        <span className="text-lg font-bold tracking-tight text-gray-900">
                            Platform Admin
                        </span>
                    </Link>
                    <nav className="flex items-center gap-4 text-sm font-medium">
                        <Link href="/organizers" className="text-gray-500 hover:text-gray-900 transition-colors">主催者管理</Link>
                        <Link href="/events" className="text-gray-500 hover:text-gray-900 transition-colors">イベント管理</Link>
                    </nav>
                </div>

                <nav className="flex items-center gap-4">
                    <UserNav initialUser={user} />
                </nav>
            </div>
        </header>
    );
}

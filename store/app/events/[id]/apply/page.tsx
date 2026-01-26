import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import ApplyClient from "./ApplyClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ApplyPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Check Auth & Profile
    let user = null;
    try {
        const { data, error } = await supabase.auth.getUser();
        if (!error) {
            user = data.user;
        }
    } catch (error) {
        console.error("Apply page auth error:", error);
        redirect("/login");
    }
    if (!user) redirect("/login");

    const { data: exhibitor } = await supabase
        .from("exhibitors")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (!exhibitor) redirect("/onboarding");

    // 2. Refresh Event Details
    const { data: event } = await supabase
        .from("events")
        .select("*, organizers(company_name)")
        .eq("id", id)
        .single();

    if (!event) return notFound();

    // 3. Check for existing application
    const { data: existingApp } = await supabase
        .from("event_applications")
        .select("id")
        .eq("event_id", id)
        .eq("exhibitor_id", exhibitor.id)
        .single();

    if (existingApp) {
        redirect(`/events/${id}`);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <ApplyClient event={event} exhibitor={exhibitor} />
            </main>
        </div>
    );
}

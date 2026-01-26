import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import EventList from "./EventList";
import { FileText } from "lucide-react";

export default async function EventsPage() {
    const supabase = await createClient();

    const { data: events, error } = await supabase
        .from("events")
        .select(`
            *,
            organizer:organizers(company_name, name)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center p-4">
                    <p className="text-red-500">データ取得エラー: {error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-purple-50 rounded-xl">
                        <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">イベント管理</h1>
                        <p className="text-sm text-gray-500">プラットフォーム上の全イベントの公開状態と不適切な内容を管理します</p>
                    </div>
                </div>

                <EventList events={events as any || []} />
            </main>
        </div>
    );
}

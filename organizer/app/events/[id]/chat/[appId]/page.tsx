"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, MessageSquare, Calendar, Store, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function OrganizerChatPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;
    const applicationId = params.appId as string;
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [context, setContext] = useState<{
        eventName: string;
        shopName: string;
        currentUserId: string;
    } | null>(null);

    useEffect(() => {
        const fetchContext = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("ログインが必要です");

                // Fetch application and related event/exhibitor
                const { data: appData, error: appError } = await supabase
                    .from("event_applications")
                    .select(`
                        id,
                        status,
                        event:events (
                            event_name
                        ),
                        exhibitor:exhibitors (
                            shop_name
                        )
                    `)
                    .eq("id", applicationId)
                    .single();

                if (appError) throw appError;
                if (appData.status !== 'approved') {
                    throw new Error("承認された申込以外ではチャットを利用できません");
                }

                setContext({
                    eventName: (appData.event as any).event_name,
                    shopName: (appData.exhibitor as any).shop_name,
                    currentUserId: user.id
                });

            } catch (err: any) {
                console.error("Fetch context error:", err);
                setError(err.message || "データの取得に失敗しました");
            } finally {
                setLoading(false);
            }
        };

        fetchContext();
    }, [applicationId, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
            </div>
        );
    }

    if (error || !context) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">エラーが発生しました</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <Button onClick={() => router.back()}>戻る</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col gap-1">
                        <Link href={`/events/${eventId}`} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors text-sm mb-1">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            イベント詳細に戻る
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">出店者様とのチャット</h1>
                        </div>
                    </div>
                </div>

                {/* 開発中メッセージ */}
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">チャット機能は開発中です</h2>
                    <p className="text-gray-500 mb-6">この機能は現在開発中です。しばらくお待ちください。</p>
                    <Link href={`/events/${eventId}`}>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                            イベント詳細に戻る
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}

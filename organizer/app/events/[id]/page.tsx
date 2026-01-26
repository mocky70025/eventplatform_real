"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import {
    Calendar, MapPin, Users, CheckCircle2, XCircle,
    ArrowLeft, ExternalLink, Clock, MessageSquare,
    Edit, AlertCircle, Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EventDetail {
    id: string;
    event_name: string;
    genre: string;
    description: string;
    event_start_date: string;
    event_end_date: string;
    event_time: string;
    venue_name: string;
    address: string;
    main_image_url: string;
    status: string;
    recruit_count: number;
    fee: string;
}

interface Application {
    id: string;
    status: string;
    message: string;
    created_at: string;
    exhibitor: {
        id: string;
        shop_name: string;
        name: string;
        genre: string;
        email: string;
    };
}

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;
    const supabase = createClient();

    const [event, setEvent] = useState<EventDetail | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
    const [error, setError] = useState("");

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("ログインが必要です");

            // Fetch event
            const { data: eventData, error: eventError } = await supabase
                .from("events")
                .select("*")
                .eq("id", eventId)
                .single();

            if (eventError) throw eventError;
            setEvent(eventData);

            // Fetch applications
            const { data: appData, error: appError } = await supabase
                .from("event_applications")
                .select(`
                    id,
                    status,
                    message,
                    created_at,
                    exhibitor:exhibitors (
                        id,
                        shop_name,
                        name,
                        genre,
                        email
                    )
                `)
                .eq("event_id", eventId)
                .order("created_at", { ascending: false });

            if (appError) throw appError;
            setApplications(appData as any);

        } catch (err: any) {
            console.error("Fetch error:", err);
            setError(err.message || "データの取得に失敗しました");
        } finally {
            setIsLoading(false);
        }
    }, [eventId, supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdateStatus = async (applicationId: string, newStatus: "approved" | "rejected" | "pending") => {
        setIsActionLoading(applicationId);
        try {
            const { error } = await supabase
                .from("event_applications")
                .update({ status: newStatus })
                .eq("id", applicationId);

            if (error) throw error;

            // Local update
            setApplications(prev => prev.map(app =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
        } catch (err: any) {
            alert("ステータスの更新に失敗しました: " + err.message);
        } finally {
            setIsActionLoading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">エラーが発生しました</h2>
                    <p className="text-gray-500 mb-6">{error || "イベントが見つかりません"}</p>
                    <Link href="/">
                        <Button>ダッシュボードに戻る</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const approvedCount = applications.filter(a => a.status === 'approved').length;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Navigation & Actions */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        ダッシュボードに戻る
                    </Link>
                    <Link href={`/events/${eventId}/edit`}>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="w-4 h-4" />
                            イベントを編集
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Event Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="relative aspect-video bg-gray-100">
                                {event.main_image_url ? (
                                    <img
                                        src={event.main_image_url}
                                        alt={event.event_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Calendar className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-xs font-bold border shadow-sm bg-white/95",
                                        event.status === 'published' ? "text-green-600 border-green-100" : "text-gray-500 border-gray-100"
                                    )}>
                                        {event.status === 'published' ? "公開中" : "非公開"}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h1 className="text-xl font-bold text-gray-900 mb-4">{event.event_name}</h1>

                                <div className="space-y-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-700">開催日時</p>
                                            <p className="text-gray-500">{event.event_start_date} {event.event_time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-700">会場</p>
                                            <p className="text-gray-500">{event.venue_name}</p>
                                            <p className="text-xs text-gray-400">{event.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Users className="w-5 h-5 text-gray-400 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-700">募集枠</p>
                                            <p className="text-gray-500">{approvedCount} / {event.recruit_count} 店舗 (承認済み)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-500" />
                                クイック統計
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-orange-50 p-4 rounded-xl">
                                    <p className="text-xs text-orange-600 font-bold mb-1">総申込数</p>
                                    <p className="text-2xl font-black text-orange-700">{applications.length}</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <p className="text-xs text-blue-600 font-bold mb-1">未処理</p>
                                    <p className="text-2xl font-black text-blue-700">{applications.filter(a => a.status === 'pending').length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Applicants List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">出店申込一覧</h2>
                            <span className="text-sm text-gray-500">全 {applications.length} 件</span>
                        </div>

                        {applications.length > 0 ? (
                            <div className="space-y-4">
                                {applications.map((app) => (
                                    <div
                                        key={app.id}
                                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-full text-xs font-bold border",
                                                        app.status === 'approved' ? "bg-green-50 text-green-700 border-green-100" :
                                                            app.status === 'rejected' ? "bg-red-50 text-red-700 border-red-100" :
                                                                "bg-blue-50 text-blue-700 border-blue-100"
                                                    )}>
                                                        {app.status === 'approved' ? "承認済み" :
                                                            app.status === 'rejected' ? "見送り" : "確認中"}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        申込日: {new Date(app.created_at).toLocaleDateString('ja-JP')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                        {app.exhibitor?.id ? (
                                                            <Link href={`/exhibitors/${app.exhibitor.id}`} className="hover:text-orange-600 transition-colors flex items-center gap-2">
                                                                {app.exhibitor?.shop_name || "店舗名なし"}
                                                                <ExternalLink className="w-4 h-4" />
                                                            </Link>
                                                        ) : (
                                                            <span>{app.exhibitor?.shop_name || "店舗名なし"}</span>
                                                        )}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {app.exhibitor?.genre || "ジャンル未設定"} ・ {app.exhibitor?.name || "名前なし"}
                                                    </p>
                                                </div>
                                                {app.message && (
                                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                        <p className="text-sm text-gray-600 leading-relaxed italic">
                                                            <MessageSquare className="w-4 h-4 inline mr-2 text-gray-400" />
                                                            {app.message}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex md:flex-col gap-2 justify-end min-w-[140px]">
                                                {app.status === 'pending' ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="bg-orange-600 hover:bg-orange-700 text-white w-full"
                                                            onClick={() => handleUpdateStatus(app.id, 'approved')}
                                                            disabled={isActionLoading === app.id}
                                                        >
                                                            {isActionLoading === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "承認する"}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-100 w-full"
                                                            onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                                            disabled={isActionLoading === app.id}
                                                        >
                                                            お断りする
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-400 hover:bg-gray-50 w-full"
                                                        onClick={() => handleUpdateStatus(app.id, 'pending')}
                                                        disabled={isActionLoading === app.id}
                                                    >
                                                        未処理に戻す
                                                    </Button>
                                                )}
                                                {app.status === 'approved' && (
                                                    <Link href={`/events/${eventId}/chat/${app.id}`}>
                                                        <Button size="sm" variant="outline" className="w-full gap-2 text-orange-600 border-orange-100 hover:bg-orange-50">
                                                            <MessageSquare className="w-4 h-4" />
                                                            チャット
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900">まだ申込はありません</h3>
                                <p className="text-gray-500 mt-2">出店者からの応募があるまでお待ちください。</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

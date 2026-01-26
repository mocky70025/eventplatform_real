import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Store,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Clock
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    let session = null;
    try {
        const { data, error } = await supabase.auth.getSession();
        if (!error) {
            session = data.session;
        }
    } catch (error) {
        console.error("Application detail page auth error:", error);
        redirect("/login");
    }

    if (!session) {
        redirect("/login");
    }

    // Get exhibitor profile
    const { data: exhibitor } = await supabase
        .from("exhibitors")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

    if (!exhibitor) {
        redirect("/onboarding");
    }

    // Get application details with event
    const { data: application, error } = await supabase
        .from("event_applications")
        .select(`
            *,
            event:events (
                id,
                event_name,
                event_start_date,
                venue_name,
                organizer:organizers (
                    company_name,
                    name,
                    email,
                    phone_number
                )
            )
        `)
        .eq("id", id)
        .eq("exhibitor_id", exhibitor.id)
        .maybeSingle();

    if (error || !application) {
        notFound();
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "approved":
                return {
                    label: "承認済み",
                    icon: CheckCircle2,
                    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    iconClass: "text-emerald-500"
                };
            case "rejected":
                return {
                    label: "見送り",
                    icon: XCircle,
                    className: "bg-red-50 text-red-700 border-red-200",
                    iconClass: "text-red-500"
                };
            default:
                return {
                    label: "確認中",
                    icon: Clock,
                    className: "bg-blue-50 text-blue-700 border-blue-200",
                    iconClass: "text-blue-500"
                };
        }
    };

    const statusInfo = getStatusInfo(application.status);
    const StatusIcon = statusInfo.icon;
    const event = application.event as any;
    const organizer = event?.organizer as any;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
                {/* Back Button */}
                <Link href="/applications" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    申込管理に戻る
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    statusInfo.className
                                )}>
                                    <StatusIcon className={cn("w-5 h-5", statusInfo.iconClass)} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">申込詳細</h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        申込日: {new Date(application.created_at).toLocaleDateString('ja-JP')}
                                    </p>
                                </div>
                            </div>
                            <div className={cn(
                                "px-4 py-2 rounded-full text-sm font-bold border",
                                statusInfo.className
                            )}>
                                {statusInfo.label}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Event Information */}
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Store className="w-5 h-5 text-emerald-600" />
                                応募先イベント
                            </h2>
                            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{event?.event_name}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-emerald-600" />
                                        {event?.event_start_date ? new Date(event.event_start_date).toLocaleDateString('ja-JP') : "未定"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-600" />
                                        {event?.venue_name || "会場未定"}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Application Message */}
                        {application.message && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">メッセージ</h2>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <p className="text-gray-700 whitespace-pre-wrap">{application.message}</p>
                                </div>
                            </section>
                        )}

                        {/* Organizer Information */}
                        {organizer && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">主催者情報</h2>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <p className="font-bold text-gray-900 mb-2">{organizer.company_name || organizer.name}</p>
                                    {organizer.email && (
                                        <p className="text-sm text-gray-600">Email: {organizer.email}</p>
                                    )}
                                    {organizer.phone_number && (
                                        <p className="text-sm text-gray-600">電話: {organizer.phone_number}</p>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                            <Link href={`/events/${event?.id}`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                    イベント詳細を見る
                                </Button>
                            </Link>
                            {application.status === 'approved' && (
                                <Link href={`/applications/${application.id}/chat`} className="flex-1">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        チャットを開始
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import {
    Calendar,
    MapPin,
    ChevronRight,
    MessageSquare,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function ApplicationsPage() {
    const supabase = await createClient();
    let session = null;
    try {
        const { data, error } = await supabase.auth.getSession();
        if (!error) {
            session = data.session;
        }
    } catch (error) {
        console.error("Applications page auth error:", error);
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

    // Get applications with event details
    const { data: applications, error } = await supabase
        .from("event_applications")
        .select(`
            *,
            event:events (
                id,
                event_name,
                event_start_date,
                venue_name,
                main_image_url
            )
        `)
        .eq("exhibitor_id", exhibitor.id)
        .order("created_at", { ascending: false });

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "approved":
                return {
                    label: "承認済み",
                    icon: CheckCircle2,
                    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
                    iconClass: "text-emerald-500"
                };
            case "rejected":
                return {
                    label: "見送り",
                    icon: XCircle,
                    className: "bg-red-50 text-red-700 border-red-100",
                    iconClass: "text-red-500"
                };
            default:
                return {
                    label: "確認中",
                    icon: Clock,
                    className: "bg-blue-50 text-blue-700 border-blue-100",
                    iconClass: "text-blue-500"
                };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">申込管理</h1>
                    <p className="text-gray-500 mt-1">イベントへの申込状況を確認できます。</p>
                </div>

                {applications && applications.length > 0 ? (
                    <div className="grid gap-4">
                        {applications.map((app: any) => {
                            const statusInfo = getStatusInfo(app.status);
                            const StatusIcon = statusInfo.icon;

                            return (
                                <div
                                    key={app.id}
                                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-6">
                                        {/* Event Image / Placeholder */}
                                        <div className="w-full md:w-32 h-32 md:h-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                            {app.event?.main_image_url ? (
                                                <img
                                                    src={app.event.main_image_url}
                                                    alt={app.event.event_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Calendar className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                                                    statusInfo.className
                                                )}>
                                                    <StatusIcon className={cn("w-3.5 h-3.5", statusInfo.iconClass)} />
                                                    {statusInfo.label}
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    申込日: {new Date(app.created_at).toLocaleDateString('ja-JP')}
                                                </span>
                                            </div>

                                            <Link href={`/applications/${app.id}`} className="block">
                                                <h2 className="text-lg font-bold text-gray-900 truncate hover:text-emerald-600 transition-colors">
                                                    {app.event?.event_name}
                                                </h2>
                                            </Link>

                                            <div className="mt-2 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    {app.event?.event_start_date ? new Date(app.event.event_start_date).toLocaleDateString('ja-JP') : "未定"}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4" />
                                                    {app.event?.venue_name || "会場未定"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                                            <Link href={`/events/${app.event?.id}`}>
                                                <Button variant="outline" size="sm" className="w-full">
                                                    詳細を表示
                                                </Button>
                                            </Link>

                                            {app.status === 'approved' && (
                                                <Link href={`/applications/${app.id}/chat`}>
                                                    <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2">
                                                        <MessageSquare className="w-4 h-4" />
                                                        チャット
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {/* Message snippet if any */}
                                    {app.message && (
                                        <div className="bg-gray-50 px-5 md:px-6 py-3 border-t border-gray-100">
                                            <p className="text-xs text-gray-500 line-clamp-1 italic">
                                                " {app.message} "
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">申込済みのイベントはありません</h3>
                        <p className="text-gray-500 mt-2 mb-6">気になるイベントを探して申し込んでみましょう。</p>
                        <Link href="/">
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                イベントを探す
                            </Button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}

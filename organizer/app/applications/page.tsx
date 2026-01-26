import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import {
    ClipboardList,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    Store,
    Calendar as CalendarIcon
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function ApplicationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get organizer profile
    const { data: profile } = await supabase
        .from("organizers")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (!profile) {
        redirect("/onboarding");
    }

    // Fetch applications for events owned by this organizer
    // Note: We join event_applications -> events -> exhibitors
    const { data: applications, error } = await supabase
        .from("event_applications")
        .select(`
            *,
            events!inner(*),
            exhibitors(*)
        `)
        .eq("events.organizer_id", profile.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching applications:", error);
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-50 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-50 text-red-700 border-red-200";
            default:
                return "bg-orange-50 text-orange-700 border-orange-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved":
                return <CheckCircle2 className="w-4 h-4" />;
            case "rejected":
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "approved":
                return "承認済み";
            case "rejected":
                return "却下済み";
            default:
                return "承認待ち";
        }
    };

    return (
        <div className="min-h-screen bg-orange-50/30">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <ClipboardList className="w-8 h-8 text-orange-600" />
                        申込管理
                    </h1>
                    <p className="text-gray-500 mt-1">
                        各イベントへの応募状況を確認・管理できます。
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {applications && applications.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">状態</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">出店者 / 店舗名</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">応募先イベント</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">応募日</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-orange-50/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
                                                    getStatusStyles(app.status)
                                                )}>
                                                    {getStatusIcon(app.status)}
                                                    {getStatusText(app.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                                        <Store className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{app.exhibitors?.shop_name}</p>
                                                        <p className="text-xs text-gray-500">{app.exhibitors?.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-700 line-clamp-1">{app.events?.event_name}</p>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                                                        <CalendarIcon className="w-3 h-3" />
                                                        {app.events?.event_start_date}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(app.created_at).toLocaleDateString('ja-JP')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/applications/${app.id}`}>
                                                    <Button variant="outline" size="sm" className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300">
                                                        <Eye className="w-4 h-4" />
                                                        詳細を確認
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ClipboardList className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">まだ申し込みはありません</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                イベントを公開して出店者を募集しましょう。申し込みが届くとここに表示されます。
                            </p>
                            <Link href="/events/new">
                                <Button className="mt-8 shadow-lg shadow-orange-500/20">
                                    新しいイベントを作成
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

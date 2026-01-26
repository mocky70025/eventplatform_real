import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Store,
    User,
    Mail,
    Phone,
    FileText,
    ExternalLink,
    AlertTriangle,
    CheckCircle2,
    XCircle
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ApplicationStatusActions from "./ApplicationStatusActions";
import DocumentCard from "./DocumentCard";

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
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

    // Fetch application details with event and exhibitor
    const { data: app, error } = await supabase
        .from("event_applications")
        .select(`
            *,
            events!inner(*),
            exhibitors(*)
        `)
        .eq("id", id)
        .eq("events.organizer_id", profile.id)
        .single();

    if (error || !app) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-orange-50/30">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="mb-8">
                    <Link href="/applications" className="flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors mb-4 group">
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> 申込一覧へ戻る
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                申込詳細
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {app.exhibitors?.shop_name} からの応募内容を確認してください。
                            </p>
                        </div>

                        <ApplicationStatusActions 
                            initialStatus={app.status} 
                            applicationId={app.id}
                            eventId={(app.events as any)?.id}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Exhibitor Profile */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Exhibitor Profile Card */}
                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Store className="w-6 h-6 text-emerald-600" />
                                出店者プロフィール
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
                                        <Store className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{app.exhibitors?.shop_name}</h3>
                                        <p className="text-gray-500 font-medium">{app.exhibitors?.name}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">自己紹介 / メッセージ</h4>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {app.message || "メッセージはありません。"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <div className="text-sm">
                                            <p className="text-gray-400 font-medium leading-none mb-1">メール</p>
                                            <p className="text-gray-900 font-bold">{app.exhibitors?.email}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <div className="text-sm">
                                            <p className="text-gray-400 font-medium leading-none mb-1">電話番号</p>
                                            <p className="text-gray-900 font-bold">{app.exhibitors?.phone_number}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Documents Section */}
                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-orange-600" />
                                提出書類
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DocumentCard
                                    label="営業許可証"
                                    imageUrl={app.exhibitors?.business_license_image_url}
                                    required={true}
                                />
                                <DocumentCard
                                    label="車検証"
                                    imageUrl={app.exhibitors?.vehicle_inspection_image_url}
                                />
                                <DocumentCard
                                    label="PL保険"
                                    imageUrl={app.exhibitors?.pl_insurance_image_url}
                                />
                                <DocumentCard
                                    label="火器類配置図"
                                    imageUrl={app.exhibitors?.fire_equipment_layout_image_url}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Event Summary & Status */}
                    <div className="space-y-8">
                        {/* Event Card */}
                        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
                            <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1">対象イベント</p>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">{app.events?.event_name}</h3>

                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-orange-500" />
                                    {app.events?.event_start_date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    {app.events?.venue_name}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Store className="w-4 h-4 text-orange-500" />
                                    {app.events?.genre}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <Link href={`/events/${app.events?.id}`}>
                                    <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 gap-2">
                                        イベント管理画面を見る
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}


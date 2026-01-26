import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import {
    Calendar, MapPin, Users, Clock,
    ArrowLeft, Share2, AlertCircle, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Get event details with organizer info
    const { data: event, error } = await supabase
        .from("events")
        .select("*, organizers(*)")
        .eq("id", id)
        .single();

    if (error || !event) {
        return notFound();
    }

    // 2. Check if user is logged in
    let user = null;
    try {
        const { data, error } = await supabase.auth.getUser();
        if (!error) {
            user = data.user;
        }
    } catch (error) {
        // Silently handle auth errors - user will be null
        console.error("Event detail page auth error:", error);
    }

    // 3. If logged in, check if already applied
    let hasApplied = false;
    let exhibitorProfile = null;

    if (user) {
        // Get exhibitor profile
        const { data: profile } = await supabase
            .from("exhibitors")
            .select("id")
            .eq("user_id", user.id)
            .single();

        exhibitorProfile = profile;

        if (profile) {
            const { data: application } = await supabase
                .from("event_applications")
                .select("id")
                .eq("event_id", id)
                .eq("exhibitor_id", profile.id)
                .single();

            if (application) hasApplied = true;
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Back Button & Actions (Mobile Sticky) */}
            <div className="sticky top-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 px-4 py-3 sm:hidden">
                <Link href="/" className="flex items-center text-sm font-medium text-gray-600">
                    <ArrowLeft className="w-4 h-4 mr-1" /> イベント一覧へ
                </Link>
            </div>

            <main className="container mx-auto px-4 py-6 sm:py-10 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">

                    {/* Left Column: Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Section */}
                        <section>
                            <Link href="/" className="hidden sm:flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors mb-6">
                                <ArrowLeft className="w-4 h-4 mr-1" /> イベント一覧へ戻る
                            </Link>

                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm mb-6">
                                {event.main_image_url ? (
                                    <img
                                        src={event.main_image_url}
                                        alt={event.event_name}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-50 text-emerald-200">
                                        <Calendar className="w-20 h-20" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1.5 rounded-lg text-sm font-bold bg-white/95 text-primary shadow-lg backdrop-blur-sm">
                                        {event.genre}
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
                                {event.event_name}
                            </h1>

                            <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                                "{event.lead_text}"
                            </p>
                        </section>

                        {/* Event Details Grid */}
                        <section className="bg-emerald-50/50 rounded-2xl p-6 sm:p-8 border border-emerald-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                    <Calendar className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">開催日時</p>
                                    <p className="font-bold text-gray-900">{event.event_start_date} {event.event_time}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                    <MapPin className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">開催場所</p>
                                    <p className="font-bold text-gray-900">{event.venue_name}</p>
                                    <p className="text-sm text-gray-500">{event.address}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                    <Users className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">募集規模</p>
                                    <p className="font-bold text-gray-900">{event.recruit_count}店舗</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                    <Clock className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">募集締切</p>
                                    <p className="font-bold text-orange-600 underline decoration-2 underline-offset-4">{event.application_period_end}</p>
                                </div>
                            </div>
                        </section>

                        {/* Description */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                イベント詳細
                            </h2>
                            <div className="text-gray-600 leading-loose whitespace-pre-wrap bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                {event.description}
                            </div>
                        </section>

                        {/* Requirements */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                出店条件・注意事項
                            </h2>
                            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-extrabold rounded-md shrink-0 mt-1">
                                        出店料
                                    </div>
                                    <p className="font-bold text-gray-900">{event.fee}</p>
                                </div>
                                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm border-t border-gray-100 pt-4">
                                    {event.requirements}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sticky Sidebar / Apply CTA */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* Application Card */}
                            <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-900/5 border border-gray-100 p-8">
                                <div className="mb-6">
                                    <p className="text-sm font-bold text-gray-400 mb-1">現在のステータス</p>
                                    <div className="flex items-center gap-2">
                                        {hasApplied ? (
                                            <span className="flex items-center gap-2 text-emerald-600 font-extrabold text-lg">
                                                <CheckCircle2 className="w-6 h-6" /> 応募済み
                                            </span>
                                        ) : (
                                            <span className="text-gray-900 font-extrabold text-lg">未応募</span>
                                        )}
                                    </div>
                                </div>

                                {hasApplied ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            このイベントへの応募は完了しています。主催者からの連絡をお待ちください。
                                        </p>
                                        <Button disabled className="w-full bg-gray-100 text-gray-400 h-14 rounded-2xl">
                                            すでに応募しています
                                        </Button>
                                    </div>
                                ) : !user ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                            出店を希望される方は、ログインして応募手続きを行ってください。
                                        </p>
                                        <Link href="/login" className="block">
                                            <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20">
                                                ログインして応募
                                            </Button>
                                        </Link>
                                    </div>
                                ) : !exhibitorProfile ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-3 text-orange-700 text-sm mb-4">
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <p>詳細を見るには、オンボーディングを完了させる必要があります。</p>
                                        </div>
                                        <Link href="/onboarding" className="block">
                                            <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20">
                                                プロフィール作成へ
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                            募集内容と条件をよくご確認の上、以下のボタンから応募してください。
                                        </p>
                                        {/* Using form for Server Action or Client Component */}
                                        <Link href={`/events/${id}/apply`}>
                                            <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 group">
                                                このイベントに応募
                                                <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
                                        <Share2 className="w-4 h-4" /> イベントを共有
                                    </button>
                                    <p className="text-[10px] text-gray-300">ID: {event.id.slice(0, 8)}</p>
                                </div>
                            </div>

                            {/* Organizer Profile Card */}
                            <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">主催者プロフィール</p>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
                                        {event.organizers?.company_name?.[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{event.organizers?.company_name}</h3>
                                        <p className="text-xs text-gray-500">{event.organizers?.name}</p>
                                    </div>
                                </div>
                                {event.organizers?.id && (
                                    <Link href={`/organizers/${event.organizers.id}`}>
                                        <Button variant="outline" className="w-full bg-white text-xs h-10 border-gray-200">
                                            主催者情報を詳しく見る
                                        </Button>
                                    </Link>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

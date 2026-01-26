import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Store, Mail, Phone, FileText, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DocumentCard from "./DocumentCard";

export default async function ExhibitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get organizer profile to verify access
    const { data: profile } = await supabase
        .from("organizers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (!profile) {
        redirect("/onboarding");
    }

    // Fetch exhibitor details
    const { data: exhibitor, error } = await supabase
        .from("exhibitors")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !exhibitor) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-orange-50/30">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="mb-8">
                    <Link href="/events" className="flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors mb-4 group">
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> イベント一覧へ戻る
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">出店者詳細</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Exhibitor Profile */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Exhibitor Profile Card */}
                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Store className="w-6 h-6 text-orange-600" />
                                出店者プロフィール
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shrink-0">
                                        <Store className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{exhibitor.shop_name || "店舗名なし"}</h3>
                                        <p className="text-gray-500 font-medium">{exhibitor.name || "名前なし"}</p>
                                        {exhibitor.genre && (
                                            <p className="text-sm text-gray-400 mt-1">{exhibitor.genre}</p>
                                        )}
                                    </div>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {exhibitor.email && (
                                        <div className="p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <div className="text-sm">
                                                <p className="text-gray-400 font-medium leading-none mb-1">メール</p>
                                                <p className="text-gray-900 font-bold">{exhibitor.email}</p>
                                            </div>
                                        </div>
                                    )}
                                    {exhibitor.phone_number && (
                                        <div className="p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <div className="text-sm">
                                                <p className="text-gray-400 font-medium leading-none mb-1">電話番号</p>
                                                <p className="text-gray-900 font-bold">{exhibitor.phone_number}</p>
                                            </div>
                                        </div>
                                    )}
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
                                    imageUrl={exhibitor.business_license_image_url}
                                    required
                                />
                                <DocumentCard
                                    label="車検証"
                                    imageUrl={exhibitor.vehicle_inspection_image_url}
                                />
                                <DocumentCard
                                    label="PL保険"
                                    imageUrl={exhibitor.pl_insurance_image_url}
                                />
                                <DocumentCard
                                    label="火器類配置図"
                                    imageUrl={exhibitor.fire_equipment_layout_image_url}
                                />
                                <DocumentCard
                                    label="自動車検査証"
                                    imageUrl={exhibitor.automobile_inspection_image_url}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="lg:col-span-1">
                        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">アクション</h3>
                            <div className="space-y-3">
                                <Link href="/events" className="block">
                                    <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 gap-2">
                                        <ArrowLeft className="w-4 h-4" />
                                        イベント一覧に戻る
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

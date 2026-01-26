"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
    CheckCircle2, AlertCircle, Loader2, ArrowLeft,
    Store, User, Mail, Phone, Calendar, Info
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ApplyClient({ event, exhibitor }: { event: any, exhibitor: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const supabase = createClient();
    const router = useRouter();

    const handleApply = async () => {
        setIsLoading(true);
        setError("");

        try {
            const { error: insertError } = await supabase
                .from("event_applications")
                .insert({
                    event_id: event.id,
                    exhibitor_id: exhibitor.id,
                    message: message,
                    status: 'pending'
                });

            if (insertError) {
                if (insertError.code === '23505') {
                    throw new Error("このイベントには既に応募済みです。");
                }
                throw insertError;
            }

            setIsSuccess(true);
            setTimeout(() => {
                router.push("/applications");
                router.refresh();
            }, 3000);
        } catch (err: any) {
            console.error("Application error:", err);
            setError(err.message || "応募に失敗しました。時間をおいて再度お試しください。");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white rounded-3xl p-12 text-center shadow-xl shadow-emerald-900/5 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-4">応募が完了しました！</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    イベント主催者（{event.organizers?.company_name}）に応募情報が送信されました。<br />
                    承認されるとチャットが可能になります。
                </p>
                <Link href="/">
                    <Button variant="outline" className="h-12 px-8 rounded-xl font-bold">
                        トップページへ戻る
                    </Button>
                </Link>
                <p className="text-xs text-gray-400 mt-6">※ 3秒後に自動的に移動します</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <Link href={`/events/${event.id}`} className="flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" /> イベント詳細へ戻る
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">出店を申し込む</h1>
                <p className="text-gray-500 font-medium">以下の内容で応募を送信します。</p>
            </div>

            {/* Event Summary Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1">応募先イベント</p>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{event.event_name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-600" /> {event.event_start_date}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-emerald-600" /> {event.genre}
                    </div>
                </div>
            </div>

            {/* Profile Review Section */}
            <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> 登録プロフィール情報
                </h3>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between py-3 border-b border-gray-50">
                        <span className="text-gray-400 font-bold">屋号 / 店舗名</span>
                        <span className="text-gray-900 font-bold">{exhibitor.shop_name}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-50">
                        <span className="text-gray-400 font-bold">代表者名</span>
                        <span className="text-gray-900 font-bold">{exhibitor.name} ({exhibitor.gender})</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-50">
                        <span className="text-gray-400 font-bold">商材ジャンル</span>
                        <span className="text-gray-900 font-bold">{exhibitor.genre_free_text || exhibitor.genre}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-50">
                        <span className="text-gray-400 font-bold">メールアドレス</span>
                        <span className="text-gray-900 font-bold flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {exhibitor.email}</span>
                    </div>
                    <div className="flex justify-between py-3">
                        <span className="text-gray-400 font-bold">電話番号</span>
                        <span className="text-gray-900 font-bold flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {exhibitor.phone_number}</span>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex gap-3 text-gray-500 text-xs text-left">
                    <Info className="w-4 h-4 shrink-0" />
                    <p>この情報はプロフィール設定から変更できます。主催者には現在の最新データが送信されます。</p>
                </div>
            </section>

            {/* Message to Organizer */}
            <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    メッセージ（任意）
                </h3>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="主催者への自己紹介や、意気込み、質問などがあれば記入してください。"
                    rows={5}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-gray-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed"
                />
            </section>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {/* Apply Button */}
            <div className="pt-4">
                <Button
                    onClick={handleApply}
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl text-lg font-extrabold shadow-lg shadow-primary/20"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" /> 送信中...
                        </div>
                    ) : (
                        "以上の内容で応募を確定する"
                    )}
                </Button>
                <p className="text-center text-xs text-gray-400 mt-4">
                    応募を確定すると、主催者にあなたのプロフィールが公開されます。
                </p>
            </div>
        </div>
    );
}

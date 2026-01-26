"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Tent, ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
            });

            if (error) throw error;
            setIsSubmitted(true);
        } catch (error: any) {
            setError(error.message || "送信に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center">
                    <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 mb-6 transition-colors font-medium">
                        <ArrowLeft className="h-4 w-4 mr-1" /> ログインに戻る
                    </Link>
                    <div className="flex justify-center mb-4 text-orange-600">
                        <Tent className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">パスワードをお忘れですか？</h2>
                    <p className="mt-2 text-sm text-gray-500 px-4">
                        ご登録のメールアドレスを入力してください。パスワード再設定用のリンクをお送りします。
                    </p>
                </div>

                {isSubmitted ? (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-center mb-4">
                            <div className="bg-orange-600 rounded-full p-3 text-white shadow-lg shadow-orange-100">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">メールを送信しました</h3>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            再設定用のリンクをメールでお送りしました。メールボックスを確認し、リンクから手続きを完了させてください。
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
                                メールアドレス
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium border"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200 font-medium">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full font-bold shadow-lg shadow-orange-100"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 送信中...
                                </>
                            ) : (
                                "送信する"
                            )}
                        </Button>
                    </form>
                )}
            </div>

            <p className="mt-8 text-sm text-gray-400 font-medium">
                © 2024 Event Platform
            </p>
        </div>
    );
}

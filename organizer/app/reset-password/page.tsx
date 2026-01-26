"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Tent, Lock, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Check if we have a session (the callback should have established one)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError("セッションが有効ではありません。もう一度リセットメールを送信してください。");
            }
            setIsVerifying(false);
        };
        checkSession();
    }, [supabase.auth]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("パスワードが一致しません");
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;
            setIsSubmitted(true);
        } catch (error: any) {
            setError(error.message || "更新に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center">
                    <div className="flex justify-center mb-4 text-orange-600">
                        <Tent className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">新しいパスワードの設定</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        新しいパスワードを入力してください。
                    </p>
                </div>

                {isSubmitted ? (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-center mb-4">
                            <div className="bg-orange-600 rounded-full p-3 text-white shadow-lg shadow-orange-100">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">更新完了</h3>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium mb-6">
                            パスワードが正常に更新されました。新しいパスワードでログインしてください。
                        </p>
                        <Button
                            className="w-full font-bold"
                            onClick={() => router.push("/login")}
                        >
                            ログインへ進む <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
                                新しいパスワード
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium border"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-1">
                                新しいパスワード（確認）
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium border"
                                    placeholder="••••••••"
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
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 更新中...
                                </>
                            ) : (
                                "パスワードを更新する"
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const supabase = createClient();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push("/");
            router.refresh();
        } catch (error: any) {
            setError(error.message || "ログインに失敗しました");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                        <ShieldCheck className="h-8 w-8 text-gray-900" />
                    </div>
                </div>
                <h2 className="text-center text-3xl font-black tracking-tighter text-gray-900">
                    Platform Admin
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500 font-medium">
                    管理者アカウントでログインしてください
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md text-gray-700">
                <div className="bg-white py-8 px-4 shadow-sm border border-gray-100 sm:rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-medium"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">
                                パスワード
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-medium"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-xs font-bold text-red-600">
                                {error}
                            </div>
                        )}

                        <div>
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-gray-200 bg-gray-900 hover:bg-black transition-all active:scale-95"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                ) : (
                                    "ログイン"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400">
                    &copy; 2024 Event Platform. All rights reserved.
                </p>
            </div>
        </div>
    );
}

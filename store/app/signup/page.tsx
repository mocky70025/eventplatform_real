"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Store, ArrowRight, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;

            // if data.user is returned but session is null, it means email confirmation is required
            if (data.user) {
                if (!data.session) {
                    setIsEmailSent(true);
                } else {
                    // Signup successful and already logged in (confirmation off)
                    router.push("/onboarding");
                }
            }
        } catch (error: any) {
            setError(error.message || "アカウント作成に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'line') => {
        setIsLoading(true);
        setError("");

        if (provider === 'line') {
            window.location.href = '/api/auth/line';
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider as any,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            setError(error.message || "ログインに失敗しました");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left: Branding */}
            <div className="hidden md:flex flex-col justify-between bg-emerald-600 p-10 text-white">
                <div>
                    <div className="flex items-center gap-2 mb-20">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Store className="h-8 w-8" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Exhibitor</span>
                    </div>
                    <h1 className="text-4xl font-bold leading-tight mb-6">
                        新しい出店の形を。<br />
                        まずは無料で登録。
                    </h1>
                    <ul className="space-y-4 text-emerald-100">
                        <li className="flex items-center gap-3">
                            <div className="bg-emerald-500/50 p-1 rounded-full"><Check className="h-4 w-4" /></div>
                            魅力的なイベントを簡単に見つける
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="bg-emerald-500/50 p-1 rounded-full"><Check className="h-4 w-4" /></div>
                            主催者とスムーズにコミュニケーション
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="bg-emerald-500/50 p-1 rounded-full"><Check className="h-4 w-4" /></div>
                            出店準備から当日までを一括管理
                        </li>
                    </ul>
                </div>
                <div className="text-sm text-emerald-200">
                    © 2024 Event Platform
                </div>
            </div>

            {/* Right: Signup Form */}
            <div className="flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    {isEmailSent ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="h-10 w-10 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">確認メールを送信しました</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                登録したメールアドレスに確認メールを送信しました。<br />
                                メール内のリンクをクリックして、アカウントを有効化してください。
                            </p>
                            <Link href="/login" className="block">
                                <Button variant="outline" className="w-full">
                                    ログイン画面へ戻る
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold text-gray-900">アカウント作成</h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    必要な情報はメールアドレスとパスワードだけです。
                                </p>
                            </div>

                            <form onSubmit={handleSignup} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        メールアドレス
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all font-medium shadow-sm"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        パスワード
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all font-medium shadow-sm"
                                            placeholder="8文字以上で入力してください"
                                            minLength={8}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full font-bold shadow-emerald-200 bg-emerald-600 hover:bg-emerald-700"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> アカウント作成中...
                                        </>
                                    ) : (
                                        <>
                                            次へ進む <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-center text-gray-400 mt-4">
                                    登録することで、<a href="#" className="underline hover:text-gray-600">利用規約</a>と<a href="#" className="underline hover:text-gray-600">プライバシーポリシー</a>に同意したことになります。
                                </p>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">または</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-center hover:bg-gray-50 border-gray-200"
                                    onClick={() => handleSocialLogin('google')}
                                    disabled={isLoading}
                                    type="button"
                                >
                                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.29.81-.55z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Google
                                </Button>
                                {/* Custom LINE Login */}
                                <Button
                                    className="w-full flex items-center justify-center bg-[#06C755] hover:bg-[#05b34c] text-white border-transparent shadow-sm"
                                    onClick={() => handleSocialLogin('line')}
                                    disabled={isLoading}
                                    type="button"
                                >
                                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_27_2)">
                                            <path d="M19.365 9.86302C19.5279 9.86951 19.6819 9.93877 19.7949 10.0563C19.9078 10.1738 19.9709 10.3305 19.9709 10.4935C19.9709 10.6565 19.9078 10.8132 19.7949 10.9307C19.6819 11.0483 19.5279 11.1175 19.365 11.124H17.61V12.249H19.365C19.4498 12.2456 19.5344 12.2594 19.6137 12.2895C19.693 12.3196 19.7654 12.3655 19.8266 12.4243C19.8878 12.483 19.9365 12.5536 19.9697 12.6316C20.003 12.7097 20.0201 12.7937 20.0201 12.8785C20.0201 12.9634 20.003 13.0473 19.9697 13.1254C19.9365 13.2035 19.8878 13.274 19.8266 13.3328C19.7654 13.3916 19.693 13.4374 19.6137 13.4675C19.5344 13.4976 19.4498 13.5114 19.365 13.508H16.979C16.8126 13.5072 16.6533 13.4406 16.5358 13.3228C16.4183 13.2049 16.3523 13.0454 16.352 12.879V8.10802C16.352 7.76302 16.634 7.47802 16.982 7.47802H19.368C19.5351 7.47842 19.6952 7.54518 19.813 7.6636C19.9309 7.78203 19.9969 7.94243 19.9965 8.10952C19.9961 8.27661 19.9293 8.43669 19.8109 8.55456C19.6925 8.67243 19.5321 8.73842 19.365 8.73802H17.61V9.86302H19.365ZM15.51 12.879C15.5092 13.0458 15.4423 13.2054 15.3241 13.3229C15.2058 13.4404 15.0457 13.5063 14.879 13.506C14.7802 13.508 14.6824 13.4863 14.5937 13.4429C14.505 13.3994 14.4279 13.3353 14.369 13.256L11.926 9.93902V12.879C11.915 13.0382 11.844 13.1873 11.7273 13.2962C11.6107 13.405 11.4571 13.4656 11.2975 13.4656C11.1379 13.4656 10.9843 13.405 10.8677 13.2962C10.751 13.1873 10.68 13.0382 10.669 12.879V8.10802C10.6687 7.94208 10.7343 7.78279 10.8512 7.66508C10.9682 7.54736 11.1271 7.48082 11.293 7.48002C11.488 7.48002 11.668 7.58402 11.788 7.73402L14.25 11.064V8.10802C14.25 7.76302 14.532 7.47802 14.88 7.47802C15.225 7.47802 15.51 7.76302 15.51 8.10802V12.879ZM9.769 12.879C9.76887 12.9618 9.75244 13.0437 9.72066 13.12C9.68888 13.1964 9.64236 13.2658 9.58377 13.3242C9.52518 13.3826 9.45565 13.4289 9.37917 13.4604C9.30268 13.492 9.22073 13.5082 9.138 13.508C8.97161 13.5072 8.81228 13.4406 8.69481 13.3228C8.57734 13.2049 8.51126 13.0454 8.511 12.879V8.10802C8.511 7.76302 8.793 7.47802 9.141 7.47802C9.487 7.47802 9.769 7.76302 9.769 8.10802V12.879ZM7.303 13.508H4.917C4.75041 13.507 4.59092 13.4404 4.47303 13.3227C4.35514 13.205 4.28831 13.0456 4.287 12.879V8.10802C4.287 7.76302 4.572 7.47802 4.917 7.47802C5.265 7.47802 5.547 7.76302 5.547 8.10802V12.249H7.303C7.46561 12.2555 7.61941 12.3247 7.73217 12.442C7.84493 12.5594 7.90791 12.7158 7.90791 12.8785C7.90791 13.0413 7.84493 13.1977 7.73217 13.315C7.61941 13.4324 7.46561 13.5015 7.303 13.508ZM24 10.314C24 4.94302 18.615 0.572021 12 0.572021C5.385 0.572021 0 4.94302 0 10.314C0 15.125 4.27 19.156 10.035 19.922C10.426 20.004 10.958 20.18 11.093 20.512C11.213 20.813 11.172 21.278 11.131 21.592L10.967 22.612C10.922 22.913 10.727 23.798 12.016 23.257C13.307 22.718 18.932 19.179 21.452 16.282C23.176 14.393 24 12.458 24 10.314Z" fill="currentColor" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_27_2">
                                                <rect width="24" height="24" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    LINE
                                </Button>
                            </div>

                            <div className="mt-6 text-center text-sm">
                                <span className="text-gray-500">すでにアカウントをお持ちですか？</span>{" "}
                                <Link
                                    href="/login"
                                    className="font-medium text-emerald-600 hover:text-emerald-500"
                                >
                                    ログイン
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

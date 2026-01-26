"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Tent, Check, ChevronRight, Building2, User, Phone, MapPin, Globe, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const supabase = createClient();

    const [formData, setFormData] = useState({
        companyName: "",
        repName: "",
        email: "", // User inputs in Step 2
        phone: "",
        zip: "",
        address: "",
        website: "",
        description: "",
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // If no user, it might be because email confirmation is on
                console.log("No user found on mount. Checking session...");
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    setError("ログインセッションが見つかりません。Supabaseの「Email」設定で「Confirm email（メール確認）」をOFFにしているか確認してください。");
                }
            } else {
                // Pre-fill email if available from user object
                if (user.email) {
                    setFormData(prev => ({ ...prev, email: user.email || "" }));
                }
            }
        };
        checkUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError("");

        try {
            console.log('=== Onboarding Submit Debug ===');

            // Check session first
            const { data: { session } } = await supabase.auth.getSession();
            console.log('Session:', session);

            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            console.log('User:', user);
            console.log('User Error:', userError);

            if (!user) {
                throw new Error("ログインしていません。サインアップ後、自動的にログインされているはずですが、セッションが見つかりません。");
            }

            console.log('Attempting to insert organizer profile...');
            console.log('Form data:', formData);

            // Insert organizer profile
            const { data: insertData, error: insertError } = await supabase
                .from("organizers")
                .insert({
                    user_id: user.id,
                    company_name: formData.companyName,
                    name: formData.repName,
                    email: formData.email,
                    phone_number: formData.phone,
                    social_links: formData.website ? { website: formData.website } : null,
                    is_approved: false, // Needs admin approval
                });

            console.log('Insert result:', insertData);
            console.log('Insert error:', insertError);

            if (insertError) throw insertError;

            console.log('Profile created successfully!');
            // Success! Redirect to dashboard
            router.push("/");
        } catch (error: any) {
            console.error("Onboarding error:", error);
            setError(error.message || "プロフィール登録に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Simple Header - Removed black border, using soft shadow and white bg */}
            <header className="h-16 bg-white shadow-sm flex items-center justify-center relative z-10">
                <div className="flex items-center gap-2 text-primary font-bold text-xl">
                    <Tent className="h-6 w-6" /> Organizer Setup
                </div>
            </header>

            <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">

                {/* Progress Steps - Enhanced Design */}
                <div className="mb-16">
                    <div className="relative flex items-center justify-between mx-auto max-w-2xl">
                        {/* Background Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full -z-10"></div>

                        {/* Active Line with Gradient and Glow */}
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full -z-10 transition-all duration-500 ease-out shadow-lg shadow-orange-200"
                            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                        ></div>

                        {/* Step 1 */}
                        <div className="flex flex-col items-center gap-3 bg-gray-50 px-3 relative z-10">
                            <div className={cn(
                                "w-14 h-14 rounded-full flex items-center justify-center text-base font-bold border-[3px] transition-all duration-500 ease-out",
                                step >= 1
                                    ? "bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300 text-white shadow-xl shadow-orange-300/50 scale-110"
                                    : "bg-white border-gray-200 text-gray-300 shadow-md"
                            )}>
                                1
                            </div>
                            <span className={cn(
                                "text-sm font-bold absolute -bottom-8 w-36 text-center transition-all duration-500",
                                step >= 1 ? "text-orange-700 scale-105" : "text-gray-400"
                            )}>基本情報</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center gap-3 bg-gray-50 px-3 relative z-10">
                            <div className={cn(
                                "w-14 h-14 rounded-full flex items-center justify-center text-base font-bold border-[3px] transition-all duration-500 ease-out",
                                step >= 2
                                    ? "bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300 text-white shadow-xl shadow-orange-300/50 scale-110"
                                    : "bg-white border-gray-200 text-gray-300 shadow-md"
                            )}>
                                2
                            </div>
                            <span className={cn(
                                "text-sm font-bold absolute -bottom-8 w-36 text-center transition-all duration-500",
                                step >= 2 ? "text-orange-700 scale-105" : "text-gray-400"
                            )}>詳細・連絡先</span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center gap-3 bg-gray-50 px-3 relative z-10">
                            <div className={cn(
                                "w-14 h-14 rounded-full flex items-center justify-center text-base font-bold border-[3px] transition-all duration-500 ease-out",
                                step >= 3
                                    ? "bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300 text-white shadow-xl shadow-orange-300/50 scale-110"
                                    : "bg-white border-gray-200 text-gray-300 shadow-md"
                            )}>
                                3
                            </div>
                            <span className={cn(
                                "text-sm font-bold absolute -bottom-8 w-36 text-center transition-all duration-500",
                                step >= 3 ? "text-orange-700 scale-105" : "text-gray-400"
                            )}>完了</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-10">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">主催者情報の登録</h2>
                                <p className="text-gray-500 mt-1">
                                    まずは基本的な情報を教えてください。<br />
                                    これは出店者に表示される情報になります。
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">主催団体名 / 会社名 <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                            placeholder="例: 株式会社イベントプロ"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">代表者名 / 担当者名 <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            name="repName"
                                            value={formData.repName}
                                            onChange={handleChange}
                                            className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                            placeholder="例: 山田 太郎"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">自己紹介 / 団体概要</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                        placeholder="どのようなイベントを主催しているか、簡単な説明を入力してください。"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button onClick={handleNext} disabled={!formData.companyName || !formData.repName}>
                                    次へ <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">連絡先・詳細情報</h2>
                                <p className="text-gray-500 mt-1">
                                    スムーズな連絡のために、正確な情報を入力してください。
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                type="email"
                                                className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                                placeholder="contact@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">電話番号 <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                type="tel"
                                                className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                                placeholder="03-1234-5678"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ウェブサイト URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            type="url"
                                            className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">所在地</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                            placeholder="東京都..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-between">
                                <Button variant="ghost" onClick={() => setStep(1)}>
                                    戻る
                                </Button>
                                <Button onClick={handleNext} disabled={!formData.phone || !formData.email}>
                                    確認へ進む <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-8">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="h-8 w-8" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">準備が整いました！</h2>
                                <p className="text-gray-500 mt-2">
                                    以下の内容でアカウント登録を完了し、<br />
                                    ダッシュボードへ移動します。
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 text-left text-sm max-w-sm mx-auto space-y-3 border border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">団体名</span>
                                    <span className="font-medium">{formData.companyName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">代表者</span>
                                    <span className="font-medium">{formData.repName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">メール</span>
                                    <span className="font-medium">{formData.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">電話番号</span>
                                    <span className="font-medium">{formData.phone}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200 max-w-sm mx-auto text-left">
                                    <p className="font-bold mb-1 flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> エラーが発生しました
                                    </p>
                                    <p>{error}</p>
                                    <div className="mt-2 pt-2 border-t border-red-100 text-xs">
                                        💡 Supabase Dashboard &rarr; Authentication &rarr; Providers &rarr; Email &rarr; <b>Confirm email</b> を OFF に設定して、新しいアカウントでやり直してください。
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex justify-center gap-4">
                                <Button variant="ghost" onClick={() => setStep(2)} disabled={isLoading} size="lg">
                                    修正する
                                </Button>
                                <Button onClick={handleSubmit} size="lg" className="px-8 shadow-orange-200" disabled={isLoading}>
                                    {isLoading ? "登録処理中..." : "ダッシュボードへ移動"}
                                </Button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

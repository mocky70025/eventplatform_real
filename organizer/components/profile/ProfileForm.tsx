"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Building2, User, Phone, MapPin, Globe, Loader2, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function ProfileForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const supabase = createClient();

    const [formData, setFormData] = useState({
        companyName: "",
        repName: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        description: "",
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login");
                    return;
                }

                const { data: profile, error: profileError } = await supabase
                    .from("organizers")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (profileError) throw profileError;

                if (profile) {
                    setFormData({
                        companyName: profile.company_name || "",
                        repName: profile.name || "",
                        email: profile.email || "",
                        phone: profile.phone_number || "",
                        address: profile.address || "",
                        website: profile.social_links?.website || "",
                        description: profile.description || "",
                    });
                }
            } catch (err: any) {
                console.error("Profile load error:", err);
                setError("プロフィールの読み込みに失敗しました");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [supabase, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setSuccess("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError("");
        setSuccess("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("セッションがありません");

            const { error: updateError } = await supabase
                .from("organizers")
                .update({
                    company_name: formData.companyName,
                    name: formData.repName,
                    email: formData.email,
                    phone_number: formData.phone,
                    address: formData.address,
                    social_links: formData.website ? { website: formData.website } : null,
                    description: formData.description,
                    updated_at: new Date().toISOString(),
                })
                .eq("user_id", user.id);

            if (updateError) throw updateError;

            setSuccess("プロフィールを更新しました");
            router.refresh();
        } catch (err: any) {
            console.error("Profile update error:", err);
            setError(err.message || "更新に失敗しました");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-orange-600 px-8 py-6">
                <h1 className="text-2xl font-bold text-white">主催者プロフィール設定</h1>
                <p className="text-orange-100 mt-1">
                    団体情報や連絡先を最新の状態に保ちましょう。
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                        {success}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">主催団体名 / 会社名 <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                                className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium"
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
                                required
                                className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium"
                            />
                        </div>
                    </div>

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
                                    required
                                    className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium"
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
                                    required
                                    className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium"
                                />
                            </div>
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
                                className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium"
                            />
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
                                className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium"
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
                            className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link href="/">
                        <Button variant="ghost" type="button">キャンセル</Button>
                    </Link>
                    <Button type="submit" disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        保存する
                    </Button>
                </div>
            </form>
        </div>
    );
}

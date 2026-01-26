"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Store, Check, ChevronRight, Building2, User, Phone, MapPin, Globe, Sparkles, AlertCircle, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const supabase = createClient();

    // Form State
    const [formData, setFormData] = useState({
        storeName: "",
        repName: "",
        email: "",
        phone: "",
        website: "",
        description: "",
    });

    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        businessLicense: null,
        vehicleInspection: null,
        plInsurance: null,
        fireLayout: null,
    });

    const [previews, setPreviews] = useState<{ [key: string]: string }>({
        businessLicense: "",
        vehicleInspection: "",
        plInsurance: "",
        fireLayout: "",
    });

    const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({
        businessLicense: "",
        vehicleInspection: "",
        plInsurance: "",
        fireLayout: "",
    });

    const [aiResults, setAiResults] = useState<{ [key: string]: { status: 'idle' | 'verifying' | 'success' | 'error', message?: string, data?: any } }>({
        businessLicense: { status: 'idle' },
        vehicleInspection: { status: 'idle' },
        plInsurance: { status: 'idle' },
        fireLayout: { status: 'idle' },
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    setError("ログインセッションが見つかりません。Supabaseの「Email」設定で「Confirm email」をOFFに設定し、新しいアカウントでやり直してください。");
                }
            } else if (user.email) {
                setFormData(prev => ({ ...prev, email: user.email || "" }));
            }
        };
        checkUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
        if (e && e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFiles(prev => ({ ...prev, [key]: file }));

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = async () => {
                const result = reader.result as string;
                setPreviews(prev => ({ ...prev, [key]: result }));

                // Start AI Verification
                setAiResults(prev => ({ ...prev, [key]: { status: 'verifying' } }));
                try {
                    const response = await fetch('/api/verify-document', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: result, type: key })
                    });
                    const data = await response.json();
                    if (data.success) {
                        setAiResults(prev => ({ ...prev, [key]: { status: 'success', message: data.message, data: data.extractedData } }));
                    } else {
                        setAiResults(prev => ({ ...prev, [key]: { status: 'error', message: data.message } }));
                    }
                } catch (err) {
                    setAiResults(prev => ({ ...prev, [key]: { status: 'error', message: 'AIチェックに失敗しました' } }));
                }
            };
            reader.readAsDataURL(file);
        } else if (e === null) {
            // Clear file and preview
            setFiles(prev => ({ ...prev, [key]: null }));
            setPreviews(prev => ({ ...prev, [key]: "" }));
            setAiResults(prev => ({ ...prev, [key]: { status: 'idle' } }));
        }
    };

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    const uploadFiles = async (userId: string) => {
        const updatedUrls: { [key: string]: string } = {};

        for (const [key, file] of Object.entries(files)) {
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${userId}/${key}_${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = fileName;

                const { error: uploadError, data } = await supabase.storage
                    .from('exhibitor-documents')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error(`Upload error for ${key}:`, uploadError);
                    throw new Error(`${key}のアップロードに失敗しました。バケット 'exhibitor-documents' が存在するか確認してください。`);
                }

                // Get public URL or just store key
                const { data: { publicUrl } } = supabase.storage
                    .from('exhibitor-documents')
                    .getPublicUrl(filePath);

                updatedUrls[key] = publicUrl;
            }
        }
        return updatedUrls;
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("ログインしていません。セッションが切れた可能性があります。");
            }

            // 1. Upload files first
            const uploadedUrls = await uploadFiles(user.id);

            // 2. Insert exhibitor profile
            const { error: insertError } = await supabase
                .from("exhibitors")
                .insert({
                    user_id: user.id,
                    shop_name: formData.storeName,
                    name: formData.repName,
                    email: formData.email,
                    phone_number: formData.phone,
                    business_license_image_url: uploadedUrls.businessLicense || null,
                    vehicle_inspection_image_url: uploadedUrls.vehicleInspection || null,
                    pl_insurance_image_url: uploadedUrls.plInsurance || null,
                    fire_equipment_layout_image_url: uploadedUrls.fireLayout || null,
                });

            if (insertError) throw insertError;

            router.push("/");
            router.refresh();
        } catch (error: any) {
            console.error("Store onboarding error:", error);
            setError(error.message || "登録に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Simple Header - Matching Organizer structure */}
            <header className="h-16 bg-white shadow-sm flex items-center justify-center relative z-10">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
                    <Store className="h-6 w-6" /> Exhibitor Setup
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
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-full -z-10 transition-all duration-500 ease-out shadow-lg shadow-emerald-200"
                            style={{
                                width: step === 1 ? '0%' : step === 2 ? '33%' : step === 3 ? '66%' : '100%'
                            }}
                        ></div>

                        {/* Step 1 */}
                        <div className="flex flex-col items-center gap-3 bg-gray-50 px-3 relative z-10">
                            <div className={cn(
                                "w-14 h-14 rounded-full flex items-center justify-center text-base font-bold border-[3px] transition-all duration-500 ease-out",
                                step >= 1
                                    ? "bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 text-white shadow-xl shadow-emerald-300/50 scale-110"
                                    : "bg-white border-gray-200 text-gray-300 shadow-md"
                            )}>
                                1
                            </div>
                            <span className={cn(
                                "text-sm font-bold absolute -bottom-8 w-36 text-center transition-all duration-500",
                                step >= 1 ? "text-emerald-700 scale-105" : "text-gray-400"
                            )}>基本情報</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center gap-3 bg-gray-50 px-3 relative z-10">
                            <div className={cn(
                                "w-14 h-14 rounded-full flex items-center justify-center text-base font-bold border-[3px] transition-all duration-500 ease-out",
                                step >= 2
                                    ? "bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 text-white shadow-xl shadow-emerald-300/50 scale-110"
                                    : "bg-white border-gray-200 text-gray-300 shadow-md"
                            )}>
                                2
                            </div>
                            <span className={cn(
                                "text-sm font-bold absolute -bottom-8 w-36 text-center transition-all duration-500",
                                step >= 2 ? "text-emerald-700 scale-105" : "text-gray-400"
                            )}>詳細・連絡先</span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center gap-3 bg-gray-50 px-3 relative z-10">
                            <div className={cn(
                                "w-14 h-14 rounded-full flex items-center justify-center text-base font-bold border-[3px] transition-all duration-500 ease-out",
                                step >= 3
                                    ? "bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 text-white shadow-xl shadow-emerald-300/50 scale-110"
                                    : "bg-white border-gray-200 text-gray-300 shadow-md"
                            )}>
                                3
                            </div>
                            <span className={cn(
                                "text-sm font-bold absolute -bottom-8 w-36 text-center transition-all duration-500",
                                step >= 3 ? "text-emerald-700 scale-105" : "text-gray-400"
                            )}>書類アップロード</span>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center gap-3 bg-gray-50 px-3 relative z-10">
                            <div className={cn(
                                "w-14 h-14 rounded-full flex items-center justify-center text-base font-bold border-[3px] transition-all duration-500 ease-out",
                                step >= 4
                                    ? "bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 text-white shadow-xl shadow-emerald-300/50 scale-110"
                                    : "bg-white border-gray-200 text-gray-300 shadow-md"
                            )}>
                                4
                            </div>
                            <span className={cn(
                                "text-sm font-bold absolute -bottom-8 w-36 text-center transition-all duration-500",
                                step >= 4 ? "text-emerald-700 scale-105" : "text-gray-400"
                            )}>完了</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-10">

                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">出店者情報の登録</h2>
                                <p className="text-gray-500 mt-1">
                                    あなたのお店の基本的な情報を教えてください。
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">店舗名 / 団体名 <span className="text-emerald-500">*</span></label>
                                    <div className="relative">
                                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            name="storeName"
                                            value={formData.storeName}
                                            onChange={handleChange}
                                            className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all font-medium shadow-sm"
                                            placeholder="例: グリーンカフェ"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">代表者名 <span className="text-emerald-500">*</span></label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            name="repName"
                                            value={formData.repName}
                                            onChange={handleChange}
                                            className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all font-medium shadow-sm"
                                            placeholder="例: 佐藤 花子"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">お店の紹介文</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all resize-none font-medium shadow-sm"
                                        placeholder="オーガニックコーヒーと手作りサンドイッチのお店です..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button onClick={handleNext} disabled={!formData.storeName || !formData.repName} className="bg-emerald-600 hover:bg-emerald-700">
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス <span className="text-emerald-500">*</span></label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                type="email"
                                                className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all font-medium shadow-sm"
                                                placeholder="contact@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">電話番号 <span className="text-emerald-500">*</span></label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                type="tel"
                                                className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all font-medium shadow-sm"
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
                                            className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all font-medium shadow-sm"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-between">
                                <Button variant="ghost" onClick={() => setStep(1)}>
                                    戻る
                                </Button>
                                <Button onClick={handleNext} disabled={!formData.phone || !formData.email}>
                                    書類アップロードへ進む <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">提出書類のアップロード</h2>
                                <p className="text-gray-500 mt-1">
                                    イベント出店に必要な各書類の画像をアップロードしてください。
                                </p>
                            </div>

                            <div className="space-y-8">
                                {/* Business License */}
                                <div className="space-y-3">
                                    <label className="block text-lg font-bold text-gray-800">1. 営業許可証 <span className="text-red-500">*</span></label>
                                    <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-emerald-300 transition-colors bg-gray-50 overflow-hidden">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'businessLicense')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />
                                        <div className="text-center relative z-10 w-full">
                                            {files.businessLicense ? (
                                                <div className="flex flex-col items-center justify-center gap-4 text-emerald-600 relative">
                                                    {previews.businessLicense && (
                                                        <>
                                                            <div className="w-full h-[500px] rounded-2xl overflow-hidden border-2 border-emerald-100 mb-3 bg-white shadow-2xl">
                                                                <img src={previews.businessLicense} alt="Preview" className="w-full h-full object-contain p-4 transition-transform hover:scale-[1.01]" />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleFileChange(null, 'businessLicense');
                                                                }}
                                                                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-red-500/90 text-white flex items-center justify-center shadow-xl hover:bg-red-600 transition-all z-30 hover:scale-110 active:scale-95"
                                                            >
                                                                <X className="w-7 h-7" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <div className="flex items-center gap-3 font-bold bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100 shadow-sm">
                                                        <Check className="w-6 h-6" />
                                                        <span className="text-sm truncate max-w-[400px]">{files.businessLicense.name}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 py-32 text-center">
                                                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-emerald-400 opacity-50" />
                                                    <span className="text-xl font-bold">クリックして営業許可証をアップロード</span>
                                                    <p className="text-sm mt-2 font-medium">JPG, PNG, PDF(画像)が利用可能です</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* AI Verification Card for Business License */}
                                    {aiResults.businessLicense.status !== 'idle' && (
                                        <div className={cn(
                                            "rounded-2xl p-6 border-2 transition-all flex items-start gap-4",
                                            aiResults.businessLicense.status === 'verifying' ? "bg-blue-50 border-blue-100" :
                                                aiResults.businessLicense.status === 'success' ? "bg-emerald-50 border-emerald-100" :
                                                    "bg-red-50 border-red-100"
                                        )}>
                                            <div className={cn(
                                                "p-3 rounded-xl",
                                                aiResults.businessLicense.status === 'verifying' ? "bg-blue-100 text-blue-600" :
                                                    aiResults.businessLicense.status === 'success' ? "bg-emerald-100 text-emerald-600" :
                                                        "bg-red-100 text-red-600"
                                            )}>
                                                {aiResults.businessLicense.status === 'verifying' ? <Loader2 className="w-6 h-6 animate-spin" /> :
                                                    aiResults.businessLicense.status === 'success' ? <Check className="w-6 h-6" /> :
                                                        <AlertCircle className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold uppercase tracking-wider opacity-60">AI Document Check</span>
                                                    {aiResults.businessLicense.status === 'verifying' && (
                                                        <span className="text-[10px] bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full font-bold animate-pulse">ANALYZING</span>
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-gray-900 leading-tight">
                                                    {aiResults.businessLicense.status === 'verifying' ? "書類を解析しています..." :
                                                        aiResults.businessLicense.status === 'success' ? "解析が完了しました" :
                                                            "解析エラー"}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {aiResults.businessLicense.message || "画像の鮮明度と有効期限を確認しています。"}
                                                </p>
                                                {aiResults.businessLicense.data && (
                                                    <div className="mt-4 grid grid-cols-2 gap-4 bg-white/50 p-4 rounded-xl border border-white/50 shadow-sm text-xs">
                                                        <div>
                                                            <p className="text-gray-400 mb-1">書類種別</p>
                                                            <p className="font-bold text-gray-800">{aiResults.businessLicense.data.documentType}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-400 mb-1">有効期限（推定）</p>
                                                            <p className="font-bold text-emerald-700">{aiResults.businessLicense.data.expiryDate}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Vehicle Inspection */}
                                <div className="space-y-3">
                                    <label className="block text-lg font-bold text-gray-800">2. 車検証</label>
                                    <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-emerald-300 transition-colors bg-gray-50 overflow-hidden">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'vehicleInspection')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />
                                        <div className="text-center relative z-10 w-full">
                                            {files.vehicleInspection ? (
                                                <div className="flex flex-col items-center justify-center gap-4 text-emerald-600 relative">
                                                    {previews.vehicleInspection && (
                                                        <>
                                                            <div className="w-full h-[500px] rounded-2xl overflow-hidden border-2 border-emerald-100 mb-3 bg-white shadow-2xl">
                                                                <img src={previews.vehicleInspection} alt="Preview" className="w-full h-full object-contain p-4 transition-transform hover:scale-[1.01]" />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleFileChange(null, 'vehicleInspection');
                                                                }}
                                                                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-red-500/90 text-white flex items-center justify-center shadow-xl hover:bg-red-600 transition-all z-30 hover:scale-110 active:scale-95"
                                                            >
                                                                <X className="w-7 h-7" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <div className="flex items-center gap-3 font-bold bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100 shadow-sm">
                                                        <Check className="w-6 h-6" />
                                                        <span className="text-sm truncate max-w-[400px]">{files.vehicleInspection.name}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 py-32">
                                                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-emerald-400 opacity-50" />
                                                    <span className="text-xl font-bold">クリックして車検証をアップロード</span>
                                                    <p className="text-sm mt-2 font-medium">車両情報が確認できる面を撮影してください</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* PL Insurance */}
                                <div className="space-y-3">
                                    <label className="block text-lg font-bold text-gray-800">3. PL保険（生産物賠償責任保険）</label>
                                    <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-emerald-300 transition-colors bg-gray-50 overflow-hidden">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'plInsurance')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />
                                        <div className="text-center relative z-10 w-full">
                                            {files.plInsurance ? (
                                                <div className="flex flex-col items-center justify-center gap-4 text-emerald-600 relative">
                                                    {previews.plInsurance && (
                                                        <>
                                                            <div className="w-full h-[500px] rounded-2xl overflow-hidden border-2 border-emerald-100 mb-3 bg-white shadow-2xl">
                                                                <img src={previews.plInsurance} alt="Preview" className="w-full h-full object-contain p-4 transition-transform hover:scale-[1.01]" />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleFileChange(null, 'plInsurance');
                                                                }}
                                                                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-red-500/90 text-white flex items-center justify-center shadow-xl hover:bg-red-600 transition-all z-30 hover:scale-110 active:scale-95"
                                                            >
                                                                <X className="w-7 h-7" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <div className="flex items-center gap-3 font-bold bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100 shadow-sm">
                                                        <Check className="w-6 h-6" />
                                                        <span className="text-sm truncate max-w-[400px]">{files.plInsurance.name}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 py-32">
                                                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-emerald-400 opacity-50" />
                                                    <span className="text-xl font-bold">クリックしてPL保険をアップロード</span>
                                                    <p className="text-sm mt-2 font-medium">生産物賠償責任保険の証書をアップロードしてください</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Fire Layout */}
                                <div className="space-y-3">
                                    <label className="block text-lg font-bold text-gray-800">4. 火器類配置図</label>
                                    <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-emerald-300 transition-colors bg-gray-50 overflow-hidden">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'fireLayout')}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />
                                        <div className="text-center relative z-10 w-full">
                                            {files.fireLayout ? (
                                                <div className="flex flex-col items-center justify-center gap-4 text-emerald-600 relative">
                                                    {previews.fireLayout && (
                                                        <>
                                                            <div className="w-full h-[500px] rounded-2xl overflow-hidden border-2 border-emerald-100 mb-3 bg-white shadow-2xl">
                                                                <img src={previews.fireLayout} alt="Preview" className="w-full h-full object-contain p-4 transition-transform hover:scale-[1.02]" />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleFileChange(null, 'fireLayout');
                                                                }}
                                                                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-red-500/90 text-white flex items-center justify-center shadow-xl hover:bg-red-600 transition-all z-30 hover:scale-110 active:scale-95"
                                                            >
                                                                <X className="w-7 h-7" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <div className="flex items-center gap-3 font-bold bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100 shadow-sm">
                                                        <Check className="w-6 h-6" />
                                                        <span className="text-sm truncate max-w-[400px]">{files.fireLayout.name}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 py-32">
                                                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-emerald-400 opacity-50" />
                                                    <span className="text-xl font-bold">クリックして火器類配置図をアップロード</span>
                                                    <p className="text-sm mt-2 font-medium">什器や火器の配置がわかる図面を選択してください</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex gap-3 text-xs text-gray-500">
                                <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" />
                                <p>5MB以内のJPG, PNG, GIF, WebP形式のみ対応しています。</p>
                            </div>

                            <div className="pt-4 flex justify-between">
                                <Button variant="ghost" onClick={() => setStep(2)}>
                                    戻る
                                </Button>
                                <Button onClick={handleNext} disabled={!files.businessLicense}>
                                    最終確認へ進む <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-8">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="h-8 w-8" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">準備が整いました！</h2>
                                <p className="text-gray-500 mt-2">
                                    以下の内容でアカウント登録を完了し、<br />
                                    ダッシュボードへ移動します。
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 text-left text-sm max-w-sm mx-auto space-y-3 border border-gray-200 shadow-sm">
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">店舗名</span>
                                    <span className="font-bold text-gray-900">{formData.storeName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">代表者</span>
                                    <span className="font-medium text-gray-900">{formData.repName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">連絡先</span>
                                    <span className="font-medium text-gray-900">{formData.email}</span>
                                </div>
                                <div className="flex justify-between font-bold text-emerald-600 text-xs">
                                    <span>提出書類</span>
                                    <span>{Object.values(files).filter(f => f !== null).length} 件を選択済み</span>
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200 max-w-sm mx-auto text-left shadow-sm">
                                    <p className="font-bold mb-1 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" /> エラーが発生しました
                                    </p>
                                    <p className="whitespace-pre-wrap">{error}</p>
                                    <div className="mt-2 pt-2 border-t border-red-100 text-[10px] text-red-500 italic">
                                        Tip: Supabase Storage に 'exhibitor-documents' バケットを作成し、公開設定になっているか確認してください。
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex justify-center gap-4">
                                <Button variant="ghost" onClick={() => setStep(3)} disabled={isLoading} size="lg">
                                    修正する
                                </Button>
                                <Button onClick={handleSubmit} size="lg" className="px-8 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200" disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" /> 登録中...
                                        </div>
                                    ) : "登録を完了する"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Store, User, Phone, MapPin, Globe, Loader2, Save, ArrowLeft, Sparkles, AlertCircle, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ProfileForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const supabase = createClient();

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

    const [aiResults, setAiResults] = useState<{ [key: string]: { status: 'idle' | 'verifying' | 'success' | 'error', message?: string, data?: any } }>({
        businessLicense: { status: 'idle' },
        vehicleInspection: { status: 'idle' },
        plInsurance: { status: 'idle' },
        fireLayout: { status: 'idle' },
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
                    .from("exhibitors")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (profileError) throw profileError;

                if (profile) {
                    // #region agent log
                    fetch('http://127.0.0.1:7243/ingest/24386baa-c201-40e8-8398-79c24751054d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'store/components/profile/ProfileForm.tsx:66',message:'Profile loaded',data:{hasProfile:!!profile,hasBusinessLicense:!!profile.business_license_image_url,businessLicenseUrl:profile.business_license_image_url?.substring(0,50)||null,hasVehicleInspection:!!profile.vehicle_inspection_image_url,hasPlInsurance:!!profile.pl_insurance_image_url,hasFireLayout:!!profile.fire_equipment_layout_image_url,hasWebsite:!!profile.website,hasDescription:!!profile.description},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
                    // #endregion
                    setFormData({
                        storeName: profile.shop_name || "",
                        repName: profile.name || "",
                        email: profile.email || "",
                        phone: profile.phone_number || "",
                        website: profile.website || "",
                        description: profile.description || "",
                    });
                    setPreviews({
                        businessLicense: profile.business_license_image_url || "",
                        vehicleInspection: profile.vehicle_inspection_image_url || "",
                        plInsurance: profile.pl_insurance_image_url || "",
                        fireLayout: profile.fire_equipment_layout_image_url || "",
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
        if (e && e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFiles(prev => ({ ...prev, [key]: file }));

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
            setFiles(prev => ({ ...prev, [key]: null }));
            setPreviews(prev => ({ ...prev, [key]: "" }));
            setAiResults(prev => ({ ...prev, [key]: { status: 'idle' } }));
        }
    };

    const uploadFiles = async (userId: string) => {
        const updatedUrls: { [key: string]: string } = {};

        for (const [key, file] of Object.entries(files)) {
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${userId}/${key}_${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = fileName;

                const { error: uploadError } = await supabase.storage
                    .from('exhibitor-documents')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('exhibitor-documents')
                    .getPublicUrl(filePath);

                updatedUrls[key] = publicUrl;
            }
        }
        return updatedUrls;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError("");
        setSuccess("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("セッションがありません");

            const uploadedUrls = await uploadFiles(user.id);

            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/24386baa-c201-40e8-8398-79c24751054d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'store/components/profile/ProfileForm.tsx:170',message:'Before update - form data and uploaded URLs',data:{formData:{storeName:formData.storeName,repName:formData.repName,email:formData.email,phone:formData.phone,website:formData.website,description:formData.description},uploadedUrls:Object.keys(uploadedUrls),hasBusinessLicense:!!uploadedUrls.businessLicense,hasVehicleInspection:!!uploadedUrls.vehicleInspection,hasPlInsurance:!!uploadedUrls.plInsurance,hasFireLayout:!!uploadedUrls.fireLayout},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion

            const updateData: any = {
                shop_name: formData.storeName,
                name: formData.repName,
                email: formData.email,
                phone_number: formData.phone,
                description: formData.description,
                updated_at: new Date().toISOString(),
            };

            if (uploadedUrls.businessLicense) updateData.business_license_image_url = uploadedUrls.businessLicense;
            if (uploadedUrls.vehicleInspection) updateData.vehicle_inspection_image_url = uploadedUrls.vehicleInspection;
            if (uploadedUrls.plInsurance) updateData.pl_insurance_image_url = uploadedUrls.plInsurance;
            if (uploadedUrls.fireLayout) updateData.fire_equipment_layout_image_url = uploadedUrls.fireLayout;

            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/24386baa-c201-40e8-8398-79c24751054d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'store/components/profile/ProfileForm.tsx:186',message:'Update data prepared',data:{updateDataKeys:Object.keys(updateData),hasWebsite:!!updateData.website,hasDescription:!!updateData.description,emailValue:updateData.email,shopNameValue:updateData.shop_name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion

            const { error: updateError } = await supabase
                .from("exhibitors")
                .update(updateData)
                .eq("user_id", user.id);

            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/24386baa-c201-40e8-8398-79c24751054d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'store/components/profile/ProfileForm.tsx:191',message:'Update result',data:{hasError:!!updateError,errorMessage:updateError?.message,errorCode:updateError?.code,errorDetails:updateError?.details,errorHint:updateError?.hint},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion

            if (updateError) throw updateError;

            setSuccess("プロフィールと書類を更新しました");
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
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-emerald-600 px-8 py-6">
                <h1 className="text-2xl font-bold text-white">出店者プロフィール設定</h1>
                <p className="text-emerald-100 mt-1">
                    店舗情報や提出書類を最新の状態に保ちましょう。
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-lg text-sm">
                        {success}
                    </div>
                )}

                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">基本情報</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">店舗名 / 団体名 <span className="text-emerald-500">*</span></label>
                            <div className="relative">
                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    name="storeName"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">代表者名 <span className="text-emerald-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    name="repName"
                                    value={formData.repName}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all font-medium"
                                />
                            </div>
                        </div>

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
                                        required
                                        className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all font-medium"
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
                                        required
                                        className="block w-full pl-10 rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">お店の紹介文</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">提出書類の確認・更新</h2>

                    <div className="grid grid-cols-1 gap-8">
                        {[
                            { key: 'businessLicense', label: '1. 営業許可証' },
                            { key: 'vehicleInspection', label: '2. 車検証' },
                            { key: 'plInsurance', label: '3. PL保険' },
                            { key: 'fireLayout', label: '4. 火器類配置図' },
                        ].map((doc) => (
                            <div key={doc.key} className="space-y-3">
                                <label className="block text-sm font-bold text-gray-800">{doc.label}</label>
                                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-colors bg-gray-50">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, doc.key)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {previews[doc.key] ? (
                                        <div className="space-y-4">
                                            <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-white shadow-sm">
                                                {/* #region agent log */}
                                                {(() => {
                                                    fetch('http://127.0.0.1:7243/ingest/24386baa-c201-40e8-8398-79c24751054d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'store/components/profile/ProfileForm.tsx:328',message:'Image preview render',data:{docKey:doc.key,hasPreview:!!previews[doc.key],previewUrl:previews[doc.key]?.substring(0,100)||null,isDataUrl:previews[doc.key]?.startsWith('data:'),isHttpUrl:previews[doc.key]?.startsWith('http')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
                                                    return null;
                                                })()}
                                                {/* #endregion */}
                                                <img 
                                                    src={previews[doc.key]} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        // #region agent log
                                                        fetch('http://127.0.0.1:7243/ingest/24386baa-c201-40e8-8398-79c24751054d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'store/components/profile/ProfileForm.tsx:338',message:'Image load error',data:{docKey:doc.key,previewUrl:previews[doc.key]?.substring(0,100)||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
                                                        // #endregion
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFileChange(null, doc.key);
                                                    }}
                                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-all z-20"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                            {files[doc.key] && (
                                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                                                    <Check className="w-4 h-4" /> アップロード準備完了: {files[doc.key]?.name}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-gray-400">
                                            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                            <p className="text-sm font-medium">クリックして画像を選択</p>
                                        </div>
                                    )}
                                </div>

                                {/* AI Analysis Result (only for new files) */}
                                {aiResults[doc.key].status !== 'idle' && (
                                    <div className={cn(
                                        "rounded-xl p-4 border transition-all text-xs",
                                        aiResults[doc.key].status === 'verifying' ? "bg-blue-50 border-blue-100" :
                                            aiResults[doc.key].status === 'success' ? "bg-emerald-50 border-emerald-100" :
                                                "bg-red-50 border-red-100"
                                    )}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {aiResults[doc.key].status === 'verifying' ? <Loader2 className="w-3 h-3 animate-spin text-blue-600" /> :
                                                aiResults[doc.key].status === 'success' ? <Check className="w-3 h-3 text-emerald-600" /> :
                                                    <AlertCircle className="w-3 h-3 text-red-600" />}
                                            <span className="font-bold">AI解析: {aiResults[doc.key].message}</span>
                                        </div>
                                        {aiResults[doc.key].data && (
                                            <div className="grid grid-cols-2 gap-2 bg-white/50 p-2 rounded-lg border border-white/50">
                                                <div>
                                                    <p className="opacity-60 mb-0.5">種別</p>
                                                    <p className="font-bold">{aiResults[doc.key].data.documentType}</p>
                                                </div>
                                                <div>
                                                    <p className="opacity-60 mb-0.5">有効期限</p>
                                                    <p className="font-bold text-emerald-700">{aiResults[doc.key].data.expiryDate}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t flex justify-end gap-3">
                    <Link href="/">
                        <Button variant="ghost" type="button">キャンセル</Button>
                    </Link>
                    <Button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 px-8 shadow-lg shadow-emerald-100">
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        {isSaving ? "保存中..." : "変更を保存する"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

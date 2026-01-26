"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ChevronRight, ChevronLeft, Calendar, MapPin,
    ImageIcon, FileText, CheckCircle2, Users, Upload, Clock, AlertCircle, Search, Trash2, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function EditEventPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;
    const supabase = createClient();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        eventName: "",
        genre: "",
        leadText: "",
        description: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        appDeadline: "",
        venueName: "",
        zipCode: "",
        address: "",
        recruitCount: 10,
        fee: "",
        requirements: "",
        mainImage: null as string | null,
        images: [] as string[],
        status: 'published'
    });

    const [files, setFiles] = useState<{ main: File | null; gallery: File[] }>({
        main: null,
        gallery: [],
    });

    useEffect(() => {
        const fetchEvent = async () => {
            setIsFetching(true);
            try {
                const { data, error } = await supabase
                    .from("events")
                    .select("*")
                    .eq("id", eventId)
                    .single();

                if (error) throw error;
                if (data) {
                    const [startT, endT] = (data.event_time || " - ").split(" - ");
                    setFormData({
                        eventName: data.event_name || "",
                        genre: data.genre || "",
                        leadText: data.lead_text || "",
                        description: data.description || "",
                        startDate: data.event_start_date || "",
                        endDate: data.event_end_date || "",
                        startTime: startT || "",
                        endTime: endT || "",
                        appDeadline: data.application_period_end || "",
                        venueName: data.venue_name || "",
                        zipCode: "", // We don't necessarily store zip code separately in DB yet
                        address: data.address || "",
                        recruitCount: data.recruit_count || 10,
                        fee: data.fee || "",
                        requirements: data.requirements || "",
                        mainImage: data.main_image_url || null,
                        images: data.gallery_images || [],
                        status: data.status || 'published'
                    });
                }
            } catch (err: any) {
                console.error("Fetch error:", err);
                setError("イベントの取得に失敗しました。");
            } finally {
                setIsFetching(false);
            }
        };

        if (eventId) fetchEvent();
    }, [eventId, supabase]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, mainImage: url }));
            setFiles(prev => ({ ...prev, main: file }));
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const urls = newFiles.map(file => URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
            setFiles(prev => ({ ...prev, gallery: [...prev.gallery, ...newFiles] }));
        }
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const searchAddress = async () => {
        const cleanZip = formData.zipCode.replace(/[-\s]/g, "");
        if (!cleanZip || cleanZip.length < 7) {
            setError("正しい郵便番号を入力してください（7桁）");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`);
            const data = await res.json();

            if (data.results && data.results[0]) {
                const result = data.results[0];
                const addr = `${result.address1}${result.address2}${result.address3}`;
                setFormData(prev => ({ ...prev, address: addr }));
                setError("");
            } else {
                setError(data.message || "住所が見つかりませんでした。");
            }
        } catch (err) {
            setError("住所の検索に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    const uploadImages = async (userId: string) => {
        let mainImageUrl = formData.mainImage || "";
        const galleryUrls: string[] = [...formData.images.filter(img => img.startsWith('http'))];

        if (files.main) {
            const fileExt = files.main.name.split('.').pop();
            const fileName = `${userId}/main_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('event-images')
                .upload(fileName, files.main);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(fileName);
            mainImageUrl = publicUrl;
        }

        for (const file of files.gallery) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/gallery_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('event-images')
                .upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(fileName);
            galleryUrls.push(publicUrl);
        }

        return { mainImageUrl, galleryUrls };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("ログインセッションが見つかりません。");

            const { mainImageUrl, galleryUrls } = await uploadImages(user.id);

            const { error: updateError } = await supabase
                .from("events")
                .update({
                    event_name: formData.eventName,
                    genre: formData.genre,
                    lead_text: formData.leadText,
                    description: formData.description,
                    event_start_date: formData.startDate,
                    event_end_date: formData.endDate || formData.startDate,
                    event_time: `${formData.startTime} - ${formData.endTime}`,
                    application_period_end: formData.appDeadline,
                    venue_name: formData.venueName,
                    address: formData.address,
                    recruit_count: formData.recruitCount,
                    fee: formData.fee,
                    requirements: formData.requirements,
                    main_image_url: mainImageUrl,
                    gallery_images: galleryUrls,
                })
                .eq("id", eventId);

            if (updateError) throw updateError;

            router.push(`/events/${eventId}`);
            router.refresh();
        } catch (err: any) {
            console.error("Event update error:", err);
            setError(err.message || "イベントの更新に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("本当にこのイベントを削除しますか？この操作は取り消せません。")) return;

        setIsLoading(true);
        try {
            const { error } = await supabase.from("events").delete().eq("id", eventId);
            if (error) throw error;
            router.push("/");
            router.refresh();
        } catch (err: any) {
            alert("削除に失敗しました: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    const steps = [
        { id: 1, title: "基本情報", icon: FileText },
        { id: 2, title: "日時", icon: Calendar },
        { id: 3, title: "場所", icon: MapPin },
        { id: 4, title: "募集", icon: Users },
        { id: 5, title: "画像", icon: ImageIcon },
        { id: 6, title: "完了", icon: CheckCircle2 },
    ];

    const canProceed = () => {
        switch (step) {
            case 1: return formData.eventName && formData.genre;
            case 2: return formData.startDate && formData.startTime && formData.endTime && formData.appDeadline;
            case 3: return formData.venueName && formData.address;
            case 4: return formData.recruitCount && formData.fee;
            default: return true;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="px-6 h-16 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href={`/events/${eventId}`} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900">イベントの編集</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        イベントを削除
                    </Button>
                    <div className="text-sm font-medium text-gray-500 px-3 border-l border-gray-100">
                        Step {step} / 6
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto max-w-3xl px-4 py-8">
                {/* Simplified Progress bar from new/page.tsx */}
                <div className="mb-14 px-2">
                    <div className="flex justify-between relative max-w-2xl mx-auto">
                        <div className="absolute top-[28px] left-0 w-full h-1.5 bg-gray-100 -z-10 rounded-full"></div>
                        <div
                            className="absolute top-[28px] left-0 h-1.5 bg-orange-500 -z-10 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                        ></div>
                        {steps.map((s) => (
                            <div key={s.id} className="flex flex-col items-center gap-3 relative">
                                <div className={cn(
                                    "w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 bg-white",
                                    step >= s.id ? "border-orange-500 text-orange-600 shadow-md" : "border-gray-100 text-gray-300"
                                )}>
                                    <s.icon className="w-7 h-7" />
                                </div>
                                <span className={cn("text-[10px] font-bold absolute -bottom-6 w-20 text-center", step === s.id ? "text-orange-600" : "text-gray-300")}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 min-h-[400px]">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                            <AlertCircle className="w-5 h-5" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Step components would go here - for brevity, implementing the core form logic similar to new/page.tsx */}
                    {/* (Reusing the same JSX structure as new/page.tsx for consistency) */}

                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-gray-900">基本情報の変更</h2>
                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">イベント名</label>
                                    <input name="eventName" value={formData.eventName} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5" />
                                </div>
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">ジャンル</label>
                                    <select name="genre" value={formData.genre} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5">
                                        <option value="マルシェ">マルシェ</option>
                                        <option value="音楽フェス">音楽フェス</option>
                                        <option value="フードフェス">フードフェス</option>
                                        <option value="地域のお祭り">地域のお祭り</option>
                                        <option value="スポーツ">スポーツ</option>
                                        <option value="その他">その他</option>
                                    </select>
                                </div>
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">詳細説明</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-gray-900">日時の変更</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">開始日</label>
                                    <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">募集締切</label>
                                    <input name="appDeadline" type="date" value={formData.appDeadline} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">開始時間</label>
                                    <input name="startTime" type="time" value={formData.startTime} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">終了時間</label>
                                    <input name="endTime" type="time" value={formData.endTime} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-gray-900">場所の変更</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">会場名</label>
                                    <input name="venueName" value={formData.venueName} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">郵便番号（検索用）</label>
                                    <div className="flex gap-2">
                                        <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="ハイフンなし" className="block flex-1 rounded-lg border-gray-300 bg-gray-50 p-3.5" />
                                        <Button type="button" onClick={searchAddress} disabled={isLoading} className="bg-gray-100 text-gray-700">検索</Button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">住所</label>
                                    <input name="address" value={formData.address} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-gray-900">条件の変更</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">募集台数</label>
                                    <input name="recruitCount" type="number" value={formData.recruitCount} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">出店料</label>
                                    <input name="fee" value={formData.fee} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-gray-900">画像の変更</h2>
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-700">メイン画像</label>
                                <div className="aspect-video relative rounded-xl border-2 border-dashed border-gray-300 overflow-hidden">
                                    {formData.mainImage ? (
                                        <img src={formData.mainImage} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
                                    )}
                                    <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity text-white font-bold">
                                        変更する
                                        <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 6 && (
                        <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">準備が整いました</h2>
                            <p className="text-gray-500">変更内容を保存して、最新の情報を公開しましょう。</p>
                        </div>
                    )}

                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                        <Button variant="ghost" onClick={handleBack} disabled={step === 1 || isLoading} className={cn(step === 1 && "invisible")}>戻る</Button>
                        {step < 6 ? (
                            <Button onClick={handleNext} disabled={!canProceed()} className="bg-orange-500 text-white rounded-full px-8">次へ</Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={isLoading} className="bg-gray-900 text-white rounded-full px-10 h-12">
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "変更を保存する"}
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

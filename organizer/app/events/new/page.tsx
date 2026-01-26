"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
    ChevronRight, ChevronLeft, Calendar, MapPin,
    ImageIcon, FileText, CheckCircle2, Users, Upload, Clock, AlertCircle, Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function CreateEventPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isApproved, setIsApproved] = useState<boolean | null>(null);
    const [isCheckingApproval, setIsCheckingApproval] = useState(true);
    const supabase = createClient();

    // Check approval status on mount
    useEffect(() => {
        const checkApproval = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login");
                    return;
                }

                const { data: profile } = await supabase
                    .from("organizers")
                    .select("is_approved")
                    .eq("user_id", user.id)
                    .single();

                if (profile) {
                    setIsApproved(profile.is_approved || false);
                } else {
                    router.push("/onboarding");
                }
            } catch (err) {
                console.error("Error checking approval:", err);
                setError("承認状態の確認に失敗しました");
            } finally {
                setIsCheckingApproval(false);
            }
        };

        checkApproval();
    }, [supabase, router]);

    // Form State
    const [formData, setFormData] = useState({
        // Step 1: Basic
        eventName: "",
        genre: "",
        leadText: "",
        description: "",

        // Step 2: Date
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        appDeadline: "",

        // Step 3: Location
        venueName: "",
        zipCode: "",
        address: "",

        // Step 4: Recruit
        recruitCount: 10,
        fee: "",
        requirements: "",

        // Step 5: Images
        mainImage: null as string | null,
        images: [] as string[],
    });

    const [files, setFiles] = useState<{ main: File | null; gallery: File[] }>({
        main: null,
        gallery: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing again
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
        // Strip hyphens and whitespace
        const cleanZip = formData.zipCode.replace(/[-\s]/g, "");
        if (!cleanZip || cleanZip.length < 7) {
            setError("正しい郵便番号を入力してください（7桁）");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            console.log("Searching zip code:", cleanZip);
            const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`);
            const data = await res.json();
            console.log("Address search response:", data);

            if (data.results && data.results[0]) {
                const result = data.results[0];
                const addr = `${result.address1}${result.address2}${result.address3}`;
                console.log("Found address:", addr);
                setFormData(prev => ({ ...prev, address: addr }));
                setError(""); // Clear error on success
            } else {
                setError(data.message || "住所が見つかりませんでした。正しい郵便番号を入力してください。");
            }
        } catch (err) {
            console.error("Zip code search error:", err);
            setError("住所の検索に失敗しました。ネットワーク状況を確認してください。");
        } finally {
            setIsLoading(false);
        }
    };

    const uploadImages = async (userId: string) => {
        let mainImageUrl = "";
        const galleryUrls: string[] = [];

        // Upload main image
        if (files.main) {
            const fileExt = files.main.name.split('.').pop();
            const fileName = `${userId}/main_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('event-images')
                .upload(fileName, files.main);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('event-images')
                .getPublicUrl(fileName);
            mainImageUrl = publicUrl;
        }

        // Upload gallery images
        for (const file of files.gallery) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/gallery_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('event-images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('event-images')
                .getPublicUrl(fileName);
            galleryUrls.push(publicUrl);
        }

        return { mainImageUrl, galleryUrls };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // 1. Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("ログインセッションが見つかりません。");

            // 2. Get organizer profile ID
            const { data: profile, error: profileError } = await supabase
                .from("organizers")
                .select("id, is_approved")
                .eq("user_id", user.id)
                .single();

            if (profileError || !profile) {
                throw new Error("主催者プロフィールが見つかりません。オンボーディングを完了させてください。");
            }

            // Check approval status (double check)
            const orgProfile = profile as unknown as { id: string; is_approved: boolean };
            if (!orgProfile.is_approved) {
                throw new Error("アカウントがまだ承認されていません。管理者の承認をお待ちください。承認が完了次第、イベントの作成が可能になります。");
            }

            // 3. Upload images first
            const { mainImageUrl, galleryUrls } = await uploadImages(user.id);

            // 4. Insert event
            const { error: insertError } = await supabase
                .from("events")
                .insert({
                    organizer_id: profile.id,
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
                    status: 'pending', // Default to pending approval
                });

            if (insertError) throw insertError;

            // Success!
            router.push("/");
            router.refresh();
        } catch (err: any) {
            console.error("Event creation error:", err);
            setError(err.message || "イベントの作成に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { id: 1, title: "基本情報", icon: FileText },
        { id: 2, title: "日時", icon: Calendar },
        { id: 3, title: "場所", icon: MapPin },
        { id: 4, title: "募集", icon: Users },
        { id: 5, title: "画像", icon: ImageIcon },
        { id: 6, title: "確認", icon: CheckCircle2 },
    ];

    // Simple validation helper
    const canProceed = () => {
        switch (step) {
            case 1: return formData.eventName && formData.genre;
            case 2: return formData.startDate && formData.startTime && formData.endTime && formData.appDeadline;
            case 3: return formData.venueName && formData.address;
            case 4: return formData.recruitCount && formData.fee;
            case 5: return true; // Image optional for now or check formData.mainImage
            default: return true;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="px-6 h-16 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900">イベント新規作成</h1>
                </div>
                <div className="text-sm font-medium text-gray-500">
                    Step {step} / 6
                </div>
            </header>

            <main className="flex-1 container mx-auto max-w-3xl px-4 py-8">
                {/* Approval Status Warning */}
                {isCheckingApproval ? (
                    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
                        <p className="text-sm text-gray-500">承認状態を確認中...</p>
                    </div>
                ) : isApproved === false ? (
                    <div className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                                <AlertCircle className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-amber-900 mb-1">承認待ち</h3>
                                <p className="text-sm text-amber-700 leading-relaxed mb-4">
                                    現在、管理者による承認を待っています。承認が完了するまで、イベントの作成はできません。
                                </p>
                                <Link href="/">
                                    <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                                        ダッシュボードに戻る
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Progress Bar */}
                <div className="mb-14 px-2">
                    <div className="flex justify-between relative max-w-2xl mx-auto">
                        {/* Connecting Line (Background) */}
                        <div className="absolute top-[28px] left-0 w-full h-1.5 bg-gray-100 -z-10 rounded-full"></div>

                        {/* Connecting Line (Active) */}
                        <div
                            className="absolute top-[28px] left-0 h-1.5 bg-orange-500 -z-10 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {steps.map((s) => (
                            <div key={s.id} className="flex flex-col items-center gap-3 relative">
                                <div className={cn(
                                    "w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 relative bg-white",
                                    step >= s.id
                                        ? "border-orange-500 text-orange-600 shadow-lg shadow-orange-100 scale-110 z-10"
                                        : "border-gray-100 text-gray-300"
                                )}>
                                    <s.icon className={cn(
                                        "w-7 h-7 transition-transform duration-500",
                                        step === s.id && "scale-110"
                                    )} />

                                    {/* Small indicator dot for completed steps */}
                                    {step > s.id && (
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center animate-in zoom-in duration-300">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[11px] font-black tracking-wider uppercase transition-all duration-500 absolute -bottom-8 w-24 text-center select-none",
                                    step === s.id ? "text-orange-600 scale-110" : step > s.id ? "text-orange-400" : "text-gray-300"
                                )}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 min-h-[400px]">

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-gray-900">どんなイベントですか？</h2>

                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        イベント名 <span className="text-orange-500">*</span>
                                    </label>
                                    <input
                                        name="eventName"
                                        value={formData.eventName}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                        placeholder="例： 第5回 東京サマーマルシェ"
                                        autoFocus
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        ジャンル <span className="text-orange-500">*</span>
                                    </label>
                                    <select
                                        name="genre"
                                        value={formData.genre}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium appearance-none shadow-sm cursor-pointer"
                                    >
                                        <option value="">選択してください</option>
                                        <option value="マルシェ">マルシェ</option>
                                        <option value="音楽フェス">音楽フェス</option>
                                        <option value="フードフェス">フードフェス</option>
                                        <option value="地域のお祭り">地域のお祭り</option>
                                        <option value="スポーツ">スポーツ</option>
                                        <option value="その他">その他</option>
                                    </select>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        キャッチコピー
                                    </label>
                                    <input
                                        name="leadText"
                                        value={formData.leadText}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                        placeholder="一言でイベントの魅力を伝えましょう"
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        イベント詳細
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={6}
                                        className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all resize-none shadow-sm leading-relaxed"
                                        placeholder="イベントの趣旨、ターゲット層、過去の実績などを詳しく記入してください。"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Date & Time */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-gray-900">いつ開催しますか？</h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            開催日 (開始) <span className="text-orange-500">*</span>
                                        </label>
                                        <input
                                            name="startDate"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            開催日 (終了)
                                        </label>
                                        <input
                                            name="endDate"
                                            type="date"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            開始時間 <span className="text-orange-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={formData.startTime.split(':')[0] || ""}
                                                onChange={(e) => {
                                                    const mins = formData.startTime.split(':')[1] || "00";
                                                    setFormData(prev => ({ ...prev, startTime: `${e.target.value.padStart(2, '0')}:${mins}` }));
                                                }}
                                                className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium appearance-none shadow-sm cursor-pointer"
                                            >
                                                <option value="">時</option>
                                                {Array.from({ length: 24 }).map((_, i) => (
                                                    <option key={i} value={i.toString().padStart(2, '0')}>{i}時</option>
                                                ))}
                                            </select>
                                            <select
                                                value={formData.startTime.split(':')[1] || ""}
                                                onChange={(e) => {
                                                    const hrs = formData.startTime.split(':')[0] || "00";
                                                    setFormData(prev => ({ ...prev, startTime: `${hrs.padStart(2, '0')}:${e.target.value}` }));
                                                }}
                                                className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium appearance-none shadow-sm cursor-pointer"
                                            >
                                                <option value="">分</option>
                                                {['00', '10', '20', '30', '40', '50'].map((m) => (
                                                    <option key={m} value={m}>{m}分</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            終了時間 <span className="text-orange-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={formData.endTime.split(':')[0] || ""}
                                                onChange={(e) => {
                                                    const mins = formData.endTime.split(':')[1] || "00";
                                                    setFormData(prev => ({ ...prev, endTime: `${e.target.value.padStart(2, '0')}:${mins}` }));
                                                }}
                                                className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium appearance-none shadow-sm cursor-pointer"
                                            >
                                                <option value="">時</option>
                                                {Array.from({ length: 24 }).map((_, i) => (
                                                    <option key={i} value={i.toString().padStart(2, '0')}>{i}時</option>
                                                ))}
                                            </select>
                                            <select
                                                value={formData.endTime.split(':')[1] || ""}
                                                onChange={(e) => {
                                                    const hrs = formData.endTime.split(':')[0] || "00";
                                                    setFormData(prev => ({ ...prev, endTime: `${hrs.padStart(2, '0')}:${e.target.value}` }));
                                                }}
                                                className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium appearance-none shadow-sm cursor-pointer"
                                            >
                                                <option value="">分</option>
                                                {['00', '10', '20', '30', '40', '50'].map((m) => (
                                                    <option key={m} value={m}>{m}分</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-orange-500" />
                                            出店募集の締め切り <span className="text-orange-500">*</span>
                                        </label>
                                        <input
                                            name="appDeadline"
                                            type="date"
                                            value={formData.appDeadline}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border-orange-200 bg-white p-3.5 text-gray-900 outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-bold shadow-sm"
                                        />
                                        <p className="text-xs text-orange-600 mt-2">
                                            ※ この日を過ぎると出店申し込みができなくなります。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Location */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-gray-900">開催場所はどこですか？</h2>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-in fade-in duration-300">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        会場名 <span className="text-orange-500">*</span>
                                    </label>
                                    <input
                                        name="venueName"
                                        value={formData.venueName}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                        placeholder="例： 代々木公園 イベント広場"
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        郵便番号
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <span className="text-sm font-bold">〒</span>
                                            </div>
                                            <input
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                className="block w-full rounded-lg border-gray-300 bg-gray-50 pl-10 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                                placeholder="例： 1500041"
                                                maxLength={7}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={searchAddress}
                                            disabled={isLoading || formData.zipCode.length < 7}
                                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 shadow-none px-6 rounded-lg"
                                        >
                                            <Search className="w-4 h-4 mr-2" />
                                            住所を検索
                                        </Button>
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        住所 / 所在地 <span className="text-orange-500">*</span>
                                    </label>
                                    <input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                        placeholder="例： 東京都渋谷区神南2-3"
                                    />
                                </div>

                                {formData.address ? (
                                    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            loading="lazy"
                                            allowFullScreen
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.address)}&output=embed&z=15`}
                                            title="Venue Map"
                                        ></iframe>
                                        <div className="bg-white p-2 text-[10px] text-gray-400 border-t border-gray-100 flex justify-between items-center px-4">
                                            <span>※ 住所に基づいて付近を表示しています</span>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-orange-600 font-bold hover:underline"
                                            >
                                                大きな地図で見る
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400">
                                        <div className="text-center">
                                            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                            <p className="text-sm font-medium">住所を入力すると地図が表示されます</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Recruitment */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-gray-900">募集要項の設定</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            募集台数 (店舗数) <span className="text-orange-500">*</span>
                                        </label>
                                        <input
                                            name="recruitCount"
                                            type="number"
                                            value={formData.recruitCount}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            出店料 <span className="text-orange-500">*</span>
                                        </label>
                                        <input
                                            name="fee"
                                            value={formData.fee}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium shadow-sm"
                                            placeholder="例： 1日 5,000円 / 売上の10%"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        出店条件・備考
                                    </label>
                                    <textarea
                                        name="requirements"
                                        value={formData.requirements}
                                        onChange={handleChange}
                                        rows={6}
                                        className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3.5 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all resize-none shadow-sm leading-relaxed"
                                        placeholder="例：
・食品衛生責任者の資格が必要です。
・発電機の持ち込みは不可です。
・搬入時間は8:00〜9:00です。"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Images */}
                    {step === 5 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-gray-900">イベントの魅力を伝えましょう</h2>
                            <p className="text-gray-500">
                                魅力的な写真は、出店者の応募意欲を高めます。
                            </p>

                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        メイン画像
                                    </label>

                                    <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 hover:bg-gray-50 transition-colors relative overflow-hidden group-hover:border-orange-300">
                                        {formData.mainImage ? (
                                            <div className="relative w-full aspect-video">
                                                <Image
                                                    src={formData.mainImage}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <label htmlFor="file-upload" className="cursor-pointer text-white font-bold border border-white px-4 py-2 rounded-full hover:bg-white/20">
                                                        変更する
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <ImageIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                                <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-600 focus-within:ring-offset-2 hover:text-orange-500"
                                                    >
                                                        <span>画像をアップロード</span>
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                                    </label>
                                                    <p className="pl-1">またはドラッグ＆ドロップ</p>
                                                </div>
                                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Confirmation */}
                    {step === 6 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">内容の確認</h2>
                                <p className="text-gray-500 mt-2">
                                    以下の内容でイベントを作成してよろしいですか？
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 space-y-6 text-sm border border-gray-100">
                                <section>
                                    <h3 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">基本情報</h3>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <dt className="text-gray-500 text-xs">イベント名</dt>
                                            <dd className="font-semibold text-gray-900">{formData.eventName}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-gray-500 text-xs">ジャンル</dt>
                                            <dd className="font-semibold text-gray-900">{formData.genre}</dd>
                                        </div>
                                    </dl>
                                </section>

                                <section>
                                    <h3 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">日時・場所</h3>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <dt className="text-gray-500 text-xs">開催日</dt>
                                            <dd className="font-semibold text-gray-900">{formData.startDate} ～ {formData.endDate}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-gray-500 text-xs">時間</dt>
                                            <dd className="font-semibold text-gray-900">{formData.startTime} - {formData.endTime}</dd>
                                        </div>
                                        <div className="col-span-2">
                                            <dt className="text-gray-500 text-xs">会場</dt>
                                            <dd className="font-semibold text-gray-900">{formData.venueName} <span className="text-xs font-normal text-gray-500">({formData.address})</span></dd>
                                        </div>
                                    </dl>
                                </section>

                                <section>
                                    <h3 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">募集要項</h3>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <dt className="text-gray-500 text-xs">募集数</dt>
                                            <dd className="font-semibold text-gray-900">{formData.recruitCount}店舗</dd>
                                        </div>
                                        <div>
                                            <dt className="text-gray-500 text-xs">出店料</dt>
                                            <dd className="font-semibold text-gray-900">{formData.fee}</dd>
                                        </div>
                                        <div className="col-span-2">
                                            <dt className="text-gray-500 text-xs">締め切り</dt>
                                            <dd className="font-semibold text-orange-600">{formData.appDeadline} まで</dd>
                                        </div>
                                    </dl>
                                </section>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={step === 1 || isLoading}
                            className={cn("text-gray-500", step === 1 && "invisible")}
                        >
                            戻る
                        </Button>

                        {step < 6 ? (
                            <Button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 shadow-md shadow-orange-200"
                            >
                                次へ進む <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading || isApproved === false}
                                className="bg-gray-900 hover:bg-black text-white rounded-full px-10 shadow-lg h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                title={isApproved === false ? "管理者の承認が必要です" : undefined}
                            >
                                {isLoading ? "作成中..." : "イベントを作成する"}
                            </Button>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}

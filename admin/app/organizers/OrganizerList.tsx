"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Organizer {
    id: string;
    company_name: string;
    name: string;
    email: string;
    phone_number: string;
    is_approved: boolean;
    created_at: string;
}

export function OrganizerRow({ organizer: initialOrganizer }: { organizer: Organizer }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [organizer, setOrganizer] = useState(initialOrganizer);
    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const supabase = createClient();
    const router = useRouter();

    // Sync with props when they change, but ignore updates within 2 seconds of our own update
    useEffect(() => {
        const now = Date.now();
        // Only sync if it's been more than 2 seconds since our last update
        // This prevents router.refresh() from overwriting our optimistic update
        if (now - lastUpdateTime > 2000) {
            setOrganizer(initialOrganizer);
        }
    }, [initialOrganizer, lastUpdateTime]);

    const handleToggleApproval = async () => {
        setIsUpdating(true);
        try {
            const newApprovalStatus = !organizer.is_approved;
            
            console.log("Updating approval status:", {
                organizerId: organizer.id,
                currentStatus: organizer.is_approved,
                newStatus: newApprovalStatus
            });
            
            // Use API route with Service Role Key to bypass RLS
            const response = await fetch('/api/organizers/update-approval', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    organizerId: organizer.id,
                    isApproved: newApprovalStatus,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '更新に失敗しました');
            }

            console.log("Update successful:", result);

            // Update local state after successful update
            if (result.organizer) {
                setOrganizer(prev => ({ ...prev, is_approved: result.organizer.is_approved }));
            } else {
                setOrganizer(prev => ({ ...prev, is_approved: newApprovalStatus }));
            }
            setLastUpdateTime(Date.now());
            
            // Refresh after a short delay to allow the update to propagate
            setTimeout(() => {
                router.refresh();
            }, 500);
        } catch (err: any) {
            console.error("Approval update error:", err);
            alert("更新に失敗しました: " + (err.message || "不明なエラーが発生しました"));
            // Revert on error
            setOrganizer(prev => ({ ...prev, is_approved: organizer.is_approved }));
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{organizer.company_name || "個人"}</span>
                    <span className="text-xs text-gray-500">{organizer.name}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col text-xs text-gray-600">
                    <span>{organizer.email}</span>
                    <span>{organizer.phone_number}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                {new Date(organizer.created_at).toLocaleDateString('ja-JP')}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${organizer.is_approved
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                    }`}>
                    {organizer.is_approved ? "承認済み" : "未承認"}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                    size="sm"
                    variant={organizer.is_approved ? "outline" : "primary"}
                    onClick={handleToggleApproval}
                    disabled={isUpdating}
                    className={!organizer.is_approved ? "bg-gray-900 text-white hover:bg-gray-800 h-8 text-xs" : "h-8 text-xs"}
                >
                    {isUpdating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : organizer.is_approved ? (
                        "承認解除"
                    ) : (
                        <span className="flex items-center gap-1"><Check className="w-3 h-3" /> 承認する</span>
                    )}
                </Button>
            </td>
        </tr>
    );
}

export default function OrganizerList({ organizers }: { organizers: Organizer[] }) {
    if (!organizers || organizers.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">主催者がまだ登録されていません</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-50">
                            <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">会社名 / 担当者</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">連絡先</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">登録日</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">ステータス</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {organizers.map((org) => (
                            <OrganizerRow key={org.id} organizer={org} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

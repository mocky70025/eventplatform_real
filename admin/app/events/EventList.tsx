"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Check, X, Loader2, AlertCircle, ExternalLink, Calendar, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface Event {
    id: string;
    event_name: string;
    status: string;
    created_at: string;
    event_start_date: string;
    venue_name: string;
    organizer: {
        company_name: string;
        name: string;
    };
}

export function EventRow({ event }: { event: Event }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleToggleStatus = async (newStatus: string) => {
        if (newStatus === 'deleted') {
            if (!confirm("本当にこのイベントを削除しますか？")) return;
        }

        setIsUpdating(true);
        try {
            if (newStatus === 'deleted') {
                const { error } = await supabase
                    .from("events")
                    .delete()
                    .eq("id", event.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("events")
                    .update({ status: newStatus })
                    .eq("id", event.id);
                if (error) throw error;
            }
            router.refresh();
        } catch (err: any) {
            alert("操作に失敗しました: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{event.event_name}</span>
                    <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                        {event.organizer?.company_name || event.organizer?.name}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-xs text-gray-500">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {event.event_start_date}
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {event.venue_name}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${event.status === 'published'
                    ? "bg-green-100 text-green-700"
                    : event.status === 'pending'
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                    {event.status === 'published' ? "公開中" : event.status === 'pending' ? "承認待ち" : "非公開"}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                    {event.status === 'pending' ? (
                        <>
                            <Button
                                size="sm"
                                onClick={() => handleToggleStatus('published')}
                                disabled={isUpdating}
                                className="bg-green-600 text-white hover:bg-green-700 h-8 text-xs font-bold"
                            >
                                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Check className="w-3 h-3 mr-1" /> 承認</>}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleStatus('rejected')}
                                disabled={isUpdating}
                                className="h-8 text-xs text-red-500 hover:bg-red-50 font-bold border-red-200"
                            >
                                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : "却下"}
                            </Button>
                        </>
                    ) : event.status !== 'published' ? (
                        <Button
                            size="sm"
                            onClick={() => handleToggleStatus('published')}
                            disabled={isUpdating}
                            className="bg-gray-900 text-white hover:bg-gray-800 h-8 text-xs font-bold"
                        >
                            {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : "公開許可"}
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus('draft')}
                            disabled={isUpdating}
                            className="h-8 text-xs text-gray-500"
                        >
                            {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : "非公開にする"}
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus('deleted')}
                        disabled={isUpdating}
                        className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 font-bold"
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

export default function EventList({ events }: { events: Event[] }) {
    if (!events || events.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">登録されているイベントはありません</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-50">
                            <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">イベント名 / 主催者</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">日程 / 場所</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">ステータス</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {events.map((event) => (
                            <EventRow key={event.id} event={event} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

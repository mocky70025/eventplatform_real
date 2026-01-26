"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle, Loader2, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ApplicationStatusActions({
    initialStatus,
    applicationId,
    eventId
}: {
    initialStatus: string,
    applicationId: string,
    eventId?: string
}) {
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const updateStatus = async (newStatus: "approved" | "rejected") => {
        if (!confirm(`${newStatus === 'approved' ? '承認' : '却下'}してよろしいですか？`)) return;

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("event_applications")
                .update({ status: newStatus })
                .eq("id", applicationId);

            if (error) throw error;

            setStatus(newStatus);
            router.refresh();
        } catch (error) {
            console.error("Error updating application status:", error);
            alert("エラーが発生しました。");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'approved') {
        // Link to chat page - organizer app uses /events/[id]/chat/[appId] format
        const chatUrl = eventId ? `/events/${eventId}/chat/${applicationId}` : `/applications/${applicationId}/chat`;
        return (
            <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-50 text-green-700 border border-green-200 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    承認済み
                </div>
                <Link href={chatUrl}>
                    <Button className="h-12 px-6 rounded-xl bg-green-600 hover:bg-green-700 gap-2 shadow-lg shadow-green-200">
                        <MessageSquare className="w-4 h-4" />
                        チャットを開始
                    </Button>
                </Link>
            </div>
        );
    }

    if (status === 'rejected') {
        return (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-50 text-red-700 border border-red-200 font-bold">
                <XCircle className="w-5 h-5" />
                却下済み
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                onClick={() => updateStatus('rejected')}
                disabled={isLoading}
                className="h-12 px-6 rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 gap-2"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                却下する
            </Button>
            <Button
                onClick={() => updateStatus('approved')}
                disabled={isLoading}
                className="h-12 px-10 rounded-xl bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-200 gap-2"
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <CheckCircle2 className="w-4 h-4" />
                )}
                承認する
            </Button>
        </div>
    );
}

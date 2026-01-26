"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, Loader2, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    application_id: string;
    sender_id: string;
    message: string;
    created_at: string;
}

interface ChatWindowProps {
    applicationId: string;
    currentUserId: string;
    themeColor?: "orange" | "emerald";
}

export function ChatWindow({ applicationId, currentUserId, themeColor = "orange" }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from("chat_messages")
                    .select("*")
                    .eq("application_id", applicationId)
                    .order("created_at", { ascending: true });

                if (error) throw error;
                setMessages(data || []);
            } catch (err) {
                console.error("Error fetching messages:", err);
            } finally {
                setIsLoading(false);
                setTimeout(scrollToBottom, 100);
            }
        };

        fetchMessages();

        // Subscribe to real-time updates
        const channel = supabase
            .channel(`chat:${applicationId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                    filter: `application_id=eq.${applicationId}`,
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    setMessages((prev) => [...prev, newMsg]);
                    setTimeout(scrollToBottom, 100);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [applicationId, supabase]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            const { error } = await supabase
                .from("chat_messages")
                .insert({
                    application_id: applicationId,
                    sender_id: currentUserId,
                    message: newMessage.trim(),
                });

            if (error) throw error;
            setNewMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
            alert("メッセージの送信に失敗しました");
        } finally {
            setIsSending(false);
        }
    };

    const colorClasses = {
        orange: {
            bubble: "bg-orange-500 text-white",
            bg: "bg-orange-50",
            button: "bg-orange-500 hover:bg-orange-600",
            text: "text-orange-600",
        },
        emerald: {
            bubble: "bg-emerald-600 text-white",
            bg: "bg-emerald-50",
            button: "bg-emerald-600 hover:bg-emerald-700",
            text: "text-emerald-700",
        }
    };

    const currentTheme = colorClasses[themeColor];

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header / Info */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-full", currentTheme.bg)}>
                        <User className={cn("w-5 h-5", currentTheme.text)} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">チャット</h3>
                        <p className="text-xs text-gray-400">リアルタイムで接続中</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className={cn("w-6 h-6 animate-spin", currentTheme.text)} />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <Send className="w-8 h-8 text-gray-300 -rotate-12" />
                        </div>
                        <p className="text-gray-400 text-sm mb-6">メッセージはまだありません。<br />最初のメッセージを送ってみましょう！</p>
                        <Button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // 入力欄にスクロールしてフォーカス
                                if (inputRef.current) {
                                    inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    setTimeout(() => {
                                        inputRef.current?.focus();
                                    }, 300);
                                } else {
                                    // フォールバック: 入力欄を直接探す
                                    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                                    if (input) {
                                        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        setTimeout(() => {
                                            input.focus();
                                        }, 300);
                                    }
                                }
                            }}
                            className={cn("rounded-xl px-6 py-3 gap-2", currentTheme.button)}
                        >
                            <Send className="w-5 h-5" />
                            チャットを開始
                        </Button>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMine = msg.sender_id === currentUserId;
                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex flex-col max-w-[80%] transition-all",
                                    isMine ? "ml-auto items-end" : "mr-auto items-start"
                                )}
                            >
                                <div className={cn(
                                    "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                                    isMine
                                        ? cn(currentTheme.bubble, "rounded-tr-none")
                                        : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                                )}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 px-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(msg.created_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-50">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="メッセージを入力..."
                        className="flex-1 px-4 py-2.5 bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 rounded-xl text-sm transition-all outline-none"
                        disabled={isSending}
                    />
                    <Button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className={cn("rounded-xl px-5 shrink-0", currentTheme.button)}
                    >
                        {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 ml-1">Shift+Enterで改行は現在未対応です</p>
            </form>
        </div>
    );
}

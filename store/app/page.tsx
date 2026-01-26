import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Search, Calendar, MapPin, Map, Filter, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      user = data.user;
    }
  } catch (error) {
    // Silently handle auth errors - user will be null
    console.error("Home page auth error:", error);
  }

  // Fetch events from Supabase
  let query = supabase
    .from("events")
    .select("*, organizers(company_name)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("event_name", `%${q}%`);
  }

  const { data: events, error } = await query;

  if (error) {
    console.error("Error fetching events:", error);
  }


  return (
    <div className="min-h-screen bg-emerald-50/30">
      <Header />

      <main className="container mx-auto px-4 py-8">

        {/* Hero Area / Search Area */}
        {!user && !q ? (
          <div className="relative overflow-hidden bg-white rounded-3xl mb-12 p-8 md:p-16 text-center border border-emerald-100 shadow-2xl shadow-emerald-600/5">
            {/* Background blobs for a modern feel */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-teal-100/30 rounded-full blur-2xl"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/80 backdrop-blur-sm border border-emerald-100 text-emerald-700 text-[10px] md:text-xs font-black uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <Store className="w-3.5 h-3.5" />
                KITCHENCAR & STALL MATCHING
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1] text-gray-900 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                あなたの出店を、<br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">もっと自由に、スマートに。</span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-emerald-100/50 -z-10 rounded-full"></span>
                </span>
              </h1>

              <p className="text-gray-500 text-lg md:text-xl mb-12 leading-relaxed font-medium max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                場所探しから集客までを一つに。<br className="hidden md:block" />
                輝くイベントと、あなたの情熱を繋ぎます。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-200 transition-all hover:scale-105 active:scale-95">
                    今すぐ無料で始める
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="ghost" className="w-full sm:w-auto h-16 px-10 text-lg font-bold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-2xl transition-all">
                    ログイン
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-4">
              {user ? "あなたのためのイベント" : "出店するイベントを探す"}
            </h1>

            <form action="/" method="GET" className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto sm:mx-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="キーワード、エリア、日付で検索..."
                  className="w-full h-10 pl-9 pr-4 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
              <Button type="submit" className="shrink-0 gap-2">
                検索
              </Button>
              <Button variant="outline" type="button" className="shrink-0 gap-2 bg-white">
                <Filter className="h-4 w-4" />
                絞り込み
              </Button>
            </form>
          </div>
        )}

        {/* Section: Recommended */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            {q ? `「${q}」の検索結果` : "募集中の最新イベント"}
          </h2>
        </div>

        {/* Event List */}
        <div className="grid grid-cols-1 gap-4">
          {events && events.length > 0 ? (
            events.map((event) => (
              <Link
                href={`/events/${event.id}`}
                key={event.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col sm:flex-row group cursor-pointer border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-48 w-full shrink-0 bg-gray-100 sm:h-auto sm:w-[240px]">
                  {event.main_image_url ? (
                    <img
                      src={event.main_image_url}
                      alt={event.event_name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                      <Calendar className="h-10 w-10 text-gray-200" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 rounded-md text-xs font-bold bg-white/90 text-gray-800 shadow-sm">
                      {event.genre}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-0 flex-1 flex flex-col">
                  <div className="p-5 flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">
                        {event.genre}
                      </span>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">主催: {event.organizers?.company_name}</p>
                    </div>

                    <h3 className="font-black text-xl text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-4 leading-tight">
                      {event.event_name}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                          <Calendar className="h-4 w-4 text-gray-400 group-hover:text-emerald-500" />
                        </div>
                        <span className="text-sm font-bold text-gray-600">{event.event_start_date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                          <MapPin className="h-4 w-4 text-gray-400 group-hover:text-emerald-500" />
                        </div>
                        <span className="text-sm font-bold text-gray-600 truncate">{event.venue_name || event.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer / CTA */}
                  <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase">出店料</span>
                      <span className="text-sm font-black text-gray-900">{event.fee}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="hidden sm:block text-[10px] font-bold text-red-500 uppercase tracking-widest">締切: {event.application_period_end}</span>
                      <Button size="sm" className="h-9 px-6 bg-white hover:bg-emerald-600 text-emerald-600 hover:text-white border-2 border-emerald-600/20 hover:border-emerald-600 transition-all font-black text-xs uppercase tracking-widest rounded-xl">
                        詳細を見る
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
              <Search className="h-10 w-10 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">該当するイベントが見つかりませんでした。</p>
              <Link href="/">
                <Button variant="ghost" className="text-primary mt-2">
                  すべてのイベントを表示
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

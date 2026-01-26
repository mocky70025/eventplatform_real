import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Plus, Calendar, MapPin, Users, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  // Get user with error handling
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      user = data.user;
    } else {
      console.error("Auth error:", error);
    }
  } catch (error) {
    console.error("Auth fetch error:", error);
  }

  // Get organizer profile
  // Use .maybeSingle() instead of .single() to avoid error when no rows found
  let profile = null;
  let profileError = null;
  
  if (user) {
    // First, check if we can query the table at all
    const { data: allOrganizers, error: testError } = await supabase
      .from("organizers")
      .select("id, user_id")
      .limit(1);
    
    console.log("Debug - Test query result:");
    console.log("  Can query organizers table:", !testError);
    console.log("  Test error:", testError ? JSON.stringify(testError, null, 2) : null);
    
    // Now try to get the specific profile
    const result = await supabase
      .from("organizers")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    
    profile = result.data;
    profileError = result.error;
    
    console.log("Debug - Profile query:");
    console.log("  Querying for user_id:", user.id);
    console.log("  Profile found:", !!profile);
    console.log("  Profile error:", profileError ? JSON.stringify(profileError, null, 2) : null);
    
    if (profileError) {
      console.error("Error fetching organizer profile:");
      console.error("  Error code:", profileError.code);
      console.error("  Error message:", profileError.message);
      console.error("  Error details:", JSON.stringify(profileError, null, 2));
    }
  }
  
  console.log("Debug - Organizer profile summary:");
  console.log("  hasUser:", !!user);
  console.log("  userId:", user?.id);
  console.log("  hasProfile:", !!profile);
  console.log("  profileId:", profile?.id);
  
  // If user exists but no profile, redirect to onboarding
  if (user && !profile && !profileError) {
    console.log("User exists but no profile found, should redirect to onboarding");
  }

  // Fetch real events (only if logged in)
  const { data: events, error: eventsError } = user && profile ? await supabase
    .from("events")
    .select("*, event_applications(count)")
    .eq("organizer_id", profile.id)
    .order("created_at", { ascending: false }) : { data: [], error: null };
  
  if (eventsError) {
    console.error("Error fetching events:", eventsError);
  }
  
  // Ensure events is always an array to prevent hydration issues
  const safeEvents = events || [];
  
  console.log("Debug - Events:");
  console.log("  events count:", safeEvents.length);
  console.log("  events type:", Array.isArray(safeEvents));

  // Fetch real pending applications count
  // Use the same method as applications/page.tsx - join with events to filter by organizer_id
  let pendingApplications = 0;
  
  if (user && profile) {
    // Fetch applications for events owned by this organizer using join query
    // This matches the pattern used in applications/page.tsx
    const { data: allApplications, error: appError } = await supabase
      .from("event_applications")
      .select(`
        id,
        status,
        events!inner(
          id,
          organizer_id
        )
      `)
      .eq("events.organizer_id", profile.id)
      .eq("status", "pending");
    
    if (!appError && allApplications) {
      pendingApplications = allApplications.length;
    } else if (appError) {
      console.error("Error fetching pending applications:", appError);
    }
  }


  return (
    <div className="min-h-screen bg-orange-50/30">
      <Header />

      <main className="container mx-auto px-4 py-8">

        {/* Hero Area / Search Area */}
        {!user ? (
          <div className="relative overflow-hidden bg-white rounded-3xl mb-12 p-8 md:p-16 text-center border border-orange-100 shadow-2xl shadow-orange-600/5">
            {/* Background blobs for a modern feel */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-amber-100/30 rounded-full blur-2xl"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-[10px] md:text-xs font-black uppercase tracking-wider mb-8">
                <Calendar className="w-3.5 h-3.5" />
                イベント主催者のための管理プラットフォーム
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1] text-gray-900">
                出店管理を、<br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">もっと滑らかに、力強く。</span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-orange-100/50 -z-10 rounded-full"></span>
                </span>
              </h1>

              <p className="text-gray-500 text-lg md:text-xl mb-12 leading-relaxed font-medium max-w-xl mx-auto">
                最高のイベント体験と<br className="hidden md:block" />
                情熱ある主催者（あなた）を支えるパートナーです。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-2xl shadow-xl shadow-orange-200 transition-all hover:scale-105 active:scale-95">
                    今すぐ無料で始める
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="ghost" className="w-full sm:w-auto h-16 px-10 text-lg font-bold text-orange-700 hover:bg-orange-50 hover:text-orange-800 rounded-2xl transition-all">
                    ログイン
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Approval Status Banner */}
            {profile && !profile.is_approved && (
              <div className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-900 mb-1">承認待ち</h3>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      現在、管理者による承認を待っています。承認が完了するまで、イベントの作成はできません。承認が完了次第、お知らせいたします。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {profile && profile.is_approved && (
              <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-900">承認済み</p>
                    <p className="text-xs text-green-700">イベントの作成が可能です</p>
                  </div>
                </div>
              </div>
            )}

            {/* Top Action Bar (Authenticated) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  主催者ダッシュボード
                </h1>
                <p className="text-gray-500 mt-1">
                  {profile?.company_name || 'プロフィール未設定'} としてログイン中
                </p>
              </div>

              {profile?.is_approved ? (
                <Link href="/events/new">
                  <Button size="lg" className="shadow-orange-500/20 shadow-lg">
                    <Plus className="mr-2 h-5 w-5" />
                    新しいイベントを作成
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  disabled 
                  className="shadow-orange-500/20 shadow-lg opacity-50 cursor-not-allowed"
                  title="管理者の承認が必要です"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  新しいイベントを作成
                </Button>
              )}
            </div>
          </>
        )}

        {user && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="relative overflow-hidden bg-white p-8 rounded-3xl shadow-sm border border-orange-100 group">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-orange-50 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex items-start gap-5">
                  <div className="p-4 bg-orange-600 rounded-2xl text-white shadow-lg shadow-orange-200 shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">開催予定イベント</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-gray-900 tracking-tight">
                        {events?.filter(e => e.status === 'published').length || 0}
                      </span>
                      <span className="text-sm font-bold text-gray-400">件</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/applications" className="relative overflow-hidden bg-white p-8 rounded-3xl shadow-sm border border-orange-100 group hover:shadow-md hover:border-orange-200 transition-all cursor-pointer block">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-amber-50 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex items-start gap-5">
                  <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl text-white shadow-lg shadow-orange-200 shrink-0">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">承認待ちの申し込み</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-orange-600 tracking-tight">
                        {pendingApplications}
                      </span>
                      <span className="text-sm font-bold text-gray-400">件</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Section Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                あなたのイベント
              </h2>
              <Button variant="ghost" size="sm" className="text-gray-500">
                すべて見る <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Event List */}
            <div className="grid grid-cols-1 gap-4">
              {safeEvents && safeEvents.length > 0 ? (
                safeEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col sm:flex-row group cursor-pointer border border-gray-100"
                  >
                    {/* Event Image */}
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
                      <div className="absolute top-2 right-2 sm:hidden">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium border shadow-sm",
                          event?.status === 'published'
                            ? "bg-white/90 text-green-700 border-green-200"
                            : "bg-white/90 text-gray-600 border-gray-200"
                        )}>
                          {event?.status === 'published' ? '公開中' : event?.status === 'draft' ? '下書き' : '終了'}
                        </span>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between min-h-[160px]">
                      <div>
                        <div className="flex items-start sm:items-center gap-2 mb-4 flex-col sm:flex-row">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                            event?.status === 'published'
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          )}>
                            {event?.status === 'published' ? '公開中' : event?.status === 'draft' ? '下書き' : '終了'}
                          </span>
                          <h3 className="font-black text-xl text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                            {event.event_name}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium text-gray-500">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                              <Calendar className="h-4 w-4 text-gray-400 group-hover:text-orange-500" />
                            </div>
                            {event.event_start_date} {event.event_time}
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                              <MapPin className="h-4 w-4 text-gray-400 group-hover:text-orange-500" />
                            </div>
                            {event.venue_name || event.address || "場所未定"}
                          </div>
                        </div>
                      </div>

                      {/* Footer Stats */}
                      <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                              <Users className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">申込数</span>
                              <span className="text-sm font-black text-gray-900 leading-none">
                                {event.event_applications?.[0]?.count || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-orange-600 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                profile?.is_approved ? (
                  <Link href="/events/new">
                    <div className="border-2 border-dashed border-orange-200/60 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-orange-50/50 transition-colors cursor-pointer group">
                      <div className="p-4 bg-orange-50 rounded-full group-hover:bg-white transition-colors mb-4">
                        <Plus className="h-8 w-8 text-orange-400 group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">最初のイベントを作成しましょう</h3>
                      <p className="text-sm text-gray-500 max-w-xs mx-auto">
                        イベントを作成して出店者の募集を開始しましょう。
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="border-2 border-dashed border-amber-200/60 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-amber-50/30">
                    <div className="p-4 bg-amber-100 rounded-full mb-4">
                      <AlertCircle className="h-8 w-8 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">承認待ちです</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                      管理者による承認が完了するまで、イベントの作成はできません。
                    </p>
                  </div>
                )
              )}
            </div>
          </>
        )}

      </main>
    </div>
  );
}

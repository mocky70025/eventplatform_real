import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Check, Building2, User, FileText, BarChart3, Users, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  // Fetch Stats
  const { count: organizerCount } = await supabase.from("organizers").select("*", { count: "exact", head: true });
  const { count: exhibitorCount } = await supabase.from("exhibitors").select("*", { count: "exact", head: true });
  const { count: eventCount } = await supabase.from("events").select("*", { count: "exact", head: true });

  // Fetch Pending Organizers
  const { data: pendingOrganizers } = await supabase
    .from("organizers")
    .select("*")
    .eq("is_approved", false)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch Draft/Recent Events
  const { data: recentEvents } = await supabase
    .from("events")
    .select(`
      *,
      organizer:organizers(company_name, name)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "主催者数", value: organizerCount || 0, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "出店者数", value: exhibitorCount || 0, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "公開イベント", value: eventCount || 0, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            管理者ダッシュボード
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            システム正常稼働中
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Organizer Approvals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-400" />
                承認待ちの主催者
                {pendingOrganizers && pendingOrganizers.length > 0 && (
                  <span className="ml-2 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {pendingOrganizers.length}
                  </span>
                )}
              </h2>
              <Link href="/organizers" className="text-xs font-medium text-blue-600 hover:underline">
                すべて見る
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {pendingOrganizers?.map((org) => (
                <div key={org.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{org.company_name || org.name}</h3>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <User className="h-3 w-3" /> {org.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                        {new Date(org.created_at).toLocaleDateString()} に登録
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/organizers" className="w-full">
                      <Button size="sm" variant="outline" className="w-full text-xs py-1 h-8 rounded-lg">
                        詳細を確認
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {(!pendingOrganizers || pendingOrganizers.length === 0) && (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-sm">承認待ちの主催者はいません</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Events */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                最近のイベント
              </h2>
              <Link href="/events" className="text-xs font-medium text-blue-600 hover:underline">
                すべて見る
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {recentEvents?.map((event) => (
                <div key={event.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{event.event_name}</h3>
                      <div className="text-xs text-gray-500 mt-1">
                        主催: {(event.organizer as any)?.company_name || (event.organizer as any)?.name}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${event.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                          {event.status === 'published' ? '公開中' : '下書き'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/events" className="w-full">
                      <Button size="sm" variant="outline" className="w-full text-xs py-1 h-8 rounded-lg">
                        イベント管理へ
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {(!recentEvents || recentEvents.length === 0) && (
                <div className="p-12 text-center text-gray-400 text-sm">
                  イベントがまだありません
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

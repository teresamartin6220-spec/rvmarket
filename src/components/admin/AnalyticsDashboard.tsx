import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, Eye, TrendingUp, Globe } from "lucide-react";

interface PageView {
  page: string;
  visitor_id: string | null;
  created_at: string;
}

type Period = "day" | "week" | "month";

function getStartDate(period: Period): Date {
  const now = new Date();
  if (period === "day") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  const d = new Date(now);
  d.setDate(d.getDate() - 30);
  return d;
}

function formatLabel(dateStr: string, period: Period): string {
  const d = new Date(dateStr);
  if (period === "day") return d.toLocaleTimeString([], { hour: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function AnalyticsDashboard() {
  const [views, setViews] = useState<PageView[]>([]);
  const [period, setPeriod] = useState<Period>("day");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViews = async () => {
      setLoading(true);
      const start = getStartDate(period);
      const { data } = await supabase
        .from("page_views")
        .select("page, visitor_id, created_at")
        .gte("created_at", start.toISOString())
        .order("created_at", { ascending: true });
      setViews((data as PageView[]) || []);
      setLoading(false);
    };
    fetchViews();
  }, [period]);

  const stats = useMemo(() => {
    const uniqueVisitors = new Set(views.map((v) => v.visitor_id).filter(Boolean)).size;
    const totalViews = views.length;
    const topPages = views.reduce<Record<string, number>>((acc, v) => {
      acc[v.page] = (acc[v.page] || 0) + 1;
      return acc;
    }, {});
    const sortedPages = Object.entries(topPages).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { uniqueVisitors, totalViews, sortedPages };
  }, [views]);

  const chartData = useMemo(() => {
    const buckets: Record<string, { views: number; visitors: Set<string> }> = {};
    views.forEach((v) => {
      const d = new Date(v.created_at);
      let key: string;
      if (period === "day") {
        key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
      } else {
        key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      }
      if (!buckets[key]) buckets[key] = { views: 0, visitors: new Set() };
      buckets[key].views++;
      if (v.visitor_id) buckets[key].visitors.add(v.visitor_id);
    });

    // Generate proper labels
    const result: { label: string; views: number; visitors: number }[] = [];
    views.forEach((v) => {
      const d = new Date(v.created_at);
      let key: string;
      if (period === "day") {
        key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
      } else {
        key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      }
      if (!result.find((r) => r.label === formatLabel(v.created_at, period) && buckets[key])) {
        const b = buckets[key];
        if (b) {
          result.push({ label: formatLabel(v.created_at, period), views: b.views, visitors: b.visitors.size });
          delete buckets[key]; // only add once
        }
      }
    });
    return result;
  }, [views, period]);

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
        <TabsList>
          <TabsTrigger value="day">Today</TabsTrigger>
          <TabsTrigger value="week">Last 7 Days</TabsTrigger>
          <TabsTrigger value="month">Last 30 Days</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4 flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2"><Eye className="h-5 w-5 text-primary" /></div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.totalViews}</p>
            <p className="text-xs text-muted-foreground">Total Page Views</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2"><Users className="h-5 w-5 text-primary" /></div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.uniqueVisitors}</p>
            <p className="text-xs text-muted-foreground">Unique Visitors</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2"><TrendingUp className="h-5 w-5 text-primary" /></div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {stats.uniqueVisitors > 0 ? (stats.totalViews / stats.uniqueVisitors).toFixed(1) : "0"}
            </p>
            <p className="text-xs text-muted-foreground">Views per Visitor</p>
          </div>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <Card className="p-4">
          <h3 className="font-heading font-semibold text-foreground mb-4">Traffic Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Page Views" />
              <Bar dataKey="visitors" fill="hsl(var(--primary) / 0.4)" radius={[4, 4, 0, 0]} name="Unique Visitors" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      ) : (
        <Card className="p-8 text-center text-muted-foreground">No data for this period yet.</Card>
      )}

      {/* Top Pages */}
      <Card className="p-4">
        <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4" /> Top Pages
        </h3>
        {stats.sortedPages.length > 0 ? (
          <div className="space-y-2">
            {stats.sortedPages.map(([page, count]) => (
              <div key={page} className="flex items-center justify-between text-sm">
                <span className="text-foreground font-mono">{page}</span>
                <span className="text-muted-foreground">{count} views</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No page views yet.</p>
        )}
      </Card>
    </div>
  );
}

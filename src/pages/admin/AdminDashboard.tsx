import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Package, MessageSquare, FileText, TrendingUp, Users, Calendar,
  Layers, Image as ImageIcon, Bug, FolderOpen, Languages, Plus,
  ArrowUpRight, Clock, Upload, Edit3, AlertCircle, CheckCircle2,
  BarChart3,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { format, subDays, startOfDay, parseISO, formatDistanceToNow } from 'date-fns';

// ── Stat Card Component ───────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, color, badge, href }: {
  title: string; value: number | string; icon: any; color: string;
  badge?: string; href?: string;
}) {
  const content = (
    <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {badge && <p className="text-xs text-amber-600 mt-1 font-medium">{badge}</p>}
        {href && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 group-hover:text-primary transition-colors">
            View all <ArrowUpRight className="h-3 w-3" />
          </p>
        )}
      </CardContent>
    </Card>
  );
  return href ? <Link to={href}>{content}</Link> : content;
}

// ── Quick Action Button ───────────────────────────────────────────────
function QuickAction({ href, icon: Icon, label, description }: {
  href: string; icon: any; label: string; description: string;
}) {
  return (
    <Link
      to={href}
      className="flex items-start gap-3 p-4 rounded-xl border hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 group"
    >
      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <span className="font-medium text-sm">{label}</span>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </Link>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
const AdminDashboard = () => {
  // ─── Fetch all stats ──────────────────────────────────────────
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const [
        productsRes, categoriesRes, quotationsRes, postsRes,
        contentRes, mediaRes, feedbackRes, translationsRes,
      ] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('quotation_requests').select('id, status', { count: 'exact' }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('content_blocks').select('id, status', { count: 'exact' }),
        supabase.from('media_assets').select('id', { count: 'exact', head: true }),
        supabase.from('feedback_tickets').select('id, status', { count: 'exact' }),
        supabase.from('translations').select('id', { count: 'exact', head: true }),
      ]);

      const pendingQuotations = quotationsRes.data?.filter(q => q.status === 'pending').length || 0;
      const openIssues = feedbackRes.data?.filter(t => t.status === 'open' || t.status === 'in_progress').length || 0;
      const draftContent = contentRes.data?.filter(b => b.status === 'draft').length || 0;
      const publishedContent = contentRes.data?.filter(b => b.status === 'published').length || 0;

      return {
        products: productsRes.count || 0,
        categories: categoriesRes.count || 0,
        quotations: quotationsRes.count || 0,
        pendingQuotations,
        posts: postsRes.count || 0,
        contentBlocks: contentRes.count || 0,
        draftContent,
        publishedContent,
        media: mediaRes.count || 0,
        issues: feedbackRes.count || 0,
        openIssues,
        translations: translationsRes.count || 0,
      };
    },
  });

  // ─── Quotation analytics ────────────────────────────────────
  const { data: quotationData } = useQuery({
    queryKey: ['admin-quotation-analytics'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      const { data } = await supabase
        .from('quotation_requests')
        .select('created_at, status')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true });
      return data || [];
    },
  });

  // ─── Recent activity ────────────────────────────────────────
  const { data: recentActivity } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      const [recentProducts, recentPosts, recentMedia, recentTickets] = await Promise.all([
        supabase.from('products').select('id, name, updated_at').order('updated_at', { ascending: false }).limit(3),
        supabase.from('blog_posts').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(3),
        supabase.from('media_assets').select('id, filename, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('feedback_tickets').select('id, title, created_at, status').order('created_at', { ascending: false }).limit(3),
      ]);

      const activities: { id: string; type: string; icon: any; label: string; time: string; color: string }[] = [];

      recentProducts.data?.forEach(p => activities.push({
        id: `p-${p.id}`, type: 'product', icon: Package,
        label: `Product updated: ${p.name}`,
        time: p.updated_at, color: 'text-blue-500',
      }));
      recentPosts.data?.forEach(p => activities.push({
        id: `b-${p.id}`, type: 'blog', icon: FileText,
        label: `Blog post: ${p.title}`,
        time: p.updated_at, color: 'text-purple-500',
      }));
      recentMedia.data?.forEach(m => activities.push({
        id: `m-${m.id}`, type: 'media', icon: Upload,
        label: `Media uploaded: ${m.filename}`,
        time: m.created_at, color: 'text-pink-500',
      }));
      recentTickets.data?.forEach(t => activities.push({
        id: `t-${t.id}`, type: 'ticket', icon: Bug,
        label: `Issue: ${t.title}`,
        time: t.created_at, color: t.status === 'open' ? 'text-red-500' : 'text-gray-500',
      }));

      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 8);
    },
  });

  // ─── Chart data processing ──────────────────────────────────
  const dailyChartData = (() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return { date: format(date, 'MMM dd'), fullDate: startOfDay(date).toISOString(), requests: 0 };
    });
    quotationData?.forEach((q) => {
      const qDate = format(parseISO(q.created_at), 'MMM dd');
      const dayData = last7Days.find((d) => d.date === qDate);
      if (dayData) dayData.requests += 1;
    });
    return last7Days;
  })();

  const statusChartData = (() => {
    const counts: Record<string, number> = { pending: 0, contacted: 0, completed: 0, cancelled: 0 };
    quotationData?.forEach((q) => {
      const s = q.status || 'pending';
      if (counts[s] !== undefined) counts[s] += 1;
    });
    return [
      { name: 'Pending', value: counts.pending, color: '#f59e0b' },
      { name: 'Contacted', value: counts.contacted, color: '#3b82f6' },
      { name: 'Completed', value: counts.completed, color: '#10b981' },
      { name: 'Cancelled', value: counts.cancelled, color: '#ef4444' },
    ].filter((item) => item.value > 0);
  })();

  const monthlyData = (() => {
    const months: Record<string, number> = {};
    quotationData?.forEach((q) => {
      const month = format(parseISO(q.created_at), 'MMM');
      months[month] = (months[month] || 0) + 1;
    });
    return Object.entries(months).map(([name, requests]) => ({ name, requests }));
  })();

  // ─── Stat cards config ─────────────────────────────────────
  const statCards = [
    { title: 'Products', value: stats?.products || 0, icon: Package, color: 'text-blue-600 bg-blue-100', href: '/admin/products' },
    { title: 'Categories', value: stats?.categories || 0, icon: FolderOpen, color: 'text-indigo-600 bg-indigo-100', href: '/admin/categories' },
    { title: 'Quotations', value: stats?.quotations || 0, icon: MessageSquare, color: 'text-green-600 bg-green-100', href: '/admin/quotations', badge: stats?.pendingQuotations ? `${stats.pendingQuotations} pending` : undefined },
    { title: 'Blog Posts', value: stats?.posts || 0, icon: FileText, color: 'text-purple-600 bg-purple-100', href: '/admin/blog' },
    { title: 'Content Blocks', value: stats?.contentBlocks || 0, icon: Layers, color: 'text-amber-600 bg-amber-100', href: '/admin/content', badge: stats?.draftContent ? `${stats.draftContent} draft` : undefined },
    { title: 'Media Assets', value: stats?.media || 0, icon: ImageIcon, color: 'text-pink-600 bg-pink-100', href: '/admin/media' },
    { title: 'Issues', value: stats?.issues || 0, icon: Bug, color: 'text-red-600 bg-red-100', href: '/admin/feedback', badge: stats?.openIssues ? `${stats.openIssues} open` : undefined },
    { title: 'Translations', value: stats?.translations || 0, icon: Languages, color: 'text-teal-600 bg-teal-100', href: '/admin/translations' },
  ];

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--background))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
  };

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to Ecofy Admin Panel</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/feedback" className="gap-1.5">
              <Bug className="h-4 w-4" /> Report Issue
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/admin/products/new" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Stats Grid (4 columns × 2 rows) ────────────────── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-9 rounded-lg" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          statCards.map((stat) => <StatCard key={stat.title} {...stat} />)
        )}
      </div>

      {/* ── System Status Row ───────────────────────────────── */}
      {!isLoading && stats && (
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">{stats.publishedContent} published</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <Edit3 className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-400">{stats.draftContent} drafts</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">{stats.pendingQuotations} pending quotes</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-700 dark:text-red-400">{stats.openIssues} open issues</span>
          </div>
        </div>
      )}

      {/* ── Charts + Activity ───────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Daily Quotation Requests */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Daily Quotation Requests
            </CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyChartData}>
                  <defs>
                    <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="requests" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorReqs)" name="Requests" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates across all modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivity?.length ? recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-2.5 border-b last:border-0">
                  <item.icon className={`h-4 w-4 mt-0.5 shrink-0 ${item.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Second Row Charts ───────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quotation Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Quotation Status
            </CardTitle>
            <CardDescription>Distribution over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {statusChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {statusChartData.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Monthly Trend
            </CardTitle>
            <CardDescription>Quotation requests by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="requests" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Requests" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Actions ───────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Jump to common tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction href="/admin/products/new" icon={Package} label="Add New Product" description="Create a new product listing" />
          <QuickAction href="/admin/blog/new" icon={FileText} label="New Blog Post" description="Write and publish a blog article" />
          <QuickAction href="/admin/quotations" icon={MessageSquare} label="View Quotations" description="Review pending quote requests" />
          <QuickAction href="/admin/content" icon={Layers} label="Content Manager" description="Edit pages and content blocks" />
          <QuickAction href="/admin/media" icon={ImageIcon} label="Media Library" description="Upload and manage media files" />
          <QuickAction href="/admin/feedback" icon={Bug} label="Issue Tracker" description="View and manage reported issues" />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

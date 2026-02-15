import { useQuery } from '@tanstack/react-query';
import { Package, MessageSquare, FileText, TrendingUp, Users, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { format, subDays, startOfDay, parseISO } from 'date-fns';

const AdminDashboard = () => {
  // Fetch basic stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [productsRes, quotationsRes, postsRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('quotation_requests').select('id, status', { count: 'exact' }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      ]);

      const pendingQuotations = quotationsRes.data?.filter(q => q.status === 'pending').length || 0;

      return {
        products: productsRes.count || 0,
        quotations: quotationsRes.count || 0,
        pendingQuotations,
        posts: postsRes.count || 0,
      };
    },
  });

  // Fetch quotation requests for charts
  const { data: quotationData } = useQuery({
    queryKey: ['admin-quotation-analytics'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      
      const { data: quotations } = await supabase
        .from('quotation_requests')
        .select('created_at, status')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true });

      return quotations || [];
    },
  });

  // Process data for daily chart (last 7 days)
  const dailyChartData = (() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date: format(date, 'MMM dd'),
        fullDate: startOfDay(date).toISOString(),
        requests: 0,
      };
    });

    quotationData?.forEach((q) => {
      const qDate = format(parseISO(q.created_at), 'MMM dd');
      const dayData = last7Days.find((d) => d.date === qDate);
      if (dayData) {
        dayData.requests += 1;
      }
    });

    return last7Days;
  })();

  // Process data for status pie chart
  const statusChartData = (() => {
    const statusCounts: Record<string, number> = {
      pending: 0,
      contacted: 0,
      completed: 0,
      cancelled: 0,
    };

    quotationData?.forEach((q) => {
      const status = q.status || 'pending';
      if (statusCounts[status] !== undefined) {
        statusCounts[status] += 1;
      }
    });

    return [
      { name: 'Pending', value: statusCounts.pending, color: '#f59e0b' },
      { name: 'Contacted', value: statusCounts.contacted, color: '#3b82f6' },
      { name: 'Completed', value: statusCounts.completed, color: '#10b981' },
      { name: 'Cancelled', value: statusCounts.cancelled, color: '#ef4444' },
    ].filter((item) => item.value > 0);
  })();

  // Process monthly comparison data
  const monthlyData = (() => {
    const months: Record<string, number> = {};
    
    quotationData?.forEach((q) => {
      const month = format(parseISO(q.created_at), 'MMM');
      months[month] = (months[month] || 0) + 1;
    });

    return Object.entries(months).map(([name, requests]) => ({
      name,
      requests,
    }));
  })();

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.products || 0,
      icon: Package,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Quotation Requests',
      value: stats?.quotations || 0,
      icon: MessageSquare,
      color: 'text-green-600 bg-green-100',
      badge: stats?.pendingQuotations ? `${stats.pendingQuotations} Pending` : undefined,
    },
    {
      title: 'Blog Posts',
      value: stats?.posts || 0,
      icon: FileText,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to Ecofy Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                {stat.badge && (
                  <p className="text-xs text-amber-600 mt-1">{stat.badge}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Quotation Requests Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Daily Quotation Requests
            </CardTitle>
            <CardDescription>Quotation requests from the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyChartData}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorRequests)"
                    name="Requests"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Quotation Status
            </CardTitle>
            <CardDescription>Status distribution over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {statusChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Monthly Quotation Trend
            </CardTitle>
            <CardDescription>Quotation requests by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="requests" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                      name="Requests"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <a
            href="/admin/products/new"
            className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors"
          >
            <Package className="h-5 w-5 text-primary" />
            <span className="font-medium">Add New Product</span>
          </a>
          <a
            href="/admin/blog/new"
            className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors"
          >
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-medium">New Blog Post</span>
          </a>
          <a
            href="/admin/quotations"
            className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors"
          >
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="font-medium">View Quotations</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

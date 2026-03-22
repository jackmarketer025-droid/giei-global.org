
"use client";

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  CreditCard, 
  CheckCircle, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  Cpu,
  Loader2,
  Laptop,
  ChevronRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const firestore = useFirestore();

  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState([
    { label: 'Total Applicants', value: '0', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50', trend: '0%' },
    { label: 'Verified Payments', value: '0', icon: CreditCard, color: 'text-emerald-600', bgColor: 'bg-emerald-50', trend: '0%' },
    { label: 'High Score (90+)', value: '0', icon: CheckCircle, color: 'text-amber-600', bgColor: 'bg-amber-50', trend: '0%' },
    { label: 'Laptop Products', value: '0', icon: Laptop, color: 'text-indigo-600', bgColor: 'bg-indigo-50', trend: '0%' },
  ]);

  useEffect(() => {
    setMounted(true);
    if (!firestore) return;

    // Real-time listener for applications
    const q = query(collection(firestore, 'applications'), orderBy('registrationDate', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentUsers(users.slice(0, 5));
      
      const total = snapshot.size;
      const verified = users.filter((u: any) => u.paymentStatus === 'success').length;
      const highScorers = users.filter((u: any) => (u.quizScore || 0) >= 90).length;

      setStats(prev => [
        { ...prev[0], value: total.toLocaleString() },
        { ...prev[1], value: verified.toLocaleString() },
        { ...prev[2], value: highScorers.toLocaleString() },
        prev[3]
      ]);
      
      setIsLoading(false);
    }, (error) => {
      console.error("Dashboard error:", error);
      setIsLoading(false);
    });

    // Real-time listener for laptops count
    const laptopsQuery = query(collection(firestore, 'laptops'));
    const unsubscribeLaptops = onSnapshot(laptopsQuery, (snapshot) => {
      setStats(prev => [
        prev[0],
        prev[1],
        prev[2],
        { ...prev[3], value: snapshot.size.toLocaleString() }
      ]);
    });

    return () => {
      unsubscribe();
      unsubscribeLaptops();
    };
  }, [firestore]);

  const chartData = [
    { name: 'Jan', applicants: 400, payments: 240 },
    { name: 'Feb', applicants: 300, payments: 139 },
    { name: 'Mar', applicants: 200, payments: 980 },
    { name: 'Apr', applicants: 278, payments: 390 },
    { name: 'May', applicants: 189, payments: 480 },
    { name: 'Jun', applicants: 239, payments: 380 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-600 font-medium">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Last updated: Just now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-2xl", stat.bgColor, stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
          <CardHeader className="px-0 pt-0 pb-6">
            <CardTitle className="text-lg font-bold text-slate-900">Registration Trends</CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="applicants" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorApplicants)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
          <CardHeader className="px-0 pt-0 pb-6">
            <CardTitle className="text-lg font-bold text-slate-900">Recent Activity</CardTitle>
          </CardHeader>
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : recentUsers?.map((user: any) => (
              <div key={user.id} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <Users className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{user.fullName}</p>
                  <p className="text-xs text-slate-600 font-medium">{user.district || user.institution}</p>
                </div>
                <div className="text-[10px] font-bold text-slate-500">
                  {user.registrationDate?.seconds 
                    ? new Date(user.registrationDate.seconds * 1000).toLocaleDateString() 
                    : 'Just now'}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions Card */}
        <Card className="bg-blue-600 border-none shadow-xl shadow-blue-100 rounded-3xl p-6 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/20 transition-all"></div>
          <CardHeader className="px-0 pt-0 pb-6 relative z-10">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Laptop className="w-5 h-5" /> Product Management
            </CardTitle>
          </CardHeader>
          <div className="space-y-4 relative z-10">
            <p className="text-sm text-blue-100 font-medium">
              আপনার ওয়েবসাইটের ল্যাপটপ প্রোডাক্ট এবং ইমেজগুলো এখান থেকে সরাসরি ম্যানেজ করুন।
            </p>
            <Link href="/admin/products">
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-xl h-12 font-bold shadow-lg flex items-center justify-between px-6 group/btn">
                ম্যানেজ করুন
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Laptop className="w-24 h-24 rotate-12" />
          </div>
        </Card>
      </div>

    </div>
  );
}


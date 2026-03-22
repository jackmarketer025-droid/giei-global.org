
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Cpu, ShieldCheck, Loader2, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "অ্যাক্সেস অনুমোদিত",
        description: "অ্যাডমিন প্যানেলে স্বাগতম।",
      });
      router.push('/admin');
    } catch (error: any) {
      toast({ 
        variant: "destructive",
        title: "অ্যাক্সেস প্রত্যাখ্যাত",
        description: "ভুল ইমেইল বা পাসওয়ার্ড প্রদান করা হয়েছে।",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-8 bg-white p-8 rounded-3xl shadow-2xl shadow-blue-100/50 border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-sm">
            <ShieldCheck className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">
            Admin Secure Access
          </h2>
          <p className="mt-2 text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400">
            Vision-2030 Control Center
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">
                E-mail
              </label>
              <Input 
                type="email" 
                placeholder="admin@vision2030.org" 
                className="block w-full px-4 h-12 bg-white border-slate-200 rounded-2xl focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">
                Password
              </label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="block w-full px-4 h-12 bg-white border-slate-200 rounded-2xl focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>



          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 h-12 border border-transparent text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>অ্যাক্সেস নিশ্চিত করুন</span>
                </div>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50">
          <div className="flex items-center justify-center gap-2 text-[8px] font-bold text-slate-300 uppercase tracking-widest">
            <Cpu className="w-3 h-3" />
            <span>System Version 2.0.4 - GIEI London Audit Ready</span>
          </div>
        </div>
      </div>
    </div>

  );
}


"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Cpu, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 blur-[100px] bg-primary"></div>
      
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>ফিরে যান</span>
        </Link>
      </div>

      <Card className="w-full max-w-md glass-panel border-none">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
            <Cpu className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">স্বাগতম</CardTitle>
          <CardDescription>আপনার ড্যাশবোর্ডে লগইন করুন</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">ইমেইল এড্রেস</label>
            <Input type="email" placeholder="email@example.com" className="bg-white/5 border-white/10" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">পাসওয়ার্ড</label>
            <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10" />
          </div>
          <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold">
            লগইন করুন
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            অ্যাকাউন্ট নেই? <Link href="/auth/register" className="text-primary hover:underline">নতুন আবেদন করুন</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

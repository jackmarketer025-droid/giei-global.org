"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Cpu, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { generateTrackingId } from '@/lib/id-generator';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "পাসওয়ার্ড মেলেনি",
        description: "দয়া করে পাসওয়ার্ড পুনরায় চেক করুন।"
      });
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const trackingId = generateTrackingId();

      const userProfile = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        institution: formData.institution,
        paymentStatus: 'success', // Simulated success for this prototype flow
        trackingId: trackingId,
        registrationDate: serverTimestamp(),
      };

      const userRef = doc(firestore, 'users', user.uid);
      
      // Non-blocking write
      setDoc(userRef, userProfile)
        .catch(async (err) => {
          const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: userProfile,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: "নিবন্ধন সফল!",
        description: "আপনার পেমেন্ট রিসিট জেনারেট করা হয়েছে।",
      });

      router.push(`/dashboard/payment-success?id=${trackingId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "নিবন্ধন ব্যর্থ",
        description: error.message || "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-20 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 -z-10 opacity-10 blur-[100px] bg-secondary"></div>
      
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>ফিরে যান</span>
        </Link>
      </div>

      <Card className="w-full max-w-2xl glass-panel border-none">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
            <Cpu className="w-8 h-8 text-secondary" />
          </div>
          <CardTitle className="text-3xl font-headline">আবেদন ফরম</CardTitle>
          <CardDescription>Vision-2030 স্কলারশিপের জন্য সঠিক তথ্য প্রদান করুন</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">পুরো নাম</label>
              <Input 
                name="fullName" 
                placeholder="আপনার নাম" 
                required 
                onChange={handleInputChange}
                className="bg-white/5 border-white/10" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">ইমেইল এড্রেস</label>
              <Input 
                name="email" 
                type="email" 
                placeholder="email@example.com" 
                required 
                onChange={handleInputChange}
                className="bg-white/5 border-white/10" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">ফোন নাম্বার</label>
              <Input 
                name="phone" 
                placeholder="০১X-XXXXXXXX" 
                required 
                onChange={handleInputChange}
                className="bg-white/5 border-white/10" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">শিক্ষা প্রতিষ্ঠান</label>
              <Input 
                name="institution" 
                placeholder="আপনার শিক্ষা প্রতিষ্ঠানের নাম" 
                required 
                onChange={handleInputChange}
                className="bg-white/5 border-white/10" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">পাসওয়ার্ড</label>
              <Input 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                onChange={handleInputChange}
                className="bg-white/5 border-white/10" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">পাসওয়ার্ড নিশ্চিত করুন</label>
              <Input 
                name="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                required 
                onChange={handleInputChange}
                className="bg-white/5 border-white/10" 
              />
            </div>
            <div className="md:col-span-2 space-y-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <input type="checkbox" required className="mt-1 accent-primary" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  আমি অঙ্গীকার করছি যে উপরে প্রদত্ত সকল তথ্য সত্য। ভুল তথ্য প্রদানের কারণে আমার আবেদন বাতিল হলে কর্তৃপক্ষ দায়ী থাকবে না।
                </p>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-bold"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                আবেদন সম্পন্ন করুন
              </Button>
            </div>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            ইতিমধ্যে আবেদন করেছেন? <Link href="/auth/login" className="text-primary hover:underline">লগইন করুন</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

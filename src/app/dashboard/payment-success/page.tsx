"use client";

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Download, Printer, Cpu, Globe, Mail, ShieldCheck, MapPin, ReceiptText, Loader2, GraduationCap } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { generateApplicationPDF } from '@/lib/pdf-generator';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const trackingId = searchParams.get('id') || "";
  const currentDate = new Date().toLocaleDateString('en-GB');
  const firestore = useFirestore();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (!trackingId || !firestore) return;
      try {
        const q = query(
          collection(firestore, 'applications'), 
          where('trackingId', '==', trackingId), 
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setUserData(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [trackingId, firestore]);

  const handleDownloadPDF = async () => {
    if (!userData) return;
    setDownloading(true);
    try {
      await generateApplicationPDF(userData);
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6 selection:bg-blue-500/30">
      <style jsx global>{`
        @media print {
          nav, button, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print-area {
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: 1px solid #eee !important;
            width: 100% !important;
          }
        }
      `}</style>
      <nav className="bg-[#0a1128]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
         <div className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
           <div className="bg-blue-600/20 p-1.5 rounded-lg">
             <GraduationCap className="text-blue-400 w-6 h-6" />
           </div>
           <div>
             <span className="block leading-none">Vision-2030</span>
             <span className="text-[8px] text-blue-300/50 font-bold tracking-[0.1em] uppercase">Global IT Excellence Initiative</span>
           </div>
         </div>
        <div className="text-[10px] text-white/40 font-bold tracking-widest uppercase hidden md:block">Official Payment Receipt</div>
      </nav>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-secondary" />
          </div>
          <h1 className="text-4xl font-headline font-bold mb-4">পেমেন্ট সফল হয়েছে!</h1>
          <p className="text-muted-foreground text-lg">আপনার মেধা যাচাই আবেদনের ডিজিটাল রিসিট জেনারেট করা হয়েছে।</p>
        </div>

        {/* Digital Receipt Card */}
        <Card className="glass-panel border-none overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-700 print-area">
          {/* Decorative watermark */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <GraduationCap className="w-64 h-64 text-primary" />
          </div>

          <CardHeader className="border-b border-white/5 pb-8 p-8 md:p-12 bg-white/[0.02]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <GraduationCap className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-headline tracking-tight">Vision-2030</h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Global IT Excellence Initiative</p>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold mb-3">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Officially Verified</span>
                </div>
                <p className="text-xl font-black text-primary font-mono tracking-tighter">ID: {trackingId}</p>
                <p className="text-xs text-muted-foreground font-medium">Issue Date: {currentDate}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 md:p-12 space-y-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Globe className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Global Headquarters</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-bold text-lg">Global IT Excellence Initiative (GIEI)</p>
                  <div className="flex gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary/50" />
                    <p>71-75 Shelton Street, Covent Garden,<br/>London, WC2H 9JQ, United Kingdom.</p>
                  </div>
                  <div className="flex items-center gap-2 text-primary pt-3">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wider">support@giei-global.org</span>
                  </div>
                </div>
              </div>

              <div className="md:text-right space-y-4">
                <div className="flex items-center md:justify-end gap-2 text-secondary">
                  <ReceiptText className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Payment Summary</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between md:justify-end gap-8 text-sm">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">Scholarship Assessment Fee</span>
                  </div>
                  <div className="flex justify-between md:justify-end gap-8 text-sm">
                    <span className="text-muted-foreground">Tax (VAT):</span>
                    <span className="font-medium">৳ ০.০০</span>
                  </div>
                  <div className="flex justify-between md:justify-end gap-8 pt-2 border-t border-white/10">
                    <span className="font-bold">Total Amount:</span>
                    <span className="text-2xl font-black text-white">৳ ৩৯৯.০০</span>
                  </div>
                  <div className="inline-flex px-4 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-[10px] font-black uppercase tracking-widest mt-2">
                    Payment Success
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <ReceiptText className="w-12 h-12 text-primary" />
              </div>
              <h4 className="font-bold flex items-center gap-2 mb-4 text-primary">
                পরবর্তী নির্দেশনা (Next Steps)
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                আপনার আবেদনটি সফলভাবে গৃহীত হয়েছে। আগামী ১৫-কার্যদিবসের মধ্যে আপনার প্রদত্ত তথ্যসমূহ ভেরিফিকেশন সম্পন্ন হবে। ভেরিফিকেশন শেষ হলে আপনি কুইজ পরীক্ষায় অংশ নেওয়ার জন্য একটি ইমেইল এবং এসএমএস পাবেন। আপনার ট্র্যাকিং আইডিটি ভবিষ্যৎ রেফারেন্সের জন্য সংরক্ষণ করুন।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 no-print">
              <Button 
                onClick={handlePrint}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-14 font-bold gap-3 shadow-lg shadow-primary/20"
              >
                <Printer className="w-5 h-5" /> Print Invoice
              </Button>
            </div>
          </CardContent>

          <div className="bg-primary/10 p-4 text-center border-t border-white/5">
            <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] animate-pulse">
              Verified & Issued by GIEI Global Audit System, London, UK
            </p>
          </div>
        </Card>

        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="link" className="text-muted-foreground hover:text-primary transition-colors">
              হোমপেজে ফিরে যান
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

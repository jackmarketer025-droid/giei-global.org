
"use client";

import { GraduationCap, Facebook, Youtube, Mail, Globe } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-card/40 pt-20 pb-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <span className="font-headline text-2xl font-bold tracking-tight">Vision-2030</span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              আমরা বাংলাদেশের ডিজিটাল রুপান্তরের কারিগর। আমাদের লক্ষ্য দেশের প্রতিটি মেধাবী শিক্ষার্থীর হাতে একটি ল্যাপটপ পৌঁছে দিয়ে তাদের উজ্জ্বল ভবিষ্যৎ নিশ্চিত করা।
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">দ্রুত লিঙ্ক</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="#goal" className="hover:text-primary transition-colors">স্কলারশিপের লক্ষ্য</Link></li>
              <li><Link href="#eligibility" className="hover:text-primary transition-colors">যোগ্যতা</Link></li>
              <li><Link href="#faq" className="hover:text-primary transition-colors">সাধারণ প্রশ্ন</Link></li>
              <li><Link href="#results" className="hover:text-primary transition-colors">ফলাফল</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">গ্লোবাল হেডকোয়ার্টার</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <Globe className="w-5 h-5 text-primary shrink-0" />
                <span className="text-xs">
                  Global IT Excellence Initiative (GIEI)<br/>
                  71-75 Shelton Street, Covent Garden,<br/>
                  London, WC2H 9JQ, United Kingdom.
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm">support@giei-global.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground text-center md:text-left">
          <div className="space-y-1">
            <p>© ২০২৬ Vision-2030 Digital Scholarship. সর্বস্বত্ব সংরক্ষিত।</p>
            <p className="text-[10px] opacity-60">Managed & Operated by Global IT Excellence Initiative (GIEI), London, UK.</p>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">গোপনীয়তা নীতি</Link>
            <Link href="#" className="hover:text-primary transition-colors">শর্তাবলী</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

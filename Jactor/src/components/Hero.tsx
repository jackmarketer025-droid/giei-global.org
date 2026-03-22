
"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Laptop, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative pt-32 pb-12 md:pt-40 md:pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10 opacity-20 blur-[100px] bg-gradient-to-br from-primary via-transparent to-secondary"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs md:text-sm font-medium mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4" />
          <span>মেধা আপনার, প্রযুক্তি আমাদের।</span>
        </div>
        
        <h1 className="font-headline text-3xl md:text-5xl lg:text-7xl font-bold mb-6 max-w-4xl mx-auto leading-[1.2] md:leading-[1.1]">
          Vision-2030: <span className="text-gradient">Fueling the Next Generation</span>
        </h1>
        
        <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
          বাংলাদেশে এই প্রথম মেধা যাচাইয়ের মাধ্যমে ডিজিটাল স্কলারশিপের আওতায় ফ্রি ল্যাপটপ প্রদান প্রকল্প।
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 md:mb-20">
          <Link href="/auth/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-lg font-bold group">
              এখনই আবেদন করুন
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#journey" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 border-white/10 hover:bg-white/5 rounded-full text-lg font-semibold">
              কিভাবে কাজ করে?
            </Button>
          </Link>
        </div>

        <div className="relative max-w-5xl mx-auto px-2">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20"></div>
          <div className="relative glass-panel rounded-2xl overflow-hidden aspect-video shadow-2xl">
            <Image 
              src="https://picsum.photos/seed/vision-hero/1200/800" 
              alt="Technology Vision" 
              fill 
              className="object-cover"
              data-ai-hint="abstract technology"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
            <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-primary/20 rounded-xl backdrop-blur-md">
                <Laptop className="w-5 h-5 md:w-8 md:h-8 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-[10px] md:text-sm font-medium text-white/60">বন্টন লক্ষ্য</p>
                <p className="text-lg md:text-2xl font-bold font-headline">৫০০০+ ল্যাপটপ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

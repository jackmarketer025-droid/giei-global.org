
"use client";

import Image from 'next/image';
import { QrCode, Quote, PlayCircle, Star, Sparkles, MapPin, CheckCircle, Laptop, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const winners = [
  {
    id: "V2030-001",
    name: "মো: আরিফুল ইসলাম",
    district: "দিনাজপুর",
    prize: "HP Core i5 Laptop",
    award: "Vision-2030 Merit Award",
    quote: "আমি প্রথমে বিশ্বাস করিনি, কিন্তু কুইজ দেওয়ার পর ল্যাপটপটি পেয়ে আমার ফ্রিল্যান্সিং ক্যারিয়ার শুরু করতে পেরেছি।",
    image: "https://picsum.photos/seed/winner-ariful/400/500",
    isVerified: true
  },
  {
    id: "V2030-002",
    name: "তানজিলা আক্তার",
    district: "বগুড়া",
    prize: "Dell Latitude Business Series",
    award: "Academic Excellence Award",
    quote: "মেধার মূল্যায়ন যে এভাবে হতে পারে তা আগে ভাবিনি। এই ল্যাপটপটি আমার স্কিল ডেভেলপমেন্টে অনেক সাহায্য করছে।",
    image: "https://picsum.photos/seed/winner-tanjila/400/500",
    isVerified: true
  },
  {
    id: "V2030-003",
    name: "রাকিব হাসান",
    district: "সিলেট",
    prize: "HP ProBook Elite",
    award: "Digital Frontier Scholarship",
    quote: "সঠিক সময়ে সঠিক প্রযুক্তি হাতে পাওয়া স্বপ্নের মতো। ভিশন-২০৩০ প্রজেক্টকে অনেক ধন্যবাদ আমার পাশে দাঁড়ানোর জন্য।",
    image: "https://picsum.photos/seed/winner-rakib/400/500",
    isVerified: true
  }
];

export function Winners() {
  return (
    <section id="results" className="section-padding relative overflow-hidden px-4 md:px-6">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 bg-primary/5 blur-[100px] md:blur-[120px] -z-10 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 text-secondary font-bold mb-4">
            <Star className="w-5 h-5 fill-secondary" />
            <span>স্বপ্নের জয়যাত্রা</span>
          </div>
          <h2 className="text-3xl md:text-5xl mb-6 font-headline">আমাদের মেধা তালিকার সেরাদের গল্প</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            প্রযুক্তির ক্ষমতায় এগিয়ে যাচ্ছে বাংলাদেশ—আমাদের সফল বিজয়ীদের সাথে পরিচিত হোন। পরবর্তী বিজয়ী হতে পারেন আপনিও! আপনার মেধা প্রমাণ করুন আজই।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          {winners.map((winner, index) => (
            <Card key={index} className="group relative glass-panel border-none overflow-hidden hover:scale-[1.01] transition-all duration-500 shadow-xl">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image 
                  src={winner.image} 
                  alt={winner.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  data-ai-hint="happy student with laptop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
                
                {winner.isVerified && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 backdrop-blur-md rounded-full border border-primary/30 z-10 animate-pulse">
                    <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-primary" />
                    <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-wider">Verified Winner</span>
                  </div>
                )}

                <div className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 group-hover:bg-primary/20 transition-colors">
                  <QrCode className="w-5 md:w-6 h-5 md:h-6 text-white" />
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <Badge className="mb-2 md:mb-3 bg-secondary/20 text-secondary border-secondary/30 backdrop-blur-sm text-[10px] md:text-xs">
                    {winner.award}
                  </Badge>
                  <h4 className="text-xl md:text-2xl font-bold font-headline mb-1 text-white">{winner.name}</h4>
                  <div className="flex items-center gap-2 text-primary text-xs md:text-sm font-semibold">
                    <Laptop className="w-3 md:w-4 h-3 md:h-4" />
                    {winner.prize}
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <div className="flex gap-2 md:gap-3 mb-6">
                  <div className="flex-1 p-2 md:p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <MapPin className="w-3 md:w-4 h-3 md:h-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-[7px] md:text-[8px] text-muted-foreground uppercase tracking-widest">বিভাগ/জেলা</span>
                      <span className="text-[10px] md:text-xs font-bold">{winner.district}</span>
                    </div>
                  </div>
                  <div className="flex-1 p-2 md:p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-center">
                    <span className="text-[7px] md:text-[8px] text-muted-foreground uppercase tracking-widest">আইডি নাম্বার</span>
                    <span className="text-[10px] md:text-xs font-bold">{winner.id}</span>
                  </div>
                </div>
                <div className="relative">
                  <Quote className="absolute -top-2 md:-top-3 -left-2 w-8 md:w-10 h-8 md:h-10 text-primary/10 -z-10" />
                  <p className="text-xs md:text-sm text-muted-foreground italic leading-relaxed pl-4 line-clamp-3 md:line-clamp-2">
                    "{winner.quote}"
                  </p>
                </div>
              </div>
            </Card>
          ))}

          <Card className="group relative border-2 border-dashed border-primary/20 bg-primary/5 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-6 md:p-8 text-center min-h-[400px] md:min-h-[500px]">
            <div className="w-16 md:w-24 h-16 md:h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <Laptop className="w-8 md:w-12 h-8 md:h-12 text-primary/40" />
            </div>
            <h4 className="text-xl md:text-2xl font-bold font-headline mb-3 md:mb-4 opacity-50">Reserved for Winner #04</h4>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
              এই স্থানটি আপনার হতে পারে। প্রথম ধাপের ১০টি ল্যাপটপ বিতরণের কার্যক্রম চলমান রয়েছে।
            </p>
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/30 rounded-full font-bold transition-all px-8">
                মেধা যাচাই শুরু করুন <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </div>

        <div className="relative group rounded-3xl overflow-hidden glass-panel border-primary/20 p-1">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 animate-pulse"></div>
          <div className="relative bg-background/60 backdrop-blur-xl rounded-[calc(1.5rem-4px)] p-6 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] md:text-xs font-bold mb-4">
                <Sparkles className="w-3 h-3" />
                <span>পরবর্তী রাউন্ড শুরু হচ্ছে</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-bold font-headline mb-4">আপনার একটি সিদ্ধান্ত বদলে দিতে পারে ভবিষ্যত</h3>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl">
                প্রথম ১০ জন বিজয়ীর তালিকায় আপনার নাম দেখতে আজই মেধা যাচাই কুইজে অংশগ্রহণ করুন। রেজিস্ট্রেশন শেষ হতে আর অল্প সময় বাকি!
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
              <div className="text-center">
                <p className="text-xs md:text-sm text-muted-foreground mb-3">রেজিস্ট্রেশন শেষ হতে বাকি</p>
                <div className="flex gap-2 md:gap-4 justify-center">
                  {['০২', '১২', '৪৫'].map((time, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold font-headline text-primary shadow-lg shadow-primary/10">
                        {time}
                      </div>
                      <span className="text-[8px] md:text-[10px] uppercase mt-1 text-muted-foreground font-bold">
                        {i === 0 ? 'দিন' : i === 1 ? 'ঘণ্টা' : 'মিনিট'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/auth/register" className="w-full">
                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold px-10 h-14 shadow-xl shadow-primary/20">
                  এখনই আবেদন নিশ্চিত করুন
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-32">
          <div className="text-center mb-10 md:mb-12">
            <h4 className="text-xl md:text-2xl font-bold font-headline mb-4">বিজয়ীদের অনুভূতি (Video Testimonials)</h4>
            <p className="text-sm md:text-base text-muted-foreground">ছবি যদি কথা না বলে, তবে ভিডিও বলবে। আমাদের বিজয়ীদের ভিডিও অভিজ্ঞতা দেখে নিন।</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative aspect-video rounded-2xl overflow-hidden glass-panel group cursor-pointer border-white/5">
                <Image 
                  src={`https://picsum.photos/seed/vid-winner-${i}/400/225`} 
                  alt="Video testimonial" 
                  fill 
                  className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <PlayCircle className="w-6 md:w-8 h-6 md:h-8 text-primary group-hover:text-primary-foreground" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[8px] md:text-[10px] font-bold text-white/60">
                  <span>বিজয়ীর অভিজ্ঞতা #{i}</span>
                  <Badge variant="outline" className="text-[7px] md:text-[8px] border-white/20 text-white/40">Verified</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

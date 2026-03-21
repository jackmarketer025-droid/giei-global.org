
"use client";

import { UserPlus, BrainCircuit, Trophy } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: "রেজিস্ট্রেশন",
    description: "সঠিক তথ্য দিয়ে আবেদন ও অ্যাসেসমেন্ট ফি প্রদান করুন।",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: BrainCircuit,
    title: "অনলাইন কুইজ",
    description: "নির্দিষ্ট সময়ে মেধা যাচাই পরীক্ষায় অংশগ্রহণ করুন।",
    color: "bg-secondary/10 text-secondary"
  },
  {
    icon: Trophy,
    title: "পুরস্কার লাভ",
    description: "মেধা তালিকায় স্থান পেলে আপনার ঠিকানায় ল্যাপটপ পৌঁছে যাবে।",
    color: "bg-primary/10 text-primary"
  }
];

export function Journey() {
  return (
    <section id="journey" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl mb-4">কার্যক্রমের ধাপসমূহ</h2>
          <p className="text-muted-foreground text-lg">খুব সহজ ৩টি ধাপে ল্যাপটপ জয়ের সুযোগ নিন।</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group p-8 rounded-2xl glass-panel hover:bg-white/[0.05] transition-all duration-300">
              <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-headline">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 translate-x-1/2 w-8 h-px bg-white/10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

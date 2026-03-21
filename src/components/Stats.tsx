
"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

const initialStats = [
  { label: "মোট বরাদ্দকৃত ল্যাপটপ", value: 5000, suffix: "+" },
  { label: "নিবন্ধিত ছাত্র-ছাত্রী", value: 12450, suffix: "" },
  { label: "সাফল্যের হার", value: 98, suffix: "%" },
  { label: "পরবর্তী কুইজের তারিখ", value: 25, suffix: " মার্চ" },
  { label: "জেলা কভারেজ", value: 64, suffix: " টি জেলা" }
];

export function Stats() {
  const [counts, setCounts] = useState(initialStats.map(() => 0));

  useEffect(() => {
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);

    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setCounts(initialStats.map(stat => Math.floor(stat.value * progress)));

      if (frame === totalFrames) clearInterval(timer);
    }, frameRate);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 md:section-padding bg-card/20 border-y border-white/5 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {initialStats.map((stat, index) => (
            <Card key={index} className="p-4 md:p-6 glass-panel border-none text-center flex flex-col justify-center min-h-[130px] md:min-h-[160px]">
              <div className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2 font-headline">
                {counts[index].toLocaleString()}{stat.suffix}
              </div>
              <div className="text-muted-foreground font-medium uppercase tracking-wider text-[8px] md:text-[10px] lg:text-xs leading-tight">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


"use client";

import { CheckCircle2, FileText, BarChart3, Users } from 'lucide-react';

export function Eligibility() {
  return (
    <section id="eligibility" className="section-padding">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl mb-8 font-headline">যোগ্যতা ও নিয়মাবলী</h2>
          <div className="space-y-6">
            <div className="flex gap-4 p-6 glass-panel rounded-2xl">
              <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">কারা আবেদন করতে পারবে?</h4>
                <p className="text-muted-foreground">নূন্যতম এসএসসি/এইচএসসি শিক্ষার্থী অথবা যেকোনো আইটি কোর্সে অধ্যয়নরত তরুণ-তরুণীরা আবেদন করতে পারবেন।</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 glass-panel rounded-2xl">
              <div className="shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">কি কি ডকুমেন্ট লাগবে?</h4>
                <p className="text-muted-foreground">আবেদনের জন্য আপনার জন্ম নিবন্ধন সনদ অথবা এনআইডি কার্ড এবং একটি সচল পার্সোনাল মোবাইল নাম্বার প্রয়োজন হবে।</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 glass-panel rounded-2xl">
              <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">নির্বাচন পদ্ধতি</h4>
                <p className="text-muted-foreground">শুধুমাত্র লটারি নয়, বরং অনলাইন কুইজ পরীক্ষার স্কোর এবং আবেদনকারীর আর্থ-সামাজিক অবস্থা যাচাইয়ের মাধ্যমে ল্যাপটপ প্রদান করা হবে।</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl rounded-full"></div>
          <div className="relative glass-panel p-8 rounded-3xl border-white/5 overflow-hidden">
            <h3 className="text-2xl font-bold mb-6 font-headline">বিশেষ নির্দেশিকা</h3>
            <ul className="space-y-4">
              {[
                "আবেদন ফি অ-ফেরতযোগ্য (সার্ভার মেইনটেইন ও কুইজ ম্যানেজমেন্টের জন্য)।",
                "কুইজে অংশ নিতে হাই-স্পিড ইন্টারনেট কানেকশন নিশ্চিত করুন।",
                "একবার কুইজ শুরু করলে নির্ধারিত সময়ের আগে শেষ করা যাবে না।",
                "ভুল তথ্য প্রদান করলে আবেদন বাতিল বলে গণ্য হবে।",
                "ফলাফল প্রকাশের ৭ কার্যদিবসের মধ্যে ল্যাপটপ কুরিয়ার করা হবে।"
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-muted-foreground">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

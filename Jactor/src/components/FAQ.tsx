'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "১. ভিশন-২০৩০ ডিজিটাল স্কলারশিপ আসলে কী?",
    a: "এটি একটি বিশেষ মেধা যাচাই প্রকল্প, যার লক্ষ্য বাংলাদেশের মেধাবী শিক্ষার্থীদের প্রযুক্তিনির্ভর করে গড়ে তোলা। নির্দিষ্ট কুইজ পরীক্ষায় অংশ নিয়ে যোগ্যতার প্রমাণ দিয়ে শিক্ষার্থীরা বিনামূল্যে ল্যাপটপ অর্জন করতে পারে।"
  },
  {
    q: "২. আবেদনের জন্য ফি কেন নেওয়া হচ্ছে?",
    a: "এই ফি মূলত অনলাইন কুইজ পোর্টাল পরিচালনা, সার্ভার রক্ষণাবেক্ষণ, এবং আবেদনকারীদের তথ্য যাচাইকরণ (Verification) প্রক্রিয়ার জন্য নেওয়া হয়। আমরা একটি সম্পূর্ণ স্বচ্ছ ও টেকনিক্যাল সিস্টেম নিশ্চিত করতে এই সামান্য সার্ভিস চার্জ গ্রহণ করি।"
  },
  {
    q: "৩. আমি কি নিশ্চিতভাবে ল্যাপটপ পাবো?",
    a: "ল্যাপটপ প্রদানের বিষয়টি সম্পূর্ণভাবে আপনার কুইজ পরীক্ষার ফলাফল এবং মেধা তালিকার ওপর নির্ভর করে। যারা সর্বোচ্চ স্কোর করবে এবং আমাদের শর্তাবলী পূরণ করবে, তারাই বিজয়ী হিসেবে নির্বাচিত হবে।"
  },
  {
    q: "৪. কুইজ পরীক্ষাটি কীভাবে হবে?",
    a: "আবেদন সম্পন্ন করার পর আপনি একটি নির্দিষ্ট সময় পাবেন। আমাদের ওয়েবসাইটেই লগইন করে আপনি আপনার মোবাইল বা কম্পিউটার থেকে অনলাইনে পরীক্ষায় অংশ নিতে পারবেন।"
  },
  {
    q: "৫. ল্যাপটপ কীভাবে আমার হাতে পৌঁছাবে?",
    a: "আপনি যদি বিজয়ী নির্বাচিত হন, তবে আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন। আপনার ঠিকানা যাচাই শেষে কুরিয়ার সার্ভিসের মাধ্যমে বা সরাসরি অনুষ্ঠানের মাধ্যমে ল্যাপটপটি আপনার হাতে তুলে দেওয়া হবে। এর জন্য আপনাকে অতিরিক্ত কোনো টাকা দিতে হবে না।"
  },
  {
    q: "৬. একই ব্যক্তি কি একাধিকবার আবেদন করতে পারবে?",
    a: "না। একজন শিক্ষার্থী তার এনআইডি (NID) বা জন্ম নিবন্ধন নম্বর ব্যবহার করে শুধুমাত্র একবারই আবেদন করতে পারবেন। জালিয়াতি রোধে আমাদের সিস্টেম অত্যন্ত কঠোর।"
  }
];

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="faq" className="section-padding bg-card/10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl mb-4 font-headline">সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)</h2>
          <p className="text-muted-foreground">আবেদন করার আগে আপনার মনে থাকা প্রশ্নগুলোর উত্তর এখান থেকে দেখে নিন।</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="আপনার প্রশ্নটি এখানে খুঁজুন..." 
            className="pl-12 h-14 bg-white/5 border-white/10 rounded-xl focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 rounded-xl px-6 bg-card/30 overflow-hidden">
                <AccordionTrigger className="text-left font-bold text-lg hover:text-primary transition-colors hover:no-underline py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              আপনার সার্চের সাথে মিলে যায় এমন কোনো প্রশ্ন পাওয়া যায়নি।
            </div>
          )}
        </Accordion>

        {/* Support Link */}
        <div className="mt-16 p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center">
          <h4 className="text-xl font-bold mb-2">আপনার প্রশ্নের উত্তর এখানে নেই?</h4>
          <p className="text-muted-foreground mb-6">আমাদের সাপোর্ট টিম আপনাকে সরাসরি সাহায্য করতে প্রস্তুত।</p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 flex gap-2 mx-auto font-bold shadow-lg shadow-primary/20">
            <MessageSquare className="w-5 h-5" /> সরাসরি লাইভ চ্যাট করুন
          </Button>
        </div>
      </div>
    </section>
  );
}

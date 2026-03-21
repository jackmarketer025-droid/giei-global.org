
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "#goal", label: "লক্ষ্য" },
    { href: "#eligibility", label: "যোগ্যতা" },
    { href: "#faq", label: "সাধারণ প্রশ্ন" },
    { href: "#results", label: "ফলাফল" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <span className="font-headline text-lg md:text-xl font-bold tracking-tight">Vision-2030</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/auth/login" className="hidden sm:inline-flex">
            <Button variant="ghost" className="hover:text-primary">লগইন</Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold px-4 md:px-6">রেজিস্ট্রেশন</Button>
          </Link>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-white/10 w-[300px]">
                <SheetTitle className="text-left mb-8 flex items-center gap-2">
                   <GraduationCap className="w-6 h-6 text-primary" />
                   <span>Vision-2030</span>
                </SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full rounded-full border-white/10">লগইন</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

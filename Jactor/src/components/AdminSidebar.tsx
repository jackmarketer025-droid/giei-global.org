
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut, 
  GraduationCap, 
  ShieldCheck,
  ChevronRight,
  Laptop
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
  { icon: Users, label: 'Applicants', href: '/admin/applicants' },
  { icon: CreditCard, label: 'Payments', href: '/admin/payments' },
  { icon: Laptop, label: 'Products', href: '/admin/products' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const auth = useAuth();

  const handleLogout = () => {
    if (auth) signOut(auth);
  };

  return (
    <div className="w-64 border-r border-slate-200 bg-white h-screen flex flex-col fixed left-0 top-0 shadow-sm">
      <div className="p-6 border-b border-slate-50 flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-xl">
          <GraduationCap className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight text-slate-900">V-2030 ADMIN</h1>
          <div className="flex items-center gap-1 text-[8px] text-blue-500 font-bold uppercase tracking-widest">
            <ShieldCheck className="w-2.5 h-2.5" />
            <span>Secure System</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group cursor-pointer",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100 font-semibold" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}>
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-50">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-colors h-12"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
}


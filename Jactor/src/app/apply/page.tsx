"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  GraduationCap, 
  Lock, 
  Loader2, 
  ArrowLeft,
  Smartphone,
  School,
  User,
  MapPin,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const BDT_DISTRICTS = [
  "Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh",
  "Gazipur", "Narayanganj", "Tangail", "Faridpur", "Munshiganj", "Manikganj", "Narsingdi",
  "Cumilla", "Noakhali", "Cox's Bazar", "Brahmanbaria", "Chandpur", "Feni", "Lakshmipur",
  "Bogura", "Pabna", "Joypurhat", "Naogaon", "Natore", "Chapainawabganj", "Sirajganj",
  "Jashore", "Kushtia", "Satkhira", "Bagerhat", "Magura", "Meherpur", "Narail", "Chuadanga",
  "Jhenaidah", "Bhola", "Pirojpur", "Patuakhali", "Jhalokati", "Barguna",
  "Habiganj", "Moulvibazar", "Sunamganj",
  "Dinajpur", "Kurigram", "Gaibandha", "Nilphamari", "Panchagarh", "Thakurgaon", "Lalmonirhat",
  "Sherpur", "Jamalpur", "Netrokona", "Kishoreganj"
];

export default function ApplyPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    primaryMobile: '',
    institutionName: '',
    classYear: '',
    alternateMobile: '',
    district: '',
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bangladesh Mobile Regex (starts with 01, then 3-9, then 8 digits)
    const mobileRegex = /^01[3-9]\d{8}$/;
    
    // Validation
    if (!formData.fullName || !formData.primaryMobile || !formData.institutionName || !formData.classYear || !formData.district) {
      toast({
        variant: "destructive",
        title: "তথ্য অসম্পূর্ণ",
        description: "দয়া করে ফরমের সকল প্রয়োজনীয় তথ্য পূরণ করুন।"
      });
      return;
    }

    if (!mobileRegex.test(formData.primaryMobile)) {
      toast({
        variant: "destructive",
        title: "ভুল মোবাইল নম্বর",
        description: "দয়া করে সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন (উদা: 017XXXXXXXX)।"
      });
      return;
    }

    if (formData.alternateMobile && !mobileRegex.test(formData.alternateMobile)) {
      toast({
        variant: "destructive",
        title: "ভুল অভিভাবকের নম্বর",
        description: "দয়া করে সঠিক ১১ ডিজিটের অভিভাবকের মোবাইল নম্বর প্রদান করুন।"
      });
      return;
    }

    setLoading(true);

    // Simulate Payment Processing Redirect
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Verification in Progress",
        description: "এক মুহূর্ত অপেক্ষা করুন, আপনাকে পেমেন্ট পেজে নিয়ে যাওয়া হচ্ছে...",
      });
      // In a real app, we would save to Firestore first. 
      // For this UI task, we'll demonstrate the redirect.
      router.push('/dashboard/payment-success?status=init');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-yellow-400 selection:text-black">
      {/* Background patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900 blur-[150px] rounded-full"></div>
      </div>

      <nav className="relative z-10 px-6 py-8 max-w-7xl mx-auto flex justify-between items-center bg-[#0f172a]/80 backdrop-blur-sm sticky top-0">
        <Link href="/" className="flex items-center gap-2 group">
          <GraduationCap className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform" />
          <div>
            <span className="text-xl font-headline font-black tracking-tight text-white block leading-none">VISION-2030</span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-blue-400 font-bold">Scholarship Portal</span>
          </div>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 gap-2 rounded-xl text-xs">
            <ArrowLeft className="w-4 h-4" /> ফিরে যান
          </Button>
        </Link>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-10 pb-24">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            Official Application Form 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tighter mb-4">
            গড়বো আগামীর <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">স্মার্ট বাংলাদেশ</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            আন্তর্জাতিক মানের স্কলারশিপ প্রোগ্রামের জন্য আপনার তথ্য প্রদান করুন এবং পরবর্তী ধাপে এগিয়ে যান।
          </p>
        </div>

        <div className="bg-[#1e293b]/50 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in duration-1000">
          <div className="bg-gradient-to-r from-blue-600/10 to-transparent p-10 md:p-14">
            <form onSubmit={handleFormSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {/* Full Name */}
                <div className="space-y-3 group">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-yellow-400 transition-colors">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <Input 
                    required
                    placeholder="উদা: আব্দুল করিম" 
                    className="h-16 bg-slate-800/50 border-white/5 rounded-2xl px-6 text-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all placeholder:text-slate-600 text-white font-medium"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>

                {/* Primary Mobile */}
                <div className="space-y-3 group">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-yellow-400 transition-colors">
                    <Smartphone className="w-3.5 h-3.5" /> Primary Mobile
                  </label>
                  <Input 
                    required
                    type="tel"
                    placeholder="০১৭XXXXXXXX" 
                    className="h-16 bg-slate-800/50 border-white/5 rounded-2xl px-6 text-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all placeholder:text-slate-600 text-white font-medium"
                    value={formData.primaryMobile}
                    onChange={(e) => setFormData({...formData, primaryMobile: e.target.value})}
                  />
                </div>

                {/* Institution Name */}
                <div className="space-y-3 group">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-yellow-400 transition-colors">
                    <School className="w-3.5 h-3.5" /> Institution Name
                  </label>
                  <Input 
                    required
                    placeholder="আপনার স্কুল/কলেজের নাম" 
                    className="h-16 bg-slate-800/50 border-white/5 rounded-2xl px-6 text-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all placeholder:text-slate-600 text-white font-medium"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({...formData, institutionName: e.target.value})}
                  />
                </div>

                {/* Class/Year Dropdown */}
                <div className="space-y-3 group">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-yellow-400 transition-colors">
                    <CalendarDays className="w-3.5 h-3.5" /> Class / Year
                  </label>
                  <Select onValueChange={(val) => setFormData({...formData, classYear: val})}>
                    <SelectTrigger className="h-16 bg-slate-800/50 border-white/5 rounded-2xl px-6 text-lg focus:ring-2 focus:ring-blue-600 text-slate-300 font-medium">
                      <SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                      <SelectItem value="8th">8th Class</SelectItem>
                      <SelectItem value="9th">9th Class</SelectItem>
                      <SelectItem value="10th">10th Class</SelectItem>
                      <SelectItem value="HSC 1st">HSC 1st Year</SelectItem>
                      <SelectItem value="HSC 2nd">HSC 2nd Year</SelectItem>
                      <SelectItem value="Honors/Degree">Honors / Degree</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Alternate Mobile */}
                <div className="space-y-3 group">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-yellow-400 transition-colors">
                    <Lock className="w-3.5 h-3.5" /> Alternate Mobile (Guardian)
                  </label>
                  <Input 
                    required
                    type="tel"
                    placeholder="অভিভাবকের মোবাইল নম্বর" 
                    className="h-16 bg-slate-800/50 border-white/5 rounded-2xl px-6 text-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all placeholder:text-slate-600 text-white font-medium"
                    value={formData.alternateMobile}
                    onChange={(e) => setFormData({...formData, alternateMobile: e.target.value})}
                  />
                </div>

                {/* Division/District - Searchable Datalist */}
                <div className="space-y-3 group">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-yellow-400 transition-colors">
                    <MapPin className="w-3.5 h-3.5" /> Division / District
                  </label>
                  <div className="relative">
                    <Input 
                      required
                      list="districts"
                      placeholder="বিভাগ বা জেলার নাম লিখুন..." 
                      className="h-16 bg-slate-800/50 border-white/5 rounded-2xl px-6 text-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all placeholder:text-slate-600 text-white font-medium"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                    />
                    <datalist id="districts">
                      {BDT_DISTRICTS.map((district) => (
                        <option key={district} value={district} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              <div className="pt-10 flex flex-col items-center gap-8">
                {/* Security Note */}
                <div className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-blue-500/5 border border-blue-500/10 max-w-lg w-full">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/40">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-[11px] md:text-xs text-slate-400 font-medium leading-relaxed">
                    <span className="text-blue-400 font-bold uppercase tracking-wider block mb-0.5">Security Note</span>
                    Your personal information is encrypted and securely stored in compliance with international data protection standards managed by GIEI, London.
                  </p>
                </div>

                {/* Submit Button */}
                <Button 
                  disabled={loading}
                  type="submit" 
                  className="w-full h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 text-[#0f172a] rounded-3xl font-black text-xl md:text-2xl shadow-2xl shadow-yellow-600/20 hover:shadow-yellow-400/30 transition-all duration-300 transform hover:-translate-y-2 active:scale-[0.98] border-none group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  {loading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-4">
                      <span>পেমেন্ট ও আবেদন নিশ্চিত করুন</span>
                      <CheckCircle2 className="w-8 h-8 opacity-40" />
                    </div>
                  )}
                </Button>
                
                <p className="text-[9px] uppercase tracking-[0.4em] font-black text-slate-600">
                  Global IT Excellence Initiative • Official Partner
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "London HQ", desc: "Managed under GIEI UK standards", icon: Globe },
            { label: "100% Encrypted", desc: "Military grade data security", icon: Lock },
            { label: "Real Time", desc: "Tracking active in 5 seconds", icon: CheckCircle2 }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4 p-6 rounded-3xl bg-slate-900/40 border border-white/5">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                <feature.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white leading-none mb-1">{feature.label}</h4>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 text-center">
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest px-6">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>System Audited & Secure - GIEI London Official 2026</span>
        </div>
      </footer>
    </div>
  );
}

// Re-using Globe icon if needed (adding to imports)
import { Globe } from 'lucide-react';

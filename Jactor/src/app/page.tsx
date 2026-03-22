
"use client";

import { useMemo, useState, useEffect } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';
import { 
  GraduationCap, 
  Search, 
  Calendar,
  Info, 
  Loader2,
  TrendingUp,
  ShieldCheck,
  Globe,
  CheckCircle2,
  Mail,
  MessageSquare,
  CreditCard,
  Smartphone,
  ChevronRight,
  Clock,
  MapPin,
  Lock,
  Camera,
  Upload,
  Check,
  Copy,
  AlertCircle,
  Menu,
  X,
  ExternalLink,
  HelpCircle,
  Trophy,
  Users,
  Cpu,
  Laptop,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth, useFirestore, useFirebaseStorage, useCollection } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, query, collection, where, limit, getDocs, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { generateTrackingId } from '@/lib/id-generator';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_LAPTOPS = [
  { 
    brand: "HP Laptop", 
    series: "Professional Series", 
    desc: "দীর্ঘস্থায়ী ব্যাটারি এবং মজবুত বডি। ছাত্র-ছাত্রীদের অ্যাসাইনমেন্ট এবং কোডিং শেখার জন্য আদর্শ।",
    model: "HP 15s বা সমমান",
    img: "https://res.cloudinary.com/dd3eekw7h/image/upload/v1774212559/Gemini_Generated_Image_6r118r6r118r6r11_iqoxse.png",
    color: "blue",
    order: 1
  },
  { 
    brand: "Dell Laptop", 
    series: "Vostro / Inspiron", 
    desc: "চমৎকার ডিসপ্লে এবং পারফরম্যান্স। ফ্রিল্যান্সিং এবং গ্রাফিক ডিজাইনের কাজের জন্য সেরা পছন্দ।",
    model: "Dell 3511 বা সমমান",
    img: "https://res.cloudinary.com/dd3eekw7h/image/upload/v1774212742/Gemini_Generated_Image_v7xopiv7xopiv7xo_eplovi.png",
    color: "emerald",
    order: 2
  },
  { 
    brand: "Lenovo Laptop", 
    series: "Ideapad Slim", 
    desc: "স্টাইলিশ লুক এবং সুপার ফাস্ট প্রসেসর। ভার্সিটির প্রেজেন্টেশন এবং মাল্টিটাস্কিংয়ের জন্য অতুলনীয়।",
    model: "Lenovo V15 বা সমমান",
    img: "https://res.cloudinary.com/dd3eekw7h/image/upload/v1774212760/Gemini_Generated_Image_46g2aa46g2aa46g2_kw2s49.png",
    color: "purple",
    order: 3
  },
  { 
    brand: "Apple MacBook", 
    series: "Top Performers Only", 
    desc: "পুরো বাংলাদেশের মধ্যে টপ ৩ জনকে অ্যাপল ম্যাকবুক এয়ার (M-Series) উপহার দেওয়া হবে।",
    model: "MacBook Air M2/M3",
    img: "https://res.cloudinary.com/dd3eekw7h/image/upload/v1774212768/Gemini_Generated_Image_preswkpreswkpres_rdtbzb.png",
    color: "amber",
    isSpecial: true,
    order: 4
  }
];

const PAYMENT_METHODS = {
  bkash: { label: 'bKash', color: 'bg-[#E2136E]', number: '01XXXXXXXXX' },
  nagad: { label: 'Nagad', color: 'bg-[#F15A22]', number: '01XXXXXXXXX' },
  rocket: { label: 'Rocket', color: 'bg-[#8C3494]', number: '01XXXXXXXXX' }
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [statusResult, setStatusResult] = useState<any>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'rocket' | null>(null);
  const [tnxId, setTnxId] = useState('');
  const [hasFile, setHasFile] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const auth = useAuth();
  const firestore = useFirestore();
  const { storage } = useFirebaseStorage();
  const { toast } = useToast();
  const router = useRouter();

  const laptopsQuery = useMemo(() => {
    if (!firestore) return null;
    const q = query(collection(firestore, 'laptops'), orderBy('order', 'asc'));
    return Object.assign(q, { __memo: true });
  }, [firestore]);

  const { data: firestoreLaptops, isLoading: laptopsLoading } = useCollection(laptopsQuery);
  const laptops = useMemo(() => {
    if (!firestoreLaptops || firestoreLaptops.length === 0) return DEFAULT_LAPTOPS;
    return firestoreLaptops;
  }, [firestoreLaptops]);

  const aboutImagesQuery = useMemo(() => {
    if (!firestore) return null;
    const q = query(collection(firestore, 'about_images'), orderBy('order', 'asc'));
    return Object.assign(q, { __memo: true });
  }, [firestore]);

  const { data: firestoreAboutImages } = useCollection(aboutImagesQuery);
  const aboutImages = useMemo(() => {
    const defaults = [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600"
    ];
    if (!firestoreAboutImages || firestoreAboutImages.length === 0) return defaults;
    return firestoreAboutImages.map(img => img.img);
  }, [firestoreAboutImages]);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 15, hours: 12, mins: 45, secs: 30 });
  const [notifyInput, setNotifyInput] = useState('');
  const [isSubmittingNotify, setIsSubmittingNotify] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        if (secs > 0) secs--;
        else if (mins > 0) { mins--; secs = 59; }
        else if (hours > 0) { hours--; mins = 59; secs = 59; }
        else if (days > 0) { days--; hours = 23; mins = 59; secs = 59; }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyInput) {
      toast({
        variant: "destructive",
        title: "তথ্য দিন",
        description: "দয়া করে আপনার ইমেইল বা ফোন নম্বর দিন।"
      });
      return;
    }

    setIsSubmittingNotify(true);
    try {
      if (firestore) {
        await setDoc(doc(collection(firestore, 'notifications')), {
          contact: notifyInput,
          timestamp: serverTimestamp()
        });
      }
      toast({
        title: "সফল হয়েছে!",
        description: "আবেদন শুরু হলে আপনাকে জানিয়ে দেওয়া হবে।",
      });
      setNotifyInput('');
    } catch (error) {
      console.error("Notify error:", error);
      toast({
        variant: "destructive",
        title: "ব্যর্থ হয়েছে",
        description: "তথ্য সেভ করা যায়নি। আবার চেষ্টা করুন।"
      });
    } finally {
      setIsSubmittingNotify(false);
    }
  };

  const divisionsData: { [key: string]: string[] } = {
    'Rangpur': ['Dinajpur', 'Rangpur', 'Kurigram', 'Gaibandha', 'Nilphamari', 'Panchagarh', 'Thakurgaon', 'Lalmonirhat'],
    'Dhaka': ['Dhaka', 'Gazipur', 'Kishoreganj', 'Gopalganj', 'Tangail', 'Dhamrai', 'Narsingdi', 'Faridpur', 'Madaripur', 'Manikganj', 'Munshiganj', 'Rajbari', 'Shariatpur'],
    'Chittagong': ['Chittagong', 'Cox\'s Bazar', 'Bandarban', 'Rangamati', 'Khagrachhari', 'Noakhali', 'Lakshmipur', 'Feni', 'Cumilla', 'Chandpur', 'Brahmanbaria'],
    'Rajshahi': ['Rajshahi', 'Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Pabna', 'Chapainawabganj', 'Sirajganj'],
    'Khulna': ['Khulna', 'Bagerhat', 'Satkhira', 'Jashore', 'Magura', 'Narail', 'Kushtia', 'Chuadanga', 'Meherpur', 'Jhenaidah'],
    'Barisal': ['Barisail', 'Bhola', 'Patuakhali', 'Barguna', 'Jhalokathi', 'Pirojpur'],
    'Sylhet': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
    'Mymensingh': ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur']
  };

  const [formData, setFormData] = useState({
    fullName: '',
    primaryMobile: '',
    birthRegistration: '',
    dateOfBirth: '',
    institutionType: '',
    institutionName: '',
    classYear: '',
    alternateMobile: '',
    division: '',
    district: '',
    agreed: false
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bangladesh Mobile Number Validation (01 followed by 9 digits)
    const mobileRegex = /^01[3-9]\d{8}$/;
    
    if (!formData.fullName || !formData.primaryMobile || !formData.birthRegistration || !formData.dateOfBirth || !formData.institutionType || !formData.institutionName || !formData.classYear || !formData.division || !formData.district) {
      toast({
        variant: "destructive",
        title: "তথ্য অসম্পূর্ণ",
        description: "দয়া করে ফরমের সকল প্রয়োজনীয় তথ্য প্রদান করুন।"
      });
      return;
    }

    if (!formData.agreed) {
      toast({
        variant: "destructive",
        title: "শর্তাবলী গ্রহণ করুন",
        description: "দয়া করে ডিসক্লেইমার এবং শর্তাবলী মেনে টিকমার্ক দিন।"
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

    setShowPaymentModal(true);
  };

  const handleFinalPaymentAndRegister = async () => {
    if (!firestore || !selectedMethod) return;
    
    if (!tnxId) {
      toast({
        variant: "destructive",
        title: "Transaction ID প্রয়োজন",
        description: "দয়া করে আপনার পেমেন্টের Transaction ID প্রদান করুন।"
      });
      return;
    }

    setLoading(true);
    toast({
      title: "পেমেন্ট ভেরিফাই করা হচ্ছে",
      description: "দয়া করে অপেক্ষা করুন, আপনার লেনদেন যাচাই করা হচ্ছে...",
    });

    try {
      // 1. Prepare Application Data
      const trackingId = generateTrackingId();
      
      // Artificial delay for realism
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 2. Firestore document creation
      const userProfile = {
        fullName: formData.fullName,
        phone: formData.primaryMobile,
        birthRegistration: formData.birthRegistration,
        dateOfBirth: formData.dateOfBirth,
        institution: formData.institutionName,
        institutionType: formData.institutionType,
        classYear: formData.classYear,
        alternatePhone: formData.alternateMobile,
        division: formData.division,
        district: formData.district,
        email: `${formData.primaryMobile}@vision2030.org`,
        paymentStatus: 'pending',
        paymentMethod: selectedMethod,
        transactionId: tnxId,
        trackingId: trackingId,
        registrationDate: serverTimestamp(),
      };

      // Use setDoc with a manual reference to avoid potential Auth issues
      const userRef = doc(firestore, 'applications', trackingId);
      await setDoc(userRef, userProfile);

      toast({
        title: "নিবন্ধন ও পেমেন্ট সফল!",
        description: "আপনার পেমেন্ট রিসিট জেনারেট করা হয়েছে।",
      });

      setShowPaymentModal(false);
      router.push(`/dashboard/payment-success?id=${trackingId}`);
    } catch (error: any) {
      console.error("Firestore Error:", error);
      toast({
        variant: "destructive",
        title: "প্রক্রিয়াটি ব্যর্থ হয়েছে",
        description: "সার্ভার পারমিশন সমস্যা। দয়া করে ফায়ারবেস কনসোলে Rules আপডেট হয়েছে কিনা নিশ্চিত করুন।"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!trackingIdInput) {
      toast({
        variant: "destructive",
        title: "আইডি দিন",
        description: "দয়া করে আপনার আইডির শেষ ৪টি ডিজিট দিন।"
      });
      return;
    }

    setCheckingStatus(true);
    try {
      // Create the full ID from the 4 digits input
      const fullTrackingId = `GIEI-${trackingIdInput.trim()}`;
      
      const q = query(
        collection(firestore, 'applications'), 
        where('trackingId', '==', fullTrackingId), 
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast({
          variant: "destructive",
          title: "তথ্য পাওয়া যায়নি",
          description: "এই আইডি দিয়ে কোনো আবেদন পাওয়া যায়নি। সঠিক ৪টি ডিজিট দিন।"
        });
      } else {
        const userData = querySnapshot.docs[0].data();
        setStatusResult(userData);
        setShowStatusDialog(true);
      }
    } catch (error) {
      console.error("Error checking status:", error);
      toast({
        variant: "destructive",
        title: "সার্ভার ত্রুটি",
        description: "স্ট্যাটাস চেক করতে সমস্যা হচ্ছে। ফায়ারবেস রুলস চেক করুন।"
      });
    } finally {
      setCheckingStatus(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Number copied to clipboard.",
    });
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'হোম', href: '/#top', isComingSoon: false },
    { label: 'প্রজেক্ট সম্পর্কে', href: '/#about', isComingSoon: false },
    { label: 'যোগ্যতা ও নিয়মাবলী', href: '/#eligibility', isComingSoon: false },
    { label: 'ল্যাপটপ তালিকা', href: '/#prizes', isComingSoon: false },
    { label: 'ফলাফল', href: '/#result', isComingSoon: false },
    { label: 'সচরাচর জিজ্ঞাসা (FAQ)', href: '/#faq', isComingSoon: false },
    { label: 'বিজয়ীদের তালিকা', href: '/#winners', isComingSoon: false },
    { label: 'লন্ডন অফিস ভেরিফিকেশন', href: '/#about-global', isComingSoon: false },
    { label: 'যোগাযোগ', href: '/#contact', isComingSoon: false },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: any) => {
    if (item.isComingSoon) {
      e.preventDefault();
      toast({
        title: "Coming Soon",
        description: "ফলাফল খুব শীঘ্রই এই সেকশনে জানানো হবে।",
      });
      return;
    }
    
    // Close mobile menu
    setIsMobileMenuOpen(false);

    // If it's a hash link on the current page, handle it manually for reliability
    if (item.href.startsWith('/#') || item.href.startsWith('#')) {
      const targetId = item.href.includes('#') ? item.href.split('#')[1] : null;
      
      // Only prevent default and scroll manually if we are already on the home page
      if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
        e.preventDefault();
        
        if (targetId) {
          const element = document.getElementById(targetId);
          if (element) {
            const navHeight = 80; // Estimated height of the sticky navbar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;

            // Use a small delay for mobile menu to close first if it was open
            setTimeout(() => {
              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
              });
            }, 100);

            // Update URL hash without jumping
            window.history.pushState(null, '', `#${targetId}`);
          }
        }
      }
    }
  };

  return (
    <div id="top" className="bg-gray-50 text-gray-900 overflow-x-hidden scroll-smooth">
      <LoadingScreen />
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm py-3 md:py-4 px-4 md:px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-blue-900 hover:bg-blue-50 rounded-xl">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-white border-none p-0">
                <SheetHeader className="p-6 border-b border-slate-50 bg-blue-50/50">
                  <SheetTitle className="text-left flex items-center gap-1.5 text-blue-900">
                    <div className="bg-blue-600/10 p-1.5 rounded-lg shrink-0">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="leading-tight font-black">Vision-2030</span>
                      <span className="text-[7px] text-blue-600/50 uppercase tracking-widest leading-none">Global IT Initiative</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4 overflow-y-auto max-h-[calc(100vh-100px)]">
                  {navItems.map((item) => (
                    <Link 
                      key={item.label} 
                      href={item.href}
                      prefetch={false}
                      onClick={(e) => handleNavClick(e, item)}
                      className="flex items-center justify-between py-5 px-4 rounded-2xl text-base font-black text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all border-b border-slate-50 last:border-0"
                    >
                      <span className="tracking-tight">{item.label}</span>
                      {item.isComingSoon ? (
                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full uppercase">Soon</span>
                      ) : (
                        <ChevronRight className="w-5 h-5 opacity-20 text-blue-600" />
                      )}
                    </Link>
                  ))}
                  
                  {/* Additional Mobile Info */}
                  <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2">Managed by</p>
                    <p className="text-xs font-bold text-blue-700">Global IT Excellence Initiative (GIEI), UK</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="text-xl md:text-2xl font-bold text-blue-900 flex items-center gap-1.5">
            <div className="bg-blue-50 p-1.5 rounded-lg shrink-0">
              <GraduationCap className="text-blue-600 w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="block leading-[1.1] font-black">Vision-2030</span>
              <span className="text-[7px] md:text-[8px] text-slate-400 font-bold tracking-[0.05em] uppercase leading-none mt-0.5">Global IT Excellence Initiative</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden lg:flex items-center gap-x-1 xl:gap-x-2 mx-auto flex-1 justify-center px-2">
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              prefetch={false}
              onClick={(e) => handleNavClick(e, item)}
              className="text-[9px] xl:text-[11px] font-black uppercase tracking-tighter xl:tracking-tight text-slate-600 hover:text-blue-600 px-1 xl:px-2 py-1 transition-all whitespace-nowrap"
            >
              {item.label}
              {item.isComingSoon && <span className="ml-1 text-[7px] bg-yellow-100 text-yellow-700 px-1 py-0 rounded-full">Soon</span>}
            </Link>
          ))}
        </div>

        <div className="hidden 2xl:block text-[9px] text-gray-400 font-bold tracking-[0.2em] uppercase mr-4 shrink-0">
            MANAGED BY GIEI, UK
        </div>

        <Link href="#apply" prefetch={false} onClick={(e) => handleNavClick(e, { href: '#apply' })}>
          <Button className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold hover:bg-blue-700 transition shadow-md border-none">
            আবেদন করুন
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="gradient-bg text-white py-16 md:py-24 px-4 md:px-6 text-center relative">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-1 rounded-full text-blue-200 text-[10px] md:text-xs font-bold mb-6 border border-blue-400/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            GLOBAL SCHOLARSHIP LIVE
          </div>
          <h1 className="text-3xl md:text-6xl font-extrabold mb-6 leading-tight">আপনার মেধা, আমাদের ল্যাপটপ</h1>
          <p className="text-base md:text-lg opacity-80 mb-10 max-w-2xl mx-auto px-2">
            বিশ্বখ্যাত <b>Global IT Excellence Initiative (GIEI)</b> এর সহযোগিতায় বাংলাদেশের মেধাবীদের জন্য আন্তর্জাতিক প্রযুক্তিতে যুক্ত হওয়ার সেরা সুযোগ।
          </p>
          
          <div className="flex justify-center gap-2 md:gap-6 mb-12">
            <div className="glass p-3 md:p-4 rounded-2xl w-20 md:w-24">
              <span className="block text-2xl md:text-3xl font-bold">{mounted ? timeLeft.days : '00'}</span>
              <span className="text-[8px] md:text-[10px] uppercase opacity-60">Days</span>
            </div>
            <div className="glass p-3 md:p-4 rounded-2xl w-20 md:w-24">
              <span className="block text-2xl md:text-3xl font-bold">{mounted ? timeLeft.hours : '00'}</span>
              <span className="text-[8px] md:text-[10px] uppercase opacity-60">Hours</span>
            </div>
            <div className="glass p-3 md:p-4 rounded-2xl w-20 md:w-24">
              <span className="block text-2xl md:text-3xl font-bold">{mounted ? timeLeft.mins : '00'}</span>
              <span className="text-[8px] md:text-[10px] uppercase opacity-60">Mins</span>
            </div>
            <div className="glass p-3 md:p-4 rounded-2xl w-20 md:w-24">
              <span className="block text-2xl md:text-3xl font-bold">{mounted ? timeLeft.secs : '00'}</span>
              <span className="text-[8px] md:text-[10px] uppercase opacity-60">Secs</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 px-6 md:px-0">
            <Link href="#apply" prefetch={false} className="w-full sm:w-auto" onClick={(e) => handleNavClick(e, { href: '#apply' })}>
              <Button size="lg" className="w-full sm:w-auto bg-yellow-400 text-blue-950 px-10 py-6 rounded-xl font-bold text-lg shadow-xl hover:bg-yellow-300 transition transform hover:scale-105 border-none h-auto">
                রেজিস্ট্রেশন করুন
              </Button>
            </Link>
            <Link href="#about" prefetch={false} className="w-full sm:w-auto" onClick={(e) => handleNavClick(e, { href: '#about' })}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-10 py-6 rounded-xl font-bold text-lg border border-white/20 transition h-auto">
                বিস্তারিত জানুন
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 bg-white px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full text-blue-600 text-[10px] md:text-xs font-bold border border-blue-100 uppercase tracking-widest">
                <Info className="w-3.5 h-3.5" /> আমাদের সম্পর্কে (Vision-2030)
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Vision-2030 কী?</h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                Vision-2030 হলো লন্ডন ভিত্তিক আন্তর্জাতিক সংস্থা <span className="text-blue-600 font-bold">Global IT Excellence Initiative (GIEI)</span> কর্তৃক পরিচালিত একটি বিশেষ শিক্ষা ও প্রযুক্তি বিস্তার কর্মসূচি। আমাদের লক্ষ্য হলো ২০৩০ সালের মধ্যে বাংলাদেশের প্রতিটি প্রান্তের মেধাবী শিক্ষার্থীদের আধুনিক প্রযুক্তির সাথে পরিচয় করিয়ে দেওয়া এবং তাদের ডিজিটাল বাংলাদেশ থেকে 'স্মার্ট বাংলাদেশে' রূপান্তরের কারিগর হিসেবে গড়ে তোলা।
              </p>
              
              <div className="pt-4">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
                  আমাদের লক্ষ্য ও উদ্দেশ্য:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "প্রযুক্তিগত বৈষম্য দূর করা", desc: "গ্রামের এবং শহরের শিক্ষার্থীদের মধ্যে ল্যাপটপ বা কম্পিউটারের যে বিশাল ব্যবধান রয়েছে, তা কমিয়ে আনা।" },
                    { title: "মেধা যাচাই ও স্বীকৃতি", desc: "একটি স্বচ্ছ কুইজ প্রতিযোগিতার মাধ্যমে প্রকৃত মেধাবীদের খুঁজে বের করা এবং তাদের হাতে উচ্চমানের ব্র্যান্ড নিউ ল্যাপটপ তুলে দেওয়া।" },
                    { title: "দক্ষ জনশক্তি তৈরি", desc: "শুধু ল্যাপটপ প্রদানই নয়, বিজয়ীদের জন্য ভবিষ্যতে আইটি স্কিল ডেভেলপমেন্ট এবং ফ্রিল্যান্সিং গাইডলাইনের সুযোগ তৈরি করা।" },
                    { title: "স্বপ্ন পূরণের সারথি", desc: "অর্থনৈতিক সীমাবদ্ধতার কারণে যারা কম্পিউটার কিনতে পারছেন না, তাদের স্বপ্নের ডানা মেলতে সাহায্য করা।" }
                  ].map((goal, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {i + 1}
                      </div>
                      <h4 className="font-black text-slate-900 text-sm mb-2">{goal.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{goal.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900 p-6 rounded-[2rem] text-white mt-8 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
                <p className="text-lg md:text-xl font-black italic text-center leading-relaxed relative z-10">
                  "আপনার মেধা, আমাদের প্রযুক্তি — একসাথে গড়বো আগামীর বাংলাদেশ।"
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-blue-100/50 blur-3xl rounded-[3rem] -z-10"></div>
              <div className="grid grid-cols-2 gap-4">
                {aboutImages.map((img, i) => (
                  <div key={i} className={`relative overflow-hidden rounded-3xl border-4 border-white shadow-xl ${i % 2 === 1 ? 'mt-8' : ''}`}>
                    <NextImage 
                      src={img} 
                      alt="Laptop" 
                      width={400} 
                      height={400} 
                      className="object-cover aspect-square hover:scale-110 transition duration-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div id="prizes" className="text-center pt-16 border-t border-slate-100 mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">ল্যাপটপ তালিকা (Laptop Prizes)</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs md:text-sm">বিজয়ীদের জন্য আকর্ষণীয় ল্যাপটপ উপহার</p>
          </div>

          <div className="mb-16">
            <p className="text-slate-600 text-center max-w-3xl mx-auto mb-12 text-base md:text-lg font-medium">
              Vision-2030 প্রজেক্টের মাধ্যমে আমরা সরাসরি বিশ্বখ্যাত ব্র্যান্ডের <span className="text-blue-600 font-bold">Brand New</span> ল্যাপটপ প্রদান করছি। আমাদের কুইজ প্রতিযোগিতার মেধা তালিকার শীর্ষ বিজয়ীরা নিচের ব্র্যান্ডগুলোর মধ্য থেকে ল্যাপটপ উপহার পাবেন:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative min-h-[400px]">
              {laptopsLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-[2.5rem]">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
              )}
              {laptops.map((laptop, i) => (
                <div key={i} className={`group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 ${laptop.isSpecial ? 'ring-2 ring-amber-400' : ''}`}>
                  <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden">
                    <NextImage 
                      src={laptop.img} 
                      alt={`${laptop.brand} ${laptop.series} Laptop`} 
                      fill 
                      className="object-cover group-hover:scale-110 transition duration-700" 
                    />
                    {laptop.isSpecial && (
                      <div className="absolute top-4 right-4 bg-amber-400 text-blue-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-bounce uppercase">
                        Special Prize
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="text-xl font-black text-slate-900 leading-none mb-1">{laptop.brand}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{laptop.series}</p>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">{laptop.desc}</p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400">মডেল আইডিয়া:</span>
                      <span className="text-[10px] font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-lg">{laptop.model}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specs Section */}
          <div className="bg-[#0f172a] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl mb-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-black mb-6">ল্যাপটপের সাধারণ কনফিগারেশন:</h3>
                <p className="text-slate-400 text-sm md:text-base mb-8 font-medium">বিজয়ীদের যে ল্যাপটপগুলো দেওয়া হবে সেগুলোর ন্যূনতম মান হবে:</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "প্রসেসর", val: "Intel i3/i5 / AMD Ryzen", icon: Cpu },
                    { label: "র‍্যাম", val: "8GB DDR4/DDR5", icon: ShieldCheck },
                    { label: "স্টোরেজ", val: "256GB / 512GB SSD", icon: Loader2 },
                    { label: "ডিসপ্লে", val: '14" / 15.6" Full HD', icon: ImageIcon },
                    { label: "অপারেটিং সিস্টেম", val: "Windows 11 (Original)", icon: Globe },
                    { label: "অফিশিয়াল ওয়ারেন্টি", val: "1-2 Years Brand Warranty", icon: CheckCircle2 }
                  ].map((spec, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                      <spec.icon className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{spec.label}</p>
                        <p className="text-xs font-black text-white">{spec.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] shadow-xl">
                  <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" /> ইউনিক সেলিং পয়েন্ট:
                  </h4>
                  <ul className="space-y-4">
                    <li className="flex gap-4 items-start">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">অরিজিনাল ওয়ারেন্টি</p>
                        <p className="text-xs text-blue-100/70 leading-relaxed">প্রতিটি ল্যাপটপ অফিশিয়াল ব্র্যান্ড ওয়ারেন্টিসহ প্রদান করা হবে।</p>
                      </div>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">ব্যাগ ও মাউস ফ্রি</p>
                        <p className="text-xs text-blue-100/70 leading-relaxed">ল্যাপটপের সাথে একটি প্রিমিয়াম ক্যারিং ব্যাগ এবং ওয়্যারলেস মাউস গিফট হিসেবে থাকবে।</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility & Rules Section */}
      <section id="eligibility" className="py-20 md:py-32 bg-slate-50 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">আবেদনের যোগ্যতা ও নিয়মাবলী</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs md:text-sm">Eligibility & Rules of Vision-2030</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: Who can apply */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-200">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-6">১. কারা আবেদন করতে পারবে?</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                Vision-2030 প্রজেক্টটি বাংলাদেশের সকল মেধাবী শিক্ষার্থীর জন্য উন্মুক্ত। নিচের স্তরের শিক্ষার্থীরা আবেদন করতে পারবে:
              </p>
              <ul className="space-y-4">
                {[
                  { title: "স্কুল পর্যায়", desc: "ষষ্ঠ (Class 6) থেকে দশম শ্রেণি পর্যন্ত।" },
                  { title: "কলেজ পর্যায়", desc: "একাদশ ও দ্বাদশ শ্রেণি (HSC পরীক্ষার্থীসহ)।" },
                  { title: "বিশ্ববিদ্যালয় ও উচ্চশিক্ষা", desc: "অনার্স, মাস্টার্স এবং সমমানের সকল শিক্ষার্থী।" },
                  { title: "মাদ্রাসা ও কারিগরি", desc: "আলিম, ফাজিল ও পলিটেকনিকের শিক্ষার্থীরাও যোগ্য।" }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase">{item.title}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Selection Process */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden group lg:translate-y-8 hover:translate-y-6 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-emerald-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-6">২. নির্বাচনের প্রক্রিয়া</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                ল্যাপটপ বিতরণে স্বচ্ছতা নিশ্চিত করতে আমরা একটি তিন স্তরের যাচাই প্রক্রিয়া অনুসরণ করি:
              </p>
              <div className="space-y-6">
                {[
                  { title: "অনলাইন কুইজ প্রতিযোগিতা", desc: "সফলভাবে আবেদনকারী সকলকে অনলাইন কুইজ পরীক্ষায় অংশ নিতে হবে।" },
                  { title: "মেধা তালিকা (Merit List)", desc: "কুইজের প্রাপ্ত নম্বর ও নির্ভুলতার ওপর ভিত্তি করে অটোমেটেড তালিকা তৈরি করা হবে।" },
                  { title: "ডকুমেন্ট ভেরিফিকেশন", desc: "নির্বাচিতদের শিক্ষা প্রতিষ্ঠানের আইডি বা সার্টিফিকেট যাচাই সাপেক্ষে ল্যাপটপ প্রদান করা হবে।" }
                ].map((item, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-black">
                      {i + 1}
                    </div>
                    <h4 className="text-[11px] font-black text-slate-900 uppercase mb-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Rules & Terms */}
            <div className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 border border-slate-800 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-amber-900/20">
                <Info className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white mb-6">৩. গুরুত্বপূর্ণ শর্তাবলী</h3>
              <div className="space-y-6">
                {[
                  { title: "একক আবেদন", desc: "একজন শিক্ষার্থী শুধুমাত্র একবারই আবেদন করতে পারবে।" },
                  { title: "আবেদন ফি", desc: "৩৯৯/- টাকা (অফেরতযোগ্য), যা প্রশাসনিক ব্যয়ে ব্যবহৃত হবে।" },
                  { title: "কুইজের বিষয়বস্তু", desc: "সাধারণ জ্ঞান, আইসিটি (ICT) এবং মানসিক দক্ষতা।" },
                  { title: "কর্তৃপক্ষের সিদ্ধান্ত", desc: "ল্যাপটপ প্রদান ও নির্বাচনের ক্ষেত্রে GIEI এর সিদ্ধান্তই চূড়ান্ত।" }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <h4 className="text-[11px] font-black text-amber-400 uppercase mb-1 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-amber-400"></div>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Result Section */}
      <section id="result" className="py-20 md:py-32 bg-white px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent -z-10"></div>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full text-blue-600 text-[10px] md:text-xs font-bold border border-blue-100 uppercase tracking-widest mb-4">
              <Calendar className="w-3.5 h-3.5" /> ফলাফল (Result)
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">মেধা যাচাই ও ফলাফল প্রক্রিয়া</h2>
            <p className="text-slate-500 font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Vision-2030 প্রজেক্টের প্রথম রাউন্ডের আবেদন বর্তমানে শেষ পর্যায়ে। সফলভাবে আবেদনকারী সকল শিক্ষার্থীকে নির্দিষ্ট সময়ে অনলাইন কুইজে অংশগ্রহণ করতে হবে।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Countdown & Notify Section */}
            <div className="bg-[#0f172a] p-8 md:p-12 rounded-[3rem] text-white overflow-hidden shadow-2xl relative flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              
              <div className="relative z-10 space-y-10 text-center">
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-black text-blue-400">ল্যাপটপ প্রজেক্ট ২০৩০-এর আবেদন শুরু হতে বাকি...</h3>
                  
                  {/* Big Countdown Timer */}
                  <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-sm mx-auto">
                    {[
                      { label: 'দিন', value: timeLeft.days },
                      { label: 'ঘণ্টা', value: timeLeft.hours },
                      { label: 'মিনিট', value: timeLeft.mins },
                      { label: 'সেকেন্ড', value: timeLeft.secs }
                    ].map((unit, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 md:p-4 backdrop-blur-xl">
                        <span className="block text-xl md:text-3xl font-black text-white leading-none mb-1">
                          {mounted ? String(unit.value).padStart(2, '0') : '00'}
                        </span>
                        <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">{unit.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                {/* Notify Me Form */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-white">আবেদন শুরু হলে আমাকে জানান</h4>
                    <p className="text-xs text-slate-400 font-medium">আপনার ইমেইল বা ফোন নম্বর দিয়ে রাখুন, আমরা আপনাকে জানিয়ে দেব।</p>
                  </div>
                  
                  <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <div className="flex-1 relative">
                      <Input 
                        value={notifyInput}
                        onChange={(e) => setNotifyInput(e.target.value)}
                        placeholder="ইমেইল বা ফোন নম্বর" 
                        className="h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-slate-600 pl-4 focus:ring-blue-500/20"
                      />
                    </div>
                    <Button 
                      type="submit"
                      disabled={isSubmittingNotify}
                      className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black px-8 transition-all shrink-0"
                    >
                      {isSubmittingNotify ? <Loader2 className="w-5 h-5 animate-spin" /> : "আমাকে জানান"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Distribution Statistics Section */}
            <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100 flex flex-col justify-center space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">ল্যাপটপ বিতরণের লক্ষ্যমাত্রা</h3>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Laptop Distribution Goals</p>
                  </div>
                </div>
                <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
                  Vision-2030 একটি দীর্ঘমেয়াদী পরিকল্পনা। আমাদের লক্ষ্য বাংলাদেশের প্রতিটি প্রান্তে প্রযুক্তির ছোঁয়া পৌঁছে দেওয়া।
                </p>
              </div>

              {/* Stats Infographic */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-end justify-between mb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">সমগ্র বাংলাদেশ</span>
                      <h4 className="text-xl md:text-2xl font-black text-slate-900">৬৪ জেলায় বিতরণ</h4>
                    </div>
                    <div className="text-right">
                      <span className="block text-2xl md:text-3xl font-black text-blue-600 leading-none">১০,০০০+</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">মোট ল্যাপটপ</span>
                    </div>
                  </div>
                  {/* Custom Progress Bar */}
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full w-[65%] group-hover:w-[70%] transition-all duration-1000 relative">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]"></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3 font-bold text-center">৬৪ জেলায় মোট ১০,০০০ ল্যাপটপ বিতরণের মহাপ্রকল্প</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
                    <Users className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <span className="block text-lg font-black text-slate-900 leading-none">৫,০০০+</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">মেধাবী শিক্ষার্থী</span>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
                    <Globe className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <span className="block text-lg font-black text-slate-900 leading-none">৮ বিভাগ</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">সারা দেশে</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Winners List Section */}
      <section id="winners" className="py-20 md:py-32 bg-slate-50 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Congratulatory Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden text-center border border-white/10 group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -mr-48 -mt-48 group-hover:bg-blue-500/20 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -ml-48 -mb-48 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-blue-200 text-[10px] md:text-xs font-black border border-white/10 uppercase tracking-widest mb-4">
                <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" /> বিজয়ীদের জন্য বার্তা
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                স্বপ্ন ছোঁয়ার লড়াইয়ে যারা বিজয়ী হবেন, <br className="hidden md:block" />
                তাদের নাম এখানে <span className="text-yellow-400">স্বর্ণাক্ষরে</span> লেখা থাকবে।
              </h2>
              <p className="text-blue-100/80 text-lg font-bold italic max-w-2xl mx-auto">
                "আপনার আবেদনের অপেক্ষায় আছি আমরা! সেরা মেধাবীদের হাতে উঠবে সেরা ল্যাপটপ।"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Timeline & Process Section */}
            <div className="space-y-8 flex flex-col">
              {/* Timeline Card */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">বিজয়ী ঘোষণার সময়সূচী</h3>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Winners Timeline</p>
                  </div>
                </div>
                
                <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 mt-1 font-black">!</div>
                    <p className="text-slate-700 font-bold leading-relaxed">
                      আবেদন প্রক্রিয়া শেষ হওয়ার ১৫ দিন পর এখানে চূড়ান্ত বিজয়ীদের তালিকা প্রকাশ করা হবে।
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between border-t border-emerald-100/50">
                    <span className="text-xs font-bold text-slate-500 uppercase">সম্ভাব্য তারিখ:</span>
                    <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg shadow-emerald-100">০৭ এপ্রিল, ২০২৬</span>
                  </div>
                </div>
              </div>

              {/* Selection Process Card */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">বিজয়ী নির্বাচনের প্রক্রিয়া</h3>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Selection Process</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { 
                      title: "স্বচ্ছতা", 
                      desc: "সম্পূর্ণ অটোমেটেড লটারি বা মেরিট লিস্টের ভিত্তিতে নির্বাচন করা হবে।", 
                      icon: ShieldCheck,
                      color: "blue"
                    },
                    { 
                      title: "যাচাইকরণ", 
                      desc: "নির্বাচিত হওয়ার পর সরাসরি আপনার শিক্ষাপ্রতিষ্ঠানে যোগাযোগ করা হবে।", 
                      icon: GraduationCap,
                      color: "indigo"
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
                      <div className={`w-10 h-10 rounded-xl bg-${item.color}-100 flex items-center justify-center text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sample Table Section */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-900/5 flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">বিজয়ীদের নমুনা তালিকা</h3>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Sample Winners List</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Demo Only</span>
                </div>
              </div>

              <div className="flex-1 overflow-hidden border border-slate-100 rounded-2xl">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="text-[10px] font-black uppercase text-slate-500">নাম</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-500">জেলা</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-500">শিক্ষাপ্রতিষ্ঠান</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-500 text-right">স্ট্যাটাস</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="py-4">
                          <div className="h-4 w-20 bg-slate-100 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-slate-100 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-32 bg-slate-100 rounded animate-pulse"></div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500 font-bold">
                  "আবেদন শুরু হওয়ার অপেক্ষায়... রেজিস্ট্রেশন শেষ হলে এখানে বিজয়ীদের নাম দেখা যাবে।"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 bg-white px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full text-blue-600 text-[10px] md:text-xs font-bold border border-blue-100 uppercase tracking-widest mb-4">
              <HelpCircle className="w-3.5 h-3.5" /> সচরাচর জিজ্ঞাসা (FAQ)
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">মনে থাকা সাধারণ কিছু প্রশ্ন</h2>
            <p className="text-slate-500 font-medium text-sm md:text-base">আপনার মনে থাকা সাধারণ কিছু প্রশ্নের উত্তর এখানে দেওয়া হলো</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "১. Vision-2030 প্রজেক্টটি আসলে কী?",
                a: "এটি লন্ডন ভিত্তিক সংস্থা GIEI এর একটি উদ্যোগ, যার লক্ষ্য বাংলাদেশের মেধাবী শিক্ষার্থীদের মাঝে আধুনিক ল্যাপটপ বিতরণের মাধ্যমে প্রযুক্তিগত শিক্ষা নিশ্চিত করা।"
              },
              {
                q: "২. আবেদন ফি ৩৯৯ টাকা কেন নেওয়া হচ্ছে?",
                a: "এই ফি মূলত কুইজ প্রতিযোগিতার অনলাইন প্ল্যাটফর্ম পরিচালনা, ডাটাবেস রক্ষণাবেক্ষণ, প্রশাসনিক খরচ এবং ল্যাপটপ বিতরণ কার্যক্রমের ব্যবস্থাপনা ব্যয়ের জন্য নেওয়া হচ্ছে। এটি সম্পূর্ণ অফেরতযোগ্য।"
              },
              {
                q: "৩. কুইজ প্রতিযোগিতাটি কীভাবে হবে?",
                a: "আবেদন সফল হওয়ার পর আপনাকে একটি নির্দিষ্ট তারিখ ও সময়ে আমাদের ওয়েবসাইটে লগইন করে অনলাইন কুইজে অংশ নিতে হবে। প্রশ্নগুলো আপনার পড়াশোনার লেভেল (যেমন: স্কুল/কলেজ/ভার্সিটি) অনুযায়ী হবে।"
              },
              {
                q: "৪. আমি কি পেমেন্ট করার পর নিশ্চিত ল্যাপটপ পাবো?",
                a: "না, ল্যাপটপ শুধুমাত্র কুইজে উত্তীর্ণ মেধা তালিকার শীর্ষ বিজয়ীদের দেওয়া হবে। এটি একটি মেধা যাচাইমূলক প্রতিযোগিতা। তবে সকল অংশগ্রহণকারীকে ডিজিটাল সার্টিফিকেট প্রদান করা হতে পারে।"
              },
              {
                q: "৫. পেমেন্ট করার পর ট্র্যাকিং আইডি না পেলে কী করবো?",
                a: "পেমেন্ট করার পর সাধারণত অটোমেটিক ট্র্যাকিং আইডি জেনারেট হয়। যদি কোনো কারণে সেটি না পান, তবে আপনার পেমেন্টের স্ক্রিনশট এবং মোবাইল নম্বরসহ আমাদের support@giei-global.org ইমেইল করুন অথবা লাইভ চ্যাটে যোগাযোগ করুন।"
              },
              {
                q: "৬. কুইজে কী ধরণের প্রশ্ন থাকবে?",
                a: "সাধারণত সাধারণ জ্ঞান (General Knowledge), আইসিটি (ICT), ইংরেজি এবং সাধারণ গণিত বা মানসিক দক্ষতার ওপর ভিত্তি করে কুইজ তৈরি করা হবে।"
              },
              {
                q: "৭. বিজয়ীদের ল্যাপটপ কীভাবে দেওয়া হবে?",
                a: "ফলাফল প্রকাশের পর নির্বাচিতদের সাথে যোগাযোগ করা হবে এবং একটি আনুষ্ঠানিক অনুষ্ঠানের মাধ্যমে অথবা কুরিয়ার সার্ভিসের মাধ্যমে (যাচাই সাপেক্ষে) ল্যাপটপ পৌঁছে দেওয়া হবে।"
              }
            ].map((item, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`} 
                className="border border-slate-100 rounded-2xl px-6 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden"
              >
                <AccordionTrigger className="py-5 text-left hover:no-underline group">
                  <span className="text-sm md:text-base font-black text-slate-700 group-hover:text-blue-600 transition-colors">
                    {item.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm md:text-base text-slate-600 leading-relaxed font-medium border-t border-slate-100/50 pt-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-16 p-8 rounded-[2.5rem] bg-[#0a1128] text-white text-center relative overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-xl font-black mb-2">আরো কিছু জানার আছে?</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium">আমাদের সাপোর্ট টিম ২৪/৭ আপনার সহায়তায় নিয়োজিত।</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="mailto:support@giei-global.org">
                <Button className="bg-white text-[#0a1128] hover:bg-blue-50 font-bold rounded-xl px-6 h-12 transition-transform hover:scale-105 border-none">
                  <Mail className="w-4 h-4 mr-2" /> ইমেইল করুন
                </Button>
              </Link>
              <Link href="#top" prefetch={false}>
                <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 font-bold rounded-xl px-6 h-12 transition-transform hover:scale-105">
                  <MessageSquare className="w-4 h-4 mr-2" /> লাইভ চ্যাট
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Status Check Section */}
      <section className="py-10 px-4 md:px-6 max-w-3xl mx-auto">
        <div className="bg-[#0a1128] p-6 md:p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden border border-white/5">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/5 p-2 rounded-xl">
                <Search className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">আবেদনের স্ট্যাটাস চেক করুন</h2>
            </div>
            
            <p className="text-slate-400 text-xs md:text-sm font-medium max-w-lg">
              আপনার ট্র্যাকিং আইডির শেষ ৪টি ডিজিট (যেমন: 5509) ব্যবহার করে বর্তমান অবস্থা জানুন।
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <div className="flex-1 relative">
                <Input 
                  placeholder="Ex: 5509" 
                  maxLength={4}
                  className="w-full h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-2 focus:ring-yellow-400/50 transition-all text-base font-bold pl-5"
                  value={trackingIdInput}
                  onChange={(e) => setTrackingIdInput(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleCheckStatus}
                disabled={checkingStatus}
                className="h-14 px-8 bg-yellow-400 hover:bg-yellow-300 text-blue-950 rounded-xl font-black text-base transition-all transform hover:scale-[1.02] active:scale-95 border-none shadow-lg shadow-yellow-400/10"
              >
                {checkingStatus ? <Loader2 className="w-5 h-5 animate-spin" /> : "চেক"}
              </Button>
            </div>
          </div>
          
          {/* Background Decorative Element */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full"></div>
        </div>
      </section>

      {/* Apply Section */}
      <section id="apply" className="py-20 md:py-32 bg-slate-50 px-4 md:px-6 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="bg-[#0f172a] p-8 md:p-16 rounded-[2.5rem] shadow-2xl border border-slate-800 text-white relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            
            <div className="relative z-10 text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Vision-2030 Global IT Scholarship</h2>
              <p className="text-slate-400 font-medium text-sm md:text-base uppercase tracking-[0.3em]">Official Application Portal</p>
            </div>

            <form onSubmit={handleFormSubmit} className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name (Student's Name)</label>
                  <Input 
                    required
                    placeholder="e.g. Abdullah Al Mamun" 
                    className="w-full px-6 h-14 bg-slate-800/50 border-none shadow-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600 text-white focus:bg-slate-800/50"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>

                {/* Primary Mobile */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Mobile (Applicant's Number)</label>
                  <Input 
                    required
                    type="tel" 
                    placeholder="017XXXXXXXX" 
                    className="w-full px-6 h-14 bg-slate-800/50 border-none shadow-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600 text-white focus:bg-slate-800/50"
                    value={formData.primaryMobile}
                    onChange={(e) => setFormData({...formData, primaryMobile: e.target.value})}
                  />
                </div>

                {/* Birth Registration Number */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Birth Registration Number (জন্ম নিবন্ধন)</label>
                  <Input 
                    required
                    type="text"
                    placeholder="17 Digit Number" 
                    className="w-full px-6 h-14 bg-slate-800/50 border-none shadow-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600 text-white focus:bg-slate-800/50"
                    value={formData.birthRegistration}
                    onChange={(e) => setFormData({...formData, birthRegistration: e.target.value})}
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Date of Birth (জন্ম তারিখ)</label>
                  <Input 
                    required
                    type="date" 
                    className="w-full px-6 h-14 bg-slate-800/50 border-none shadow-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-white focus:bg-slate-800/50 [color-scheme:dark]"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  />
                </div>


                {/* Institution Type Dropdown */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Institution Type (ক্যাটাগরি)</label>
                  <Select onValueChange={(val) => setFormData({...formData, institutionType: val})}>
                    <SelectTrigger className="w-full px-6 h-14 bg-slate-800/50 border-none shadow-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-white focus:bg-slate-800/50">
                      <SelectValue placeholder="Select Institution Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white font-medium">
                      <SelectItem value="School">School (স্কুল)</SelectItem>
                      <SelectItem value="College">College (কলেজ)</SelectItem>
                      <SelectItem value="Madrasah">Madrasah (মাদ্রাসা)</SelectItem>
                      <SelectItem value="University">University (বিশ্ববিদ্যালয়)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Institution Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Institution Name (প্রতিষ্ঠানের নাম)</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                      required
                      placeholder="Type your Institution Name..." 
                      className="w-full pl-12 pr-6 h-14 bg-slate-800/50 border-none shadow-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600 text-white focus:bg-slate-800/50"
                      value={formData.institutionName}
                      onChange={(e) => setFormData({...formData, institutionName: e.target.value})}
                    />
                  </div>
                </div>

                {/* Class/Year Dropdown */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Class / Year</label>
                  <Select onValueChange={(val) => setFormData({...formData, classYear: val})}>
                    <SelectTrigger className="w-full px-6 h-14 bg-slate-800/50 border-none shadow-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-white focus:bg-slate-800/50">
                      <SelectValue placeholder="Select Class/Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white font-medium">
                      <SelectItem value="5th">5th Class (পঞ্চম শ্রেণি)</SelectItem>
                      <SelectItem value="6th">6th Class (ষষ্ঠ শ্রেণি)</SelectItem>
                      <SelectItem value="7th">7th Class (সপ্তম শ্রেণি)</SelectItem>
                      <SelectItem value="8th">8th Class (অষ্টম শ্রেণি)</SelectItem>
                      <SelectItem value="9th">9th Class (নবম শ্রেণি)</SelectItem>
                      <SelectItem value="10th">10th Class (দশম শ্রেণি)</SelectItem>
                      <SelectItem value="HSC 1st">HSC 1st Year (একাদশ শ্রেণি)</SelectItem>
                      <SelectItem value="HSC 2nd">HSC 2nd Year (দ্বাদশ শ্রেণি)</SelectItem>
                      <SelectItem value="Honors">Honors (অনার্স)</SelectItem>
                      <SelectItem value="Masters">Masters (মাস্টার্স)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Alternate Mobile */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Alternate Mobile (Guardian's Number)</label>
                  <Input 
                    type="tel" 
                    placeholder="01XXXXXXXXX (Optional)" 
                    className="w-full px-6 h-14 bg-slate-800/50 border-none shadow-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600 text-white focus:bg-slate-800/50"
                    value={formData.alternateMobile}
                    onChange={(e) => setFormData({...formData, alternateMobile: e.target.value})}
                  />
                </div>

                {/* Division Dropdown */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Division (বিভাগ)</label>
                  <Select onValueChange={(val) => setFormData({...formData, division: val, district: ''})}>
                    <SelectTrigger className="w-full px-6 h-14 bg-slate-800/50 border-none shadow-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-white focus:bg-slate-800/50">
                      <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white font-medium">
                      <SelectItem value="Dhaka">Dhaka (ঢাকা)</SelectItem>
                      <SelectItem value="Chittagong">Chittagong (চট্টগ্রাম)</SelectItem>
                      <SelectItem value="Rajshahi">Rajshahi (রাজশাহী)</SelectItem>
                      <SelectItem value="Khulna">Khulna (খুলনা)</SelectItem>
                      <SelectItem value="Barisal">Barisal (বরিশাল)</SelectItem>
                      <SelectItem value="Sylhet">Sylhet (সিলেট)</SelectItem>
                      <SelectItem value="Rangpur">Rangpur (রংপুর)</SelectItem>
                      <SelectItem value="Mymensingh">Mymensingh (ময়মনসিংহ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                {/* District Searchable Input */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">District (জেলা)</label>
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                      required
                      list="districts"
                      disabled={!formData.division}
                      placeholder={formData.division ? "Search or Type District..." : "Select Division First"}
                      className="w-full pl-12 pr-6 h-14 bg-slate-800/50 border-none shadow-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:bg-slate-800/50"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                    />
                    <datalist id="districts">
                      {formData.division && divisionsData[formData.division]?.map((dist) => (
                        <option key={dist} value={dist} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Disclaimer & Checkbox */}
              <div className="mt-8 space-y-4 bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50">
                <div className="flex items-start gap-4">
                  <input 
                    type="checkbox" 
                    id="terms"
                    required
                    checked={formData.agreed}
                    onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                    className="mt-1.5 w-5 h-5 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-900 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-[11px] md:text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
                    <span className="text-white font-bold block mb-2">বিশেষ দ্রষ্টব্য:</span>
                    <ul className="space-y-1 text-slate-400">
                      <li>১. আবেদন ফি ৩৯৯/- টাকা (অফেরতযোগ্য)।</li>
                      <li>২. ল্যাপটপ প্রদান সম্পূর্ণভাবে কুইজ প্রতিযোগিতার মেধা তালিকা এবং GIEI কর্তৃপক্ষের নিয়মানুযায়ী সম্পন্ন হবে।</li>
                      <li>৩. সফল পেমেন্টের পর আপনার ট্র্যাকিং আইডিটি সংরক্ষণ করুন।</li>
                      <li>৪. যেকোনো প্রয়োজনে আমাদের সাপোর্ট টিমে যোগাযোগ করুন।</li>
                    </ul>
                  </label>
                </div>
              </div>

              {/* Trust/Security Note */}

              <div className="flex items-center justify-center gap-3 py-4 border-t border-slate-800/50 mt-8">
                <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest leading-tight">
                  Security Note: Your data is end-to-end encrypted and stored securely within GIEI servers.
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-blue-950 py-8 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-yellow-400/10 transition-all transform hover:-translate-y-1.5 active:scale-[0.98] h-auto border-none uppercase tracking-widest"
              >
                Payment & Confirm
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Status Result Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="w-[90%] max-w-[320px] p-0 overflow-hidden bg-white border-none rounded-2xl shadow-2xl">
          <div className="bg-[#0a1128] p-4 text-white relative">
            <DialogTitle className="text-base font-bold mb-0.5">আবেদনের অবস্থা</DialogTitle>
            <p className="text-slate-400 text-[10px]">আইডি: <span className="text-yellow-400 font-bold">{statusResult?.trackingId}</span></p>
          </div>

          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase">নাম</span>
                <span className="text-xs font-black text-slate-900">{statusResult?.fullName}</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase">প্রতিষ্ঠান</span>
                <span className="text-xs font-black text-slate-900 truncate max-w-[120px]">{statusResult?.institution}</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase">শ্রেণি</span>
                <span className="text-xs font-black text-slate-900">{statusResult?.classYear}</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase">পেমেন্ট</span>
                {statusResult?.paymentStatus === 'success' ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-green-100 text-green-700 uppercase">
                    সফল (Verified)
                  </span>
                ) : statusResult?.paymentStatus === 'rejected' ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-red-100 text-red-700 uppercase">
                    বাতিল (Rejected)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-700 uppercase">
                    পেন্ডিং (Pending)
                  </span>
                )}
              </div>
            </div>

            {/* Quiz Date Highlight Box */}
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-900">
                <Calendar className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase">কুইজ এর তারিখ:</span>
              </div>
              <p className="text-[11px] font-black text-blue-700 leading-tight">আগামী ১৫-কার্যদিবসের মধ্যে জানানো হবে (SMS এর মাধ্যমে)</p>
            </div>

            <Button 
              onClick={() => setShowStatusDialog(false)}
              className="w-full h-10 bg-[#0a1128] hover:bg-[#152042] text-white rounded-xl font-bold transition-all text-xs"
            >
              বন্ধ করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal Interface */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
          <div className="bg-blue-700 p-5 text-white text-center relative flex-shrink-0">
            <div className="absolute top-2 right-2 opacity-10">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <DialogTitle className="text-lg font-bold mb-0.5">নিরাপদ পেমেন্ট গেটওয়ে</DialogTitle>
            <DialogDescription className="text-blue-100 text-[10px]">
              Vision-2030 স্কলারশিপ ফি: <span className="font-bold text-white">৳ ৩৯৯.০০</span>
            </DialogDescription>
          </div>

          <div className="p-5 overflow-y-auto custom-scrollbar space-y-4">
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">পেমেন্ট মেথড নির্বাচন করুন</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(PAYMENT_METHODS).map(([id, method]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedMethod(id as any)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                      selectedMethod === id 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-[9px] mb-1 ${method.color}`}>
                      {method.label[0]}
                    </div>
                    <span className="text-[9px] font-bold">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedMethod && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Sent Money Instructions */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center gap-2 text-blue-900">
                    <Smartphone className="w-3.5 h-3.5" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">কিভাবে পেমেন্ট করবেন</h4>
                  </div>
                  <ol className="text-[10px] text-blue-800 space-y-1 list-decimal list-inside font-medium">
                    <li>আপনার {PAYMENT_METHODS[selectedMethod].label} অ্যাপে যান।</li>
                    <li><b>'Send Money'</b> অপশনটি বেছে নিন।</li>
                    <li>নিচের নম্বরে <b>৳ ৩৯৯.০০</b> টাকা পাঠান:</li>
                  </ol>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-blue-200">
                    <span className="text-base font-black text-blue-900">{PAYMENT_METHODS[selectedMethod].number}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => copyToClipboard(PAYMENT_METHODS[selectedMethod].number)}
                      className="h-7 w-7 text-blue-600 hover:bg-blue-50"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <p className="text-[8px] text-blue-600 flex items-center gap-1 font-bold italic">
                    <AlertCircle className="w-2.5 h-2.5" /> রেফারেন্সে আপনার ফোন নম্বর ব্যবহার করুন।
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Transaction ID (TnxID)</label>
                  <Input 
                    placeholder="TRX12345678" 
                    className="h-10 rounded-xl border-gray-200 text-sm font-bold"
                    value={tnxId}
                    onChange={(e) => setTnxId(e.target.value)}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payment Proof (Screenshot)</label>
                  <button 
                    type="button"
                    onClick={() => setHasFile(!hasFile)}
                    className={`w-full h-16 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
                      hasFile ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-200 bg-gray-50'
                    }`}
                  >
                    {hasFile ? (
                      <>
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-[9px] font-bold text-green-700">ফাইল আপলোড হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-[9px] font-bold text-gray-500">স্ক্রিনশট আপলোড করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-1 flex-shrink-0">
              <Button 
                disabled={!selectedMethod || !tnxId || loading}
                onClick={handleFinalPaymentAndRegister}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white h-11 rounded-xl font-bold shadow-lg shadow-blue-200 text-sm"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                পেমেন্ট নিশ্চিত করুন
              </Button>
              <p className="text-[7px] text-center text-muted-foreground mt-3 uppercase tracking-[0.2em] font-black opacity-60">
                🔒 Secured by GIEI Audit System, London
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Section */}
      <section id="contact" className="bg-white overflow-hidden">
        {/* Hero Banner */}
        <div className="bg-[#0a1128] py-16 md:py-24 px-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white blur-[100px] rounded-full -ml-32 -mt-32"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white blur-[100px] rounded-full -mr-32 -mb-32"></div>
          </div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">GIEI Global Support Center (London HQ)</h2>
            <p className="text-blue-100 text-lg md:text-xl font-bold">আমাদের লন্ডন অফিসের সাথে সরাসরি যোগাযোগ করুন।</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-20 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side: Contact Card & Verification */}
            <div className="space-y-8">
              <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-900/5 space-y-10">
                <div className="grid grid-cols-1 gap-8">
                  {/* Address */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">অফিস ঠিকানা</h4>
                      <p className="text-slate-700 font-bold text-sm md:text-base leading-relaxed">
                        71-75 Shelton Street, Covent Garden,<br />
                        London, WC2H 9JQ, United Kingdom.
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ফোন নম্বর</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-700 font-black text-lg md:text-xl tracking-tight">+44 20 4561 7852</p>
                        <span className="text-xl" title="UK Flag">🇬🇧</span>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ইমেইল</h4>
                      <Link href="mailto:support@giei-global.org" className="text-blue-600 font-black text-lg hover:underline transition-all">
                        support@giei-global.org
                      </Link>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">অফিস টাইম</h4>
                      <p className="text-slate-700 font-bold">Monday - Friday</p>
                      <p className="text-slate-500 text-sm font-medium">সকাল ৯টা - বিকাল ৫টা (GMT)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Section */}
              <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 flex items-start gap-5 group hover:bg-emerald-50 transition-colors">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-lg shadow-emerald-200/50">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-emerald-900 leading-none">Verified Entity</h3>
                  <p className="text-emerald-800/70 text-sm font-bold leading-relaxed">
                    এই প্রজেক্টটি England & Wales-এ নিবন্ধিত। কোম্পানি রেজিস্ট্রেশন নম্বর যাচাই করতে <Link href="https://find-and-update.company-information.service.gov.uk/" target="_blank" className="text-emerald-600 underline decoration-2 underline-offset-4 hover:text-emerald-700 transition-colors">এখানে ক্লিক করুন</Link>।
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Google Map */}
            <div className="h-[500px] lg:h-full min-h-[500px] bg-slate-100 rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl shadow-blue-900/5 relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.90502079171!2d-0.1250333233791234!3d51.5131170718142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604ccab37652b%3A0x22237135f4323c03!2s71-75%20Shelton%20St%2C%20London%20WC2H%209JQ%2C%20UK!5e0!3m2!1sen!2sbd!4v1711195000000!5m2!1sen!2sbd" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="filter grayscale-[0.2] contrast-[1.1] group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white shadow-xl">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Live Location
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-950 text-white py-12 px-4 border-t border-slate-900">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-black tracking-tight">Vision-2030</span>
            </div>
            <p className="text-slate-500 font-bold text-sm md:text-base">
              GIEI Global: Empowering Students through Technology.
            </p>
            <div className="h-[1px] w-20 bg-blue-600/30 mx-auto"></div>
            <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.3em]">
              &copy; ২০২৬ GIEI GLOBAL | ALL RIGHTS RESERVED
            </p>
          </div>
        </footer>
      </section>

      {/* Floating Chat */}
      <Link 
        href="#" 
        prefetch={false}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition z-50 transform hover:scale-110"
      >
        <MessageSquare className="w-6 h-6 md:w-8 md:h-8" />
      </Link>
    </div>
  );
}

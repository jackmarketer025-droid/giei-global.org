"use client";

import { useEffect, useState } from 'react';
import { GraduationCap, Laptop, Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500); // Increased time for a smoother, slower animation experience
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-50/98 backdrop-blur-xl animate-in fade-in duration-700">
      <div className="relative flex flex-col items-center max-w-md w-full px-6">
        
        {/* Animation Container */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-10">
          
          {/* Laptop Base (Static) */}
          <div className="absolute bottom-12 w-32 h-2.5 bg-[#0a1128] rounded-full shadow-lg z-10"></div>
          <div className="absolute bottom-11 w-36 h-1 bg-[#0a1128]/20 blur-sm rounded-full"></div>
          
          {/* Laptop Screen (Opening Animation) */}
          <div className="absolute bottom-[54px] w-28 h-20 bg-[#2563EB] rounded-lg border-[3px] border-[#0a1128] flex items-center justify-center overflow-hidden origin-bottom shadow-2xl z-20 animate-[laptopOpen_2s_ease-in-out_forwards]">
            {/* Blinking Data Processing Icon */}
            <div className="relative flex flex-col items-center gap-1.5">
              <div className="w-3 h-3 bg-white rounded-full animate-[blink_1.5s_infinite] shadow-[0_0_15px_rgba(255,255,255,0.9)]"></div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1 bg-white/40 rounded-full animate-pulse"></div>
                <div className="w-3 h-1 bg-white/60 rounded-full animate-pulse delay-75"></div>
                <div className="w-1.5 h-1 bg-white/40 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
            
            {/* Screen Glare */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none"></div>
          </div>

          {/* Graduation Cap (Flying Animation) */}
          <div className="absolute z-30 opacity-0 scale-150 animate-[capFlyIn_1.2s_cubic-bezier(0.34,1.56,0.64,1)_2.2s_forwards]">
            <div className="relative">
              <GraduationCap className="w-16 h-16 text-[#0a1128] drop-shadow-2xl fill-[#0a1128]/10" strokeWidth={1.5} />
              {/* Tassel detail */}
              <div className="absolute right-2 top-8 w-1 h-6 bg-yellow-500 rounded-full opacity-80 animate-bounce"></div>
            </div>
          </div>
        </div>

        {/* Loading Message & Branding */}
        <div className="text-center space-y-4 animate-[fadeInUp_1s_ease-out_0.5s_both]">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-[#0a1128] tracking-tight">
              GIEI ল্যাপটপ স্কলারশিপ
            </h2>
            <div className="h-1 w-20 bg-[#2563EB] mx-auto rounded-full"></div>
          </div>

          <div className="space-y-2">
            <p className="text-[#2563EB] font-bold text-lg md:text-xl animate-pulse">
              আপনার স্বপ্ন ছোঁয়ার পথে...
            </p>
            <p className="text-slate-500 font-medium text-sm md:text-base italic">
              "ভবিষ্যৎ গড়ার প্রস্তুতি চলছে..."
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-6">
            <div className="relative">
              <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
              <div className="absolute inset-0 bg-[#2563EB]/20 blur-lg rounded-full animate-pulse"></div>
            </div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-400">
              Processing Data
            </span>
          </div>
        </div>
      </div>

      {/* Tailwind Animations Definitions */}
      <style jsx global>{`
        @keyframes laptopOpen {
          0% { 
            transform: perspective(1000px) rotateX(-105deg); 
            opacity: 0;
            filter: brightness(0.5);
          }
          100% { 
            transform: perspective(1000px) rotateX(0deg); 
            opacity: 1;
            filter: brightness(1);
          }
        }
        @keyframes capFlyIn {
          0% { 
            transform: translateY(-150px) translateX(-50px) rotate(-45deg) scale(2); 
            opacity: 0; 
          }
          70% {
            opacity: 1;
          }
          100% { 
            transform: translateY(-45px) translateX(0) rotate(0deg) scale(1); 
            opacity: 1; 
          }
        }
        @keyframes fadeInUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}

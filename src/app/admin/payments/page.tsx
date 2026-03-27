
"use client";

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search,
  Loader2,
  CreditCard,
  Smartphone,
  Save
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PaymentsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [savingNumbers, setSavingNumbers] = useState(false);
  
  // Payment numbers and logos state
  const [numbers, setNumbers] = useState({
    bkash_no: '',
    nagad_no: '',
    rocket_no: '',
    bkash_logo: '',
    nagad_logo: '',
    rocket_logo: ''
  });

  // Fetch current numbers and logos
  useEffect(() => {
    const fetchNumbers = async () => {
      if (!firestore) return;
      try {
        const snap = await getDoc(doc(firestore, 'app_settings', 'payment_methods'));
        if (snap.exists()) {
          const data = snap.data();
          setNumbers({
            bkash_no: data.bkash_no || '',
            nagad_no: data.nagad_no || '',
            rocket_no: data.rocket_no || '',
            bkash_logo: data.bkash_logo || '',
            nagad_logo: data.nagad_logo || '',
            rocket_logo: data.rocket_logo || ''
          });
        }
      } catch (error) {
        console.error("Error fetching numbers:", error);
      }
    };
    fetchNumbers();
  }, [firestore]);

  const handleUpdateNumbers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    setSavingNumbers(true);
    try {
      await setDoc(doc(firestore, 'app_settings', 'payment_methods'), numbers, { merge: true });
      toast({
        title: "Settings Updated",
        description: "Payment numbers and logos have been updated globally.",
      });
    } catch (error) {
      console.error("Error updating numbers:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings.",
      });
    } finally {
      setSavingNumbers(false);
    }
  };

  const submissionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'payment_submissions'), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: submissions, isLoading } = useCollection(submissionsQuery);

  const filteredSubmissions = submissions?.filter(sub => 
    sub.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.trxId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.senderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.applicationId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStatus = async (submissionId: string, applicationId: string, newStatus: 'success' | 'rejected') => {
    if (!firestore) return;
    setUpdatingId(submissionId);
    try {
      // 1. Update payment_submissions
      await updateDoc(doc(firestore, 'payment_submissions', submissionId), {
        status: newStatus
      });

      // 2. Update applications
      await updateDoc(doc(firestore, 'applications', applicationId), {
        paymentStatus: newStatus
      });

      toast({
        title: "Payment Verified",
        description: `Status set to ${newStatus}. Application updated.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update payment status.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">পেমেন্ট ম্যানেজমেন্ট (Payment Management)</h1>
        <p className="text-slate-600 font-medium">নম্বর আপডেট করুন এবং পেমেন্ট ভেরিফাই করুন।</p>
      </div>

      {/* Manage Numbers Section */}
      <Card className="border-none shadow-2xl bg-[#0f172a] text-white rounded-[2.5rem] overflow-hidden relative group">
        {/* Neon Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-blue-600/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full -ml-32 -mb-32 group-hover:bg-indigo-600/20 transition-all duration-700"></div>
        
        <CardHeader className="relative z-10 border-b border-white/5 bg-white/5 backdrop-blur-sm">
          <CardTitle className="flex items-center gap-2 text-xl font-black">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Smartphone className="w-5 h-5 text-blue-400" />
            </div>
            পেমেন্ট মেথড ও নম্বর ম্যানেজমেন্ট (Manage Payment Gateways)
          </CardTitle>
          <CardDescription className="text-blue-200/50 font-medium">
            বিকাশ, নগদ এবং রকেট নম্বর ও লোগো লিঙ্ক (Cloudinary) এখান থেকে পরিবর্তন করুন।
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 p-8">
          <form onSubmit={handleUpdateNumbers} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* bKash Settings */}
              <div className="space-y-4 p-6 rounded-3xl bg-white/5 border border-white/10 group/item hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E2136E] flex items-center justify-center text-white font-black text-xs">B</div>
                  <h3 className="font-black text-blue-400 uppercase tracking-widest text-sm">bKash Settings</h3>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Bkash Number</label>
                  <Input 
                    value={numbers.bkash_no}
                    onChange={(e) => setNumbers({...numbers, bkash_no: e.target.value})}
                    placeholder="01XXXXXXXXX"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl h-12 focus:ring-2 focus:ring-[#E2136E]/50 focus:border-[#E2136E]/50 transition-all px-4 font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Bkash Logo Link (Cloudinary)</label>
                  <Input 
                    value={numbers.bkash_logo}
                    onChange={(e) => setNumbers({...numbers, bkash_logo: e.target.value})}
                    placeholder="https://res.cloudinary.com/..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl h-12 focus:ring-2 focus:ring-[#E2136E]/50 focus:border-[#E2136E]/50 transition-all px-4 text-xs"
                  />
                </div>
              </div>

              {/* Nagad Settings */}
              <div className="space-y-4 p-6 rounded-3xl bg-white/5 border border-white/10 group/item hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#F15A22] flex items-center justify-center text-white font-black text-xs">N</div>
                  <h3 className="font-black text-orange-400 uppercase tracking-widest text-sm">Nagad Settings</h3>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nagad Number</label>
                  <Input 
                    value={numbers.nagad_no}
                    onChange={(e) => setNumbers({...numbers, nagad_no: e.target.value})}
                    placeholder="01XXXXXXXXX"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl h-12 focus:ring-2 focus:ring-[#F15A22]/50 focus:border-[#F15A22]/50 transition-all px-4 font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nagad Logo Link (Cloudinary)</label>
                  <Input 
                    value={numbers.nagad_logo}
                    onChange={(e) => setNumbers({...numbers, nagad_logo: e.target.value})}
                    placeholder="https://res.cloudinary.com/..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl h-12 focus:ring-2 focus:ring-[#F15A22]/50 focus:border-[#F15A22]/50 transition-all px-4 text-xs"
                  />
                </div>
              </div>

              {/* Rocket Settings */}
              <div className="space-y-4 p-6 rounded-3xl bg-white/5 border border-white/10 group/item hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#8C3494] flex items-center justify-center text-white font-black text-xs">R</div>
                  <h3 className="font-black text-purple-400 uppercase tracking-widest text-sm">Rocket Settings</h3>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Rocket Number</label>
                  <Input 
                    value={numbers.rocket_no}
                    onChange={(e) => setNumbers({...numbers, rocket_no: e.target.value})}
                    placeholder="01XXXXXXXXX"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl h-12 focus:ring-2 focus:ring-[#8C3494]/50 focus:border-[#8C3494]/50 transition-all px-4 font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Rocket Logo Link (Cloudinary)</label>
                  <Input 
                    value={numbers.rocket_logo}
                    onChange={(e) => setNumbers({...numbers, rocket_logo: e.target.value})}
                    placeholder="https://res.cloudinary.com/..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl h-12 focus:ring-2 focus:ring-[#8C3494]/50 focus:border-[#8C3494]/50 transition-all px-4 text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={savingNumbers}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl px-10 h-14 shadow-xl shadow-blue-600/20 transition-all transform hover:-translate-y-1 active:scale-95 border-none uppercase tracking-widest text-sm"
              >
                {savingNumbers ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Verify Payments Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            পেমেন্ট ভেরিফিকেশন (Verify Submissions)
          </h2>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="নাম, TxID বা ফোন নম্বর দিয়ে খুঁজুন..." 
              className="pl-11 h-12 bg-white border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5 pl-8">আবেদনকারী (Applicant)</TableHead>
                <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">পেমেন্ট ডিটেইলস (Details)</TableHead>
                <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">ট্রানজেকশন আইডি (TxID)</TableHead>
                <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">অবস্থা (Status)</TableHead>
                <TableHead className="text-right font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5 pr-8">অ্যাকশন (Actions)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-500">পেমেন্ট সাবমিশন লোড হচ্ছে...</p>
                  </TableCell>
                </TableRow>
              ) : filteredSubmissions?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <CreditCard className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-500">কোন পেমেন্ট রেকর্ড পাওয়া যায়নি।</p>
                  </TableCell>
                </TableRow>
              ) : filteredSubmissions?.map((sub) => (
                <TableRow key={sub.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="pl-8 py-5">
                    <div>
                      <p className="font-black text-sm text-slate-900 tracking-tight">{sub.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-bold">{sub.phone}</p>
                      <code className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block text-slate-500">{sub.applicationId}</code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className={`rounded-lg font-black text-[9px] px-2 py-0.5 uppercase ${
                          sub.method === 'bkash' ? 'bg-[#E2136E]/10 text-[#E2136E]' : 
                          sub.method === 'nagad' ? 'bg-[#F15A22]/10 text-[#F15A22]' : 
                          'bg-[#8C3494]/10 text-[#8C3494]'
                        }`}>
                          {sub.method}
                        </Badge>
                        <span className="text-[11px] font-black text-slate-700">৳{sub.amount}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Smartphone className="w-3 h-3" /> From: {sub.senderNumber}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-black text-blue-600 font-mono tracking-wider bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">{sub.trxId}</span>
                  </TableCell>
                  <TableCell>
                    {sub.status === 'success' ? (
                      <Badge className="rounded-full bg-emerald-100 text-emerald-700 border-emerald-200 font-black text-[9px] px-3 py-1 uppercase tracking-tighter">
                        Verified
                      </Badge>
                    ) : sub.status === 'rejected' ? (
                      <Badge className="rounded-full bg-red-100 text-red-700 border-red-200 font-black text-[9px] px-3 py-1 uppercase tracking-tighter">
                        Rejected
                      </Badge>
                    ) : (
                      <Badge className="rounded-full bg-amber-100 text-amber-700 border-amber-200 font-black text-[9px] px-3 py-1 uppercase tracking-tighter animate-pulse">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2">
                      {updatingId === sub.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      ) : (
                        <>
                          <Button 
                            onClick={() => handleUpdateStatus(sub.id, sub.applicationId, 'success')}
                            disabled={sub.status === 'success'}
                            size="sm" 
                            className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 px-4 shadow-lg shadow-emerald-600/10 border-none"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-black">Approve</span>
                          </Button>
                          <Button 
                            onClick={() => handleUpdateStatus(sub.id, sub.applicationId, 'rejected')}
                            disabled={sub.status === 'rejected'}
                            size="sm" 
                            variant="destructive"
                            className="h-9 rounded-xl gap-2 px-4 shadow-lg shadow-red-600/10 border-none"
                          >
                            <XCircle className="w-4 h-4" />
                            <span className="text-xs font-black">Reject</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

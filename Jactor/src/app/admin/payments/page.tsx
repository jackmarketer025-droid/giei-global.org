"use client";

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, updateDoc, doc } from 'firebase/firestore';
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
  ExternalLink,
  CreditCard
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function PaymentsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const paymentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'applications'), orderBy('registrationDate', 'desc'));
  }, [firestore]);

  const { data: applications, isLoading } = useCollection(paymentsQuery);

  const filteredApps = applications?.filter(app => 
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.trackingId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStatus = async (id: string, newStatus: 'success' | 'rejected') => {
    if (!firestore) return;
    setUpdatingId(id);
    try {
      await updateDoc(doc(firestore, 'applications', id), {
        paymentStatus: newStatus
      });
      toast({
        title: "Status Updated",
        description: `Payment status has been set to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">পেমেন্ট যাচাইকরণ (Payment Verification)</h1>
        <p className="text-slate-600 font-medium">ট্রানজেকশন আইডি যাচাই করুন এবং আবেদনকারীর পেমেন্ট স্ট্যাটাস ম্যানেজ করুন।</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
          <Input 
            placeholder="নাম, ট্রানজেকশন আইডি বা ট্র্যাকিং আইডি দিয়ে খুঁজুন..." 
            className="pl-11 h-12 bg-white border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow className="border-slate-200 hover:bg-transparent">
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5 pl-6">আবেদনকারী (Applicant)</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">মাধ্যম (Method)</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">ট্রানজেকশন আইডি (TxID)</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">ট্র্যাকিং আইডি (Track ID)</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">অবস্থা (Status)</TableHead>
              <TableHead className="text-right font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5 pr-6">যাচাইকরণ (Verify)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-500">পেমেন্ট লোড হচ্ছে...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredApps?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">কোন পেমেন্ট রেকর্ড পাওয়া যায়নি।</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredApps?.map((app) => (
              <TableRow key={app.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                <TableCell className="pl-6 py-4">
                  <div>
                    <p className="font-bold text-sm text-slate-900 tracking-tight">{app.fullName}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{app.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="rounded-lg bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 uppercase">
                    {app.paymentMethod || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-black text-slate-700 font-mono tracking-wider">{app.transactionId || 'N/A'}</span>
                </TableCell>
                <TableCell>
                  <code className="text-[11px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">{app.trackingId}</code>
                </TableCell>
                <TableCell>
                  {app.paymentStatus === 'success' ? (
                    <Badge className="rounded-full bg-emerald-100 text-emerald-700 border-emerald-200 font-bold text-[9px] px-2.5 py-0.5">
                      সফল (VERIFIED)
                    </Badge>
                  ) : app.paymentStatus === 'rejected' ? (
                    <Badge className="rounded-full bg-red-100 text-red-700 border-red-200 font-bold text-[9px] px-2.5 py-0.5">
                      বাতিল (REJECTED)
                    </Badge>
                  ) : (
                    <Badge className="rounded-full bg-amber-100 text-yellow-700 border-amber-200 font-bold text-[9px] px-2.5 py-0.5">
                      অপেক্ষমান (PENDING)
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    {updatingId === app.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    ) : (
                      <>
                        <Button 
                          onClick={() => handleUpdateStatus(app.id, 'success')}
                          disabled={app.paymentStatus === 'success'}
                          size="sm" 
                          className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1.5 px-3"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">Approve</span>
                        </Button>
                        <Button 
                          onClick={() => handleUpdateStatus(app.id, 'rejected')}
                          disabled={app.paymentStatus === 'rejected'}
                          size="sm" 
                          variant="destructive"
                          className="h-8 rounded-lg gap-1.5 px-3"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">Reject</span>
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
  );
}

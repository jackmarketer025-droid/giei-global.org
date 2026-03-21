
"use client";

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  ExternalLink,
  Cpu,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export default function ApplicantsPage() {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'applications'), orderBy('registrationDate', 'desc'));
  }, [firestore]);

  const { data: users, isLoading } = useCollection(usersQuery);

  const filteredUsers = users?.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.trackingId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Applicant Management</h1>
          <p className="text-slate-600 font-medium">Manage and verify all scholarship applicants.</p>
        </div>
        <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-2xl gap-2 h-11 px-6 shadow-lg shadow-blue-100 transition-all active:scale-[0.98]">
          <Download className="w-4 h-4" /> 
          <span className="font-bold text-sm">Export CSV</span>
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
          <Input 
            placeholder="Search by name, email or ID..." 
            className="pl-11 h-12 bg-white border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 w-12 rounded-2xl bg-white border-slate-300 p-0 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-all shadow-sm">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow className="border-slate-200 hover:bg-transparent">
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5 pl-6">Applicant</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">Institution</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">Tracking ID</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">Status</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">Score</TableHead>
              <TableHead className="text-right font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5 pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-500">Loading applicants...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                      <Search className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">No applicants found matching your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers?.map((user) => (
              <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                <TableCell className="pl-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200 overflow-hidden">
                      <span className="text-xs font-black text-blue-600 group-hover:text-white uppercase">{(user.fullName || 'U')[0]}</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 tracking-tight">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{user.institution || user.district || 'N/A'}</p>
                </TableCell>
                <TableCell>
                  <code className="text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 group-hover:bg-white group-hover:text-blue-600 transition-colors">{user.trackingId}</code>
                </TableCell>
                <TableCell>
                  {user.paymentStatus === 'success' ? (
                    <Badge className="rounded-full bg-emerald-100 text-emerald-700 border-emerald-200 font-bold text-[9px] px-2.5 py-0.5">
                      VERIFIED
                    </Badge>
                  ) : user.paymentStatus === 'rejected' ? (
                    <Badge className="rounded-full bg-red-100 text-red-700 border-red-200 font-bold text-[9px] px-2.5 py-0.5">
                      REJECTED
                    </Badge>
                  ) : (
                    <Badge className="rounded-full bg-amber-100 text-yellow-700 border-amber-200 font-bold text-[9px] px-2.5 py-0.5">
                      PENDING
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-black text-slate-900">{user.quizScore || '0'}/100</span>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
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


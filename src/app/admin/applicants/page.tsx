
"use client";

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
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
  Edit, 
  Trash2, 
  ExternalLink,
  Loader2,
  Check,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';

export default function ApplicantsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [actionLoading, setActionLoading] = useState(false);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'applications'), orderBy('registrationDate', 'desc'));
  }, [firestore]);

  const { data: users, isLoading } = useCollection(usersQuery);

  const filteredUsers = users?.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setEditFormData({
      fullName: user.fullName || '',
      phone: user.phone || '',
      institution: user.institution || '',
      classYear: user.classYear || '',
      division: user.division || '',
      district: user.district || '',
      paymentStatus: user.paymentStatus || 'pending'
    });
    setIsEditing(true);
  };

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setIsDeleting(true);
  };

  const handleUpdateUser = async () => {
    if (!firestore || !selectedUser) return;
    setActionLoading(true);
    try {
      await updateDoc(doc(firestore, 'applications', selectedUser.id), editFormData);
      toast({
        title: "Success",
        description: "Applicant information updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update applicant information.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!firestore || !selectedUser) return;
    setActionLoading(true);
    try {
      await deleteDoc(doc(firestore, 'applications', selectedUser.id));
      toast({
        title: "Deleted",
        description: "Applicant has been removed from the system.",
      });
      setIsDeleting(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete applicant.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">আবেদনকারী ব্যবস্থাপনা (Applicants)</h1>
          <p className="text-slate-600 font-medium">আবেদনকারীদের তথ্য এডিট, ডিলিট এবং ম্যানেজ করুন।</p>
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
            placeholder="নাম, আইডি বা ফোন নম্বর দিয়ে খুঁজুন..." 
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
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5 pl-8">আবেদনকারী (Applicant)</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">প্রতিষ্ঠান ও ঠিকানা (Info)</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">আইডি (Tracking ID)</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5">পেমেন্ট (Status)</TableHead>
              <TableHead className="text-right font-bold text-slate-700 uppercase text-[10px] tracking-wider py-5 pr-8">অ্যাকশন (Actions)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-500">আবেদনকারী লোড হচ্ছে...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                      <Search className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">কোন আবেদনকারী পাওয়া যায়নি।</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers?.map((user) => (
              <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                <TableCell className="pl-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300 shadow-sm">
                      <span className="text-xs font-black text-blue-600 group-hover:text-white uppercase">{(user.fullName || 'U')[0]}</span>
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-900 tracking-tight">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-bold">{user.phone}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-700 truncate max-w-[180px]">{user.institution || 'N/A'}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.district}, {user.division}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-[11px] font-black text-blue-600 bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">{user.trackingId}</code>
                </TableCell>
                <TableCell>
                  {user.paymentStatus === 'success' ? (
                    <Badge className="rounded-full bg-emerald-100 text-emerald-700 border-emerald-200 font-black text-[9px] px-3 py-1 uppercase tracking-tighter">
                      Verified
                    </Badge>
                  ) : user.paymentStatus === 'rejected' ? (
                    <Badge className="rounded-full bg-red-100 text-red-700 border-red-200 font-black text-[9px] px-3 py-1 uppercase tracking-tighter">
                      Rejected
                    </Badge>
                  ) : (
                    <Badge className="rounded-full bg-amber-100 text-amber-700 border-amber-200 font-black text-[9px] px-3 py-1 uppercase tracking-tighter">
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <Button 
                      onClick={() => handleEditClick(user)}
                      variant="ghost" 
                      size="icon" 
                      className="w-10 h-10 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm border border-transparent hover:border-blue-100"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => handleDeleteClick(user)}
                      variant="ghost" 
                      size="icon" 
                      className="w-10 h-10 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm border border-transparent hover:border-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="bg-blue-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <DialogTitle className="text-2xl font-black tracking-tight">আবেদনকারীর তথ্য পরিবর্তন</DialogTitle>
            <DialogDescription className="text-blue-100 font-medium">
              আইডি: {selectedUser?.trackingId} এর তথ্য আপডেট করুন।
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6 bg-white">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                <Input 
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                  className="rounded-xl border-slate-200 h-12 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</Label>
                <Input 
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  className="rounded-xl border-slate-200 h-12 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Institution</Label>
                <Input 
                  value={editFormData.institution}
                  onChange={(e) => setEditFormData({...editFormData, institution: e.target.value})}
                  className="rounded-xl border-slate-200 h-12 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Class/Year</Label>
                <Input 
                  value={editFormData.classYear}
                  onChange={(e) => setEditFormData({...editFormData, classYear: e.target.value})}
                  className="rounded-xl border-slate-200 h-12 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Division</Label>
                <Input 
                  value={editFormData.division}
                  onChange={(e) => setEditFormData({...editFormData, division: e.target.value})}
                  className="rounded-xl border-slate-200 h-12 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">District</Label>
                <Input 
                  value={editFormData.district}
                  onChange={(e) => setEditFormData({...editFormData, district: e.target.value})}
                  className="rounded-xl border-slate-200 h-12 font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Payment Status</Label>
              <select 
                value={editFormData.paymentStatus}
                onChange={(e) => setEditFormData({...editFormData, paymentStatus: e.target.value})}
                className="w-full rounded-xl border-slate-200 h-12 font-bold px-3 focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="pending">Pending</option>
                <option value="success">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <DialogFooter className="bg-slate-50 p-6 flex gap-3 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="rounded-xl h-12 px-6 font-bold"
            >
              বাতিল
            </Button>
            <Button 
              onClick={handleUpdateUser}
              disabled={actionLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-8 font-black shadow-lg shadow-blue-600/10 border-none"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              সেভ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-slate-900">আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 font-medium text-base">
              এটি আবেদনকারী <span className="font-black text-red-600">{selectedUser?.fullName}</span> এর সকল তথ্য ডাটাবেস থেকে স্থায়ীভাবে ডিলিট করে দেবে। এই অ্যাকশনটি আর ফিরিয়ে আনা সম্ভব নয়।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex gap-3">
            <AlertDialogCancel className="rounded-xl h-12 px-6 font-bold border-slate-200">বাতিল</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 px-8 font-black shadow-lg shadow-red-600/10 border-none"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              হ্যাঁ, ডিলিট করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

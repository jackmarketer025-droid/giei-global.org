"use client";

import { useState, useMemo, useRef } from 'react';
import { useFirestore, useCollection, useFirebaseStorage } from '@/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Laptop, 
  Save, 
  RefreshCw, 
  Image as ImageIcon,
  ExternalLink,
  Loader2,
  Plus,
  Upload,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import NextImage from 'next/image';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { deleteDoc } from 'firebase/firestore';

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
    img: "https://res.cloudinary.com/dd3eekw7h/image/upload/v1774213346/m2_m3_chip_naxovt.png",
    color: "amber",
    isSpecial: true,
    order: 4
  }
];

export default function AdminProducts() {
  const firestore = useFirestore();
  const { storage } = useFirebaseStorage();
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [addSection, setAddSection] = useState<'laptop' | 'about'>('laptop');
  const [editingLaptop, setEditingLaptop] = useState<any>(null);
  const [editUrl, setEditUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newImage, setNewImage] = useState({
    brand: '',
    series: '',
    desc: '',
    model: '',
    img: '',
    order: 1
  });

  const laptopsQuery = useMemo(() => {
    if (!firestore) return null;
    const q = query(collection(firestore, 'laptops'), orderBy('order', 'asc'));
    return Object.assign(q, { __memo: true });
  }, [firestore]);

  const { data: laptops, isLoading: isLaptopsLoading } = useCollection(laptopsQuery);

  const aboutQuery = useMemo(() => {
    if (!firestore) return null;
    const q = query(collection(firestore, 'about_images'), orderBy('order', 'asc'));
    return Object.assign(q, { __memo: true });
  }, [firestore]);

  const { data: aboutImages, isLoading: isAboutLoading } = useCollection(aboutQuery);

  const isLoading = isLaptopsLoading || isAboutLoading;

  const handleDelete = async () => {
    if (!firestore || !deletingItem) return;
    setIsSeeding(true);
    try {
      const isAboutImage = deletingItem.id.startsWith('about_');
      const collectionName = isAboutImage ? 'about_images' : 'laptops';
      await deleteDoc(doc(firestore, collectionName, deletingItem.id));
      toast({
        title: "ডিলিট করা হয়েছে",
        description: "আইটেমটি সফলভাবে রিমুভ করা হয়েছে।"
      });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "ডিলিট করা যায়নি",
        description: "দয়া করে আবার চেষ্টা করুন।"
      });
    } finally {
      setIsSeeding(false);
      setDeletingItem(null);
    }
  };

  const handleUpdateImage = async (id: string, newUrl: string) => {
    if (!firestore) return;
    setUpdatingId(id);
    try {
      // Check if it's a laptop or about image
      const isAboutImage = id.startsWith('about_');
      const collectionName = isAboutImage ? 'about_images' : 'laptops';
      const laptopRef = doc(firestore, collectionName, id);
      await updateDoc(laptopRef, { img: newUrl });
      toast({
        title: "Image Updated",
        description: "Image has been updated successfully.",
      });
    } catch (error) {
      console.error("Update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the image. Check your permissions.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage || !editingLaptop) return;

    setIsUploading(true);
    try {
      const fileName = `${editingLaptop.id}_${Date.now()}`;
      const storageRef = ref(storage, `website_content/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setEditUrl(downloadURL);
      toast({
        title: "File Uploaded",
        description: "Click 'Update' to save changes.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Could not upload image.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    
    if (!newImage.img) {
      toast({
        variant: "destructive",
        title: "অসম্পূর্ণ তথ্য",
        description: "দয়া করে ছবির লিঙ্ক প্রদান করুন।"
      });
      return;
    }

    setIsSeeding(true);
    try {
      const collectionName = addSection === 'about' ? 'about_images' : 'laptops';
      const count = addSection === 'about' ? (aboutImages?.length || 0) : (laptops?.length || 0);
      
      const newDocRef = doc(collection(firestore, collectionName));
      await setDoc(newDocRef, {
        ...newImage,
        id: newDocRef.id,
        order: count + 1,
        createdAt: new Date()
      });
      
      toast({
        title: "সফল হয়েছে",
        description: "নতুন ছবি যোগ করা হয়েছে।"
      });
      
      setShowAddDialog(false);
      setNewImage({
        brand: '',
        series: '',
        desc: '',
        model: '',
        img: '',
        order: count + 2
      });
    } catch (error) {
      console.error("Add error:", error);
      toast({
        variant: "destructive",
        title: "ব্যর্থ হয়েছে",
        description: "ছবি যোগ করা যায়নি।"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const seedInitialData = async () => {
    if (!firestore) return;
    
    // Check if data already exists to warn user
    if ((laptops && laptops.length > 0) || (aboutImages && aboutImages.length > 0)) {
      if (!confirm("কিছু ডাটা ইতিমধ্যে বিদ্যমান। আপনি কি ডিফল্ট ডাটা আবার যোগ করতে চান? এতে ডুপ্লিকেট হতে পারে।")) {
        return;
      }
    }

    setIsSeeding(true);
    try {
      const batch = writeBatch(firestore);
      
      // Seed Laptops - only if laptops is empty or user confirmed
      DEFAULT_LAPTOPS.forEach((laptop) => {
        const newDocRef = doc(collection(firestore, 'laptops'));
        batch.set(newDocRef, { ...laptop, id: newDocRef.id });
      });

      // Seed About Images
      const ABOUT_IMAGES = [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600"
      ];

      ABOUT_IMAGES.forEach((img, i) => {
        const aboutRef = doc(firestore, 'about_images', `about_${i + 1}`);
        batch.set(aboutRef, { img, order: i + 1, id: aboutRef.id });
      });

      await batch.commit();
      toast({
        title: "Data Initialized",
        description: "Default laptop and about data has been added.",
      });
    } catch (error) {
      console.error("Seed error:", error);
      toast({
        variant: "destructive",
        title: "Initialization Failed",
        description: "Could not seed the data.",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Manage Content</h1>
          <p className="text-slate-600 font-medium">Update images and information across the website.</p>
        </div>
        
        <div className="flex gap-3">
          {!isLoading && ((!laptops || laptops.length === 0) || (!aboutImages || aboutImages.length === 0)) && (
            <Button 
              onClick={seedInitialData} 
              disabled={isSeeding}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 px-6 font-bold shadow-lg shadow-blue-100"
            >
              {isSeeding ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              Initialize Website Data
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-12">
          {/* About Us Images Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">About Us Images</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage images in the About section</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setAddSection('about');
                  setShowAddDialog(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-4 font-bold text-xs"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add About Image
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {aboutImages?.map((img: any, i: number) => (
                <Card 
                  key={img.id} 
                  onClick={() => {
                    setEditingLaptop(img);
                    setEditUrl(img.img);
                    setShowEditDialog(true);
                  }}
                  className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer group"
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                      <NextImage 
                        src={img.img} 
                        alt={`About Image ${i + 1}`} 
                        fill 
                        className="object-cover group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white text-blue-600 px-3 py-1.5 rounded-full font-bold text-[10px] flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" /> Edit
                        </div>
                      </div>
                    </div>
                    <div className="p-3 text-center relative">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Position {i + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingItem(img);
                          setShowDeleteDialog(true);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Laptops Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Laptop Products</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage images for laptop prizes</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setAddSection('laptop');
                  setShowAddDialog(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-4 font-bold text-xs"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Laptop
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {laptops?.map((laptop) => (
                <Card 
                  key={laptop.id} 
                  onClick={() => {
                    setEditingLaptop(laptop);
                    setEditUrl(laptop.img);
                    setShowEditDialog(true);
                  }}
                  className="bg-white border border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer group"
                >
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden bg-slate-50">
                      <NextImage 
                        src={laptop.img} 
                        alt={laptop.brand} 
                        fill 
                        className="object-cover group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          <ImageIcon className="w-4 h-4" /> ছবি পরিবর্তন করুন
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900 leading-none">{laptop.brand}</h3>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{laptop.series}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{laptop.desc}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingItem(laptop);
                          setShowDeleteDialog(true);
                        }}
                        className="absolute right-2 bottom-2 w-8 h-8 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Edit Image Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-[2rem] p-8 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" /> ছবি পরিবর্তন করুন
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-inner">
              <NextImage 
                src={editUrl || (editingLaptop?.img)} 
                alt="Preview" 
                fill 
                className="object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Direct Upload</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full h-12 border-dashed border-2 border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-600 font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  কম্পিউটার থেকে ছবি আপলোড করুন
                </Button>
              </div>

              <div className="relative flex items-center gap-2">
                <div className="h-[1px] flex-1 bg-slate-100"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase">অথবা লিঙ্ক দিন</span>
                <div className="h-[1px] flex-1 bg-slate-100"></div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cloudinary / Image URL</label>
                <Input 
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="https://..."
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button 
                onClick={() => {
                  if (editingLaptop && editUrl !== editingLaptop.img) {
                    handleUpdateImage(editingLaptop.id, editUrl);
                  }
                  setShowEditDialog(false);
                }}
                disabled={updatingId === editingLaptop?.id || isUploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-blue-100"
              >
                {updatingId === editingLaptop?.id ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                ছবি আপডেট করুন
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-[2rem] p-8 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> ডিলিট নিশ্চিত করুন
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium pt-2">
              আপনি কি নিশ্চিত যে আপনি এই {deletingItem?.brand || 'আইটেমটি'} ডিলিট করতে চান? এটি একবার ডিলিট করলে আর ফিরে পাওয়া যাবে না।
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-6 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1 rounded-xl h-12 font-bold border-slate-100"
            >
              না, থাক
            </Button>
            <Button 
              onClick={handleDelete}
              disabled={isSeeding}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-red-100"
            >
              {isSeeding ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Trash2 className="w-5 h-5 mr-2" />}
              হ্যাঁ, ডিলিট করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Image Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-[2rem] p-8 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> নতুন {addSection === 'about' ? 'ছবি' : 'প্রোডাক্ট'} যোগ করুন
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddImage} className="space-y-6 mt-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-inner">
              {newImage.img ? (
                <NextImage src={newImage.img} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <ImageIcon className="w-8 h-8 opacity-20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">No Image Selected</span>
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              {addSection === 'laptop' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Brand</label>
                      <Input 
                        value={newImage.brand}
                        onChange={(e) => setNewImage({...newImage, brand: e.target.value})}
                        placeholder="e.g. HP"
                        className="h-11 bg-slate-50 border-slate-100 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Series</label>
                      <Input 
                        value={newImage.series}
                        onChange={(e) => setNewImage({...newImage, series: e.target.value})}
                        placeholder="e.g. Pavilion"
                        className="h-11 bg-slate-50 border-slate-100 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                    <Textarea 
                      value={newImage.desc}
                      onChange={(e) => setNewImage({...newImage, desc: e.target.value})}
                      placeholder="Product details..."
                      className="bg-slate-50 border-slate-100 rounded-xl text-sm min-h-[80px]"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Direct Upload</label>
                <input 
                  type="file" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !storage) return;
                    setIsUploading(true);
                    try {
                      const fileName = `new_${addSection}_${Date.now()}`;
                      const storageRef = ref(storage, `website_content/${fileName}`);
                      const snapshot = await uploadBytes(storageRef, file);
                      const downloadURL = await getDownloadURL(snapshot.ref);
                      setNewImage({...newImage, img: downloadURL});
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                  id="add-file-input"
                />
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('add-file-input')?.click()}
                  disabled={isUploading}
                  className="w-full h-12 border-dashed border-2 border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-600 font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  কম্পিউটার থেকে ছবি আপলোড করুন
                </Button>
              </div>

              <div className="relative flex items-center gap-2">
                <div className="h-[1px] flex-1 bg-slate-100"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase">অথবা লিঙ্ক দিন</span>
                <div className="h-[1px] flex-1 bg-slate-100"></div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Image URL</label>
                <Input 
                  value={newImage.img}
                  onChange={(e) => setNewImage({...newImage, img: e.target.value})}
                  placeholder="https://..."
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button 
                type="submit"
                disabled={isSeeding || isUploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-blue-100"
              >
                {isSeeding ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                সংরক্ষণ করুন
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {!isLoading && laptops && laptops.length > 0 && (
        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <RefreshCw className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900">Real-time Sync Active</h4>
            <p className="text-sm text-blue-700/70 font-medium">Any changes made here will reflect instantly on the public website home page.</p>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, LayoutDashboard, Utensils, Camera, LogOut, Loader2, Star, CheckSquare, MapPin, Clock, Phone, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db, storage, handleFirestoreError, OperationType } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
  rating?: number;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  date: string;
}

const Admin: React.FC = () => {
  const { user, isAdmin, loading, signInError, login, logout } = useFirebase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'menu' | 'messages' | 'featured' | 'orders' | 'branches'>('menu');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<{ id: string, nameUz: string, nameEn: string, nameRu: string }[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [editingBranch, setEditingBranch] = useState<any | null>(null);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newBranch, setNewBranch] = useState<any>({
    name: '',
    lat: '',
    lng: '',
    phone: '',
    workingHours: '',
    closedDays: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, type: 'menu' | 'message' | 'order' | 'branch' } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleFileUpload = async (file: File, folder: string): Promise<string> => {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File is too large. Maximum size is 5MB.");
    }

    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    setUploadProgress(0);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      const timeout = setTimeout(() => {
        uploadTask.cancel();
        setUploadProgress(null);
        reject(new Error("Upload timed out — Firebase Storage rules may be blocking access. Go to Firebase Console → Storage → Rules and allow authenticated writes."));
      }, 10000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          if (progress > 0) clearTimeout(timeout);
        },
        (error) => {
          clearTimeout(timeout);
          setUploadProgress(null);
          let message = "Failed to upload image.";
          if (error.code === 'storage/unauthorized') {
            message = "Permission denied. Go to Firebase Console → Storage → Rules and allow authenticated writes.";
          } else if (error.code === 'storage/canceled') {
            message = "Upload canceled — likely due to Firebase Storage permissions. Check your Storage rules.";
          } else {
            message = `Upload failed: ${error.message}`;
          }
          reject(new Error(message));
        },
        async () => {
          clearTimeout(timeout);
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadProgress(null);
            resolve(url);
          } catch (error) {
            setUploadProgress(null);
            reject(new Error("Failed to get image URL after upload."));
          }
        }
      );
    });
  };

  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: '',
    category: 'beef',
    description: '',
    image: 'https://picsum.photos/seed/new/800/600',
  });

  useEffect(() => {
    if (!loading && !user) {
      // Stay on login page
    }
  }, [user, loading]);

  useEffect(() => {
    if (!isAdmin && user && !loading) {
      // Not an admin
    }
  }, [isAdmin, user, loading]);

  useEffect(() => {
    if (isAdmin) {
      const menuQuery = query(collection(db, 'menu'), orderBy('createdAt', 'desc'));
      const unsubscribeMenu = onSnapshot(menuQuery, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
        setMenuItems(items);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'menu'));

      const categoriesQuery = query(collection(db, 'categories'));
      const unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
        if (snapshot.empty) {
          const defaults = [
            { id: 'beef', nameUz: 'Goʻshtli', nameEn: 'Beef', nameRu: 'С говядиной' },
            { id: 'chicken', nameUz: 'Tovuqli', nameEn: 'Chicken', nameRu: 'С курицей' },
            { id: 'pumpkin', nameUz: 'Oshqovoqli', nameEn: 'Pumpkin', nameRu: 'С тыквой' },
            { id: 'greens', nameUz: 'Koʻkatli', nameEn: 'Greens', nameRu: 'С зеленью' }
          ];
          defaults.forEach(async (cat) => {
            await setDoc(doc(db, 'categories', cat.id), {
              nameUz: cat.nameUz,
              nameEn: cat.nameEn,
              nameRu: cat.nameRu
            });
          });
        } else {
          const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
          setCategoriesList(cats);
        }
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'categories'));

      const messagesQuery = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
      const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'contacts'));

      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
        const ords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ords);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));

      const branchesQuery = query(collection(db, 'branches'), orderBy('createdAt', 'desc'));
      const unsubscribeBranches = onSnapshot(branchesQuery, (snapshot) => {
        if (snapshot.empty) {
          const defaults = [
            {
              name: 'Seliskiy filial',
              lat: 39.61583395,
              lng: 66.95666921,
              phone: '+998 90 123 45 67',
              workingHours: '08:00 - 22:00',
              closedDays: '',
              mapUrl: 'https://maps.google.com/?q=39.61583395,66.95666921&z=18'
            },
            {
              name: 'Limonadniy filial',
              lat: 39.64482178,
              lng: 66.96929061,
              phone: '+998 90 765 43 21',
              workingHours: '08:00 - 23:00',
              closedDays: ''
            },
            {
              name: 'Oqmachit filial',
              lat: 39.6210414,
              lng: 66.99595928,
              phone: '+998 90 999 88 77',
              workingHours: '09:00 - 21:00',
              closedDays: 'Yakshanba'
            },
            {
              name: "Gulbog' filial",
              lat: 39.6107335,
              lng: 66.9733386,
              phone: '+998 90 555 44 33',
              workingHours: '08:00 - 20:00',
              closedDays: ''
            }
          ];
          defaults.forEach(async (b) => {
            await addDoc(collection(db, 'branches'), {
              ...b,
              mapUrl: `https://maps.google.com/?q=${b.lat},${b.lng}&z=16`,
              createdAt: serverTimestamp()
            });
          });
        } else {
          const bList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setBranches(bList);
        }
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'branches'));

      return () => {
        unsubscribeMenu();
        unsubscribeCategories();
        unsubscribeMessages();
        unsubscribeOrders();
        unsubscribeBranches();
      };
    }
  }, [isAdmin]);

  const handleAddMenuItem = async () => {
    if (newItem.name && newItem.price) {
      setIsProcessing(true);
      try {
        await addDoc(collection(db, 'menu'), {
          ...newItem,
          rating: 5,
          createdAt: serverTimestamp(),
        });
        setIsAdding(false);
        setNewItem({ name: '', price: '', category: 'beef', description: '', image: 'https://picsum.photos/seed/new/800/600' });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'menu');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleUpdateMenuItem = async () => {
    if (editingItem && editingItem.name && editingItem.price) {
      setIsProcessing(true);
      try {
        const { id, ...data } = editingItem;
        await updateDoc(doc(db, 'menu', id), data);
        setEditingItem(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `menu/${editingItem.id}`);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleAddCategory = async () => {
    const nameUz = prompt("Enter category name in Uzbek (e.g., Kartoshkali):");
    if (!nameUz) return;
    const nameEn = prompt("Enter category name in English (e.g., Potato):") || nameUz;
    const nameRu = prompt("Enter category name in Russian (e.g., С картошкой):") || nameUz;
    const id = nameEn.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    
    if (categoriesList.some(c => c.id === id)) {
      alert("A category with this English name already exists!");
      return;
    }

    try {
      await setDoc(doc(db, 'categories', id), { nameUz, nameEn, nameRu });
    } catch (error) {
      alert("Failed to add category");
    }
  };

  const handleEditCategory = async (currentId: string) => {
    const cat = categoriesList.find(c => c.id === currentId);
    if (!cat) return;
    const nameUz = prompt("Edit category name in Uzbek:", cat.nameUz);
    if (!nameUz) return;
    const nameEn = prompt("Edit category name in English:", cat.nameEn || cat.nameUz);
    const nameRu = prompt("Edit category name in Russian:", cat.nameRu || cat.nameUz);

    try {
      await setDoc(doc(db, 'categories', currentId), { nameUz, nameEn, nameRu });
    } catch (error) {
      alert("Failed to edit category");
    }
  };

  const handleDeleteCategory = async (currentId: string) => {
    if (categoriesList.length <= 1) {
      alert("You must keep at least one category.");
      return;
    }
    const cat = categoriesList.find(c => c.id === currentId);
    if (!cat) return;
    if (!confirm(`Are you sure you want to delete category "${cat.nameEn || cat.nameUz}"?`)) return;
    try {
      await deleteDoc(doc(db, 'categories', currentId));
    } catch (error) {
      alert("Failed to delete category");
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'menu', id));
      setConfirmDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `menu/${id}`);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contacts', id));
      setConfirmDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `contacts/${id}`);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'orders', id));
      setConfirmDelete(null);
    } catch (error) {
      alert('Failed to delete order');
    }
  };

  const handleDeleteBranch = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'branches', id));
      setConfirmDelete(null);
    } catch (error) {
      alert('Failed to delete branch');
    }
  };

  const handleAddBranch = async () => {
    if (newBranch.name && newBranch.lat && newBranch.lng) {
      setIsProcessing(true);
      try {
        const latVal = parseFloat(newBranch.lat) || 0;
        const lngVal = parseFloat(newBranch.lng) || 0;
        const mapUrl = `https://maps.google.com/?q=${latVal},${lngVal}&z=16`;
        await addDoc(collection(db, 'branches'), {
          name: newBranch.name,
          lat: latVal,
          lng: lngVal,
          phone: newBranch.phone || '',
          workingHours: newBranch.workingHours || '',
          closedDays: newBranch.closedDays || '',
          mapUrl,
          createdAt: serverTimestamp(),
        });
        setIsAddingBranch(false);
        setNewBranch({ name: '', lat: '', lng: '', phone: '', workingHours: '', closedDays: '' });
      } catch (error) {
        alert("Failed to add branch: " + error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleUpdateBranch = async () => {
    if (editingBranch && editingBranch.name && editingBranch.lat && editingBranch.lng) {
      setIsProcessing(true);
      try {
        const { id, ...data } = editingBranch;
        const latVal = parseFloat(data.lat) || 0;
        const lngVal = parseFloat(data.lng) || 0;
        data.lat = latVal;
        data.lng = lngVal;
        data.mapUrl = `https://maps.google.com/?q=${latVal},${lngVal}&z=16`;
        await updateDoc(doc(db, 'branches', id), data);
        setEditingBranch(null);
      } catch (error) {
        alert("Failed to update branch: " + error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleToggleFlag = async (itemId: string, flag: 'isSpecial' | 'isPopular', value: boolean) => {
    setTogglingId(itemId + flag);
    try {
      if (flag === 'isSpecial' && value) {
        const toReset = menuItems.filter(i => i.id !== itemId && (i as any).isSpecial);
        for (const item of toReset) {
          await updateDoc(doc(db, 'menu', item.id), { isSpecial: false });
        }
      }
      await updateDoc(doc(db, 'menu', itemId), { [flag]: value });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `menu/${itemId}`);
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!loginEmail || !loginPassword) return;
      setLoginLoading(true);
      try {
        await login(loginEmail, loginPassword);
      } catch {
        // error handled in context
      } finally {
        setLoginLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-6 uz-pattern">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-md space-y-8 text-center"
        >
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-primary font-traditional tracking-tighter">
              ADMIN <span className="text-accent">LOGIN</span>
            </h1>
            <p className="text-sm text-gray-400">
              {user && !isAdmin
                ? "You don't have administrator privileges. Please contact the owner."
                : "Sign in to access the admin panel."}
            </p>
          </div>

          {!user ? (
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                />
              </div>
              {signInError && (
                <p className="text-sm text-red-500 font-medium text-center">{signInError}</p>
              )}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-accent transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
              >
                {loginLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                <span>{loginLoading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            </form>
          ) : (
            <button
              onClick={logout}
              className="w-full py-5 border-2 border-primary text-primary rounded-2xl font-bold hover:bg-primary hover:text-white transition-all"
            >
              Sign Out
            </button>
          )}

          <Link to="/" className="block text-xs font-bold text-gray-400 hover:text-primary transition-colors">
            Back to Website
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-8">
          <Link to="/" className="text-xl font-bold tracking-tighter text-primary font-traditional">
            NIYAT <span className="text-accent">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          <button
            onClick={() => setActiveTab('menu')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'menu' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Utensils size={18} />
            <span>Manage Menu</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <CheckSquare size={18} />
            <span>Manage Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'messages' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <ImageIcon size={18} />
            <span>Messages</span>
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'featured' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Star size={18} />
            <span>Featured Sections</span>
          </button>
          <button
            onClick={() => setActiveTab('branches')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'branches' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <MapPin size={18} />
            <span>Manage Branches</span>
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-gray-100 space-y-4">
          <div className="px-4 py-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logged in as</p>
            <p className="text-xs font-bold text-primary truncate">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-primary font-traditional">
                {activeTab === 'menu' ? 'Menu Management' : activeTab === 'orders' ? 'Orders Management' : activeTab === 'featured' ? 'Featured Sections' : activeTab === 'branches' ? 'Branches Management' : 'Messages'}
              </h1>
              <p className="text-sm text-gray-400">
                {activeTab === 'messages' ? 'View and manage customer inquiries.' : activeTab === 'featured' ? 'Choose which items appear in special sections on the homepage.' : activeTab === 'orders' ? 'Manage and track customer orders in real-time.' : activeTab === 'branches' ? 'Add, edit, or delete store branch locations, phone numbers, and working hours.' : 'Add, edit or remove items from your website.'}
              </p>
            </div>
            {activeTab === 'menu' && (
              <button
                onClick={() => setIsAdding(true)}
                className="px-6 py-3 bg-accent text-white rounded-xl font-bold flex items-center space-x-2 hover:shadow-lg transition-all"
              >
                <Plus size={18} />
                <span>Add New Item</span>
              </button>
            )}
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {activeTab === 'menu' && (
              <div className="divide-y divide-gray-50">
                {menuItems.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 italic">No menu items found.</div>
                ) : (
                  menuItems.map((item) => (
                    <div key={item.id} className="p-6 flex items-center space-x-6 group hover:bg-gray-50 transition-colors">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={item.image || undefined} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow space-y-1">
                        <h4 className="text-lg font-bold text-primary">{item.name}</h4>
                        <div className="flex items-center space-x-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span className="text-accent">{item.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ id: item.id, type: 'menu' })}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 italic">No customer orders found.</div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-8 space-y-4 group hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row md:items-start md:justify-between md:space-y-0 gap-6">
                      <div className="space-y-3 flex-grow">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-lg font-bold text-primary">{order.customerName}</h4>
                          <span className="text-xs font-semibold text-accent border border-accent/20 px-2 py-0.5 rounded-full bg-accent/5">
                            {order.total}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                            order.status === 'completed'
                              ? 'bg-green-50 text-green-600 border border-green-100'
                              : order.status === 'cooking'
                              ? 'bg-blue-50 text-blue-600 border border-blue-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Customer Contact Details */}
                        <div className="flex gap-4 text-xs font-semibold text-gray-400">
                          <p>Phone: <a href={`tel:${order.customerPhone}`} className="text-primary hover:underline">{order.customerPhone}</a></p>
                          <p>Date: {order.createdAt?.toDate().toLocaleString() || 'Just now'}</p>
                        </div>

                        {/* Items ordered */}
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 max-w-lg">
                          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items Ordered</h5>
                          <ul className="divide-y divide-gray-200/50 text-sm font-medium text-gray-700">
                            {order.items?.map((item: any, i: number) => (
                              <li key={i} className="py-2 flex justify-between">
                                <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                <span className="font-bold text-primary">{item.price}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 shrink-0 self-end md:self-start">
                        {/* Status Select dropdown */}
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="text-xs font-bold border border-gray-200 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-accent outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="cooking">Cooking</option>
                          <option value="completed">Completed</option>
                        </select>

                        {/* Delete Order button */}
                        <button
                          onClick={() => setConfirmDelete({ id: order.id, type: 'order' })}
                          className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="divide-y divide-gray-50">
                {messages.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 italic">No messages found.</div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="p-8 space-y-4 group hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-primary">{msg.name}</h4>
                          <p className="text-sm text-accent font-bold">{msg.email}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {msg.createdAt?.toDate().toLocaleString() || 'Just now'}
                          </p>
                        </div>
                        <button
                          onClick={() => setConfirmDelete({ id: msg.id, type: 'message' })}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed bg-white p-4 rounded-2xl border border-gray-100">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'featured' && (
              <div className="divide-y divide-gray-50">
                <div className="p-6 flex items-center gap-8 bg-gray-50/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <div className="w-4 h-4 rounded bg-amber-400/80 flex items-center justify-center">
                      <Star size={10} className="text-white fill-white" />
                    </div>
                    Bugungi maxsus <span className="text-gray-400 font-normal">(max 1)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <div className="w-4 h-4 rounded bg-primary flex items-center justify-center">
                      <Star size={10} className="text-white fill-white" />
                    </div>
                    Mashhur tanlovlar <span className="text-gray-400 font-normal">(max 3)</span>
                  </div>
                </div>
                {menuItems.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 italic">No menu items found.</div>
                ) : (
                  menuItems.map((item: any) => {
                    const isSpecial = !!item.isSpecial;
                    const isPopular = !!item.isPopular;
                    const popularCount = menuItems.filter((i: any) => i.isPopular).length;
                    const togglingSpecial = togglingId === item.id + 'isSpecial';
                    const togglingPopular = togglingId === item.id + 'isPopular';
                    return (
                      <div key={item.id} className="p-5 flex items-center gap-5 hover:bg-gray-50/60 transition-colors">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                          <img src={item.image || undefined} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-primary">{item.name}</h4>
                          <p className="text-xs text-gray-400 uppercase tracking-widest">{item.category} · {item.price}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Maxsus</span>
                          <button
                            disabled={togglingSpecial}
                            onClick={() => handleToggleFlag(item.id, 'isSpecial', !isSpecial)}
                            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${isSpecial ? 'bg-amber-400' : 'bg-gray-200'} ${togglingSpecial ? 'opacity-50' : ''}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${isSpecial ? 'translate-x-5' : ''}`} />
                          </button>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Mashhur</span>
                          <button
                            disabled={togglingPopular || (!isPopular && popularCount >= 3)}
                            onClick={() => handleToggleFlag(item.id, 'isPopular', !isPopular)}
                            title={!isPopular && popularCount >= 3 ? 'Max 3 ta mashhur tanlash mumkin' : ''}
                            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${isPopular ? 'bg-primary' : 'bg-gray-200'} ${(togglingPopular || (!isPopular && popularCount >= 3)) ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${isPopular ? 'translate-x-5' : ''}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'branches' && (
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center bg-gray-50/60 p-4 rounded-xl">
                  <span className="text-sm font-bold text-gray-500">Branches List ({branches.length})</span>
                  <button
                    onClick={() => setIsAddingBranch(true)}
                    className="px-4 py-2 bg-accent text-white rounded-xl font-bold flex items-center space-x-2 hover:shadow-md transition-all text-xs"
                  >
                    <Plus size={14} />
                    <span>Add Branch</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {branches.length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-gray-400 italic">No branches found.</div>
                  ) : (
                    branches.map((b) => (
                      <div key={b.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow relative group">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-primary font-traditional">{b.name}</h3>
                            <p className="text-xs text-accent mt-0.5 font-semibold">Coords: {b.lat}, {b.lng}</p>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => setEditingBranch(b)}
                              className="p-2 text-gray-400 hover:text-accent hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setConfirmDelete({ id: b.id, type: 'branch' })}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 border-t border-gray-50 pt-4">
                          <div className="flex items-center space-x-2">
                            <Phone size={12} className="text-accent" />
                            <span className="truncate">{b.phone || 'No phone'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock size={12} className="text-accent" />
                            <span>{b.workingHours || 'No working hours'}</span>
                          </div>
                          <div className="flex items-center space-x-2 col-span-2">
                            <span className="font-bold text-red-400">Closed: </span>
                            <span>{b.closedDays || 'Open every day'}</span>
                          </div>
                        </div>
                        {b.lat && b.lng && (
                          <a
                            href={`https://maps.google.com/?q=${b.lat},${b.lng}&z=16`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-accent hover:underline"
                          >
                            <span>Google Maps link</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Menu Item Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary font-traditional">
                  Add New Menu Item
                </h3>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-primary">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto flex-grow">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</label>
                    <input
                      type="text"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="text-[10px] font-bold text-accent hover:underline flex items-center gap-0.5"
                      >
                        <Plus size={10} /> Add
                      </button>
                    </div>
                  </div>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nameUz} ({cat.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Restored Description Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all h-20 resize-none"
                    placeholder="Enter item description..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {newItem.image ? (
                        <img src={newItem.image || undefined} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-gray-300" size={18} />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await handleFileUpload(file, 'menu');
                            setNewItem({ ...newItem, image: url });
                          } catch (err: any) {
                            alert(err.message || "Failed to upload image");
                          }
                        }
                      }}
                      className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-accent cursor-pointer"
                    />
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-1 items-center justify-between">
                      <span className="text-[10px] font-semibold inline-block py-0.5 px-2 uppercase rounded-full text-accent bg-accent/10">
                        {uploadProgress !== null ? `Uploading: ${Math.round(uploadProgress)}%` : 'Image URL'}
                      </span>
                    </div>
                    {uploadProgress !== null && (
                      <div className="w-full bg-gray-100 rounded-full h-1 mb-2">
                        <div
                          className="bg-accent h-1 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    <input
                      type="text"
                      value={newItem.image}
                      onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                      placeholder="Or enter URL manually"
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-xs transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 py-4 bg-gray-50 flex space-x-3">
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-grow py-2.5 border border-gray-200 text-gray-500 rounded-xl font-bold text-sm hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMenuItem}
                  disabled={isProcessing}
                  className="flex-grow py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-accent transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  <span>Save Item</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Menu Item Modal */}
      <AnimatePresence>
        {editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary font-traditional">
                  Edit Menu Item
                </h3>
                <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-primary">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto flex-grow">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</label>
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</label>
                    <input
                      type="text"
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="text-[10px] font-bold text-accent hover:underline flex items-center gap-0.5"
                      >
                        <Plus size={10} /> Add
                      </button>
                    </div>
                  </div>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nameUz} ({cat.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Restored Description Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all h-20 resize-none"
                    placeholder="Enter item description..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {editingItem.image ? (
                        <img src={editingItem.image || undefined} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-gray-300" size={18} />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await handleFileUpload(file, 'menu');
                            setEditingItem({ ...editingItem, image: url });
                          } catch (err: any) {
                            alert(err.message || "Failed to upload image");
                          }
                        }
                      }}
                      className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-accent cursor-pointer"
                    />
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-1 items-center justify-between">
                      <span className="text-[10px] font-semibold inline-block py-0.5 px-2 uppercase rounded-full text-accent bg-accent/10">
                        {uploadProgress !== null ? `Uploading: ${Math.round(uploadProgress)}%` : 'Image URL'}
                      </span>
                    </div>
                    {uploadProgress !== null && (
                      <div className="w-full bg-gray-100 rounded-full h-1 mb-2">
                        <div
                          className="bg-accent h-1 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    <input
                      type="text"
                      value={editingItem.image}
                      onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                      placeholder="Or enter URL manually"
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-xs transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 py-4 bg-gray-50 flex space-x-3">
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-grow py-2.5 border border-gray-200 text-gray-500 rounded-xl font-bold text-sm hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateMenuItem}
                  disabled={isProcessing}
                  className="flex-grow py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-accent transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  <span>Update Item</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">Confirm Delete</h3>
                <p className="text-sm text-gray-400">Are you sure you want to delete this {confirmDelete.type}? This action cannot be undone.</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-grow py-3 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmDelete.type === 'menu') handleDeleteMenuItem(confirmDelete.id);
                    if (confirmDelete.type === 'message') handleDeleteMessage(confirmDelete.id);
                    if (confirmDelete.type === 'order') handleDeleteOrder(confirmDelete.id);
                    if (confirmDelete.type === 'branch') handleDeleteBranch(confirmDelete.id);
                  }}
                  className="flex-grow py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Branch Modal */}
      <AnimatePresence>
        {isAddingBranch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary font-traditional">
                  Add New Branch
                </h3>
                <button onClick={() => setIsAddingBranch(false)} className="text-gray-400 hover:text-primary">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-grow text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Branch Name</label>
                  <input
                    type="text"
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    placeholder="e.g. Seliskiy filial"
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newBranch.lat}
                      onChange={(e) => setNewBranch({ ...newBranch, lat: e.target.value })}
                      placeholder="39.6158"
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newBranch.lng}
                      onChange={(e) => setNewBranch({ ...newBranch, lng: e.target.value })}
                      placeholder="66.9566"
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Phone Number</label>
                  <input
                    type="text"
                    value={newBranch.phone}
                    onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                    placeholder="+998 90 123 4567"
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Working Hours</label>
                  <input
                    type="text"
                    value={newBranch.workingHours}
                    onChange={(e) => setNewBranch({ ...newBranch, workingHours: e.target.value })}
                    placeholder="08:00 - 22:00"
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Closed Days</label>
                  <input
                    type="text"
                    value={newBranch.closedDays}
                    onChange={(e) => setNewBranch({ ...newBranch, closedDays: e.target.value })}
                    placeholder="e.g. Yakshanba (leave blank for open daily)"
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                  />
                </div>
              </div>

              <div className="p-5 py-4 bg-gray-50 flex space-x-3">
                <button
                  onClick={() => setIsAddingBranch(false)}
                  className="flex-grow py-2.5 border border-gray-200 text-gray-500 rounded-xl font-bold text-sm hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBranch}
                  disabled={isProcessing}
                  className="flex-grow py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-accent transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  <span>Save Branch</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Branch Modal */}
      <AnimatePresence>
        {editingBranch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary font-traditional">
                  Edit Branch
                </h3>
                <button onClick={() => setEditingBranch(null)} className="text-gray-400 hover:text-primary">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-grow text-left animate-none">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Branch Name</label>
                  <input
                    type="text"
                    value={editingBranch.name}
                    onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                    placeholder="e.g. Seliskiy filial"
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editingBranch.lat}
                      onChange={(e) => setEditingBranch({ ...editingBranch, lat: e.target.value })}
                      placeholder="39.6158"
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editingBranch.lng}
                      onChange={(e) => setEditingBranch({ ...editingBranch, lng: e.target.value })}
                      placeholder="66.9566"
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Phone Number</label>
                  <input
                    type="text"
                    value={editingBranch.phone}
                    onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                    placeholder="+998 90 123 4567"
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Working Hours</label>
                  <input
                    type="text"
                    value={editingBranch.workingHours}
                    onChange={(e) => setEditingBranch({ ...editingBranch, workingHours: e.target.value })}
                    placeholder="08:00 - 22:00"
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Closed Days</label>
                  <input
                    type="text"
                    value={editingBranch.closedDays}
                    onChange={(e) => setEditingBranch({ ...editingBranch, closedDays: e.target.value })}
                    placeholder="e.g. Yakshanba (leave blank for open daily)"
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                  />
                </div>
              </div>

              <div className="p-5 py-4 bg-gray-50 flex space-x-3">
                <button
                  onClick={() => setEditingBranch(null)}
                  className="flex-grow py-2.5 border border-gray-200 text-gray-500 rounded-xl font-bold text-sm hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBranch}
                  disabled={isProcessing}
                  className="flex-grow py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-accent transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;

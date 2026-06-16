import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, ShoppingBag, Heart, Search, Phone, User, Trash2, LogOut, Plus, Minus, CheckCircle, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFirebase } from '../context/FirebaseContext';
import { useCartFavourites } from '../context/CartFavouritesContext';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import AnimatedButton from './AnimatedButton';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, loginWithGoogle, logout } = useFirebase();
  const { cart, favourites, addToCart, decrementCartItem, removeFromCart, clearCart, toggleFavourite } = useCartFavourites();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  
  // Drawer States
  const [cartOpen, setCartOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  
  // Checkout Form States
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  // Firestore Menu Items for Drawer Item details
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'menu'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMenuItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
    });
    return () => unsubscribe();
  }, []);

  // Autofill name from Google account
  useEffect(() => {
    if (user?.displayName) {
      setCustomerName(user.displayName);
    }
  }, [user]);

  const isOverlay = location.pathname === '/' && !isScrolled;

  const navItems = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.menu, path: '/menu' },
    { name: t.nav.location, path: '/location' },
    { name: t.nav.contact, path: '/contact' },
  ];

  const languages = [
    { code: 'uz', name: 'Oʻzbekcha' },
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
  ];

  // Helper translations local to Navbar drawers
  const navT = {
    uz: {
      phone: 'Telefon',
      cartTitle: 'Savat',
      favTitle: 'Saralanganlar',
      emptyCart: 'Savatda hozircha mahsulot yoʻq',
      emptyFav: 'Saralangan mahsulotlar yoʻq',
      total: 'Jami',
      checkout: 'Buyurtma berish',
      checkoutDetails: 'Aloqa maʼlumotlari',
      nameLabel: 'Ismingiz',
      phoneLabel: 'Telefon raqamingiz',
      placeOrder: 'Buyurtmani tasdiqlash',
      ordering: 'Yuborilmoqda...',
      orderSuccess: 'Buyurtma qabul qilindi!',
      orderSuccessDesc: 'Tez orada operatorimiz siz bilan bogʻlanadi.',
      loginGoogle: 'Google orqali kirish',
      logout: 'Chiqish',
      searchPlaceholder: 'Menu boʻylab qidirish...',
      searchBtn: 'Qidirish',
      addCart: 'Savatga qoʻshish'
    },
    en: {
      phone: 'Phone',
      cartTitle: 'Shopping Cart',
      favTitle: 'Favourites',
      emptyCart: 'Your cart is empty',
      emptyFav: 'Your favourites list is empty',
      total: 'Total',
      checkout: 'Checkout',
      checkoutDetails: 'Contact Details',
      nameLabel: 'Your Name',
      phoneLabel: 'Your Phone Number',
      placeOrder: 'Confirm Order',
      ordering: 'Submitting...',
      orderSuccess: 'Order Received!',
      orderSuccessDesc: 'Our operator will contact you shortly.',
      loginGoogle: 'Sign in with Google',
      logout: 'Sign Out',
      searchPlaceholder: 'Search menu...',
      searchBtn: 'Search',
      addCart: 'Add to Cart'
    },
    ru: {
      phone: 'Телефон',
      cartTitle: 'Корзина',
      favTitle: 'Избранное',
      emptyCart: 'В корзине пока ничего нет',
      emptyFav: 'Список избранного пуст',
      total: 'Итого',
      checkout: 'Оформить заказ',
      checkoutDetails: 'Контактные данные',
      nameLabel: 'Ваше имя',
      phoneLabel: 'Номер телефона',
      placeOrder: 'Подтвердить заказ',
      ordering: 'Отправка...',
      orderSuccess: 'Заказ принят!',
      orderSuccessDesc: 'Наш оператор свяжется с вами в ближайшее время.',
      loginGoogle: 'Войти через Google',
      logout: 'Выйти',
      searchPlaceholder: 'Поиск по меню...',
      searchBtn: 'Поиск',
      addCart: 'В корзину'
    }
  }[language as 'uz' | 'en' | 'ru'] || {
    phone: 'Phone',
    cartTitle: 'Shopping Cart',
    favTitle: 'Favourites',
    emptyCart: 'Your cart is empty',
    emptyFav: 'Your favourites list is empty',
    total: 'Total',
    checkout: 'Checkout',
    checkoutDetails: 'Contact Details',
    nameLabel: 'Your Name',
    phoneLabel: 'Your Phone Number',
    placeOrder: 'Confirm Order',
    ordering: 'Submitting...',
    orderSuccess: 'Order Received!',
    orderSuccessDesc: 'Our operator will contact you shortly.',
    loginGoogle: 'Sign in with Google',
    logout: 'Sign Out',
    searchPlaceholder: 'Search menu...',
    searchBtn: 'Search',
    addCart: 'Add to Cart'
  };

  // Cart Calculations
  const cartWithDetails = cart.map(item => {
    const details = menuItems.find(m => m.id === item.id);
    return {
      ...item,
      details
    };
  }).filter(item => item.details !== undefined);

  const totalPrice = cartWithDetails.reduce((sum, item) => {
    const priceNum = parseFloat(item.details!.price.replace(/[^0-9]/g, '')) || 0;
    return sum + (priceNum * item.quantity);
  }, 0);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Search Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setSearchOpen(false);
      navigate(`/menu?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  };

  // Order Submission
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim() || !customerName.trim()) return;
    setIsOrdering(true);
    try {
      await addDoc(collection(db, 'orders'), {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        userId: user?.uid || 'guest',
        userEmail: user?.email || '',
        items: cartWithDetails.map(item => ({
          id: item.id,
          name: item.details!.name,
          price: item.details!.price,
          quantity: item.quantity
        })),
        total: `${totalPrice.toLocaleString()} UZS`,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      clearCart();
      setCheckoutStep('success');
    } catch (err) {
      alert('Order failed, please try again.');
      console.error(err);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed z-50 transition-all duration-500 left-1/2 -translate-x-1/2 ${isScrolled
          ? 'top-4 w-[92%] max-w-7xl bg-white/90 backdrop-blur-xl border border-gray-100/80 py-2 shadow-md rounded-2xl sm:rounded-full px-4 sm:px-8'
          : 'top-0 w-full bg-transparent py-2.5 px-4 sm:px-8'
          }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Left Section: Logo & Nav items next to it */}
            <div className="flex items-center space-x-8 lg:space-x-12">
              <Link to="/" className="flex items-center group shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Niyat Somsa Logo" 
                  className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
                    isScrolled ? 'h-9' : 'h-10'
                  }`} 
                />
              </Link>
              
              {/* Desktop Nav Items */}
              <div className="hidden md:flex items-center space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-xs uppercase font-bold tracking-wider transition-all duration-300 relative group/link ${location.pathname === item.path
                      ? 'text-[#c8a96e]'
                      : isOverlay
                        ? 'text-[#1a1a1a] hover:text-[#c8a96e]'
                        : 'text-gray-500 hover:text-[#1a1a1a]'
                      }`}
                  >
                    {item.name}
                    <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#c8a96e] transition-all duration-300 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover/link:w-full'
                      }`} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Section: phone number, search, cart, fav, lang, profile */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {/* Phone number */}
              <a 
                href="tel:+998901234567" 
                className={`flex items-center space-x-2 text-xs font-bold transition-all duration-300 ${
                  isOverlay ? 'text-[#1a1a1a] hover:text-[#c8a96e]' : 'text-gray-600 hover:text-[#c8a96e]'
                }`}
              >
                <Phone size={13} className="text-[#c8a96e]" />
                <span className="tracking-wider">+998 90 123 4567</span>
              </a>

              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-1.5 rounded-full hover:bg-black/5 transition-colors ${
                  isOverlay ? 'text-[#1a1a1a] hover:text-[#c8a96e]' : 'text-gray-500 hover:text-[#1a1a1a]'
                }`}
              >
                <Search size={16} />
              </button>

              {/* Favourites Trigger */}
              <button
                onClick={() => setFavOpen(true)}
                className={`p-1.5 rounded-full hover:bg-black/5 transition-colors relative ${
                  isOverlay ? 'text-[#1a1a1a] hover:text-[#c8a96e]' : 'text-gray-500 hover:text-[#1a1a1a]'
                }`}
              >
                <Heart size={16} className={favourites.length > 0 ? 'fill-red-500 text-red-500' : ''} />
                {favourites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    {favourites.length}
                  </span>
                )}
              </button>

              {/* Cart/Bucket Trigger */}
              <button
                onClick={() => {
                  setCartOpen(true);
                  setCheckoutStep('cart');
                }}
                className={`p-1.5 rounded-full hover:bg-black/5 transition-colors relative ${
                  isOverlay ? 'text-[#1a1a1a] hover:text-[#c8a96e]' : 'text-gray-500 hover:text-[#1a1a1a]'
                }`}
              >
                <ShoppingBag size={16} />
                {totalCartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c8a96e] text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className={`flex items-center space-x-1 text-xs font-bold transition-colors ${isOverlay
                    ? 'text-[#1a1a1a] hover:text-[#c8a96e]'
                    : 'text-gray-500 hover:text-[#1a1a1a]'
                    }`}
                >
                  <Globe size={13} />
                  <span className="uppercase tracking-wider">{language}</span>
                  <ChevronDown size={10} className={`transition-transform duration-300 ${showLangMenu ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-32 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => { setLanguage(lang.code as any); setShowLangMenu(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#f7f5f2] transition-colors ${language === lang.code ? 'text-[#c8a96e] font-bold' : 'text-gray-600'
                            }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile/Auth Button */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden shadow-sm hover:border-[#c8a96e] transition-colors flex items-center justify-center"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User photo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={15} className="text-gray-600" />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={loginWithGoogle}
                    className={`p-1.5 rounded-full hover:bg-black/5 transition-colors ${
                      isOverlay ? 'text-[#1a1a1a] hover:text-[#c8a96e]' : 'text-gray-500 hover:text-[#1a1a1a]'
                    }`}
                    title={navT.loginGoogle}
                  >
                    <User size={16} />
                  </button>
                )}

                <AnimatePresence>
                  {user && showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 space-y-3"
                    >
                      <div className="text-center pb-2 border-b border-gray-50">
                        <p className="text-xs font-bold text-gray-800 truncate">{user.displayName}</p>
                        <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { logout(); setShowProfileMenu(false); }}
                        className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut size={13} />
                        <span>{navT.logout}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Actions Container */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Menu Link Button */}
              <Link
                to="/menu"
                className={`p-1.5 ${isOverlay ? 'text-[#1a1a1a]' : 'text-gray-500'}`}
                title="Menyular"
              >
                <BookOpen size={18} />
              </Link>

              {/* Favourites Trigger */}
              <button
                onClick={() => setFavOpen(true)}
                className={`p-1.5 relative ${isOverlay ? 'text-[#1a1a1a]' : 'text-gray-500'}`}
                title="Saralanganlar"
              >
                <Heart size={18} className={favourites.length > 0 ? 'fill-red-500 text-red-500' : ''} />
                {favourites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    {favourites.length}
                  </span>
                )}
              </button>

              {/* Cart Trigger */}
              <button
                onClick={() => {
                  setCartOpen(true);
                  setCheckoutStep('cart');
                }}
                className={`p-1.5 relative ${isOverlay ? 'text-[#1a1a1a]' : 'text-gray-500'}`}
              >
                <ShoppingBag size={18} />
                {totalCartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c8a96e] text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    {totalCartCount}
                  </span>
                )}
              </button>
              
              {/* Menu trigger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-1.5 transition-colors ${isOverlay && !isOpen
                  ? 'text-[#1a1a1a] hover:text-[#c8a96e]'
                  : 'text-[#1a1a1a] hover:text-[#c8a96e]'
                  }`}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 overflow-hidden mt-2 rounded-2xl"
            >
              <div className="px-4 pt-3 pb-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 text-xs font-bold rounded-xl transition-colors uppercase tracking-wider ${location.pathname === item.path
                      ? 'text-[#c8a96e] bg-[#f7f5f2]'
                      : 'text-gray-600 hover:bg-[#f7f5f2]'
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Extra Items */}
                <div className="pt-4 border-t border-gray-100 space-y-3 px-4">
                  <a 
                    href="tel:+998901234567" 
                    className="flex items-center space-x-2 text-xs font-bold text-gray-600"
                  >
                    <Phone size={13} className="text-[#c8a96e]" />
                    <span>+998 90 123 4567</span>
                  </a>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => { setLanguage(lang.code as any); setIsOpen(false); }}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${language === lang.code
                            ? 'bg-[#1a1a1a] text-white'
                            : 'text-gray-500 hover:text-[#1a1a1a]'
                            }`}
                        >
                          {lang.code.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    {user ? (
                      <button 
                        onClick={() => { logout(); setIsOpen(false); }}
                        className="text-[10px] font-bold text-red-500 hover:underline flex items-center space-x-1"
                      >
                        <LogOut size={12} />
                        <span>{navT.logout}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => { loginWithGoogle(); setIsOpen(false); }}
                        className="text-[10px] font-bold text-[#c8a96e] hover:underline flex items-center space-x-1"
                      >
                        <User size={12} />
                        <span>{navT.loginGoogle}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inline Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-lg p-3 rounded-2xl max-w-lg mx-auto"
            >
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder={navT.searchPlaceholder}
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="flex-grow px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-1 focus:ring-accent text-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-accent transition-colors"
                >
                  {navT.searchBtn}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── DRAWERS ── */}
      <AnimatePresence>
        {/* Cart Drawer */}
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[450px] bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary font-traditional flex items-center space-x-2">
                  <ShoppingBag className="text-accent" size={20} />
                  <span>{navT.cartTitle}</span>
                </h3>
                <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-primary">
                  <X size={22} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {checkoutStep === 'cart' && (
                  <>
                    {cartWithDetails.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                        <ShoppingBag size={48} className="text-gray-200" />
                        <p className="text-sm font-semibold text-gray-400">{navT.emptyCart}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cartWithDetails.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-50 rounded-2xl hover:bg-gray-50/50 transition-all">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                              <img src={item.details!.image} alt={item.details!.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-sm font-bold text-primary truncate">{item.details!.name}</h4>
                              <p className="text-xs font-semibold text-accent mt-0.5">{item.details!.price}</p>
                            </div>
                            {/* Quantity buttons */}
                            <div className="flex items-center space-x-2.5 bg-gray-50 px-2.5 py-1.5 rounded-full shrink-0">
                              <button 
                                onClick={() => decrementCartItem(item.id)}
                                className="text-gray-500 hover:text-[#1a1a1a]"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-bold text-primary w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => addToCart(item.id)}
                                className="text-gray-500 hover:text-[#1a1a1a]"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            {/* Remove button */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {checkoutStep === 'details' && (
                  <form onSubmit={handlePlaceOrder} className="space-y-4 py-2">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">{navT.checkoutDetails}</h4>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{navT.nameLabel}</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-1 focus:ring-accent text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{navT.phoneLabel}</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-1 focus:ring-accent text-sm"
                      />
                    </div>
                    
                    <AnimatedButton
                      type="submit"
                      disabled={isOrdering}
                      variant="accent"
                      className="w-full mt-4"
                    >
                      {isOrdering ? navT.ordering : navT.placeOrder}
                    </AnimatedButton>
                  </form>
                )}

                {checkoutStep === 'success' && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 12 }}
                    >
                      <CheckCircle size={56} className="text-green-500" />
                    </motion.div>
                    <h4 className="text-xl font-bold text-primary font-traditional">{navT.orderSuccess}</h4>
                    <p className="text-xs text-gray-400 max-w-xs">{navT.orderSuccessDesc}</p>
                    <AnimatedButton
                      onClick={() => setCartOpen(false)}
                      variant="primary"
                      className="mt-4"
                    >
                      Ok
                    </AnimatedButton>
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartWithDetails.length > 0 && checkoutStep === 'cart' && (
                <div className="p-6 border-t border-gray-100 space-y-4 bg-gray-50/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-500">{navT.total}</span>
                    <span className="text-lg font-bold text-primary font-traditional">
                      {totalPrice.toLocaleString()} UZS
                    </span>
                  </div>
                  <AnimatedButton
                    onClick={() => setCheckoutStep('details')}
                    variant="accent"
                    className="w-full"
                  >
                    {navT.checkout}
                  </AnimatedButton>
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* Favourites Drawer */}
        {favOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setFavOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[450px] bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary font-traditional flex items-center space-x-2">
                  <Heart className="text-red-500 fill-red-500" size={20} />
                  <span>{navT.favTitle}</span>
                </h3>
                <button onClick={() => setFavOpen(false)} className="text-gray-400 hover:text-primary">
                  <X size={22} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow overflow-y-auto p-6">
                {favourites.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <Heart size={48} className="text-gray-200" />
                    <p className="text-sm font-semibold text-gray-400">{navT.emptyFav}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favourites.map(id => {
                      const item = menuItems.find(m => m.id === id);
                      if (!item) return null;
                      return (
                        <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-50 rounded-2xl hover:bg-gray-50/50 transition-all">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-bold text-primary truncate">{item.name}</h4>
                            <p className="text-xs font-semibold text-accent mt-0.5">{item.price}</p>
                          </div>
                          {/* Add to Cart button */}
                          <button
                            onClick={() => addToCart(item.id)}
                            className="px-3 py-1.5 bg-secondary hover:bg-accent hover:text-[#1a1a1a] text-primary rounded-lg text-[10px] font-bold uppercase transition-colors shrink-0"
                          >
                            {navT.addCart}
                          </button>
                          {/* Remove button */}
                          <button
                            onClick={() => toggleFavourite(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

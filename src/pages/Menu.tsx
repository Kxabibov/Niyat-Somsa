import React, { useState, useMemo, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import SectionHeader from '../components/SectionHeader';
import SomsaCard from '../components/SomsaCard';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
  rating: number;
}

const Menu: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<{ id: string, nameUz: string, nameEn: string, nameRu: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync search input from URL param 'q' on mount/change
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    const base = [{ id: 'all', name: t.menu.categories.all }];
    const list = categoriesList.map((cat) => {
      let name = cat.nameUz;
      if (language === 'en' && cat.nameEn) name = cat.nameEn;
      if (language === 'ru' && cat.nameRu) name = cat.nameRu;
      return { id: cat.id, name };
    });
    return [...base, ...list];
  }, [categoriesList, language, t]);

  useEffect(() => {
    const q = query(collection(db, 'menu'), orderBy('createdAt', 'desc'));
    const unsubscribeMenu = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setMenuItems(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'menu');
      setLoading(false);
    });

    const categoriesQuery = query(collection(db, 'categories'));
    const unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setCategoriesList(cats);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'categories'));

    return () => {
      unsubscribeMenu();
      unsubscribeCategories();
    };
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, menuItems]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SectionHeader
        title={t.menu.title}
        subtitle="Discover our wide range of authentic Uzbek samsa, each prepared with traditional recipes and the freshest ingredients."
      />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t.menu.search}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) {
                setSearchParams({ q: e.target.value });
              } else {
                setSearchParams({});
              }
            }}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all outline-none text-sm"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-secondary text-primary hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Menu Grid */}
          <div
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 items-start"
            style={{ WebkitOverflowScrolling: 'touch', transform: 'translateZ(0)' }}
          >
            <AnimatePresence mode="sync">
              {filteredItems.map((item, index) => (
                <SomsaCard key={item.id} {...item} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-24 space-y-4">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto text-accent">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-bold text-primary font-traditional">No items found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Menu;

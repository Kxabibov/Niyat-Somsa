import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Star, Loader2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import SectionHeader from '../components/SectionHeader';
import SomsaCard from '../components/SomsaCard';
import { collection, query, onSnapshot, where, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import HangingIcons from '../components/HangingIcons';
import AnimatedButton from '../components/AnimatedButton';

const CAROUSEL_DATA = [
  {
    src: '/1.png',
    bg: '/bg1.jpeg',
    title: 'DOMOTI',
    translations: {
      uz: { name: 'Domoti Somsa', desc: 'Qarsildoq xamir, sersuv dumba yog‘i va yangi kesilgan mol go‘shti.' },
      en: { name: 'Domoti Somsa', desc: 'Crispy pastry, juicy beef chunk, and traditional spices.' },
      ru: { name: 'Самса Домоти', desc: 'Хрустящее тесто, сочная говядина и традиционные специи.' }
    }
  },
  {
    src: '/2.png',
    bg: '/bg2.jpeg',
    title: 'PESOCHNI',
    translations: {
      uz: { name: 'Pesochni Somsa (Mol go‘shti)', desc: 'Og‘izda eriydigan pesochniy xamir va mayin mol go‘shti.' },
      en: { name: 'Beef Shortcrust Somsa', desc: 'Melt-in-your-mouth shortcrust pastry with tender beef.' },
      ru: { name: 'Песочная Самса (Говядина)', desc: 'Тающее во рту песочное тесто с нежной говядиной.' }
    }
  },
  {
    src: '/3.png',
    bg: '/bg3.jpeg',
    title: 'TOMCHI',
    translations: {
      uz: { name: 'Tomchi Somsa', desc: 'Tandirda pishirilgan xushxo‘r va shirin qovoq.' },
      en: { name: 'Tomchi Somsa', desc: 'Delicious and sweet pumpkin baked in tandir.' },
      ru: { name: 'Самса Томчи', desc: 'Вкусная и сладкая тыква, запеченная в тандыре.' }
    }
  },
  {
    src: '/4.png',
    bg: '/bg4.jpeg',
    title: 'QIYMA',
    translations: {
      uz: { name: 'Qiyma Somsa', desc: 'Kattalashtirilgan maxsus qiyma tandir somsa.' },
      en: { name: 'Minced Meat Somsa', desc: 'Super-sized special minced beef tandir somsa.' },
      ru: { name: 'Самса с фаршем', desc: 'Увеличенная специальная тандырная самса с фаршем.' }
    }
  },
  {
    src: '/5.png',
    bg: '/bg5.jpeg',
    title: 'PORA',
    translations: {
      uz: { name: 'Pora Somsa', desc: 'Bahoriy ko‘katlar va vaqtida terilgan barra piyoz bilan tayyorlangan somsa.' },
      en: { name: 'Pora Somsa', desc: 'Spring greens and fresh dough baked to perfection.' },
      ru: { name: 'Самса Пора', desc: 'Весенняя зелень и свежее тесто, выпеченные до совершенства.' }
    }
  },
  {
    src: '/6.png',
    bg: '/bg6.jpeg',
    title: 'PESOCHNI',
    translations: {
      uz: { name: 'Pesochni Somsa (Tovuq go‘shti)', desc: 'Og‘izda eriydigan pesochniy xamir va barra tovuq go‘shti.' },
      en: { name: 'Chicken Shortcrust Somsa', desc: 'Melt-in-your-mouth shortcrust pastry with tender chicken.' },
      ru: { name: 'Песочная Самса (Курица)', desc: 'Тающее во рту песочное тесто с нежным куриным мясом.' }
    }
  },
  {
    src: '/7.png',
    bg: '/bg7.jpeg',
    title: 'DOMASHNIY',
    translations: {
      uz: { name: 'Domashniy Somsa', desc: 'Bizning eng mashhur va uy sharoitida tayyorlangan retseptimiz.' },
      en: { name: 'Homemade Somsa', desc: 'Our most famous and unique homemade recipe.' },
      ru: { name: 'Домашняя Самса', desc: 'Наш самый известный и уникальный домашний рецепт.' }
    }
  }
];

interface MenuItem {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
  rating: number;
  isSpecial?: boolean;
  isPopular?: boolean;
}

// Uzbek ornament SVG paths for decorative background elements
const UzOrnament = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 120 120" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="60,6 78,22 92,6 92,28 114,28 98,44 114,60 92,60 92,82 78,66 60,82 42,66 28,82 28,60 6,60 22,44 6,28 28,28 28,6 42,22" stroke="#c8a96e" strokeWidth="1.2" strokeOpacity="0.18" fill="none" />
    <circle cx="60" cy="60" r="16" stroke="#c8a96e" strokeWidth="1" strokeOpacity="0.14" fill="none" />
    <circle cx="60" cy="60" r="8" stroke="#c8a96e" strokeWidth="0.8" strokeOpacity="0.1" fill="none" />
    <polygon points="60,30 66,54 90,60 66,66 60,90 54,66 30,60 54,54" stroke="#c8a96e" strokeWidth="0.8" strokeOpacity="0.1" fill="none" />
  </svg>
);

const UzRosette = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
      <line key={i}
        x1="50" y1="50"
        x2={50 + 40 * Math.cos((angle * Math.PI) / 180)}
        y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
        stroke="#c8a96e" strokeWidth="0.8" strokeOpacity="0.12"
      />
    ))}
    <circle cx="50" cy="50" r="40" stroke="#c8a96e" strokeWidth="0.8" strokeOpacity="0.1" fill="none" />
    <circle cx="50" cy="50" r="25" stroke="#c8a96e" strokeWidth="0.8" strokeOpacity="0.1" fill="none" />
    <circle cx="50" cy="50" r="10" stroke="#c8a96e" strokeWidth="0.8" strokeOpacity="0.12" fill="none" />
  </svg>
);

const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const lang = (language === 'uz' || language === 'en' || language === 'ru') ? language : 'uz';

  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [specialItem, setSpecialItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [activeStackIdx, setActiveStackIdx] = useState(0);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    CAROUSEL_DATA.forEach((item) => {
      const img1 = new Image();
      img1.src = item.src;
      const img2 = new Image();
      img2.src = item.bg;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      navigate('next');
    }, 15000);
    return () => clearInterval(interval);
  }, [activeIndex, isAnimating]);

  const navigate = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);

    setActiveIndex((prev) => {
      if (direction === 'next') {
        return (prev + 1) % 7;
      } else {
        return (prev + 6) % 7;
      }
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  const getRole = (index: number) => {
    const diff = (index - activeIndex + 7) % 7;
    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    if (diff === 2) return 'right-2';
    if (diff === 3) return 'back';
    if (diff === 4) return 'back';
    if (diff === 5) return 'left-2';
    if (diff === 6) return 'left';
    return 'hidden';
  };

  const getRoleStyle = (role: string) => {
    const styles: Record<string, React.CSSProperties> = {
      center: {
        transform: `translate3d(-50%, ${isMobile ? '-20vh' : '-12vh'}, 0) scale(${isMobile ? 4.4 : 2.5})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 30,
      },
      left: {
        transform: `translate3d(${isMobile ? '-140%' : '-170%'}, ${isMobile ? '-15vh' : '-2vh'}, 0) scale(${isMobile ? 1.05 : 0.7})`,
        filter: 'blur(1.5px)',
        opacity: 0.85,
        zIndex: 20,
      },
      right: {
        transform: `translate3d(${isMobile ? '40%' : '70%'}, ${isMobile ? '-15vh' : '-2vh'}, 0) scale(${isMobile ? 1.05 : 0.7})`,
        filter: 'blur(1.5px)',
        opacity: 0.85,
        zIndex: 20,
      },
      'left-2': {
        transform: `translate3d(${isMobile ? '-220%' : '-260%'}, ${isMobile ? '-12vh' : '-1.5vh'}, 0) scale(${isMobile ? 0.75 : 0.5})`,
        filter: 'blur(3px)',
        opacity: 0.5,
        zIndex: 10,
      },
      'right-2': {
        transform: `translate3d(${isMobile ? '120%' : '160%'}, ${isMobile ? '-12vh' : '-1.5vh'}, 0) scale(${isMobile ? 0.75 : 0.5})`,
        filter: 'blur(3px)',
        opacity: 0.5,
        zIndex: 10,
      },
      back: {
        transform: `translate3d(-50%, 0, 0) scale(0.3)`,
        filter: 'blur(5px)',
        opacity: 0,
        zIndex: 5,
      },
    };

    return styles[role] || {
      transform: 'translate3d(-50%, 0, 0) scale(0.3)',
      filter: 'blur(8px)',
      opacity: 0,
      zIndex: 0,
    };
  };

  const handleItemClick = (index: number) => {
    if (isAnimating) return;
    const diff = (index - activeIndex + 7) % 7;
    if (diff === 0) return;
    if (diff === 1 || diff === 2 || diff === 3) {
      navigate('next');
    } else {
      navigate('prev');
    }
  };

  const handleStackCardClick = (idx: number, positionIndex: number) => {
    if (positionIndex === 0) {
      // Front card clicked -> move to the next one
      setActiveStackIdx((prev) => (prev + 1) % 3);
    } else {
      // Background card clicked -> bring it to the front
      setActiveStackIdx(idx);
    }
  };

  useEffect(() => {
    // Fetch special item
    const specialQ = query(collection(db, 'menu'), where('isSpecial', '==', true), limit(1));
    const unsubSpecial = onSnapshot(specialQ, (snap) => {
      if (!snap.empty) {
        setSpecialItem({ id: snap.docs[0].id, ...snap.docs[0].data() } as MenuItem);
      } else {
        setSpecialItem(null);
      }
    }, () => setSpecialItem(null));

    // Fetch popular items
    const popularQ = query(collection(db, 'menu'), where('isPopular', '==', true), limit(6));
    const unsubPopular = onSnapshot(popularQ, (snap) => {
      if (!snap.empty) {
        setFeaturedItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem)));
      } else {
        // Fallback: just show first 3
        const fallbackQ = query(collection(db, 'menu'), limit(3));
        onSnapshot(fallbackQ, (fb) => {
          setFeaturedItems(fb.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem)));
          setLoading(false);
        });
        return;
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'menu');
      setLoading(false);
    });

    setLoading(false);
    return () => { unsubSpecial(); unsubPopular(); };
  }, []);

  return (
    <div className="space-y-28 pb-28">

      {/* ── Hero ── */}
      <section
        className="relative w-full h-[75vh] sm:h-[100vh] overflow-hidden bg-[#121212] select-none"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 z-[50]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='0.08' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Smooth transitioning backgrounds */}
        <div className="absolute inset-0 z-0">
          {CAROUSEL_DATA.map((item, idx) => (
            <div
              key={idx}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-[650ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                backgroundImage: `url(${item.bg})`,
                opacity: activeIndex === idx ? 1 : 0,
              }}
            />
          ))}
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 pointer-events-none" />
        </div>

        {/* Giant header container (positioned at top-[6px]) */}
        <div className="absolute inset-x-0 top-[6px] flex flex-col items-center justify-start pointer-events-none z-[15]">
          {/* Giant header text (Highly visible solid white background header using Flokison, 2x bigger) */}
          <div className="relative w-full h-[22vw] sm:h-[24vw] min-h-[120px] max-h-[380px] flex items-center justify-center">
            {CAROUSEL_DATA.map((item, idx) => (
              <span
                key={idx}
                className="absolute text-white transition-all duration-[650ms] ease-[cubic-bezier(0.25,1,0.5,1)] uppercase select-none font-black"
                style={{
                  fontFamily: "'Flokison', sans-serif",
                  fontSize: isMobile ? 'clamp(135px, 36vw, 380px)' : 'clamp(90px, 24vw, 380px)',
                  opacity: activeIndex === idx ? 0.9 : 0,
                  color: '#ffffff',
                  lineHeight: 0.8,
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                  transform: `scale(${activeIndex === idx ? 1 : 0.95})`,
                  textShadow: '0 4px 25px rgba(0,0,0,0.45)',
                }}
              >
                {item.title}
              </span>
            ))}
          </div>
        </div>

        {/* Carousel Plates (zIndex 25, sits in front of the giant text container) */}
        <div className="absolute inset-x-0 bottom-0 top-[10%] z-[25] pointer-events-none">
          {CAROUSEL_DATA.map((item, idx) => {
            const role = getRole(idx);
            const roleStyle = getRoleStyle(role);
            const isCenter = role === 'center';

            return (
              <div
                key={idx}
                onClick={() => handleItemClick(idx)}
                className={`absolute left-1/2 bottom-0 w-[150px] h-[150px] sm:w-[260px] sm:h-[260px] origin-bottom transition-all duration-[650ms] ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-auto ${
                  isCenter ? 'cursor-default' : 'cursor-pointer'
                }`}
                style={{
                  ...roleStyle,
                  willChange: 'transform, filter, opacity',
                }}
              >
                <img
                  src={item.src}
                  alt={item.translations[lang].name}
                  className="w-full h-full object-contain object-bottom select-none pointer-events-none"
                  draggable={false}
                  style={{
                    filter: isCenter
                      ? 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))'
                      : 'drop-shadow(0 8px 12px rgba(0,0,0,0.25))',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom row: glassy description box on the left, "Menyuni ko‘rish" link on the right, aligned middle (moved up) */}
        <div className="absolute bottom-26 sm:bottom-38 inset-x-3 sm:inset-x-16 z-[45] flex items-center justify-between pointer-events-none">
          {/* Glassy description box (length lessened, min-height & responsive padding for perfect mobile fit) */}
          <div className="pointer-events-auto max-w-[62vw] sm:max-w-[340px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex items-center px-3 sm:px-6 py-2.5 sm:py-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl"
                style={{ minHeight: 'calc(2.2 * clamp(20px, 3.5vw, 48px))' }}
              >
                <div>
                  <h2 className="font-sans font-bold uppercase tracking-[0.05em] text-[10px] sm:text-lg mb-0.5 sm:mb-1 leading-tight text-white">
                    {CAROUSEL_DATA[activeIndex].translations[lang].name}
                  </h2>
                  <p className="font-sans text-[8px] sm:text-xs text-white/80 leading-snug font-medium line-clamp-2">
                    {CAROUSEL_DATA[activeIndex].translations[lang].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Menyuni ko'rish button (moved up, vertically centered with the glassy bar) */}
          <div className="pointer-events-auto">
            <Link
              to="/menu"
              className="flex items-center space-x-2 text-white uppercase tracking-[-0.01em] hover:text-[#c8a96e] transition-colors duration-200 leading-none"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(20px, 3.5vw, 48px)',
                fontWeight: 400,
              }}
            >
              <span>
                {lang === 'uz' ? 'Menyuni ko‘rish' : lang === 'ru' ? 'Смотреть меню' : 'Discover Menu'}
              </span>
              <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 text-[#c8a96e]" strokeWidth={2.25} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Today's Special ── */}
      {specialItem && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Decorative ornament */}
            <UzRosette className="absolute left-[-80px] top-1/2 -translate-y-1/2 w-[240px] h-[240px] uz-spin-slow pointer-events-none hidden md:block" />

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl img-hover"
              style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.12)' }}
            >
              <img
                src={specialItem.image || undefined}
                alt={specialItem.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="inline-block text-[10px] font-bold tracking-[0.3em] text-[#c8a96e] uppercase border border-[#c8a96e]/25 rounded-full px-3 py-1 bg-[#c8a96e]/5">
                  {t.special.title}
                </span>
                <h3 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] font-traditional leading-tight">
                  {specialItem.name}
                </h3>
                <p className="text-gray-400 leading-relaxed text-base max-w-md">
                  {specialItem.description}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Clock size={16} className="text-[#c8a96e]" />
                  <span>20–25 min</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Star size={16} className="text-[#c8a96e] fill-[#c8a96e]" />
                  <span>{specialItem.rating} (120+ {t.home.reviews})</span>
                </div>
              </div>
              <Link to="/menu" className="inline-block">
                <AnimatedButton variant="accent">
                  {t.menu.price}: {specialItem.price}
                </AnimatedButton>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Popular Choices ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden md:overflow-visible">
        <UzOrnament className="absolute right-[-60px] top-[-40px] w-[200px] h-[200px] uz-bloom pointer-events-none hidden md:block" style={{ animationDelay: '1s' }} />

        <div className="flex justify-between items-end mb-14">
          <SectionHeader badge={t.nav.menu} title={t.home.popular} />
          <Link to="/menu" className="text-sm font-semibold text-gray-400 hover:text-[#c8a96e] transition-colors flex items-center gap-1.5 mb-2">
            <span>{t.home.viewAll}</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#c8a96e] animate-spin" />
          </div>
        ) : (
          <div className="relative w-full max-w-sm mx-auto h-[530px] flex items-center justify-center">
            {featuredItems.slice(0, 3).map((item, idx) => {
              const positionIndex = (idx - activeStackIdx + 3) % 3;
              
              let rotate = 0;
              let scale = 1;
              let x = 0;
              let y = 0;
              let zIndex = 30;
              let opacity = 1;

              if (positionIndex === 0) {
                rotate = 0;
                scale = 1;
                x = 0;
                y = 0;
                zIndex = 30;
                opacity = 1;
              } else if (positionIndex === 1) {
                rotate = 5;
                scale = 0.95;
                x = isMobile ? 24 : 35;
                y = 12;
                zIndex = 20;
                opacity = 0.9;
              } else if (positionIndex === 2) {
                rotate = -5;
                scale = 0.9;
                x = isMobile ? -24 : -35;
                y = 24;
                zIndex = 10;
                opacity = 0.75;
              }

              return (
                <motion.div
                  key={item.id}
                  style={{ zIndex }}
                  animate={{
                    rotate,
                    scale,
                    x,
                    y,
                    opacity,
                  }}
                  whileHover={positionIndex === 0 ? { y: -8 } : undefined}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 25,
                  }}
                  onClick={() => handleStackCardClick(idx, positionIndex)}
                  className="absolute w-full cursor-pointer select-none origin-bottom"
                >
                  <SomsaCard {...item} index={idx} isStacked={true} />
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick Info section removed */}

    </div>
  );
};

export default Home;

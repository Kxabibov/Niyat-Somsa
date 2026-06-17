import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    // Lenis smooth scroll is desktop-only — on touch devices native scroll is faster
    if (window.matchMedia('(hover: none)').matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    (window as any).lenisInstance = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      (window as any).lenisInstance = null;
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`flex-grow relative z-10 ${isHome ? 'pt-[60px]' : 'pt-24'}`}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;

import React, { useEffect, useRef } from 'react';
import { Star, Heart, Users, Coffee } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import ParticleCanvas from '../components/ParticleCanvas';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const panels = containerRef.current.querySelectorAll('.roadmap-panel');
    const stickyFrame = containerRef.current.querySelector('.sticky-frame');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top+=80',
          end: '+=300%', // Scrolls 3x viewport height
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // Animate transition of each panel (starting from panel index 1)
      panels.forEach((panel, i) => {
        if (i === 0) return;

        // Slide up the panel
        tl.fromTo(
          panel,
          { yPercent: 100, opacity: 0.9 },
          { yPercent: 0, opacity: 1, ease: 'none' }
        );

        // Tilt the image inside the panel as it enters
        const img = panel.querySelector('.panel-image');
        if (img) {
          tl.fromTo(
            img,
            { rotate: i % 2 === 0 ? -12 : 12, scale: 0.95 },
            { rotate: i % 2 === 0 ? 3 : -3, scale: 1, ease: 'power2.out' },
            '<' // Same time as the panel slides up
          );
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 pb-24">
      {/* Story Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-accent uppercase tracking-[0.2em]">
              {t.nav.about}
            </h2>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary font-traditional tracking-tight">
              {t.about.title}
            </h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t.about.content}
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t.about.content2}
          </p>
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="space-y-2">
              <h4 className="text-3xl font-bold text-primary font-traditional">15+</h4>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">{t.about.stats.years}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-bold text-primary font-traditional">5000+</h4>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">{t.about.stats.daily}</p>
            </div>
          </div>
        </motion.div>

        {/* Aesthetic Two-Image Composition */}
        <div className="relative w-full h-[400px] sm:h-[480px] select-none">
          {/* Main Large Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-[75%] h-[80%] rounded-3xl overflow-hidden shadow-2xl border border-white/40"
          >
            <img
              src="https://picsum.photos/seed/bakery-life/800/800"
              alt="Bakery Story Main"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply"></div>
          </motion.div>

          {/* Overlapping Small Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 6, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 4, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute bottom-0 right-0 w-[55%] h-[60%] rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white"
          >
            <img
              src="https://picsum.photos/seed/somsa-bake/800/800"
              alt="Bakery Story Secondary"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply"></div>
          </motion.div>
        </div>
      </section>

      {/* Values Roadmap Section: GSAP Pinned Reveal */}
      <section ref={containerRef} className="relative w-full py-16 overflow-hidden">
        {/* Sticky Container Frame */}
        <div className="sticky-frame relative w-full h-[80vh] min-h-[500px] max-h-[750px] flex items-center justify-center overflow-hidden rounded-[2.5rem] border border-gray-100 bg-[#FAF7F2] shadow-xl">
          
          {/* Panel 1: Handmade */}
          <div className="roadmap-panel absolute inset-0 w-full h-full p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 bg-[#FDFCFA] z-10">
            <div className="md:w-1/2 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-accent">
                <Heart size={28} />
              </div>
              <h3 className="text-3xl font-bold text-primary font-traditional">{t.about.features.handmade.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                {t.about.features.handmade.desc}
              </p>
            </div>
            <div className="md:w-1/2 aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border-2 border-white/60">
              <img
                src="https://picsum.photos/seed/handmade/600/600"
                alt="Handmade feature"
                className="panel-image w-full h-full object-cover transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Panel 2: Authentic */}
          <div className="roadmap-panel absolute inset-0 w-full h-full p-8 md:p-16 flex flex-col md:flex-row-reverse items-center justify-between gap-12 bg-[#F6F3EE] z-20">
            <div className="md:w-1/2 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-accent shadow-sm">
                <Star size={28} />
              </div>
              <h3 className="text-3xl font-bold text-primary font-traditional">{t.about.features.authentic.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                {t.about.features.authentic.desc}
              </p>
            </div>
            <div className="md:w-1/2 aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border-2 border-white/60">
              <img
                src="https://picsum.photos/seed/authentic/600/600"
                alt="Authentic feature"
                className="panel-image w-full h-full object-cover transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Panel 3: Community */}
          <div className="roadmap-panel absolute inset-0 w-full h-full p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 bg-[#EFECE6] z-30">
            <div className="md:w-1/2 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-accent shadow-sm">
                <Users size={28} />
              </div>
              <h3 className="text-3xl font-bold text-primary font-traditional">{t.about.features.community.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                {t.about.features.community.desc}
              </p>
            </div>
            <div className="md:w-1/2 aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border-2 border-white/60">
              <img
                src="https://picsum.photos/seed/community/600/600"
                alt="Community feature"
                className="panel-image w-full h-full object-cover transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Panel 4: Fresh */}
          <div className="roadmap-panel absolute inset-0 w-full h-full p-8 md:p-16 flex flex-col md:flex-row-reverse items-center justify-between gap-12 bg-[#EADECE] z-40">
            <div className="md:w-1/2 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-accent shadow-sm">
                <Coffee size={28} />
              </div>
              <h3 className="text-3xl font-bold text-primary font-traditional">{t.about.features.fresh.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                {t.about.features.fresh.desc}
              </p>
            </div>
            <div className="md:w-1/2 aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border-2 border-white/60">
              <img
                src="https://picsum.photos/seed/fresh/600/600"
                alt="Fresh feature"
                className="panel-image w-full h-full object-cover transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Cultural Accent Section */}
      <section className="relative py-24 rounded-3xl overflow-hidden bg-primary text-white text-center space-y-8">
        <ParticleCanvas particleColor="rgba(200, 169, 110, 0.4)" lineColor="rgba(200, 169, 110, 0.15)" />
        <div className="absolute inset-0 opacity-10 uz-pattern"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold font-traditional">{t.about.heritage.title}</h2>
          <p className="text-white/80 leading-relaxed text-lg">
            {t.about.heritage.desc}
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:space-x-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">100%</div>
              <div className="text-xs uppercase tracking-widest font-bold text-white/60">{t.about.heritage.natural}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">{t.about.heritage.tandir}</div>
              <div className="text-xs uppercase tracking-widest font-bold text-white/60">{t.about.heritage.baked}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">{t.about.heritage.halal}</div>
              <div className="text-xs uppercase tracking-widest font-bold text-white/60">{t.about.heritage.certified}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingBag, Plus, Minus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useCartFavourites } from '../context/CartFavouritesContext';
import AnimatedButton from './AnimatedButton';

interface SomsaCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  rating: number;
  category: string;
  index?: number;
  isStacked?: boolean;
}

const SomsaCard: React.FC<SomsaCardProps> = ({
  id,
  name,
  price,
  image,
  description,
  rating,
  category,
  index = 0,
  isStacked = false,
}) => {
  const { t } = useLanguage();
  const { cart, addToCart, decrementCartItem, toggleFavourite, isFavourite } = useCartFavourites();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const cartItem = cart.find((item) => item.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isFav = isFavourite(id);

  const cardContent = (
    <div
      className={`${isStacked ? '' : 'hover-lift'} group bg-white rounded-3xl overflow-hidden border border-gray-100/80 flex flex-col h-full cursor-pointer`}
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      onClick={() => !isStacked && setModalOpen(true)}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative img-hover">
        <img
          src={image || undefined}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        {/* Category badge */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-[10px] font-bold text-white/95 uppercase tracking-widest">
          {category}
        </div>
        {/* Rating badge */}
        <div className="absolute top-4 right-4 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center space-x-1 shadow-sm">
          <Star size={11} className="fill-[#c8a96e] text-[#c8a96e]" />
          <span className="text-[10px] font-bold text-[#1a1a1a]">{rating}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-6 space-y-2 sm:space-y-4 flex-grow flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="text-sm sm:text-lg font-bold text-[#1a1a1a] font-traditional leading-tight truncate">{name}</h4>
          <p className="text-xs sm:text-sm font-bold text-accent">{price}</p>
        </div>

        {/* Buttons: Favourites and Add to Cart */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 pt-1 sm:pt-2" onClick={(e) => e.stopPropagation()}>
          {/* Fav button */}
          <button
            onClick={() => toggleFavourite(id)}
            className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all duration-300 shrink-0 ${
              isFav
                ? 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100/50'
                : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50/50 hover:border-red-50'
            }`}
          >
            <Heart className={`${isFav ? 'fill-red-500' : ''} sm:w-4 sm:h-4 w-3.5 h-3.5`} />
          </button>

          {/* View details button styled like Uiverse button - opens popup or redirects to menu */}
          <AnimatedButton
            onClick={(e) => {
              e.stopPropagation();
              if (isStacked) {
                navigate('/menu');
              } else {
                setModalOpen(true);
              }
            }}
            className="flex-grow"
          >
            <span>{t.home.viewButton}</span>
          </AnimatedButton>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isStacked ? (
        cardContent
      ) : (
        <motion.div
          layout
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full"
        >
          {cardContent}
        </motion.div>
      )}

      {/* Product Details Popup Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative bg-white w-full max-w-3xl rounded-[1.8rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 max-h-[92vh] md:max-h-none flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-2 bg-white/80 backdrop-blur-md hover:bg-white rounded-full text-gray-500 hover:text-[#1a1a1a] shadow-sm transition-all"
              >
                <X size={16} />
              </button>

              {/* Left Column: Image */}
              <div className="relative h-40 sm:h-52 md:h-full overflow-hidden shrink-0">
                <img src={image} alt={name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Right Column: Info & CTA */}
              <div className="p-5 sm:p-8 md:p-10 flex flex-col justify-between space-y-4 md:space-y-6 overflow-y-auto">
                <div className="space-y-2 md:space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] sm:text-[10px] font-bold text-accent uppercase tracking-widest border border-accent/20 px-2 sm:px-2.5 py-0.5 rounded-full bg-accent/5">
                      {category}
                    </span>
                    <div className="flex items-center space-x-1 shrink-0">
                      <Star size={11} className="fill-[#c8a96e] text-[#c8a96e] sm:w-[13px] sm:h-[13px]" />
                      <span className="text-[11px] sm:text-xs font-bold text-[#1a1a1a]">{rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary font-traditional leading-tight">
                    {name}
                  </h3>
                  
                  <p className="text-lg sm:text-xl font-bold text-accent">
                    {price}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-h-[70px] md:max-h-[150px] overflow-y-auto pr-2">
                    {description || 'Siz sevgan, har doim issiq va toʻyimli anʼanaviy oʻzbek taomi.'}
                  </p>
                </div>

                <div className="space-y-3 md:space-y-4 pt-1 md:pt-2">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    {/* Quantity Selector or Add to Bucket Button */}
                    {quantity > 0 ? (
                      <div className="flex items-center space-x-3 sm:space-x-4 bg-gray-50 border border-gray-100/60 p-1 sm:p-1.5 rounded-[12px] sm:rounded-[14px]">
                        <button
                          onClick={() => decrementCartItem(id)}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 shadow-sm transition-all"
                        >
                          <Minus size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <span className="text-sm sm:text-base font-bold text-primary w-6 sm:w-8 text-center">{quantity}</span>
                        <button
                          onClick={() => addToCart(id)}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center text-gray-500 hover:text-[#c8a96e] hover:bg-[#FAF7F2] shadow-sm transition-all"
                        >
                          <Plus size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ) : (
                      <AnimatedButton
                        variant="primary"
                        onClick={() => addToCart(id)}
                        className="flex-grow py-2 sm:py-2.5"
                      >
                        <ShoppingBag size={14} className="sm:w-[15px] sm:h-[15px]" />
                        <span className="text-xs sm:text-sm">Savatga qoʻshish</span>
                      </AnimatedButton>
                    )}

                    {/* Toggle Fav in Modal */}
                    <button
                      onClick={() => toggleFavourite(id)}
                      className={`p-3 sm:p-4 rounded-[12px] sm:rounded-[14px] border transition-all duration-300 ${
                        isFav
                          ? 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100/50'
                          : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50/50 hover:border-red-50'
                      }`}
                    >
                      <Heart size={16} className={`${isFav ? 'fill-red-500' : ''} sm:w-[20px] sm:h-[20px]`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SomsaCard;

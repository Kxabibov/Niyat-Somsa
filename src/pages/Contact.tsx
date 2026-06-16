import React, { useState } from 'react';
import { Send, Phone, MapPin, Instagram, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import HangingIcons from '../components/HangingIcons';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'contacts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 pb-24">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary font-traditional tracking-tight">
          {t.contact.title}
        </h1>
        <p className="text-gray-500 leading-relaxed">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl space-y-8 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                    {t.contact.name}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all outline-none text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                    {t.contact.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all outline-none text-sm"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                    {t.contact.message}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent transition-all outline-none text-sm resize-none"
                    placeholder="Tell us something..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-btn-accent w-full py-4 rounded-full font-bold flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HangingIcons />
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{t.contact.send}</span>
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform z-10" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-2xl font-bold text-primary font-traditional">{t.contact.thankYou}</h3>
                <p className="text-gray-500 max-w-xs mx-auto">{t.contact.success}</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm font-bold text-accent hover:underline"
                >
                  {t.contact.sendAnother}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-12 lg:pl-12"
        >
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-primary font-traditional">{t.contact.getInTouch}</h3>
            <p className="text-gray-500 leading-relaxed">
              {t.contact.touchSubtitle}
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-accent flex-shrink-0">
                <Phone size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t.contact.phoneLabel}</h4>
                <p className="text-lg font-bold text-primary">+998 90 123 45 67</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-accent flex-shrink-0">
                <Mail size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t.contact.emailLabel}</h4>
                <p className="text-lg font-bold text-primary">hello@samsabakery.uz</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-accent flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t.contact.locationLabel}</h4>
                <p className="text-lg font-bold text-primary">{t.location.address}</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 space-y-6">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t.contact.followUs}</h4>
            <div className="flex space-x-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-primary hover:text-accent transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                  <Instagram size={20} />
                </div>
                <span className="font-bold">Instagram</span>
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-primary hover:text-accent transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                  <Send size={20} />
                </div>
                <span className="font-bold">Telegram</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;

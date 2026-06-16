import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Navigation, ExternalLink, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import HangingIcons from '../components/HangingIcons';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const Location: React.FC = () => {
  const { t } = useLanguage();
  const defaultBranches = [
    {
      id: 'seliskiy',
      name: 'Seliskiy filial',
      lat: 39.61583395,
      lng: 66.95666921,
      phone: '+998 90 123 45 67',
      workingHours: '08:00 - 22:00',
      closedDays: '',
      mapUrl: 'https://maps.google.com/?q=39.61583395,66.95666921&z=18'
    },
    {
      id: 'limonadniy',
      name: 'Limonadniy filial',
      lat: 39.64482178,
      lng: 66.96929061,
      phone: '+998 90 765 43 21',
      workingHours: '08:00 - 23:00',
      closedDays: '',
      mapUrl: 'https://maps.google.com/?q=39.64482178,66.96929061&z=14'
    },
    {
      id: 'oqmachit',
      name: 'Oqmachit filial',
      lat: 39.6210414,
      lng: 66.99595928,
      phone: '+998 90 999 88 77',
      workingHours: '09:00 - 21:00',
      closedDays: 'Yakshanba',
      mapUrl: 'https://maps.google.com/?q=39.6210414,66.99595928&z=15'
    },
    {
      id: 'gulbog',
      name: "Gulbog' filial",
      lat: 39.6107335,
      lng: 66.9733386,
      phone: '+998 90 555 44 33',
      workingHours: '08:00 - 20:00',
      closedDays: '',
      mapUrl: 'https://maps.google.com/?q=39.6107335,66.9733386&z=16'
    }
  ];

  const [branches, setBranches] = useState<any[]>(defaultBranches);
  const [selectedBranch, setSelectedBranch] = useState<any | null>(defaultBranches[0]);
  const [closestBranch, setClosestBranch] = useState<{ branch: any; distance: number } | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'branches'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBranches(list);
        setSelectedBranch(prev => {
          if (prev) {
            const found = list.find(b => b.id === prev.id || b.name === prev.name);
            return found || list[0];
          }
          return list[0];
        });
      }
    });
    return unsubscribe;
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleFindClosest = () => {
    if (!navigator.geolocation) {
      alert("Sizning brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;

        if (branches.length === 0) {
          setLocating(false);
          return;
        }

        let minDistance = Infinity;
        let nearest: any = null;

        branches.forEach((b) => {
          if (b.lat && b.lng) {
            const dist = calculateDistance(uLat, uLng, b.lat, b.lng);
            if (dist < minDistance) {
              minDistance = dist;
              nearest = b;
            }
          }
        });

        if (nearest) {
          setClosestBranch({ branch: nearest, distance: parseFloat(minDistance.toFixed(2)) });
          setSelectedBranch(nearest);
        }
        setLocating(false);
      },
      (error) => {
        alert("Geolokatsiya aniqlanmadi. GPS yoki ruxsat berilganligini tekshiring.");
        setLocating(false);
      }
    );
  };

  const mapUrl = selectedBranch && selectedBranch.lat && selectedBranch.lng
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${selectedBranch.lng - 0.005}%2C${selectedBranch.lat - 0.005}%2C${selectedBranch.lng + 0.005}%2C${selectedBranch.lat + 0.005}&layer=mapnik&marker=${selectedBranch.lat}%2C${selectedBranch.lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=66.93%2C39.60%2C67.01%2C39.66&layer=mapnik`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary font-traditional tracking-tight">
          {t.location.title}
        </h1>
        <p className="text-gray-500 leading-relaxed">
          {t.location.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative aspect-square md:aspect-video lg:aspect-square bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-xl"
        >
          <iframe
            title="Bakery Location"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={mapUrl}
            className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
          ></iframe>
          {selectedBranch?.lat && selectedBranch?.lng && (
            <div className="absolute bottom-6 right-6">
              <a
                href={`https://maps.google.com/?q=${selectedBranch.lat},${selectedBranch.lng}&z=16`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn text-xs font-bold flex items-center space-x-2 py-3 px-6"
              >
                <HangingIcons />
                <span>{t.location.openMaps}</span>
                <ExternalLink size={14} className="z-10" />
              </a>
            </div>
          )}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8 lg:pl-6"
        >
          {/* Branch List / Selector */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-2xl font-bold text-primary font-traditional">Filiallarimiz</h3>
              <button
                onClick={handleFindClosest}
                disabled={locating}
                className="glass-btn-accent text-xs font-bold flex items-center space-x-2 py-2.5 px-4 rounded-xl disabled:opacity-50"
              >
                <Compass size={14} className={locating ? 'animate-spin' : ''} />
                <span>{locating ? "Qidirilmoqda..." : "Eng yaqin filialni aniqlash"}</span>
              </button>
            </div>

            {closestBranch && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between text-emerald-800"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold uppercase tracking-wider">Eng yaqin filial topildi!</p>
                  <p className="text-sm font-bold">{closestBranch.branch.name} ({closestBranch.distance} km uzoqlikda)</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MapPin size={16} />
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {branches.length === 0 ? (
                <div className="col-span-2 text-center py-6 text-gray-400 italic">Filiallar yuklanmoqda...</div>
              ) : (
                branches.map((b) => {
                  const isSelected = selectedBranch?.id === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBranch(b)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
                        isSelected
                          ? 'bg-[#c8a96e]/10 border-[#c8a96e] shadow-md'
                          : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-primary font-traditional text-base leading-tight">{b.name}</h4>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        )}
                      </div>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Clock size={12} className="text-accent shrink-0" />
                          <span>{b.workingHours || '08:00 - 20:00'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone size={12} className="text-accent shrink-0" />
                          <span>{b.phone || '+998 90 123 4567'}</span>
                        </div>
                        {b.closedDays && (
                          <div className="text-[10px] text-red-500 font-bold mt-1">
                            Dam olish kuni: {b.closedDays}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {selectedBranch && (
            <div className="border-t border-gray-100 pt-8 space-y-6">
              <h3 className="text-xl font-bold text-primary font-traditional">Filial Tafsilotlari</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Working Hours */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-primary font-bold text-sm">
                    <Clock size={16} className="text-accent" />
                    <span>Ish vaqti</span>
                  </div>
                  <p className="text-sm text-gray-600 pl-7">{selectedBranch.workingHours || '08:00 - 20:00'}</p>
                  {selectedBranch.closedDays && (
                    <p className="text-xs text-red-500 pl-7 font-bold">Dam olish kuni: {selectedBranch.closedDays}</p>
                  )}
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-primary font-bold text-sm">
                    <Phone size={16} className="text-accent" />
                    <span>Telefon raqam</span>
                  </div>
                  <p className="text-sm text-gray-600 pl-7">{selectedBranch.phone || '+998 90 123 45 67'}</p>
                </div>
              </div>

              {selectedBranch.lat && selectedBranch.lng && (
                <div className="pt-2">
                  <a
                    href={`https://maps.google.com/?q=${selectedBranch.lat},${selectedBranch.lng}&z=16`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-btn-accent font-medium flex items-center space-x-2 py-4 px-8 rounded-full max-w-xs justify-center"
                  >
                    <HangingIcons />
                    <Navigation size={18} className="z-10" />
                    <span>{t.location.getDirections}</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Location;

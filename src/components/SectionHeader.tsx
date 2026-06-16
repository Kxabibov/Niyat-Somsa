import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ badge, title, subtitle }) => {
  return (
    <div className="space-y-3">
      {badge && (
        <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-[0.25em] text-[#c8a96e] uppercase border border-[#c8a96e]/30 rounded-full bg-[#c8a96e]/5">
          {badge}
        </span>
      )}
      <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-[#1a1a1a] font-traditional leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-gray-400 leading-relaxed max-w-md">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;

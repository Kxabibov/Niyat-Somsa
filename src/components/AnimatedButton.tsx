import React, { useInsertionEffect } from 'react';
import HangingIcons from './HangingIcons';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'ghost';
  children: React.ReactNode;
}

const BUTTON_CSS = `
.uiverse-btn {
  position: relative;
  padding: 10px 28px;
  background: #c8a96e;
  font-size: 13px;
  font-weight: 700;
  color: #1a1614;
  cursor: pointer;
  border: 1px solid #c8a96e;
  border-radius: 14px;
  filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.15));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease-in-out;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  overflow: hidden;
}

.uiverse-btn:hover {
  border-color: #bba16b;
  background: linear-gradient(85deg, #c8a96e, #d6b77b, #e4c588, #d6b77b, #c8a96e);
  background-size: 200% 200%;
  animation: wind-anim 2s ease-in-out infinite;
}

@keyframes wind-anim {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.uiverse-btn .icon-1 {
  position: absolute;
  top: 2px; right: 6px;
  width: 18px;
  transform-origin: 0 0;
  transform: rotate(10deg);
  transition: all 0.5s ease-in-out;
  filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.3));
}
.uiverse-btn:hover .icon-1 {
  animation: slay-1-anim 3s cubic-bezier(0.52,0,0.58,1) infinite;
}
@keyframes slay-1-anim {
  0%,100% { transform: rotate(10deg); }
  50%     { transform: rotate(-5deg); }
}

.uiverse-btn .icon-2 {
  position: absolute;
  top: 2px; left: 16px;
  width: 10px;
  transform-origin: 50% 0;
  transform: rotate(10deg);
  transition: all 1s ease-in-out;
  filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.5));
}
.uiverse-btn:hover .icon-2 {
  animation: slay-2-anim 3s cubic-bezier(0.52,0,0.58,1) 1s infinite;
  transform: rotate(0);
}
@keyframes slay-2-anim {
  0%,100% { transform: rotate(0deg); }
  50%     { transform: rotate(15deg); }
}

.uiverse-btn .icon-3 {
  position: absolute;
  top: 2px; left: 4px;
  width: 14px;
  transform-origin: 50% 0;
  transform: rotate(-5deg);
  transition: all 1s ease-in-out;
  filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.5));
}
.uiverse-btn:hover .icon-3 {
  animation: slay-3-anim 2s cubic-bezier(0.52,0,0.58,1) 1s infinite;
  transform: rotate(0);
}
@keyframes slay-3-anim {
  0%,100% { transform: rotate(0deg); }
  50%     { transform: rotate(-5deg); }
}

@keyframes soft-glow {
  0%,100% { box-shadow: 0 0 4px rgba(200,169,110,0.3); }
  50%     { box-shadow: 0 0 12px rgba(200,169,110,0.7), 0 0 4px rgba(200,169,110,0.3); }
}

@media (max-width: 639px) {
  .uiverse-btn {
    border-radius: 9999px !important;
    padding: 8px 18px !important;
    font-size: 11px !important;
    animation: soft-glow 2s infinite ease-in-out !important;
  }
  .uiverse-btn .icon-1,
  .uiverse-btn .icon-2,
  .uiverse-btn .icon-3 { display: none !important; }
}
`;

let styleInjected = false;

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  useInsertionEffect(() => {
    if (styleInjected) return;
    const el = document.createElement('style');
    el.textContent = BUTTON_CSS;
    document.head.appendChild(el);
    styleInjected = true;
  }, []);

  return (
    <button className={`uiverse-btn ${className}`} {...props}>
      <span className="relative z-10">{children}</span>
      <HangingIcons />
    </button>
  );
};

export default AnimatedButton;

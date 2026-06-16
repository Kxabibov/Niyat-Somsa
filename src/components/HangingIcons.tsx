import React from 'react';

const Leaf: React.FC<{ x: number; y: number; rotate: number; scale?: number }> = ({ x, y, rotate, scale = 1 }) => (
  <path
    d="M0 0 C-2 -2 -3 -5 0 -8 C3 -5 2 -2 0 0"
    transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}
    fill="currentColor"
  />
);

const HangingIcons: React.FC = () => {
  return (
    <>
      {/* Icon 1: 8 leaves */}
      <div className="icon-1 pointer-events-none">
        <svg viewBox="0 0 40 40" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="38" x2="20" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          {/* 8 leaves total */}
          <Leaf x={20} y={5} rotate={0} /> {/* 1 */}
          <Leaf x={20} y={13} rotate={-55} /> {/* 2 */}
          <Leaf x={20} y={13} rotate={55} /> {/* 3 */}
          <Leaf x={20} y={21} rotate={-55} /> {/* 4 */}
          <Leaf x={20} y={21} rotate={55} /> {/* 5 */}
          <Leaf x={20} y={29} rotate={-55} /> {/* 6 */}
          <Leaf x={20} y={29} rotate={55} /> {/* 7 */}
          <Leaf x={20} y={35} rotate={-55} /> {/* 8 */}
        </svg>
      </div>

      {/* Icon 2: 6 leaves */}
      <div className="icon-2 pointer-events-none">
        <svg viewBox="0 0 40 30" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="28" x2="20" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          {/* 6 leaves total */}
          <Leaf x={20} y={5} rotate={0} /> {/* 1 */}
          <Leaf x={20} y={12} rotate={-55} /> {/* 2 */}
          <Leaf x={20} y={12} rotate={55} /> {/* 3 */}
          <Leaf x={20} y={19} rotate={-55} /> {/* 4 */}
          <Leaf x={20} y={19} rotate={55} /> {/* 5 */}
          <Leaf x={20} y={25} rotate={-55} /> {/* 6 */}
        </svg>
      </div>

      {/* Icon 3: 10 leaves, bigger last one */}
      <div className="icon-3 pointer-events-none">
        <svg viewBox="0 0 40 48" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="46" x2="20" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          {/* 10 leaves total */}
          <Leaf x={20} y={5} rotate={0} /> {/* 1 */}
          <Leaf x={20} y={13} rotate={-55} /> {/* 2 */}
          <Leaf x={20} y={13} rotate={55} /> {/* 3 */}
          <Leaf x={20} y={21} rotate={-55} /> {/* 4 */}
          <Leaf x={20} y={21} rotate={55} /> {/* 5 */}
          <Leaf x={20} y={29} rotate={-55} /> {/* 6 */}
          <Leaf x={20} y={29} rotate={55} /> {/* 7 */}
          <Leaf x={20} y={37} rotate={-55} /> {/* 8 */}
          <Leaf x={20} y={37} rotate={55} /> {/* 9 */}
          <Leaf x={20} y={43} rotate={-55} /> {/* 10 */}
        </svg>
      </div>
    </>
  );
};

export default HangingIcons;

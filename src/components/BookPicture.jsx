import React, { useId } from 'react';

/**
 * কিতাবের দারসের জন্য নিজস্ব ৩D-স্টাইল SVG ছবি (গ্রেডিয়েন্ট, আলো-ছায়া, গভীরতা)।
 * কোনো প্রাণীর ছবি নেই। প্রতিটি ছবি 120x120 viewBox-এ আঁকা; আলো উপর-বাম দিক থেকে।
 */

// সমান দূরত্বে স্টপসহ লিনিয়ার গ্রেডিয়েন্ট (dir: v = উপর→নিচ, h = বাম→ডান, d = কোণাকুণি)
export function Lin({ id, c, dir = 'v' }) {
  const [x2, y2] = dir === 'h' ? [1, 0] : dir === 'd' ? [1, 1] : [0, 1];
  return (
    <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
      {c.map((color, i) => (
        <stop key={i} offset={c.length === 1 ? 0 : i / (c.length - 1)} stopColor={color} />
      ))}
    </linearGradient>
  );
}

// উপর-বাম থেকে আলো পড়া রেডিয়াল গ্রেডিয়েন্ট
export function Rad({ id, c, cx = 0.35, cy = 0.3, r = 0.8 }) {
  return (
    <radialGradient id={id} cx={cx} cy={cy} r={r}>
      {c.map((color, i) => (
        <stop key={i} offset={i / (c.length - 1)} stopColor={color} />
      ))}
    </radialGradient>
  );
}

const Shadow = ({ u, cx = 60, cy = 108, rx = 40, ry = 7 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#0f172a" opacity="0.22" filter={u('blur')} />
);

const Gloss = ({ d, opacity = 0.35 }) => <path d={d} fill="#ffffff" opacity={opacity} />;

const WOOD = ['#fcd34d', '#d97706', '#92400e'];
const GOLD = ['#fef3c7', '#fbbf24', '#b45309'];
const GLASS = ['#e0f2fe', '#7dd3fc', '#0284c7'];
const METAL = ['#f1f5f9', '#94a3b8', '#475569'];

const PICTURES = {
  book: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('cover')} c={['#6ee7b7', '#10b981', '#047857']} dir="d" />
        <Lin id={id('spine')} c={['#047857', '#065f46', '#064e3b']} dir="h" />
        <Lin id={id('pages')} c={['#fffbeb', '#fde68a']} dir="h" />
        <Lin id={id('top')} c={['#a7f3d0', '#34d399']} dir="h" />
        <Rad id={id('gold')} c={GOLD} />
      </defs>
      <Shadow u={u} rx="42" />
      <path d="M84 22 L96 13 V93 L84 102 Z" fill={u('pages')} />
      <path d="M86 30 L94 24 M86 44 L94 38 M86 58 L94 52 M86 72 L94 66 M86 86 L94 80" stroke="#d6b36a" strokeWidth="1" opacity="0.7" />
      <path d="M26 22 L38 13 H96 L84 22 Z" fill={u('top')} />
      <rect x="22" y="22" width="64" height="80" rx="7" fill={u('cover')} />
      <rect x="22" y="22" width="13" height="80" rx="6" fill={u('spine')} />
      <rect x="43" y="34" width="34" height="9" rx="4.5" fill={u('gold')} />
      <g transform="translate(60 70)">
        <rect x="-12" y="-12" width="24" height="24" rx="3" fill={u('gold')} />
        <rect x="-12" y="-12" width="24" height="24" rx="3" fill={u('gold')} transform="rotate(45)" />
        <circle r="6" fill="#059669" />
        <circle r="2.5" fill="#a7f3d0" />
      </g>
      <path d="M74 100 V116 L79 111 L84 116 V100 Z" fill="#e11d48" />
      <Gloss d="M38 26 H78 Q82 26 80 30 L44 56 Q38 60 38 52 Z" opacity="0.18" />
    </g>
  ),

  pen: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('body')} c={['#075985', '#38bdf8', '#0ea5e9', '#0c4a6e']} dir="h" />
        <Lin id={id('cap')} c={['#1e1b4b', '#4f46e5', '#312e81']} dir="h" />
        <Lin id={id('gold')} c={['#b45309', '#fde68a', '#d97706']} dir="h" />
        <Lin id={id('grip')} c={['#1e293b', '#64748b', '#0f172a']} dir="h" />
      </defs>
      <Shadow u={u} cx="62" rx="34" />
      <g transform="rotate(38 60 58)">
        <rect x="50" y="4" width="20" height="74" rx="10" fill={u('body')} />
        <rect x="50" y="4" width="20" height="30" rx="10" fill={u('cap')} />
        <rect x="50" y="31" width="20" height="5" fill={u('gold')} />
        <rect x="67" y="9" width="4.5" height="26" rx="2.2" fill={u('gold')} />
        <rect x="53" y="77" width="14" height="10" rx="2" fill={u('grip')} />
        <path d="M53 87 H67 L60 112 Z" fill={u('gold')} />
        <path d="M60 93 V106" stroke="#78350f" strokeWidth="1.4" />
        <circle cx="60" cy="93" r="2" fill="#78350f" />
        <rect x="54" y="10" width="4" height="62" rx="2" fill="#ffffff" opacity="0.35" />
      </g>
    </g>
  ),

  chair: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('wood')} c={WOOD} dir="d" />
        <Lin id={id('leg')} c={['#78350f', '#b45309', '#451a03']} dir="h" />
        <Lin id={id('seat')} c={['#fde68a', '#f59e0b']} dir="v" />
        <Lin id={id('cushion')} c={['#6ee7b7', '#10b981', '#047857']} dir="d" />
      </defs>
      <Shadow u={u} rx="38" />
      <rect x="40" y="70" width="6" height="30" rx="3" fill={u('leg')} />
      <rect x="76" y="70" width="6" height="30" rx="3" fill={u('leg')} />
      <path d="M38 12 H80 Q86 12 86 18 V62 H34 V16 Q34 12 38 12 Z" fill={u('wood')} />
      <rect x="40" y="18" width="40" height="38" rx="6" fill={u('cushion')} />
      <Gloss d="M44 22 H70 Q74 22 70 26 L48 44 Q44 47 44 42 Z" opacity="0.3" />
      <path d="M34 62 H86 L94 72 H26 Z" fill={u('seat')} />
      <path d="M26 72 H94 V79 Q94 82 91 82 H29 Q26 82 26 79 Z" fill="#b45309" />
      <rect x="28" y="80" width="8" height="28" rx="4" fill={u('leg')} />
      <rect x="84" y="80" width="8" height="28" rx="4" fill={u('leg')} />
    </g>
  ),

  house: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('front')} c={['#fffbeb', '#fde68a']} dir="v" />
        <Lin id={id('side')} c={['#fcd34d', '#d97706']} dir="v" />
        <Lin id={id('roof')} c={['#5eead4', '#0d9488', '#115e59']} dir="d" />
        <Lin id={id('roofSide')} c={['#14b8a6', '#0f766e']} dir="v" />
        <Lin id={id('glass')} c={GLASS} dir="d" />
        <Lin id={id('door')} c={WOOD} dir="d" />
      </defs>
      <Shadow u={u} cx="64" rx="48" />
      <path d="M70 56 L104 44 V92 L70 104 Z" fill={u('side')} />
      <path d="M58 16 L104 44 L70 56 L36 30 Z" fill={u('roofSide')} />
      <path d="M16 58 H70 V104 H16 Z" fill={u('front')} />
      <path d="M8 60 L43 22 L78 60 Z" fill={u('roof')} />
      <path d="M43 22 L58 16 L104 44 L78 60 Z" fill={u('roofSide')} opacity="0.85" />
      <rect x="35" y="74" width="16" height="30" rx="2" fill={u('door')} />
      <circle cx="47" cy="90" r="1.8" fill="#fef3c7" />
      <rect x="21" y="68" width="11" height="12" rx="1.5" fill={u('glass')} />
      <rect x="55" y="68" width="11" height="12" rx="1.5" fill={u('glass')} />
      <path d="M80 62 L94 57 V71 L80 76 Z" fill={u('glass')} />
      <Gloss d="M14 58 L43 26 L50 34 L24 60 Z" opacity="0.25" />
    </g>
  ),

  door: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('frame')} c={['#92400e', '#78350f', '#451a03']} dir="d" />
        <Lin id={id('panel')} c={['#fbbf24', '#d97706', '#92400e']} dir="d" />
        <Lin id={id('inset')} c={['#b45309', '#f59e0b']} dir="d" />
        <Rad id={id('knob')} c={GOLD} />
      </defs>
      <Shadow u={u} rx="36" />
      <rect x="26" y="8" width="66" height="100" rx="5" fill={u('frame')} />
      <path d="M33 14 H86 V108 H33 Z" fill="#451a03" />
      <path d="M33 14 H80 V108 H33 Z" fill={u('panel')} />
      <rect x="39" y="21" width="35" height="34" rx="4" fill={u('inset')} />
      <rect x="39" y="63" width="35" height="38" rx="4" fill={u('inset')} />
      <path d="M39 55 V25 Q39 21 43 21 H74" stroke="#78350f" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M39 101 V67 Q39 63 43 63 H74" stroke="#78350f" strokeWidth="1.5" fill="none" opacity="0.6" />
      <circle cx="73" cy="60" r="4.5" fill={u('knob')} />
      <Gloss d="M36 18 H56 L36 50 Z" opacity="0.18" />
    </g>
  ),

  lamp: ({ id, u }) => (
    <g>
      <defs>
        <Rad id={id('glow')} c={['#fef08a', '#fef9c3', 'rgba(254,249,195,0)']} cx={0.5} cy={0.5} r={0.5} />
        <Rad id={id('bulb')} c={['#ffffff', '#fef08a', '#facc15', '#ca8a04']} cx={0.38} cy={0.32} r={0.75} />
        <Lin id={id('metal')} c={['#475569', '#e2e8f0', '#94a3b8', '#334155']} dir="h" />
      </defs>
      <circle cx="60" cy="46" r="52" fill={u('glow')} />
      <path d="M60 14 C39 14 28 30 28 46 C28 59 37 66 43 74 C46 78 46 82 46 86 H74 C74 82 74 78 77 74 C83 66 92 59 92 46 C92 30 81 14 60 14 Z" fill={u('bulb')} />
      <path d="M50 60 Q55 49 60 60 Q65 49 70 60 M52 62 V84 M68 62 V84" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="46" cy="34" rx="7" ry="11" fill="#ffffff" opacity="0.75" transform="rotate(30 46 34)" />
      <rect x="44" y="85" width="32" height="8" rx="3" fill={u('metal')} />
      <rect x="45" y="93" width="30" height="7" rx="3" fill={u('metal')} />
      <rect x="47" y="100" width="26" height="7" rx="3" fill={u('metal')} />
      <path d="M53 107 H67 L63 115 H57 Z" fill="#334155" />
    </g>
  ),

  wall: ({ id, u }) => {
    const rows = [0, 1, 2, 3];
    return (
      <g>
        <defs>
          <Lin id={id('brick')} c={['#fdba74', '#ea580c', '#9a3412']} dir="d" />
          <Lin id={id('brickDark')} c={['#fb923c', '#c2410c', '#7c2d12']} dir="d" />
          <Lin id={id('top')} c={['#fed7aa', '#fdba74']} dir="h" />
          <Lin id={id('side')} c={['#c2410c', '#7c2d12']} dir="v" />
        </defs>
        <Shadow u={u} cx="62" rx="52" />
        <path d="M100 34 L112 26 V96 L100 104 Z" fill={u('side')} />
        <path d="M8 34 L20 26 H112 L100 34 Z" fill={u('top')} />
        <rect x="8" y="34" width="92" height="70" fill="#e7cfb4" />
        {rows.map(row => {
          const y = 35 + row * 17.2;
          const offset = row % 2 === 0 ? 0 : -12;
          return [0, 1, 2, 3, 4].map(col => {
            const x = 9 + offset + col * 24;
            const left = Math.max(9, x);
            const width = Math.min(x + 22, 99) - left;
            if (width <= 3) return null;
            return (
              <rect
                key={`${row}-${col}`}
                x={left}
                y={y}
                width={width}
                height="15.5"
                rx="2.5"
                fill={(row + col) % 3 === 0 ? u('brickDark') : u('brick')}
              />
            );
          });
        })}
        <Gloss d="M10 36 H60 L10 70 Z" opacity="0.12" />
      </g>
    );
  },

  bed: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('wood')} c={WOOD} dir="d" />
        <Lin id={id('mattress')} c={['#ffffff', '#e0f2fe', '#bae6fd']} dir="v" />
        <Lin id={id('blanket')} c={['#6ee7b7', '#10b981', '#047857']} dir="d" />
        <Rad id={id('pillow')} c={['#ffffff', '#f1f5f9', '#cbd5e1']} />
      </defs>
      <Shadow u={u} rx="54" />
      <path d="M8 32 Q8 26 14 26 H22 Q26 26 26 32 V108 H8 Z" fill={u('wood')} />
      <path d="M24 60 L34 50 H112 L104 60 Z" fill={u('mattress')} />
      <rect x="22" y="60" width="84" height="22" rx="4" fill={u('mattress')} />
      <ellipse cx="42" cy="54" rx="15" ry="8" fill={u('pillow')} />
      <path d="M52 54 L60 48 H112 L106 58 V84 Q106 88 102 88 H52 Z" fill={u('blanket')} />
      <path d="M58 62 Q80 58 102 62 M58 72 Q80 68 102 72" stroke="#a7f3d0" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
      <rect x="22" y="82" width="88" height="9" rx="2" fill={u('wood')} />
      <rect x="100" y="56" width="12" height="52" rx="4" fill={u('wood')} />
      <rect x="24" y="91" width="6" height="16" rx="2" fill="#78350f" />
      <Gloss d="M60 50 H100 L66 62 Z" opacity="0.25" />
    </g>
  ),

  mosque: ({ id, u }) => (
    <g>
      <defs>
        <Rad id={id('dome')} c={['#a7f3d0', '#34d399', '#059669', '#065f46']} cx={0.35} cy={0.25} r={0.85} />
        <Lin id={id('wall')} c={['#ffffff', '#ecfdf5', '#a7f3d0']} dir="v" />
        <Lin id={id('side')} c={['#a7f3d0', '#6ee7b7']} dir="v" />
        <Lin id={id('minaret')} c={['#a7f3d0', '#ffffff', '#d1fae5', '#6ee7b7']} dir="h" />
        <Lin id={id('cap')} c={['#34d399', '#047857']} dir="h" />
        <Lin id={id('gold')} c={GOLD} dir="d" />
        <Lin id={id('door')} c={['#047857', '#064e3b']} dir="v" />
        <Lin id={id('glass')} c={GLASS} dir="d" />
      </defs>
      <Shadow u={u} rx="54" />
      <path d="M92 64 L100 58 V100 L92 106 Z" fill={u('side')} />
      <rect x="28" y="62" width="64" height="44" rx="2" fill={u('wall')} />
      <path d="M36 64 C36 38 47 28 60 26 C73 28 84 38 84 64 Z" fill={u('dome')} />
      <rect x="34" y="60" width="52" height="5" rx="2" fill="#059669" />
      <path d="M60 26 V14" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
      <path d="M64 6 A6.5 6.5 0 1 0 64 18 A5 5 0 1 1 64 6 Z" fill={u('gold')} />
      <rect x="8" y="42" width="15" height="66" rx="3" fill={u('minaret')} />
      <rect x="6" y="56" width="19" height="4" rx="2" fill="#10b981" />
      <path d="M6 43 L15.5 20 L25 43 Z" fill={u('cap')} />
      <rect x="97" y="42" width="15" height="66" rx="3" fill={u('minaret')} />
      <rect x="95" y="56" width="19" height="4" rx="2" fill="#10b981" />
      <path d="M95 43 L104.5 20 L114 43 Z" fill={u('cap')} />
      <path d="M51 106 V88 A9 9 0 0 1 69 88 V106 Z" fill={u('door')} />
      <path d="M36 86 V78 A5 5 0 0 1 46 78 V86 Z" fill={u('glass')} />
      <path d="M74 86 V78 A5 5 0 0 1 84 78 V86 Z" fill={u('glass')} />
      <ellipse cx="49" cy="40" rx="5" ry="9" fill="#ffffff" opacity="0.45" transform="rotate(25 49 40)" />
    </g>
  ),

  madrasa: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('front')} c={['#fffbeb', '#fef3c7', '#fde68a']} dir="v" />
        <Lin id={id('side')} c={['#fcd34d', '#d97706']} dir="v" />
        <Lin id={id('roof')} c={['#b45309', '#78350f']} dir="v" />
        <Lin id={id('roofTop')} c={['#f59e0b', '#b45309']} dir="h" />
        <Lin id={id('glass')} c={GLASS} dir="d" />
        <Lin id={id('sign')} c={['#14b8a6', '#0f766e']} dir="v" />
        <Lin id={id('gate')} c={['#047857', '#022c22']} dir="v" />
      </defs>
      <Shadow u={u} cx="62" rx="56" />
      <path d="M96 46 L112 36 V94 L96 106 Z" fill={u('side')} />
      <path d="M4 40 L20 30 H114 L98 40 Z" fill={u('roofTop')} />
      <rect x="4" y="40" width="94" height="8" rx="1" fill={u('roof')} />
      <rect x="8" y="48" width="88" height="58" fill={u('front')} />
      <rect x="32" y="16" width="40" height="17" rx="4" fill={u('sign')} />
      <rect x="39" y="22" width="26" height="5" rx="2.5" fill="#99f6e4" />
      {[14, 30, 64, 80].map(x => (
        <g key={x}>
          <rect x={x} y="56" width="11" height="14" rx="2" fill={u('glass')} />
          <rect x={x} y="78" width="11" height="14" rx="2" fill={u('glass')} />
        </g>
      ))}
      <path d="M100 52 L108 47 V60 L100 65 Z M100 74 L108 69 V82 L100 87 Z" fill={u('glass')} opacity="0.85" />
      <path d="M43 106 V84 A9 9 0 0 1 61 84 V106 Z" fill={u('gate')} />
      <rect x="47" y="56" width="10" height="14" rx="2" fill={u('glass')} />
      <Gloss d="M10 50 H50 L10 80 Z" opacity="0.2" />
    </g>
  ),

  blackboard: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('frame')} c={WOOD} dir="d" />
        <Rad id={id('board')} c={['#15803d', '#14532d', '#052e16']} cx={0.3} cy={0.25} r={1} />
        <Lin id={id('leg')} c={['#78350f', '#b45309', '#451a03']} dir="h" />
      </defs>
      <Shadow u={u} rx="42" />
      <path d="M36 74 L24 110 M84 74 L96 110" stroke={u('leg')} strokeWidth="7" strokeLinecap="round" />
      <path d="M60 74 L60 106" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
      <path d="M14 14 L20 9 H112 L106 14 Z" fill="#fcd34d" />
      <path d="M106 14 L112 9 V74 L106 80 Z" fill="#92400e" />
      <rect x="10" y="14" width="96" height="66" rx="5" fill={u('frame')} />
      <rect x="17" y="21" width="82" height="52" rx="3" fill={u('board')} />
      <text x="58" y="53" textAnchor="middle" fontSize="23" fill="#f8fafc" fontFamily="Amiri, serif" opacity="0.95">أ ب ت</text>
      <path d="M28 63 H58" stroke="#dcfce7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <rect x="20" y="76" width="76" height="6" rx="2" fill="#78350f" />
      <rect x="70" y="73" width="14" height="4" rx="2" fill="#ffffff" />
      <Gloss d="M20 24 H52 L20 50 Z" opacity="0.1" />
    </g>
  ),

  ruler: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('top')} c={['#fef3c7', '#fcd34d', '#f59e0b']} dir="v" />
        <Lin id={id('edge')} c={['#d97706', '#92400e']} dir="v" />
      </defs>
      <Shadow u={u} rx="46" />
      <g transform="rotate(-22 60 60)">
        <path d="M6 72 H112 V80 Q112 82 110 82 H8 Q6 82 6 80 Z" fill={u('edge')} />
        <rect x="6" y="44" width="106" height="30" rx="4" fill={u('top')} />
        {Array.from({ length: 20 }).map((_, i) => (
          <path
            key={i}
            d={`M${12 + i * 5} 44 V${i % 5 === 0 ? 59 : i % 2 === 0 ? 54 : 51}`}
            stroke="#92400e"
            strokeWidth="1.5"
          />
        ))}
        <rect x="10" y="64" width="98" height="4" rx="2" fill="#ffffff" opacity="0.45" />
      </g>
    </g>
  ),

  bag: ({ id, u }) => (
    <g>
      <defs>
        <Rad id={id('body')} c={['#fda4af', '#f43f5e', '#be123c', '#881337']} cx={0.3} cy={0.2} r={1} />
        <Lin id={id('flap')} c={['#fb7185', '#e11d48', '#9f1239']} dir="v" />
        <Lin id={id('handle')} c={['#9f1239', '#fb7185', '#881337']} dir="v" />
        <Lin id={id('side')} c={['#9f1239', '#4c0519']} dir="v" />
        <Lin id={id('gold')} c={GOLD} dir="d" />
      </defs>
      <Shadow u={u} rx="46" />
      <path d="M42 38 V27 A9 9 0 0 1 51 18 H69 A9 9 0 0 1 78 27 V38" stroke={u('handle')} strokeWidth="7" fill="none" />
      <path d="M100 40 L108 34 V96 L100 106 Z" fill={u('side')} />
      <rect x="12" y="36" width="90" height="70" rx="12" fill={u('body')} />
      <path d="M12 48 A12 12 0 0 1 24 36 H90 A12 12 0 0 1 102 48 V64 Q57 78 12 64 Z" fill={u('flap')} />
      <rect x="49" y="58" width="16" height="18" rx="4" fill={u('gold')} />
      <circle cx="57" cy="67" r="2.5" fill="#78350f" />
      <Gloss d="M20 42 H60 Q64 42 60 45 L24 60 Q18 62 18 56 V48 Q18 42 20 42 Z" opacity="0.3" />
    </g>
  ),

  notebook: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('cover')} c={['#7dd3fc', '#0ea5e9', '#0369a1']} dir="d" />
        <Lin id={id('pages')} c={['#fffbeb', '#fde68a']} dir="h" />
        <Lin id={id('ring')} c={METAL} dir="v" />
      </defs>
      <Shadow u={u} rx="40" />
      <path d="M92 20 L100 13 V95 L92 104 Z" fill={u('pages')} />
      <path d="M30 20 L38 13 H100 L92 20 Z" fill="#e0f2fe" />
      <rect x="28" y="20" width="66" height="84" rx="6" fill={u('cover')} />
      <rect x="44" y="34" width="38" height="24" rx="4" fill="#f8fafc" />
      <path d="M50 42 H76 M50 50 H69" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      {[28, 42, 56, 70, 84, 98].map(y => (
        <rect key={y} x="22" y={y - 3.5} width="15" height="7" rx="3.5" fill={u('ring')} />
      ))}
      <Gloss d="M40 24 H86 Q90 24 86 28 L46 70 Q40 76 40 68 Z" opacity="0.18" />
    </g>
  ),

  table: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('top')} c={['#fde68a', '#f59e0b', '#d97706']} dir="d" />
        <Lin id={id('edge')} c={['#b45309', '#78350f']} dir="v" />
        <Lin id={id('leg')} c={['#78350f', '#b45309', '#451a03']} dir="h" />
      </defs>
      <Shadow u={u} rx="52" />
      <rect x="36" y="56" width="6" height="36" rx="3" fill={u('leg')} />
      <rect x="84" y="56" width="6" height="36" rx="3" fill={u('leg')} />
      <path d="M22 50 L38 30 H106 L96 50 Z" fill={u('top')} />
      <path d="M96 50 L106 30 V38 L96 58 Z" fill="#92400e" />
      <rect x="10" y="50" width="86" height="9" rx="2" fill={u('edge')} />
      <rect x="16" y="59" width="9" height="49" rx="4" fill={u('leg')} />
      <rect x="82" y="59" width="9" height="49" rx="4" fill={u('leg')} />
      <Gloss d="M42 33 H92 L50 47 Q44 49 40 44 Z" opacity="0.3" />
    </g>
  ),

  room: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('back')} c={['#f0fdfa', '#ccfbf1']} dir="v" />
        <Lin id={id('left')} c={['#99f6e4', '#5eead4']} dir="h" />
        <Lin id={id('floor')} c={['#fde68a', '#f59e0b']} dir="v" />
        <Lin id={id('glass')} c={GLASS} dir="d" />
        <Lin id={id('wood')} c={WOOD} dir="d" />
      </defs>
      <path d="M8 22 L40 8 V76 L8 108 Z" fill={u('left')} />
      <path d="M40 8 H112 V76 H40 Z" fill={u('back')} />
      <path d="M8 108 L40 76 H112 V108 Z" fill={u('floor')} />
      <path d="M24 108 L50 76 M48 108 L66 76 M72 108 L84 76 M96 108 L102 76" stroke="#d97706" strokeWidth="1" opacity="0.35" />
      <rect x="60" y="20" width="34" height="28" rx="2" fill="#0f766e" />
      <rect x="63" y="23" width="28" height="22" rx="1" fill={u('glass')} />
      <path d="M77 23 V45" stroke="#0f766e" strokeWidth="2" />
      <path d="M16 36 L28 31 V88 L16 96 Z" fill={u('wood')} />
      <path d="M52 74 L58 68 H92 L88 74 Z" fill="#fcd34d" />
      <rect x="50" y="74" width="38" height="5" rx="1.5" fill={u('wood')} />
      <path d="M54 79 V94 M84 79 V94" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
      <Gloss d="M64 24 H74 L64 36 Z" opacity="0.5" />
    </g>
  ),

  window: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('frame')} c={WOOD} dir="d" />
        <Lin id={id('sky')} c={['#bae6fd', '#38bdf8', '#0284c7']} dir="v" />
        <Lin id={id('sill')} c={['#fbbf24', '#92400e']} dir="v" />
      </defs>
      <Shadow u={u} rx="48" />
      <rect x="14" y="10" width="92" height="88" rx="6" fill={u('frame')} />
      <rect x="22" y="18" width="76" height="72" rx="2" fill="#78350f" />
      <rect x="25" y="21" width="73" height="69" rx="2" fill={u('sky')} />
      <circle cx="80" cy="36" r="8" fill="#fde047" />
      <ellipse cx="44" cy="68" rx="14" ry="6" fill="#ffffff" opacity="0.9" />
      <ellipse cx="52" cy="64" rx="9" ry="6" fill="#ffffff" opacity="0.9" />
      <path d="M30 60 L50 21 H60 L36 70 Z M42 90 L78 21 H84 L48 90 Z" fill="#ffffff" opacity="0.18" />
      <rect x="57" y="18" width="7" height="72" fill={u('frame')} />
      <rect x="22" y="50" width="76" height="7" fill={u('frame')} />
      <path d="M6 98 L12 92 H114 L108 98 Z" fill="#fcd34d" />
      <rect x="6" y="98" width="102" height="8" rx="2" fill={u('sill')} />
    </g>
  ),

  lock: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('body')} c={['#fde68a', '#f59e0b', '#b45309']} dir="d" />
        <Lin id={id('shackle')} c={METAL} dir="h" />
        <Lin id={id('side')} c={['#b45309', '#78350f']} dir="v" />
      </defs>
      <Shadow u={u} rx="40" />
      <path d="M38 56 V36 A22 22 0 0 1 82 36 V56" stroke={u('shackle')} strokeWidth="11" fill="none" />
      <path d="M41 56 V36 A19 19 0 0 1 60 17" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round" />
      <path d="M94 56 L100 50 V100 L94 108 Z" fill={u('side')} />
      <rect x="22" y="52" width="74" height="56" rx="12" fill={u('body')} />
      <circle cx="59" cy="76" r="7.5" fill="#451a03" />
      <path d="M55 78 H63 L61 94 H57 Z" fill="#451a03" />
      <Gloss d="M30 56 H80 Q86 56 82 60 L34 80 Q28 82 28 76 V62 Q28 56 30 56 Z" opacity="0.35" />
    </g>
  ),

  key: ({ id, u }) => (
    <g>
      <defs>
        <Rad id={id('bow')} c={['#fef3c7', '#fbbf24', '#b45309']} />
        <Lin id={id('shaft')} c={['#fde68a', '#f59e0b', '#92400e']} dir="v" />
      </defs>
      <Shadow u={u} rx="46" />
      <g transform="rotate(-24 60 60)">
        <circle cx="32" cy="60" r="23" fill={u('bow')} />
        <circle cx="32" cy="60" r="9" fill="#78350f" opacity="0.85" />
        <circle cx="32" cy="60" r="7" className="fill-white dark:fill-slate-800" />
        <rect x="50" y="53" width="62" height="14" rx="5" fill={u('shaft')} />
        <rect x="84" y="65" width="10" height="15" rx="2" fill={u('shaft')} />
        <rect x="99" y="65" width="10" height="20" rx="2" fill={u('shaft')} />
        <rect x="54" y="56" width="54" height="3" rx="1.5" fill="#ffffff" opacity="0.6" />
        <ellipse cx="24" cy="48" rx="6" ry="4" fill="#ffffff" opacity="0.55" />
      </g>
    </g>
  ),

  box: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('front')} c={['#f59e0b', '#b45309', '#78350f']} dir="v" />
        <Lin id={id('lid')} c={['#fcd34d', '#d97706', '#92400e']} dir="v" />
        <Lin id={id('side')} c={['#92400e', '#451a03']} dir="v" />
        <Lin id={id('band')} c={METAL} dir="h" />
        <Lin id={id('gold')} c={GOLD} dir="d" />
      </defs>
      <Shadow u={u} rx="54" />
      <path d="M98 50 L110 40 V94 L98 106 Z" fill={u('side')} />
      <path d="M98 50 V40 Q98 24 84 24 L96 16 Q110 16 110 32 V40 Z" fill="#b45309" />
      <rect x="10" y="50" width="88" height="56" rx="5" fill={u('front')} />
      <path d="M10 52 V40 Q10 24 26 24 H84 Q98 24 98 40 V52 Z" fill={u('lid')} />
      <rect x="24" y="24" width="9" height="82" fill={u('band')} />
      <rect x="76" y="24" width="9" height="82" fill={u('band')} />
      <rect x="10" y="49" width="88" height="5" fill="#78350f" />
      <rect x="45" y="44" width="18" height="20" rx="4" fill={u('gold')} />
      <circle cx="54" cy="53" r="2.5" fill="#451a03" />
      <Gloss d="M16 30 Q20 26 30 26 H72 L24 44 Q16 46 16 40 Z" opacity="0.3" />
    </g>
  ),

  clock: ({ id, u }) => (
    <g>
      <defs>
        <Rad id={id('ring')} c={['#6ee7b7', '#10b981', '#047857', '#064e3b']} cx={0.3} cy={0.25} r={0.9} />
        <Rad id={id('face')} c={['#ffffff', '#f8fafc', '#e2e8f0']} cx={0.4} cy={0.35} r={0.7} />
        <Rad id={id('bell')} c={GOLD} />
      </defs>
      <Shadow u={u} rx="38" />
      <path d="M36 92 L28 108 M84 92 L92 108" stroke="#065f46" strokeWidth="7" strokeLinecap="round" />
      <circle cx="30" cy="20" r="11" fill={u('bell')} />
      <circle cx="90" cy="20" r="11" fill={u('bell')} />
      <circle cx="62" cy="60" r="44" fill="#064e3b" />
      <circle cx="60" cy="58" r="44" fill={u('ring')} />
      <circle cx="60" cy="58" r="35" fill={u('face')} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        const r1 = i % 3 === 0 ? 26 : 29;
        return (
          <path
            key={i}
            d={`M${60 + Math.sin(a) * r1} ${58 - Math.cos(a) * r1} L${60 + Math.sin(a) * 32} ${58 - Math.cos(a) * 32}`}
            stroke="#334155"
            strokeWidth={i % 3 === 0 ? 3.5 : 2}
            strokeLinecap="round"
          />
        );
      })}
      <path d="M60 58 L60 36" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
      <path d="M60 58 L76 66" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="58" r="4" fill="#f59e0b" />
      <path d="M34 42 A30 30 0 0 1 58 26" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
    </g>
  ),

  umbrella: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('panelA')} c={['#c4b5fd', '#8b5cf6', '#5b21b6']} dir="d" />
        <Lin id={id('panelB')} c={['#ddd6fe', '#a78bfa', '#6d28d9']} dir="d" />
        <Lin id={id('shaft')} c={METAL} dir="h" />
        <Lin id={id('handle')} c={WOOD} dir="d" />
      </defs>
      <Shadow u={u} cx="54" rx="30" />
      <path d="M60 52 V96" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
      <path d="M60 94 V100 A9 9 0 0 1 42 100" stroke={u('handle')} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M8 60 C12 32 32 14 60 14 C40 24 34 42 34 60 Q21 51 8 60 Z" fill={u('panelA')} />
      <path d="M34 60 C34 42 44 22 60 14 C76 22 86 42 86 60 Q73 51 60 60 Q47 51 34 60 Z" fill={u('panelB')} />
      <path d="M86 60 C86 42 80 24 60 14 C88 14 108 32 112 60 Q99 51 86 60 Z" fill={u('panelA')} />
      <path d="M60 14 V6" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
      <path d="M40 24 Q48 17 58 16 Q48 26 44 40 Z" fill="#ffffff" opacity="0.35" />
    </g>
  ),

  glasses: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('lens')} c={['#f0f9ff', '#bae6fd', '#7dd3fc']} dir="d" />
        <Lin id={id('frame')} c={['#94a3b8', '#475569', '#1e293b']} dir="v" />
      </defs>
      <Shadow u={u} rx="48" />
      <path d="M20 58 L8 42 M100 58 L112 42" stroke={u('frame')} strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="37" cy="66" rx="22" ry="20" fill={u('lens')} opacity="0.9" stroke={u('frame')} strokeWidth="6" />
      <ellipse cx="83" cy="66" rx="22" ry="20" fill={u('lens')} opacity="0.9" stroke={u('frame')} strokeWidth="6" />
      <path d="M57 62 Q60 55 63 62" stroke={u('frame')} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M24 70 L40 50 H46 L30 74 Z M70 70 L86 50 H92 L76 74 Z" fill="#ffffff" opacity="0.7" />
    </g>
  ),

  car: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('body')} c={['#fca5a5', '#ef4444', '#b91c1c', '#7f1d1d']} dir="v" />
        <Lin id={id('cabin')} c={['#f87171', '#dc2626']} dir="v" />
        <Lin id={id('glass')} c={['#e0f2fe', '#7dd3fc', '#0369a1']} dir="d" />
        <Rad id={id('tire')} c={['#475569', '#1e293b', '#020617']} cx={0.4} cy={0.35} r={0.7} />
        <Rad id={id('rim')} c={['#ffffff', '#cbd5e1', '#64748b']} />
        <Rad id={id('light')} c={['#ffffff', '#fef08a', '#facc15']} />
      </defs>
      <Shadow u={u} cy="106" rx="54" />
      <path d="M28 58 L41 33 Q43 29 48 29 H77 Q82 29 85 33 L100 58 Z" fill={u('cabin')} />
      <path d="M37 57 L46 37 H60 V57 Z" fill={u('glass')} />
      <path d="M65 57 V37 H78 L91 57 Z" fill={u('glass')} />
      <path d="M40 54 L48 40 H52 L44 56 Z M68 54 L72 40 H75 L71 56 Z" fill="#ffffff" opacity="0.5" />
      <rect x="6" y="54" width="108" height="34" rx="13" fill={u('body')} />
      <rect x="12" y="60" width="96" height="4" rx="2" fill="#ffffff" opacity="0.45" />
      <path d="M8 76 H112" stroke="#7f1d1d" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="106" cy="66" rx="6" ry="4.5" fill={u('light')} />
      <rect x="7" y="63" width="7" height="7" rx="3" fill="#fb923c" />
      <circle cx="33" cy="90" r="15" fill={u('tire')} />
      <circle cx="33" cy="90" r="7" fill={u('rim')} />
      <circle cx="87" cy="90" r="15" fill={u('tire')} />
      <circle cx="87" cy="90" r="7" fill={u('rim')} />
    </g>
  ),

  bicycle: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('frame')} c={['#5eead4', '#0d9488', '#115e59']} dir="d" />
        <Lin id={id('seat')} c={['#475569', '#0f172a']} dir="v" />
        <Rad id={id('gear')} c={GOLD} />
      </defs>
      <Shadow u={u} cy="104" rx="54" />
      {[28, 92].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy="78" r="22" stroke="#1e293b" strokeWidth="6" fill="none" />
          <circle cx={cx} cy="78" r="25" stroke="#64748b" strokeWidth="1" fill="none" opacity="0.6" />
          <circle cx={cx} cy="78" r="18.5" stroke="#94a3b8" strokeWidth="1.2" fill="none" opacity="0.8" />
          <path d={`M${cx - 18} 78 H${cx + 18} M${cx} 60 V96 M${cx - 13} 65 L${cx + 13} 91 M${cx + 13} 65 L${cx - 13} 91`} stroke="#94a3b8" strokeWidth="1" />
          <circle cx={cx} cy="78" r="3.5" fill="#334155" />
          <path d={`M${cx - 16} 64 A21 21 0 0 1 ${cx + 4} 57`} stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.45" strokeLinecap="round" />
        </g>
      ))}
      <path d="M28 78 L54 78 L44 46 Z M44 46 L80 46 L54 78 M80 46 L92 78" stroke={u('frame')} strokeWidth="6" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M80 46 L76 32 M69 30 H85" stroke="#334155" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M44 46 L41 37" stroke="#334155" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M30 33 Q40 29 52 33 Q50 38 40 38 Q32 38 30 33 Z" fill={u('seat')} />
      <circle cx="54" cy="78" r="6.5" fill={u('gear')} />
    </g>
  ),

  flag: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('pole')} c={METAL} dir="h" />
        <Lin id={id('cloth')} c={['#475569', '#1e293b', '#020617']} dir="d" />
        <Rad id={id('knob')} c={GOLD} />
      </defs>
      <Shadow u={u} cx="30" rx="22" />
      <rect x="24" y="12" width="7" height="96" rx="3" fill={u('pole')} />
      <circle cx="27.5" cy="11" r="6" fill={u('knob')} />
      {/* কালিমার পতাকা */}
      <path d="M31 18 C52 10 70 28 110 18 V74 C72 84 52 66 31 74 Z" fill={u('cloth')} />
      <path d="M31 18 C52 10 70 28 110 18 V25 C72 35 52 17 31 25 Z" fill="#ffffff" opacity="0.12" />
      <g fill="#ffffff" fontFamily="'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', serif" fontWeight="700" textAnchor="middle" direction="rtl">
        <text x="70" y="42" fontSize="11">لَا إِلٰهَ إِلَّا اللّٰهُ</text>
        <text x="70" y="60" fontSize="11">مُحَمَّدٌ رَسُولُ اللّٰهِ</text>
      </g>
    </g>
  ),

  fan: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('blade')} c={['#fef3c7', '#fcd34d', '#d97706']} dir="d" />
        <Rad id={id('hub')} c={['#f1f5f9', '#94a3b8', '#334155']} />
        <Lin id={id('rod')} c={METAL} dir="h" />
      </defs>
      <Shadow u={u} cy="104" rx="46" />
      <rect x="57" y="8" width="6" height="34" rx="2" fill={u('rod')} />
      <rect x="50" y="6" width="20" height="6" rx="3" fill="#475569" />
      <path d="M52 56 C36 42 12 44 6 52 C12 62 36 66 52 62 Z" fill={u('blade')} />
      <path d="M68 56 C84 42 108 44 114 52 C108 62 84 66 68 62 Z" fill={u('blade')} />
      <path d="M56 66 C50 82 54 100 60 104 C68 100 70 82 64 66 Z" fill={u('blade')} />
      <ellipse cx="60" cy="58" rx="15" ry="12" fill={u('hub')} />
      <ellipse cx="60" cy="68" rx="7" ry="4" fill="#334155" />
      <ellipse cx="55" cy="53" rx="5" ry="3" fill="#ffffff" opacity="0.6" />
      <path d="M12 50 C22 46 36 47 46 53" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.55" strokeLinecap="round" />
    </g>
  ),

  garden: ({ id, u }) => (
    <g>
      <defs>
        <Rad id={id('tree')} c={['#86efac', '#22c55e', '#15803d', '#14532d']} cx={0.35} cy={0.3} r={0.9} />
        <Lin id={id('trunk')} c={WOOD} dir="h" />
        <Lin id={id('grass')} c={['#86efac', '#16a34a']} dir="v" />
        <Lin id={id('fence')} c={['#fffbeb', '#fde68a', '#d97706']} dir="v" />
        <Rad id={id('flowerA')} c={['#fecdd3', '#f43f5e']} />
        <Rad id={id('flowerB')} c={['#fef9c3', '#eab308']} />
      </defs>
      <Shadow u={u} rx="54" />
      <path d="M8 88 Q60 76 112 88 V104 H8 Z" fill={u('grass')} />
      <rect x="74" y="48" width="8" height="42" rx="3" fill={u('trunk')} />
      <circle cx="78" cy="38" r="26" fill={u('tree')} />
      <circle cx="68" cy="30" r="7" fill="#ffffff" opacity="0.25" />
      <rect x="30" y="66" width="6" height="24" rx="2" fill={u('trunk')} />
      <circle cx="33" cy="56" r="16" fill={u('tree')} />
      {[12, 30, 48, 66, 84, 102].map(x => (
        <path key={x} d={`M${x} 104 V84 L${x + 4} 78 L${x + 8} 84 V104 Z`} fill={u('fence')} />
      ))}
      <rect x="8" y="88" width="104" height="4" rx="2" fill="#d97706" />
      <rect x="8" y="97" width="104" height="4" rx="2" fill="#d97706" />
      <circle cx="18" cy="76" r="5" fill={u('flowerA')} />
      <circle cx="50" cy="78" r="4.5" fill={u('flowerB')} />
      <circle cx="100" cy="76" r="5" fill={u('flowerA')} />
    </g>
  ),

  bedding: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('top')} c={['#e0e7ff', '#a5b4fc']} dir="h" />
        <Lin id={id('front')} c={['#818cf8', '#4f46e5', '#3730a3']} dir="v" />
        <Lin id={id('side')} c={['#4338ca', '#312e81']} dir="v" />
      </defs>
      <Shadow u={u} rx="54" />
      <path d="M8 58 L28 40 H112 L96 58 Z" fill={u('top')} />
      <path d="M96 58 L112 40 V84 L96 102 Z" fill={u('side')} />
      <rect x="8" y="58" width="88" height="44" rx="6" fill={u('front')} />
      <path d="M8 80 H96" stroke="#c7d2fe" strokeWidth="2" strokeDasharray="4 4" />
      {[30, 52, 74].map(x => <circle key={`a${x}`} cx={x} cy="69" r="2" fill="#c7d2fe" />)}
      {[30, 52, 74].map(x => <circle key={`b${x}`} cx={x} cy="91" r="2" fill="#c7d2fe" />)}
      <path d="M36 46 H96 L90 52 H30 Z" fill="#ffffff" opacity="0.4" />
    </g>
  ),

  pillow: ({ id, u }) => (
    <g>
      <defs>
        <Rad id={id('body')} c={['#ffffff', '#fce7f3', '#f9a8d4', '#db2777']} cx={0.4} cy={0.35} r={0.85} />
      </defs>
      <Shadow u={u} rx="48" />
      <path d="M14 34 Q60 22 106 34 Q98 64 106 94 Q60 106 14 94 Q22 64 14 34 Z" fill={u('body')} />
      <path d="M22 42 Q60 32 98 42 Q92 64 98 86 Q60 96 22 86 Q28 64 22 42 Z" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.6" />
      <ellipse cx="44" cy="48" rx="16" ry="7" fill="#ffffff" opacity="0.6" />
    </g>
  ),

  shirt: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('body')} c={['#e0f2fe', '#7dd3fc', '#0369a1']} dir="d" />
        <Lin id={id('collar')} c={['#f8fafc', '#cbd5e1']} dir="v" />
      </defs>
      <Shadow u={u} rx="44" />
      <path d="M40 14 L22 22 L6 50 L22 60 L30 46 V106 H90 V46 L98 60 L114 50 L98 22 L80 14 Q60 26 40 14 Z" fill={u('body')} />
      <path d="M40 14 Q60 26 80 14 L74 10 Q60 20 46 10 Z" fill={u('collar')} />
      <path d="M60 22 V70" stroke="#0369a1" strokeWidth="2" />
      {[34, 46, 58].map(y => <circle key={y} cx="60" cy={y} r="2.2" fill="#f8fafc" />)}
      <path d="M72 58 H84 V66 H72 Z" fill="#0284c7" opacity="0.6" />
      <path d="M26 26 L40 18 L42 40 Q34 34 26 26 Z" fill="#ffffff" opacity="0.35" />
    </g>
  ),

  cap: ({ id, u }) => (
    <g>
      <defs>
        <Rad id={id('dome')} c={['#ffffff', '#f1f5f9', '#cbd5e1', '#94a3b8']} cx={0.35} cy={0.25} r={0.9} />
        <Lin id={id('band')} c={['#f8fafc', '#e2e8f0', '#94a3b8']} dir="v" />
      </defs>
      <Shadow u={u} cy="100" rx="46" />
      <path d="M16 78 Q16 26 60 24 Q104 26 104 78 Z" fill={u('dome')} />
      <path d="M14 76 Q60 88 106 76 V90 Q60 102 14 90 Z" fill={u('band')} />
      {[30, 45, 60, 75, 90].map(x => (
        <path key={x} d={`M${x} 84 l3 -4 l3 4 l-3 4 Z`} fill="#0d9488" opacity="0.7" />
      ))}
      <path d="M36 62 Q60 50 84 62 M42 46 Q60 38 78 46" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
      <ellipse cx="44" cy="40" rx="12" ry="7" fill="#ffffff" opacity="0.8" />
    </g>
  ),

  clothing: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('a')} c={['#fde68a', '#f59e0b', '#b45309']} dir="v" />
        <Lin id={id('b')} c={['#a7f3d0', '#10b981', '#047857']} dir="v" />
        <Lin id={id('c')} c={['#fecdd3', '#fb7185', '#be123c']} dir="v" />
      </defs>
      <Shadow u={u} rx="50" />
      <path d="M100 82 L108 74 V96 L100 104 Z" fill="#9f1239" />
      <rect x="14" y="82" width="86" height="22" rx="4" fill={u('c')} />
      <path d="M98 60 L106 52 V74 L98 82 Z" fill="#047857" />
      <rect x="18" y="60" width="80" height="22" rx="4" fill={u('b')} />
      <path d="M96 38 L104 30 V52 L96 60 Z" fill="#b45309" />
      <rect x="22" y="38" width="74" height="22" rx="4" fill={u('a')} />
      <path d="M22 38 L30 30 H104 L96 38 Z" fill="#fef3c7" />
      <path d="M40 38 Q58 50 76 38" stroke="#92400e" strokeWidth="2" fill="none" />
      <rect x="26" y="41" width="40" height="3" rx="1.5" fill="#ffffff" opacity="0.55" />
    </g>
  ),

  turban: ({ id, u }) => (
    <g>
      <defs>
        <Rad id={id('wrap')} c={['#ffffff', '#f8fafc', '#e2e8f0', '#94a3b8']} cx={0.35} cy={0.3} r={0.9} />
        <Lin id={id('tail')} c={['#f1f5f9', '#cbd5e1']} dir="v" />
      </defs>
      <Shadow u={u} cy="102" rx="46" />
      <path d="M90 70 Q104 84 96 108 L86 104 Q92 86 82 74 Z" fill={u('tail')} />
      <ellipse cx="60" cy="66" rx="46" ry="30" fill={u('wrap')} />
      <path d="M16 70 Q60 40 104 60 M18 80 Q60 56 102 74 M24 56 Q60 30 98 48" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M14 66 Q60 104 106 66" stroke="#cbd5e1" strokeWidth="3" fill="none" />
      <ellipse cx="44" cy="48" rx="14" ry="7" fill="#ffffff" opacity="0.9" />
    </g>
  ),

  handkerchief: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('cloth')} c={['#ecfeff', '#a5f3fc', '#22d3ee']} dir="d" />
        <Lin id={id('fold')} c={['#cffafe', '#67e8f9', '#0891b2']} dir="d" />
      </defs>
      <Shadow u={u} rx="46" />
      <path d="M16 30 L100 20 L106 96 L20 102 Z" fill={u('cloth')} />
      <path d="M24 36 L94 28 L99 90 L27 95 Z" stroke="#0891b2" strokeWidth="2" strokeDasharray="5 3" fill="none" />
      <path d="M106 96 L64 98 L100 58 Z" fill={u('fold')} />
      <circle cx="44" cy="58" r="7" fill="#f472b6" opacity="0.8" />
      <circle cx="44" cy="58" r="3" fill="#fde68a" />
      <path d="M22 34 L60 29 L26 60 Z" fill="#ffffff" opacity="0.35" />
    </g>
  ),

  shoe: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('upper')} c={['#fcd34d', '#b45309', '#78350f']} dir="d" />
        <Lin id={id('sole')} c={['#475569', '#0f172a']} dir="v" />
      </defs>
      <Shadow u={u} cy="100" rx="54" />
      <path d="M10 88 V58 Q10 44 24 44 L44 44 Q52 62 74 66 L100 72 Q112 76 112 88 Z" fill={u('upper')} />
      <path d="M8 86 H114 Q114 98 104 98 H14 Q8 98 8 92 Z" fill={u('sole')} />
      <path d="M46 50 L56 58 M52 46 L62 54 M58 52 L66 60" stroke="#fef3c7" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 50 Q18 46 28 48" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" />
      <path d="M76 70 Q96 72 106 80" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />
    </g>
  ),

  necklace: ({ id, u }) => (
    <g>
      <defs>
        <Rad id={id('gem')} c={['#fef08a', '#eab308', '#ca8a04', '#713f12']} />
        <Rad id={id('pendant')} c={['#67e8f9', '#06b6d4', '#0e7490']} />
      </defs>
      <Shadow u={u} rx="36" cy="104" />
      <path d="M26 30 C 26 75, 94 75, 94 30" stroke="#ca8a04" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M32 32 C 32 70, 88 70, 88 32" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 4" fill="none" strokeLinecap="round" />
      <circle cx="60" cy="74" r="8" fill={u('pendant')} />
      <circle cx="60" cy="74" r="4.5" fill={u('gem')} />
      <circle cx="58" cy="72" r="1.5" fill="#ffffff" opacity="0.8" />
    </g>
  ),

  tree: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('trunk')} c={WOOD} dir="v" />
        <Rad id={id('foliage')} c={['#86efac', '#22c55e', '#15803d', '#14532d']} cx={0.35} cy={0.3} r={0.7} />
      </defs>
      <Shadow u={u} rx="38" cy="106" />
      <path d="M52 65 L50 104 Q50 106 60 106 Q70 106 70 104 L68 65 Z" fill={u('trunk')} />
      <circle cx="60" cy="46" r="34" fill={u('foliage')} />
      <circle cx="44" cy="52" r="22" fill={u('foliage')} />
      <circle cx="76" cy="52" r="22" fill={u('foliage')} />
      <circle cx="60" cy="34" r="24" fill={u('foliage')} />
      <Gloss d="M48 24 Q60 18 72 26" opacity="0.4" />
    </g>
  ),

  airplane: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('fuselage')} c={['#ffffff', '#e2e8f0', '#94a3b8']} dir="d" />
        <Lin id={id('wing')} c={['#38bdf8', '#0284c7', '#0369a1']} dir="d" />
      </defs>
      <Shadow u={u} rx="42" cy="106" />
      <path d="M60 52 L14 74 L22 80 L60 64 L98 80 L106 74 Z" fill={u('wing')} />
      <ellipse cx="60" cy="56" rx="13" ry="44" fill={u('fuselage')} transform="rotate(-15 60 56)" />
      <path d="M52 86 L36 96 L42 99 L56 92 L70 99 L76 96 L64 86 Z" fill={u('wing')} />
      <ellipse cx="66" cy="28" rx="5" ry="8" fill="#0284c7" transform="rotate(-15 66 28)" />
      <Gloss d="M64 24 Q68 32 66 40" opacity="0.6" />
    </g>
  ),

  flower: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('stem')} c={['#4ade80', '#16a34a', '#14532d']} dir="v" />
        <Rad id={id('petal')} c={['#fda4af', '#f43f5e', '#be123c', '#881337']} cx={0.35} cy={0.35} r={0.7} />
        <Rad id={id('center')} c={GOLD} />
      </defs>
      <Shadow u={u} rx="30" cy="106" />
      <path d="M60 55 Q56 80 58 104" stroke={u('stem')} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M58 80 Q40 76 44 68 Q52 70 58 78 Z" fill="#22c55e" />
      <circle cx="60" cy="38" r="14" fill={u('petal')} />
      <circle cx="46" cy="48" r="14" fill={u('petal')} />
      <circle cx="74" cy="48" r="14" fill={u('petal')} />
      <circle cx="50" cy="62" r="14" fill={u('petal')} />
      <circle cx="70" cy="62" r="14" fill={u('petal')} />
      <circle cx="60" cy="52" r="11" fill={u('center')} />
      <Gloss d="M54 48 Q60 44 66 48" opacity="0.5" />
    </g>
  ),

  ball: ({ id, u }) => (
    <g>
      <defs>
        <Rad id={id('ballBody')} c={['#ffffff', '#f1f5f9', '#cbd5e1', '#64748b']} cx={0.3} cy={0.25} r={0.8} />
      </defs>
      <Shadow u={u} rx="36" cy="106" />
      <circle cx="60" cy="58" r="42" fill={u('ballBody')} />
      <polygon points="60,42 72,50 68,64 52,64 48,50" fill="#0f172a" />
      <polygon points="60,20 68,26 62,32 58,32 52,26" fill="#0f172a" />
      <polygon points="86,40 96,48 90,56 82,54 80,44" fill="#0f172a" />
      <polygon points="34,40 40,44 38,54 30,56 24,48" fill="#0f172a" />
      <polygon points="76,78 84,86 78,92 70,88 70,80" fill="#0f172a" />
      <polygon points="44,78 50,80 50,88 42,92 36,86" fill="#0f172a" />
      <Gloss d="M42 32 A34 34 0 0 1 76 28" opacity="0.6" />
    </g>
  ),

  map: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('paper')} c={['#fef3c7', '#fde68a', '#f59e0b']} dir="d" />
      </defs>
      <Shadow u={u} rx="46" cy="104" />
      <path d="M16 26 Q36 20 58 26 Q80 32 104 24 V90 Q80 98 58 92 Q36 86 16 92 Z" fill={u('paper')} stroke="#d97706" strokeWidth="2" />
      <path d="M40 38 Q50 48 54 44 T68 56 T84 50" stroke="#0284c7" strokeWidth="2.5" fill="none" strokeDasharray="3 2" />
      <path d="M26 64 Q38 58 48 70 T72 74" stroke="#16a34a" strokeWidth="2" fill="none" />
      <circle cx="86" cy="74" r="10" fill="#ffffff" opacity="0.6" />
      <path d="M86 66 L88 74 L86 82 L84 74 Z" fill="#ef4444" />
      <path d="M78 74 L86 76 L94 74 L86 72 Z" fill="#3b82f6" />
      <Gloss d="M22 34 Q58 28 98 32" opacity="0.3" />
    </g>
  ),

  prayer_rug: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('mat_base')} c={['#047857', '#065f46', '#064e3b']} dir="d" />
        <Lin id={id('mat_arch')} c={['#fef3c7', '#fbbf24', '#b45309']} dir="v" />
        <Lin id={id('fringe')} c={['#fef08a', '#d97706']} dir="h" />
      </defs>
      <Shadow u={u} cx="60" cy="106" rx="46" ry="8" />
      <polygon points="20,98 100,98 106,32 14,32" fill={u('mat_base')} />
      <polygon points="24,94 96,94 101,36 19,36" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 2" opacity="0.8" />
      <path d="M34 88 L86 88 L88 56 Q60 38 32 56 Z" fill="#065f46" stroke="#fbbf24" strokeWidth="2.5" />
      <circle cx="60" cy="62" r="7" fill={u('mat_arch')} />
      <polygon points="60,51 63,59 71,62 63,65 60,73 57,65 49,62 57,59" fill="#fef3c7" />
      <line x1="14" y1="30" x2="106" y2="30" stroke={u('fringe')} strokeWidth="3" strokeDasharray="2 2" />
      <line x1="20" y1="100" x2="100" y2="100" stroke={u('fringe')} strokeWidth="3" strokeDasharray="2 2" />
      <Gloss d="M26 38 L94 38 L90 50 L30 50 Z" opacity="0.18" />
    </g>
  ),

  river: ({ id, u }) => (
    <g>
      <defs>
        <Lin id={id('water')} c={['#38bdf8', '#0284c7', '#0369a1']} dir="d" />
        <Lin id={id('bank_left')} c={['#86efac', '#22c55e', '#15803d']} dir="v" />
        <Lin id={id('bank_right')} c={['#bbf7d0', '#4ade80', '#16a34a']} dir="v" />
      </defs>
      <Shadow u={u} cx="60" cy="106" rx="44" ry="7" />
      <rect x="15" y="20" width="90" height="85" rx="14" fill="#047857" opacity="0.2" />
      <path d="M15 20 Q35 50 15 105 H105 Q85 50 105 20 Z" fill={u('bank_left')} />
      <path d="M48 20 C65 45 35 75 55 105 H80 C60 75 90 45 70 20 Z" fill={u('water')} />
      <path d="M53 35 Q60 40 56 46" stroke="#e0f2fe" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
      <path d="M45 65 Q55 70 50 78" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M62 85 Q70 90 65 96" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <ellipse cx="38" cy="88" rx="4" ry="2.5" fill="#94a3b8" />
      <ellipse cx="82" cy="40" rx="3.5" ry="2" fill="#cbd5e1" />
      <Gloss d="M18 24 Q60 16 102 24 L96 32 Q60 26 24 32 Z" opacity="0.25" />
    </g>
  )
};

export function hasBookPicture(name) {
  return Boolean(name && PICTURES[name]);
}

export function usePictureIds() {
  const prefix = `bp${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return {
    id: (name) => `${prefix}-${name}`,
    u: (name) => `url(#${prefix}-${name})`
  };
}

function SharedDefs({ id }) {
  return (
    <defs>
      <filter id={id('blur')} x="-50%" y="-200%" width="200%" height="500%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
  );
}

export default function BookPicture({ name, className = 'w-16 h-16', title }) {
  const ids = usePictureIds();
  const Draw = PICTURES[name];
  if (!Draw) return null;
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={title || name}>
      <SharedDefs id={ids.id} />
      <Draw {...ids} />
    </svg>
  );
}

/**
 * কাছে (هٰذَا / هٰذِهِ) ও দূরে (ذٰلِكَ / تِلْكَ) বোঝানোর ৩D দৃশ্য:
 * কাছের জিনিস সামনে বড়, দূরের জিনিস পেছনে ছোট, সাথে ব্যাজ।
 */
export function DistanceScene({ name, distance = 'near', className = '' }) {
  const ids = usePictureIds();
  const { id, u } = ids;
  const Draw = PICTURES[name];
  if (!Draw) return null;
  const isNear = distance === 'near';

  return (
    <div className={`relative mx-auto w-full max-w-[220px] sm:max-w-[280px] ${className}`}>
      <svg
        viewBox="0 0 240 150"
        className="w-full h-auto rounded-2xl shadow-inner ring-1 ring-slate-200/80 dark:ring-slate-700/60"
        role="img"
        aria-label={`${name} ${isNear ? 'কাছে' : 'দূরে'}`}
      >
        <SharedDefs id={id} />
        <defs>
          <Lin id={id('skyLight')} c={['#e0f2fe', '#f0f9ff']} />
          <Lin id={id('groundLight')} c={['#bbf7d0', '#dcfce7', '#86efac']} />
          <Lin id={id('skyDark')} c={['#0f172a', '#1e293b']} />
          <Lin id={id('groundDark')} c={['#064e3b', '#065f46', '#022c22']} />
        </defs>
        <g className="dark:hidden">
          <rect width="240" height="150" fill={u('skyLight')} />
          <path d="M0 64 H240 V150 H0 Z" fill={u('groundLight')} />
        </g>
        <g className="hidden dark:inline">
          <rect width="240" height="150" fill={u('skyDark')} />
          <path d="M0 64 H240 V150 H0 Z" fill={u('groundDark')} />
        </g>
        <path
          d="M120 64 L-20 150 M120 64 L40 150 M120 64 L120 150 M120 64 L200 150 M120 64 L260 150 M0 78 H240 M0 98 H240 M0 124 H240"
          strokeWidth="1"
          className="stroke-emerald-600/20 dark:stroke-emerald-300/15"
        />
        {isNear ? (
          <svg x="62" y="30" width="116" height="116" viewBox="0 0 120 120">
            <Draw {...ids} />
          </svg>
        ) : (
          <>
            <path d="M120 144 L152 78" strokeWidth="2.5" strokeDasharray="5 5" strokeLinecap="round" className="stroke-amber-500" />
            <svg x="136" y="22" width="52" height="52" viewBox="0 0 120 120">
              <Draw {...ids} />
            </svg>
          </>
        )}
      </svg>
      <span
        className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border shadow-sm ${
          isNear
            ? 'bg-emerald-600 text-white border-emerald-700'
            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
        }`}
      >
        {isNear ? 'কাছে' : 'দূরে'}
      </span>
    </div>
  );
}

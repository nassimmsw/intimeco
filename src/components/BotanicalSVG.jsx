
export default function BotanicalSVG({ className = '', opacity = 0.55, color = '#F5C6CB' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main stem */}
      <path
        d="M80 200 Q75 160 65 130 Q55 100 40 80 Q25 60 10 50"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity={opacity}
      />
      {/* Branch left top */}
      <path
        d="M45 95 Q30 85 15 88"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity={opacity}
      />
      {/* Branch right upper */}
      <path
        d="M55 110 Q65 95 75 92"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity={opacity}
      />
      {/* Branch left mid */}
      <path
        d="M50 125 Q32 120 20 110"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity={opacity}
      />
      {/* Branch right lower */}
      <path
        d="M60 140 Q72 130 82 128"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity={opacity}
      />
      {/* Branch left lower */}
      <path
        d="M57 155 Q40 152 28 145"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity={opacity}
      />
      {/* Berry dots — right branch top */}
      <circle cx="75" cy="92" r="2.5" fill={color} opacity={opacity} />
      <circle cx="80" cy="88" r="2" fill={color} opacity={opacity * 0.7} />
      {/* Berry dots — left top */}
      <circle cx="15" cy="88" r="2.5" fill={color} opacity={opacity} />
      <circle cx="10" cy="84" r="1.8" fill={color} opacity={opacity * 0.7} />
      {/* Berry dots — left mid */}
      <circle cx="20" cy="110" r="2.5" fill={color} opacity={opacity} />
      <circle cx="14" cy="107" r="1.8" fill={color} opacity={opacity * 0.7} />
      {/* Berry dots — right lower */}
      <circle cx="82" cy="128" r="2.5" fill={color} opacity={opacity} />
      <circle cx="87" cy="124" r="1.8" fill={color} opacity={opacity * 0.7} />
      {/* Berry dots — left lower */}
      <circle cx="28" cy="145" r="2.5" fill={color} opacity={opacity} />
      <circle cx="22" cy="142" r="1.8" fill={color} opacity={opacity * 0.7} />
      {/* Top of main stem berries */}
      <circle cx="10" cy="50" r="3" fill={color} opacity={opacity} />
      <circle cx="5" cy="45" r="2" fill={color} opacity={opacity * 0.6} />
      <circle cx="15" cy="46" r="1.8" fill={color} opacity={opacity * 0.6} />
    </svg>
  );
}

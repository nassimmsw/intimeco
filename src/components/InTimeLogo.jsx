import React from 'react';

/* Inline SVG logo that replicates the brand identity:
   - Pink background circle
   - Dark navy bra icon with small white hearts
   - Pink botanical branches on left and right
   - "Lingerie pour elle" cursive arc text above
   - "Intime & Co" bold serif text below
*/
export default function InTimeLogo({ size = 120, showText = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Intime & Co"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="98" fill="#F9D7DA" />

      {/* Left botanical branch */}
      <g opacity="0.75">
        <path d="M38 105 Q28 90 22 75" stroke="#E8A5AE" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M28 88 Q18 82 12 85" stroke="#E8A5AE" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M25 95 Q15 92 10 98" stroke="#E8A5AE" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <circle cx="12" cy="85" r="2.2" fill="#E8A5AE"/>
        <circle cx="10" cy="98" r="2.2" fill="#E8A5AE"/>
        <circle cx="22" cy="75" r="2.5" fill="#E8A5AE"/>
        <circle cx="17" cy="71" r="1.7" fill="#E8A5AE" opacity="0.6"/>
      </g>

      {/* Right botanical branch */}
      <g opacity="0.75">
        <path d="M162 105 Q172 90 178 75" stroke="#E8A5AE" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M172 88 Q182 82 188 85" stroke="#E8A5AE" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M175 95 Q185 92 190 98" stroke="#E8A5AE" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <circle cx="188" cy="85" r="2.2" fill="#E8A5AE"/>
        <circle cx="190" cy="98" r="2.2" fill="#E8A5AE"/>
        <circle cx="178" cy="75" r="2.5" fill="#E8A5AE"/>
        <circle cx="183" cy="71" r="1.7" fill="#E8A5AE" opacity="0.6"/>
      </g>

      {/* "Lingerie pour elle" curved arc text above */}
      <defs>
        <path
          id="arcPath"
          d="M 40 95 A 62 62 0 0 1 160 95"
        />
      </defs>
      <text
        fontFamily="'Cormorant Garamond', serif"
        fontSize="14"
        fill="#1C2340"
        fontStyle="italic"
      >
        <textPath href="#arcPath" startOffset="50%" textAnchor="middle">
          Lingerie pour elle
        </textPath>
      </text>

      {/* Bra icon — dark navy */}
      <g transform="translate(52, 90)">
        {/* Left cup */}
        <path
          d="M0 38 C0 38, 0 18, 8 12 C16 6, 30 6, 40 14 C44 17, 47 20, 48 24 C48 28, 46 30, 44 32 C40 36, 32 38, 24 38 Z"
          fill="#1C2340"
        />
        {/* Right cup */}
        <path
          d="M96 38 C96 38, 96 18, 88 12 C80 6, 66 6, 56 14 C52 17, 49 20, 48 24 C48 28, 50 30, 52 32 C56 36, 64 38, 72 38 Z"
          fill="#1C2340"
        />
        {/* Center bridge */}
        <path
          d="M44 32 C44 34, 45 36, 48 38 C51 36, 52 34, 52 32"
          fill="#1C2340"
          stroke="#1C2340"
          strokeWidth="0.5"
        />
        {/* Left strap */}
        <path
          d="M10 12 L14 0"
          stroke="#1C2340"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Right strap */}
        <path
          d="M86 12 L82 0"
          stroke="#1C2340"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* White heart pattern on left cup */}
        {[
          [14, 22, 4], [22, 17, 3.5], [28, 25, 3.5],
          [18, 30, 3], [32, 17, 3]
        ].map(([x, y, s], i) => (
          <path
            key={`lh${i}`}
            d={`M${x} ${y + s * 0.3} C${x} ${y - s * 0.3}, ${x - s * 0.9} ${y - s * 0.3}, ${x - s * 0.9} ${y + s * 0.2} C${x - s * 0.9} ${y + s * 0.8}, ${x} ${y + s * 1.3}, ${x} ${y + s * 1.3} C${x} ${y + s * 1.3}, ${x + s * 0.9} ${y + s * 0.8}, ${x + s * 0.9} ${y + s * 0.2} C${x + s * 0.9} ${y - s * 0.3}, ${x} ${y - s * 0.3}, ${x} ${y + s * 0.3}`}
            fill="white"
            opacity="0.9"
          />
        ))}

        {/* White heart pattern on right cup */}
        {[
          [64, 22, 4], [72, 17, 3.5], [68, 28, 3.5],
          [78, 23, 3], [62, 30, 3]
        ].map(([x, y, s], i) => (
          <path
            key={`rh${i}`}
            d={`M${x} ${y + s * 0.3} C${x} ${y - s * 0.3}, ${x - s * 0.9} ${y - s * 0.3}, ${x - s * 0.9} ${y + s * 0.2} C${x - s * 0.9} ${y + s * 0.8}, ${x} ${y + s * 1.3}, ${x} ${y + s * 1.3} C${x} ${y + s * 1.3}, ${x + s * 0.9} ${y + s * 0.8}, ${x + s * 0.9} ${y + s * 0.2} C${x + s * 0.9} ${y - s * 0.3}, ${x} ${y - s * 0.3}, ${x} ${y + s * 0.3}`}
            fill="white"
            opacity="0.9"
          />
        ))}
      </g>

      {/* "Intime & Co" bold serif below */}
      <text
        x="100"
        y="162"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', serif"
        fontSize="22"
        fontWeight="700"
        fill="#1C2340"
        letterSpacing="0.5"
      >
        Intime &amp; Co
      </text>
    </svg>
  );
}

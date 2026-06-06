export default function InTimeLogo({ size = 120, className = '' }) {
  return (
    <img
      src="/intime-logo.jpg"
      alt="Intime & Co - Lingerie pour elle"
      width={size}
      height={size}
      className={`block rounded-full object-cover ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      loading="eager"
      decoding="async"
    />
  );
}

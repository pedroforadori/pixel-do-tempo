export function WatermarkOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {/* Diagonal repeated watermark */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 60px,
            rgba(0,0,0,0.15) 60px,
            rgba(0,0,0,0.15) 62px
          )`,
        }}
      />
      <div className="relative flex flex-col items-center gap-1 text-white drop-shadow-lg">
        <span className="text-lg font-bold tracking-widest opacity-70 rotate-[-20deg] select-none">
          pixeldotempo.com
        </span>
      </div>
    </div>
  );
}

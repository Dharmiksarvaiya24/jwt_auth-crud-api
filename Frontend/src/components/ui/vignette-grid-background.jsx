import { cn } from '@/lib/utils';

export function GridVignetteBackground({
  className,
  size = 48,
  x = 50,
  y = 50,
  horizontalVignetteSize = 100,
  verticalVignetteSize = 100,
  intensity = 0,
  ...props
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[-1] bg-black',
        className,
      )}
      style={{
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.08) 25%, rgba(255, 255, 255, 0.08) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.08) 75%, rgba(255, 255, 255, 0.08) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.08) 25%, rgba(255, 255, 255, 0.08) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.08) 75%, rgba(255, 255, 255, 0.08) 76%, transparent 77%, transparent)
        `,
        backgroundSize: `${size}px ${size}px`,
        maskImage: `radial-gradient(ellipse ${horizontalVignetteSize}% ${verticalVignetteSize}% at ${x}% ${y}%, black ${
          100 - intensity
        }%, transparent 100%)`,
      }}
      {...props}
    />
  );
}

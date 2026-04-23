import React, { useMemo, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const GridVignetteBackground = React.memo(function GridVignetteBackground({
  className,
  size = 48,
  x = 50,
  y = 50,
  horizontalVignetteSize = 100,
  verticalVignetteSize = 100,
  intensity = 0,
  duration = 8,
  // gap in seconds to hold at the end of each cycle before restarting
  gap = 1,
  ...props
}) {
  // lineWidth in px (keeps lines sharp)
  const lineWidth = 1;
  const lineColor = 'rgba(255,255,255,0.12)';

  // animation: move grid by one cell, then hold (gap) before repeating
  // movePercent is computed from gap/duration when running
  const movePercent = null;

  // We control animation via requestAnimationFrame so no CSS keyframes are necessary

  // base style; we will drive backgroundPosition with JS to avoid mid-cycle restarts
  const baseStyle = useMemo(() => ({
    backgroundColor: '#000000',
    backgroundImage: `
      repeating-linear-gradient(0deg, ${lineColor} 0 ${lineWidth}px, transparent ${lineWidth}px ${size}px),
      repeating-linear-gradient(90deg, ${lineColor} 0 ${lineWidth}px, transparent ${lineWidth}px ${size}px)
    `,
    ['--grid-size']: `${size}px`,
    transform: 'translateZ(0)',
    imageRendering: 'pixelated',
    maskImage: `radial-gradient(ellipse ${horizontalVignetteSize}% ${verticalVignetteSize}% at ${x}% ${y}%, black ${
      100 - intensity
    }%, transparent 100%)`,
    WebkitMaskImage: `radial-gradient(ellipse ${horizontalVignetteSize}% ${verticalVignetteSize}% at ${x}% ${y}%, black ${
      100 - intensity
    }%, transparent 100%)`,
  }), [lineColor, lineWidth, size, horizontalVignetteSize, verticalVignetteSize, x, y, intensity]);

  const elRef = useRef(null);
  // keep latest config in refs so animation loop doesn't restart when props change
  const cfgRef = useRef({ size, duration, gap });
  cfgRef.current.size = size;
  cfgRef.current.duration = duration;
  cfgRef.current.gap = gap;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let rafId = null;
    let start = null;

    const run = (ts) => {
      if (start === null) start = ts;
  const { size: cfgSize, duration: cfgDuration, gap: cfgGap } = cfgRef.current;
  const totalMs = cfgDuration * 1000;
  const gapMs = Math.max(0, cfgGap * 1000);
  const moveMs = Math.max(0, totalMs - gapMs);
  const holdMs = Math.max(0, totalMs - moveMs); // effectively gapMs (or 0 if moveMs == totalMs)
      const elapsed = ts - start;

      if (elapsed <= moveMs) {
        // interpolate 0 -> size
        const t = elapsed / moveMs;
        const pos = Math.round(t * cfgSize);
        const posStr = `${pos}px ${pos}px, ${pos}px ${pos}px`;
        el.style.backgroundPosition = posStr;
      } else if (elapsed <= moveMs + holdMs) {
        // hold at end
        const pos = cfgSize;
        const posStr = `${pos}px ${pos}px, ${pos}px ${pos}px`;
        el.style.backgroundPosition = posStr;
      } else {
        // restart cycle
        start = ts;
      }

      rafId = requestAnimationFrame(run);
    };

    rafId = requestAnimationFrame(run);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []); // run once on mount; cfgRef allows live updates without restarting

  return (
    <div
      ref={elRef}
      className={cn('fixed inset-0 z-0 pointer-events-none', className)}
      style={baseStyle}
      {...props}
    />
  );
});

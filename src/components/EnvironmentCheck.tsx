import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Flame, ScrollText, Sparkles, Swords } from 'lucide-react';

interface StackItem {
  label: string;
  detail: string;
  icon: 'flame' | 'scroll' | 'sparkles' | 'swords';
}

const STACK_ITEMS: StackItem[] = [
  { label: 'Astro 7 + MDX', detail: 'Content Collections & static speed', icon: 'scroll' },
  { label: 'React 19 Islands', detail: 'Interactive lore & search UI', icon: 'sparkles' },
  { label: 'GSAP + Lenis + Barba', detail: 'Smooth scroll & page transitions', icon: 'flame' },
  { label: 'Elden Typography & Icons', detail: 'Cinzel, Garamond & Game Icons', icon: 'swords' },
];

function renderIcon(icon: StackItem['icon']) {
  const cls = 'h-5 w-5 text-er-gold';
  switch (icon) {
    case 'flame':
      return <Flame className={cls} />;
    case 'scroll':
      return <ScrollText className={cls} />;
    case 'sparkles':
      return <Sparkles className={cls} />;
    case 'swords':
      return <Swords className={cls} />;
  }
}

export default function EnvironmentCheck() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.stack-card', {
        opacity: 0,
        y: 16,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="grid gap-4 sm:grid-cols-2">
      {STACK_ITEMS.map((item) => (
        <div
          key={item.label}
          className="stack-card rounded border border-er-gold-dim/40 bg-er-charcoal/80 p-5 transition-colors hover:border-er-gold/70"
        >
          <div className="mb-2 flex items-center gap-3">
            {renderIcon(item.icon)}
            <h2 className="font-heading text-base font-semibold tracking-wider text-er-gold-bright">
              {item.label}
            </h2>
          </div>
          <p className="font-lore text-lg text-er-ash">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}

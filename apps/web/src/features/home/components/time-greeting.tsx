'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun, Sunrise } from 'lucide-react';

type GreetingPeriod = 'morning' | 'afternoon' | 'night';

interface TimeGreetingProps {
  name: string;
  labels: Record<GreetingPeriod, string>;
}

function getGreetingPeriod(hour: number): GreetingPeriod {
  if (hour < 12) return 'morning';
  if (hour < 20) return 'afternoon';
  return 'night';
}

const subscribe = () => () => undefined;

function getClientGreetingPeriod() {
  return getGreetingPeriod(new Date().getHours());
}

function getServerGreetingPeriod() {
  return null;
}

export function TimeGreeting({ name, labels }: TimeGreetingProps) {
  const period = useSyncExternalStore(
    subscribe,
    getClientGreetingPeriod,
    getServerGreetingPeriod,
  );

  if (!period) return null;

  const Icon = period === 'morning' ? Sunrise : period === 'afternoon' ? Sun : Moon;

  return (
    <p
      className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface/80 px-3 py-1.5 text-base font-bold text-primary shadow-sm"
      role="status"
    >
      <Icon className="size-4" aria-hidden="true" />
      {labels[period]}, {name}
    </p>
  );
}

'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun, Sunrise } from 'lucide-react';

type GreetingPeriod = 'morning' | 'afternoon' | 'night';

interface TimeGreetingProps {
  name: string;
  labels: Record<GreetingPeriod, string>;
}

function getGreetingPeriod(hour: number): GreetingPeriod {
  if (hour < 6 || hour >= 20) return 'night';
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
    <h2
      className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      aria-live="polite"
    >
      <Icon className="size-6 shrink-0 text-primary" aria-hidden="true" />
      {labels[period]}, {name}
    </h2>
  );
}

'use client';

import { useSyncExternalStore } from 'react';

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

  return (
    <p className="text-sm font-semibold text-primary" role="status">
      {labels[period]}, {name}
    </p>
  );
}

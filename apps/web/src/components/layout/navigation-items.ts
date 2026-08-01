import {
  CircleUserRound,
  Home,
  Map,
  PawPrint,
  Plus,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Inicio',
    href: '/',
    icon: Home,
  },
  {
    label: 'Mapa',
    href: '/mapa',
    icon: Map,
  },
  {
    label: 'Reportes',
    href: '/reportes',
    icon: ScrollText,
  },
  {
    label: 'Mascotas',
    href: '/mascotas',
    icon: PawPrint,
  },
  {
    label: 'Perfil',
    href: '/perfil',
    icon: CircleUserRound,
  },
];

export const reportAction = {
  label: 'Reportar',
  icon: Plus,
};

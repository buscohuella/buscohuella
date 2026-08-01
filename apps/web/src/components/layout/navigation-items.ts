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
  { label: 'Inicio', href: '/inicio', icon: Home },
  { label: 'Mapa', href: '/mapa', icon: Map },
  { label: 'Reportes', href: '/mis-reportes', icon: ScrollText },
  { label: 'Mascotas', href: '/mis-mascotas', icon: PawPrint },
  { label: 'Perfil', href: '/perfil', icon: CircleUserRound },
];

export const reportAction = {
  label: 'Reportar',
  icon: Plus,
};

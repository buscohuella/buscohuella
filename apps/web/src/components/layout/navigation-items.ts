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
  labelKey: string;
  href: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  {
    labelKey: 'navigation.private.home',
    href: '/inicio',
    icon: Home,
  },
  {
    labelKey: 'navigation.private.map',
    href: '/mapa',
    icon: Map,
  },
  {
    labelKey: 'navigation.private.notices',
    href: '/mis-avisos',
    icon: ScrollText,
  },
  {
    labelKey: 'navigation.private.pets',
    href: '/mis-mascotas',
    icon: PawPrint,
  },
  {
    labelKey: 'navigation.private.profile',
    href: '/perfil',
    icon: CircleUserRound,
  },
];

export const reportAction = {
  labelKey: 'navigation.private.report',
  icon: Plus,
};

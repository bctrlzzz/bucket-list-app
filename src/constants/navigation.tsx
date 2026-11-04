import type { Feather } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Feather>['name'];

export type NavItem = {
    href: Href;
    label: string;
    icon: IconName;
};

export const navItems: NavItem[] = [
 { href: '/', label: 'Mis planes', icon: 'layers'},   
 { href: '/profile', label: 'Mi perfil', icon: 'user'},   
 { href: '/calendar', label: 'Mi calendario', icon: 'calendar'},   
 { href: '/shared', label: 'Compartidos', icon: 'users'},   
 { href: '/near-me', label: 'Cerca de mí', icon: 'map-pin'},   
 { href: '/tiktok', label: 'TikTok', icon: 'music'},
 { href: '/plan', label: 'Planificar mi 2027', icon: 'activity'},
]
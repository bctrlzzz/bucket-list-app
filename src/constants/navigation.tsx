import type { Feather } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Feather>['name'];

export type NavItem = {
    href: Href;
    label: string;
    icon: IconName;
    showOnPhone: boolean;
};

export const navItems: NavItem[] = [
 { href: '/', label: 'Mis planes', icon: 'layers', showOnPhone: true},   
 { href: '/profile', label: 'Mi perfil', icon: 'user', showOnPhone: false},   
 { href: '/calendar', label: 'Mi calendario', icon: 'calendar', showOnPhone: true},   
 { href: '/shared', label: 'Compartidos', icon: 'users', showOnPhone: false},    
 { href: '/near-me', label: 'Cerca de mí', icon: 'map-pin', showOnPhone: true},    
 { href: '/tiktok', label: 'TikTok', icon: 'music', showOnPhone: true},   
 { href: '/plan', label: 'Planificar mi 2027', icon: 'activity', showOnPhone: false},   
]
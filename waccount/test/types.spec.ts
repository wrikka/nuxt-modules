import { describe, it, expect } from 'vitest';
import type { ModuleOptions, NavItem, WAccountConfig } from '../src/types';

describe('waccount types', () => {
  it('should have correct ModuleOptions structure', () => {
    const options: ModuleOptions = {
      publicPages: ['/about', '/contact'],
      navItems: [
        { id: 'test', label: 'Test', path: '/test' }
      ],
      enableAuthMiddleware: true,
      loginPath: '/auth/login',
      workosClientId: 'test-client-id',
      workosApiKey: 'test-api-key',
      databaseUrl: 'postgres://localhost/test'
    };

    expect(options.publicPages).toEqual(['/about', '/contact']);
    expect(options.navItems).toHaveLength(1);
    expect(options.enableAuthMiddleware).toBe(true);
    expect(options.loginPath).toBe('/auth/login');
  });

  it('should have correct NavItem structure', () => {
    const navItem: NavItem = {
      id: 'profile',
      label: 'Profile',
      icon: 'mdi:account',
      path: '/profile',
      badge: 3
    };

    expect(navItem.id).toBe('profile');
    expect(navItem.label).toBe('Profile');
    expect(navItem.icon).toBe('mdi:account');
    expect(navItem.path).toBe('/profile');
    expect(navItem.badge).toBe(3);
  });

  it('should have correct WAccountConfig structure', () => {
    const config: WAccountConfig = {
      publicPages: [],
      navItems: [],
      enableAuthMiddleware: false,
      loginPath: '/login',
      workosClientId: 'client-id'
    };

    expect(config.publicPages).toEqual([]);
    expect(config.navItems).toEqual([]);
    expect(config.enableAuthMiddleware).toBe(false);
    expect(config.loginPath).toBe('/login');
    expect(config.workosClientId).toBe('client-id');
  });
});

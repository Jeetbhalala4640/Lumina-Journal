import { User } from '../types';
import { INITIAL_USER } from './seedData';
import { getStoredUser, saveStoredUser } from './storage';

const AUTH_KEY = 'lumina_auth_state_v1';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export const authService = {
  getInitialState(): AuthState {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Default: logged in as author so the user can immediately test creating, drafts, and dashboard!
      const user = getStoredUser() || INITIAL_USER;
      const state: AuthState = {
        user,
        isAuthenticated: true,
        token: 'mock-jwt-token-lumina-author-2026',
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(state));
      return state;
    } catch {
      return {
        user: INITIAL_USER,
        isAuthenticated: true,
        token: 'mock-jwt-token-lumina-author-2026',
      };
    }
  },

  saveState(state: AuthState): void {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save auth state', e);
    }
  },

  async login(email: string, _password?: string): Promise<User> {
    // In demo mode, if author email is matched, log in as Author
    let user = getStoredUser();
    if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
      user = {
        ...INITIAL_USER,
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      };
    }

    const state: AuthState = {
      user,
      isAuthenticated: true,
      token: 'jwt-session-' + Date.now(),
    };
    this.saveState(state);
    saveStoredUser(user);
    return user;
  },

  async register(name: string, email: string, _password?: string): Promise<User> {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
      role: 'author',
      bio: 'Author and tech enthusiast writing on modern software and design.',
      title: 'Writer & Thinker',
      socialLinks: {},
    };

    const state: AuthState = {
      user: newUser,
      isAuthenticated: true,
      token: 'jwt-session-' + Date.now(),
    };
    this.saveState(state);
    saveStoredUser(newUser);
    return newUser;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const currentUser = getStoredUser() || INITIAL_USER;
    const updated: User = {
      ...currentUser,
      ...updates,
    };
    saveStoredUser(updated);

    const state: AuthState = {
      user: updated,
      isAuthenticated: true,
      token: 'jwt-session-' + Date.now(),
    };
    this.saveState(state);
    return updated;
  },

  async logout(): Promise<void> {
    const state: AuthState = {
      user: null,
      isAuthenticated: false,
      token: null,
    };
    this.saveState(state);
  },
};

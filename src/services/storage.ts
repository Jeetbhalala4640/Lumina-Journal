import { Blog, Category, Comment, User } from '../types';
import { INITIAL_BLOGS, INITIAL_CATEGORIES, INITIAL_USER } from './seedData';

const STORAGE_KEYS = {
  BLOGS: 'lumina_blogs_data_v1',
  CATEGORIES: 'lumina_categories_data_v1',
  USER: 'lumina_user_profile_v1',
  BOOKMARKS: 'lumina_user_bookmarks_v1',
  COMMENTS: 'lumina_blog_comments_v1',
  THEME: 'lumina_theme_mode_v1',
  AUTH_TOKEN: 'lumina_auth_token_v1',
};

export const getStoredBlogs = (): Blog[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BLOGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(INITIAL_BLOGS));
      return INITIAL_BLOGS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_BLOGS;
  }
};

export const saveStoredBlogs = (blogs: Blog[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
  } catch (error) {
    console.error('Failed to save blogs to storage', error);
  }
};

export const getStoredCategories = (): Category[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CATEGORIES;
  }
};

export const saveStoredCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories', error);
  }
};

export const getStoredUser = (): User | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (!data) {
      return INITIAL_USER;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_USER;
  }
};

export const saveStoredUser = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user', error);
  }
};

export const getStoredBookmarks = (): string[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredBookmarks = (ids: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(ids));
  } catch (error) {
    console.error('Failed to save bookmarks', error);
  }
};

export const getStoredComments = (): Comment[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    if (!data) {
      const initialComments: Comment[] = [
        {
          id: 'comm-1',
          blogId: 'blog-1',
          authorName: 'Marcus Vance',
          authorEmail: 'marcus@techcorp.io',
          authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          content: 'The section on separating presentation mechanics from domain invariants hits close to home. We experienced a 3x speedup in refactoring after adopting pure TS domain entities.',
          createdAt: '2026-09-15T14:20:00.000Z',
          likes: 14,
        },
        {
          id: 'comm-2',
          blogId: 'blog-1',
          authorName: 'Sophia Lin',
          authorEmail: 'sophia@uxstudio.dev',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
          content: 'Splendid writing Elena! Really appreciate the benchmarks comparison table.',
          createdAt: '2026-09-16T09:12:00.000Z',
          likes: 8,
        },
        {
          id: 'comm-3',
          blogId: 'blog-2',
          authorName: 'Julian Thorne',
          authorEmail: 'julian@designguild.org',
          authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
          content: '“Perfection is achieved when there is nothing left to take away” is a mantra more design teams need to tape to their monitors.',
          createdAt: '2026-09-22T12:00:00.000Z',
          likes: 19,
        },
      ];
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(initialComments));
      return initialComments;
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveStoredComments = (comments: Comment[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  } catch (error) {
    console.error('Failed to save comments', error);
  }
};

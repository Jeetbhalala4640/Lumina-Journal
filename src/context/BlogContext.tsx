import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Blog, Category, DashboardStats, BlogFilterOptions } from '../types';
import { blogService } from '../services/blogService';
import {
  getStoredCategories,
  getStoredBookmarks,
  saveStoredBookmarks,
  getStoredBlogs,
} from '../services/storage';

interface BlogContextType {
  blogs: Blog[];
  categories: Category[];
  bookmarks: string[];
  isLoading: boolean;
  refreshBlogs: () => Promise<void>;
  getFilteredBlogs: (options?: BlogFilterOptions) => Promise<Blog[]>;
  getBlogBySlug: (slug: string) => Promise<Blog | null>;
  getBlogById: (id: string) => Promise<Blog | null>;
  createBlog: (data: Partial<Blog>) => Promise<Blog>;
  updateBlog: (id: string, data: Partial<Blog>) => Promise<Blog>;
  deleteBlog: (id: string) => Promise<boolean>;
  duplicateBlog: (id: string) => Promise<Blog>;
  publishBlog: (id: string) => Promise<Blog>;
  unpublishBlog: (id: string) => Promise<Blog>;
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  incrementViews: (id: string) => Promise<number>;
  toggleLike: (id: string) => Promise<{ likes: number; liked: boolean }>;
  getStats: () => Promise<DashboardStats>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>(() => getStoredBlogs());
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  const [bookmarks, setBookmarks] = useState<string[]>(() => getStoredBookmarks());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await blogService.getBlogs();
      setBlogs(data);
      const cats = getStoredCategories();
      const computedCats = cats.map((c) => ({
        ...c,
        count: data.filter(
          (b) =>
            b.status === 'published' &&
            b.category.toLowerCase() === c.name.toLowerCase()
        ).length,
      }));
      setCategories(computedCats);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFilteredBlogs = useCallback(async (options?: BlogFilterOptions) => {
    return blogService.getBlogs(options);
  }, []);

  const getBlogBySlug = useCallback(async (slug: string) => {
    return blogService.getBlogBySlug(slug);
  }, []);

  const getBlogById = useCallback(async (id: string) => {
    return blogService.getBlogById(id);
  }, []);

  const createBlog = useCallback(async (data: Partial<Blog>) => {
    const created = await blogService.createBlog(data);
    await refreshBlogs();
    return created;
  }, [refreshBlogs]);

  const updateBlog = useCallback(async (id: string, data: Partial<Blog>) => {
    const updated = await blogService.updateBlog(id, data);
    setBlogs((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  }, []);

  const deleteBlog = useCallback(async (id: string) => {
    const success = await blogService.deleteBlog(id);
    if (success) {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    }
    return success;
  }, []);

  const duplicateBlog = useCallback(async (id: string) => {
    const dup = await blogService.duplicateBlog(id);
    setBlogs((prev) => [dup, ...prev]);
    return dup;
  }, []);

  const publishBlog = useCallback(async (id: string) => {
    const pub = await blogService.publishBlog(id);
    setBlogs((prev) => prev.map((b) => (b.id === id ? pub : b)));
    return pub;
  }, []);

  const unpublishBlog = useCallback(async (id: string) => {
    const unpub = await blogService.unpublishBlog(id);
    setBlogs((prev) => prev.map((b) => (b.id === id ? unpub : b)));
    return unpub;
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter((item) => item !== id);
      } else {
        next = [...prev, id];
      }
      saveStoredBookmarks(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => {
    return bookmarks.includes(id);
  }, [bookmarks]);

  const incrementViews = useCallback(async (id: string) => {
    const newViews = await blogService.incrementViews(id);
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, views: newViews } : b))
    );
    return newViews;
  }, []);

  const toggleLike = useCallback(async (id: string) => {
    const res = await blogService.toggleLike(id);
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, likes: res.likes } : b))
    );
    return res;
  }, []);

  const getStats = useCallback(async () => {
    return blogService.getDashboardStats();
  }, []);

  const contextValue = useMemo(
    () => ({
      blogs,
      categories,
      bookmarks,
      isLoading,
      refreshBlogs,
      getFilteredBlogs,
      getBlogBySlug,
      getBlogById,
      createBlog,
      updateBlog,
      deleteBlog,
      duplicateBlog,
      publishBlog,
      unpublishBlog,
      toggleBookmark,
      isBookmarked,
      incrementViews,
      toggleLike,
      getStats,
    }),
    [
      blogs,
      categories,
      bookmarks,
      isLoading,
      refreshBlogs,
      getFilteredBlogs,
      getBlogBySlug,
      getBlogById,
      createBlog,
      updateBlog,
      deleteBlog,
      duplicateBlog,
      publishBlog,
      unpublishBlog,
      toggleBookmark,
      isBookmarked,
      incrementViews,
      toggleLike,
      getStats,
    ]
  );

  return (
    <BlogContext.Provider value={contextValue}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

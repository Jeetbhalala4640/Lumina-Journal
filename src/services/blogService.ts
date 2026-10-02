import { Blog, BlogFilterOptions, Comment, DashboardStats } from '../types';
import {
  getStoredBlogs,
  saveStoredBlogs,
  getStoredComments,
  saveStoredComments,
  getStoredUser,
} from './storage';

export const calculateReadingTime = (content: string): number => {
  const cleanText = content.replace(/<[^>]*>?/gm, '');
  const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const blogService = {
  async getBlogs(options: BlogFilterOptions = {}): Promise<Blog[]> {
    let blogs = getStoredBlogs();

    if (options.status && options.status !== 'all') {
      blogs = blogs.filter((b) => b.status === options.status);
    }

    if (options.category && options.category !== 'all') {
      blogs = blogs.filter(
        (b) => b.category.toLowerCase() === options.category?.toLowerCase() ||
               b.category.toLowerCase().replace(/\s+/g, '-') === options.category?.toLowerCase()
      );
    }

    if (options.tag) {
      blogs = blogs.filter((b) =>
        b.tags.some((t) => t.toLowerCase() === options.tag?.toLowerCase())
      );
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      blogs = blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.subtitle.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (options.sort === 'popular') {
      blogs.sort((a, b) => b.views - a.views);
    } else if (options.sort === 'oldest') {
      blogs.sort(
        (a, b) =>
          new Date(a.publishedAt || a.createdAt).getTime() -
          new Date(b.publishedAt || b.createdAt).getTime()
      );
    } else {
      // default latest
      blogs.sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
      );
    }

    return [...blogs];
  },

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const blogs = getStoredBlogs();
    const blog = blogs.find((b) => b.slug === slug);
    return blog ? { ...blog } : null;
  },

  async getBlogById(id: string): Promise<Blog | null> {
    const blogs = getStoredBlogs();
    const blog = blogs.find((b) => b.id === id);
    return blog ? { ...blog } : null;
  },

  async createBlog(data: Partial<Blog>): Promise<Blog> {
    const blogs = getStoredBlogs();
    const user = getStoredUser();

    const title = data.title || 'Untitled Article';
    const slug = data.slug || generateSlug(title) + '-' + Math.random().toString(36).substring(2, 6);
    const readingTime = calculateReadingTime(data.content || '');

    const newBlog: Blog = {
      id: 'blog-' + Date.now(),
      slug,
      title,
      subtitle: data.subtitle || '',
      excerpt: data.excerpt || (data.content ? data.content.replace(/<[^>]*>?/gm, '').slice(0, 160) + '...' : ''),
      content: data.content || '',
      coverImage:
        data.coverImage ||
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
      coverImageCaption: data.coverImageCaption || '',
      category: data.category || 'Engineering',
      tags: data.tags && data.tags.length > 0 ? data.tags : ['General'],
      status: data.status || 'draft',
      author: {
        id: user?.id || 'usr-1',
        name: user?.name || 'Elena Rostova',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: user?.bio || '',
        title: user?.title || '',
      },
      readingTime,
      views: 0,
      likes: 0,
      featured: !!data.featured,
      popular: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: data.status === 'published' ? new Date().toISOString() : null,
      seo: data.seo || {
        metaTitle: title,
        metaDescription: data.excerpt || title,
        keywords: data.tags || [],
      },
    };

    const updated = [newBlog, ...blogs];
    saveStoredBlogs(updated);
    return newBlog;
  },

  async updateBlog(id: string, data: Partial<Blog>): Promise<Blog> {
    const blogs = getStoredBlogs();
    const index = blogs.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new Error(`Blog with id ${id} not found`);
    }

    const current = blogs[index];
    const newContent = data.content !== undefined ? data.content : current.content;
    const readingTime = calculateReadingTime(newContent);

    let publishedAt = current.publishedAt;
    if (data.status === 'published' && !current.publishedAt) {
      publishedAt = new Date().toISOString();
    } else if (data.status === 'draft') {
      publishedAt = null;
    }

    const updatedBlog: Blog = {
      ...current,
      ...data,
      readingTime,
      updatedAt: new Date().toISOString(),
      publishedAt,
      seo: {
        ...current.seo,
        ...(data.seo || {}),
      },
    };

    blogs[index] = updatedBlog;
    saveStoredBlogs(blogs);
    return updatedBlog;
  },

  async deleteBlog(id: string): Promise<boolean> {
    const blogs = getStoredBlogs();
    const filtered = blogs.filter((b) => b.id !== id);
    saveStoredBlogs(filtered);
    return true;
  },

  async duplicateBlog(id: string): Promise<Blog> {
    const original = await this.getBlogById(id);
    if (!original) throw new Error('Original blog not found');

    const duplicateData: Partial<Blog> = {
      ...original,
      id: undefined,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Math.random().toString(36).substring(2, 5)}`,
      status: 'draft',
      views: 0,
      likes: 0,
      featured: false,
      popular: false,
    };

    return this.createBlog(duplicateData);
  },

  async publishBlog(id: string): Promise<Blog> {
    return this.updateBlog(id, { status: 'published' });
  },

  async unpublishBlog(id: string): Promise<Blog> {
    return this.updateBlog(id, { status: 'draft' });
  },

  async incrementViews(id: string): Promise<number> {
    const blogs = getStoredBlogs();
    const index = blogs.findIndex((b) => b.id === id);
    if (index === -1) return 0;

    blogs[index].views += 1;
    saveStoredBlogs(blogs);
    return blogs[index].views;
  },

  async toggleLike(id: string): Promise<{ likes: number; liked: boolean }> {
    const blogs = getStoredBlogs();
    const index = blogs.findIndex((b) => b.id === id);
    if (index === -1) return { likes: 0, liked: false };

    const likedKey = `lumina_liked_${id}`;
    const alreadyLiked = localStorage.getItem(likedKey) === 'true';

    if (alreadyLiked) {
      blogs[index].likes = Math.max(0, blogs[index].likes - 1);
      localStorage.removeItem(likedKey);
    } else {
      blogs[index].likes += 1;
      localStorage.setItem(likedKey, 'true');
    }

    saveStoredBlogs(blogs);
    return { likes: blogs[index].likes, liked: !alreadyLiked };
  },

  async getRelatedBlogs(currentBlog: Blog, limit = 3): Promise<Blog[]> {
    const blogs = getStoredBlogs();
    return blogs
      .filter(
        (b) =>
          b.id !== currentBlog.id &&
          b.status === 'published' &&
          (b.category === currentBlog.category ||
            b.tags.some((t) => currentBlog.tags.includes(t)))
      )
      .slice(0, limit);
  },

  async getAdjacentBlogs(currentBlog: Blog): Promise<{ prev: Blog | null; next: Blog | null }> {
    const blogs = getStoredBlogs()
      .filter((b) => b.status === 'published')
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());

    const currentIndex = blogs.findIndex((b) => b.id === currentBlog.id);
    if (currentIndex === -1) return { prev: null, next: null };

    const prev = currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;
    const next = currentIndex > 0 ? blogs[currentIndex - 1] : null;

    return { prev, next };
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const blogs = getStoredBlogs();
    const totalBlogs = blogs.length;
    const publishedBlogs = blogs.filter((b) => b.status === 'published').length;
    const draftBlogs = blogs.filter((b) => b.status === 'draft').length;
    const totalViews = blogs.reduce((acc, curr) => acc + curr.views, 0);
    const totalLikes = blogs.reduce((acc, curr) => acc + curr.likes, 0);

    const recentViews = [
      { date: 'Mon', views: Math.round(totalViews * 0.12) },
      { date: 'Tue', views: Math.round(totalViews * 0.15) },
      { date: 'Wed', views: Math.round(totalViews * 0.18) },
      { date: 'Thu', views: Math.round(totalViews * 0.22) },
      { date: 'Fri', views: Math.round(totalViews * 0.19) },
      { date: 'Sat', views: Math.round(totalViews * 0.08) },
      { date: 'Sun', views: Math.round(totalViews * 0.06) },
    ];

    return {
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalViews,
      totalLikes,
      viewsThisMonth: Math.round(totalViews * 0.72),
      recentViews,
    };
  },

  async getComments(blogId: string): Promise<Comment[]> {
    const comments = getStoredComments();
    return comments.filter((c) => c.blogId === blogId);
  },

  async addComment(
    blogId: string,
    data: Omit<Comment, 'id' | 'createdAt' | 'likes'>
  ): Promise<Comment> {
    const comments = getStoredComments();
    const newComment: Comment = {
      ...data,
      id: 'comm-' + Date.now(),
      blogId,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    const updated = [newComment, ...comments];
    saveStoredComments(updated);
    return newComment;
  },
};

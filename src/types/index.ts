export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'author' | 'reader';
  bio?: string;
  title?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  count?: number;
}

export interface BlogSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string; // Rich HTML
  coverImage: string;
  coverImageCaption?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  author: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    title: string;
  };
  readingTime: number; // in minutes
  views: number;
  likes: number;
  featured: boolean;
  popular: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  seo: BlogSeo;
}

export interface Comment {
  id: string;
  blogId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface BlogFilterOptions {
  category?: string;
  tag?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'oldest';
  status?: 'all' | 'published' | 'draft';
}

export interface DashboardStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalViews: number;
  totalLikes: number;
  viewsThisMonth: number;
  recentViews: { date: string; views: number }[];
}

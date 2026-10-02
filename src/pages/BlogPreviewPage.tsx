import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  PenSquare,
  Globe,
  LayoutDashboard,
  Clock,
  Eye,
  CheckCircle2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useToast } from '../context/ToastContext';
import { Blog } from '../types';
import TableOfContents from '../components/blog/TableOfContents';
import ReadingProgressBar from '../components/blog/ReadingProgressBar';

const BlogPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlogById, publishBlog, unpublishBlog } = useBlog();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const load = async () => {
      if (!id) return;

      if (id === 'temp') {
        const stored = sessionStorage.getItem('lumina_live_preview_data');
        if (stored) {
          setBlog(JSON.parse(stored));
        }
        setLoading(false);
        return;
      }

      try {
        const found = await getBlogById(id);
        setBlog(found);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, getBlogById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400">
        Generating high-fidelity preview...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="font-serif font-bold text-2xl text-neutral-900 dark:text-white">
          Preview unavailable
        </h2>
        <p className="text-xs text-neutral-500">
          No preview content found for this session.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handlePublish = async () => {
    if (!id || id === 'temp') {
      success('To publish this draft permanently, return to the studio editor and click Publish.');
      return;
    }

    try {
      if (blog.status === 'published') {
        await unpublishBlog(blog.id);
        setBlog({ ...blog, status: 'draft' });
        success('Article unpublished.');
      } else {
        await publishBlog(blog.id);
        setBlog({ ...blog, status: 'published' });
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        success('🎉 Article is now live!');
      }
    } catch {
      error('Failed to update status.');
    }
  };

  const formattedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <ReadingProgressBar />

      {/* Floating Top Studio Preview Controls Bar */}
      <div className="sticky top-0 z-50 w-full bg-neutral-900/95 backdrop-blur-md text-white border-b border-neutral-800 py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Live Preview Mode
            </span>
            <span className="hidden sm:inline text-xs text-neutral-400">
              Rendering exactly as readers will see it
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to={id === 'temp' ? '/dashboard/create' : `/dashboard/edit/${id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
            >
              <PenSquare className="w-3.5 h-3.5 text-brand-400" />
              <span>Edit Article</span>
            </Link>

            <button
              onClick={handlePublish}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{blog.status === 'published' ? 'Unpublish' : 'Publish Live'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Public Article Simulator */}
      <article className="min-h-screen py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Article Header */}
          <header className="max-w-4xl mx-auto space-y-6 text-center lg:text-left mb-12">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                {blog.category}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                <Clock className="w-3.5 h-3.5" />
                {blog.readingTime} min read
              </span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl text-neutral-900 dark:text-white tracking-tight leading-[1.15]">
              {blog.title}
            </h1>

            {blog.subtitle && (
              <p className="text-neutral-600 dark:text-neutral-400 text-lg sm:text-xl leading-relaxed font-light">
                {blog.subtitle}
              </p>
            )}

            {/* Author Byline */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 border-t border-neutral-100 dark:border-neutral-900">
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-800"
              />
              <div className="text-left">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {blog.author.name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {blog.author.title || 'Author'} • {formattedDate}
                </p>
              </div>
            </div>
          </header>

          {/* Hero Cover Image */}
          <div className="max-w-5xl mx-auto mb-14">
            <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-neutral-100 dark:bg-neutral-800">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
            {blog.coverImageCaption && (
              <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-3 italic font-serif">
                {blog.coverImageCaption}
              </p>
            )}
          </div>

          {/* Layout: Main Body + Sticky TOC */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            <main className="lg:col-span-8">
              <div
                className="editorial-prose prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content || '<p><em>No content provided yet.</em></p>' }}
              />

              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mr-2">
                    Tags:
                  </span>
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </main>

            <aside className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                <TableOfContents content={blog.content} />
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPreviewPage;

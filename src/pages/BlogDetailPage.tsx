import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Eye,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PenSquare,
} from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Blog } from '../types';
import ReadingProgressBar from '../components/blog/ReadingProgressBar';
import TableOfContents from '../components/blog/TableOfContents';
import ShareButtons from '../components/blog/ShareButtons';
import CommentsSection from '../components/blog/CommentsSection';
import BlogCard from '../components/blog/BlogCard';
import { blogService } from '../services/blogService';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getBlogBySlug, incrementViews, isBookmarked, toggleBookmark } = useBlog();
  const { isAuthenticated } = useAuth();
  const { success, info } = useToast();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [adjacent, setAdjacent] = useState<{ prev: Blog | null; next: Blog | null }>({
    prev: null,
    next: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    let isMounted = true;
    const loadBlog = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await getBlogBySlug(slug);
        if (!isMounted) return;

        if (found) {
          setBlog(found);
          // Increment views asynchronously in background without blocking render
          incrementViews(found.id).catch(() => {});

          const rel = await blogService.getRelatedBlogs(found, 3);
          if (isMounted) setRelated(rel);

          const adj = await blogService.getAdjacentBlogs(found);
          if (isMounted) setAdjacent(adj);
        } else {
          setBlog(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBlog();

    return () => {
      isMounted = false;
    };
  }, [slug, getBlogBySlug, incrementViews]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-neutral-500 font-medium">Loading essay...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-serif font-bold text-3xl text-neutral-900 dark:text-white">
          Article Not Found
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          The article you are looking for may have been removed, unpublished, or the URL might be invalid.
        </p>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Articles</span>
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(blog.id);
  const formattedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleBookmark = () => {
    toggleBookmark(blog.id);
    if (!bookmarked) {
      success('Saved to bookmarks');
    } else {
      info('Removed from bookmarks');
    }
  };

  return (
    <>
      {/* Sticky Top Reading Progress */}
      <ReadingProgressBar />

      <article className="min-h-screen py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Breadcrumb / Return button */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200/60 dark:border-neutral-800">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all essays</span>
            </Link>

            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <Link
                  to={`/dashboard/edit/${blog.id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>Edit in Studio</span>
                </Link>
              )}
              <button
                onClick={handleBookmark}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors active:scale-95"
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-brand-500 text-brand-500' : ''}`} />
                <span>{bookmarked ? 'Saved' : 'Save article'}</span>
              </button>
            </div>
          </div>

          {/* Article Header */}
          <header className="max-w-4xl mx-auto space-y-6 text-center lg:text-left mb-12">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <Link
                to={`/category/${blog.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition-colors"
              >
                {blog.category}
              </Link>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                <Clock className="w-3.5 h-3.5" />
                {blog.readingTime} min read
              </span>
              {blog.views > 0 && (
                <>
                  <span className="text-neutral-300 dark:text-neutral-700">•</span>
                  <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <Eye className="w-3.5 h-3.5" />
                    {blog.views.toLocaleString()} reads
                  </span>
                </>
              )}
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

          {/* Layout: Main Article Body + Sticky TOC Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* Main Article Content */}
            <main className="lg:col-span-8">
              <div
                className="editorial-prose prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags Section */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mr-2">
                    Tagged with:
                  </span>
                  {blog.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blogs?tag=${encodeURIComponent(tag)}`}
                      className="text-xs font-medium px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Share & Like Bar */}
              <ShareButtons
                title={blog.title}
                blogId={blog.id}
                initialLikes={blog.likes}
              />

              {/* Author Showcase Card */}
              <div className="my-12 p-8 rounded-3xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                <img
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-neutral-800 flex-shrink-0"
                />
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="font-serif font-bold text-xl text-neutral-900 dark:text-white">
                      {blog.author.name}
                    </h4>
                    <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold uppercase tracking-wider">
                      Author &amp; Editor
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                    {blog.author.bio || 'Architecting distributed systems and writing on UI ergonomics.'}
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/about"
                      className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      More about Elena →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Adjacent Article Navigation (Prev / Next) */}
              {(adjacent.prev || adjacent.next) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
                  {adjacent.prev ? (
                    <Link
                      to={`/blog/${adjacent.prev.slug}`}
                      className="group p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-brand-500/40 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-2">
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous Essay</span>
                      </div>
                      <h5 className="font-serif font-bold text-sm text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-2">
                        {adjacent.prev.title}
                      </h5>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {adjacent.next ? (
                    <Link
                      to={`/blog/${adjacent.next.slug}`}
                      className="group p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-brand-500/40 transition-all flex flex-col justify-between text-right"
                    >
                      <div className="flex items-center justify-end gap-1.5 text-xs text-neutral-400 mb-2">
                        <span>Next Essay</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      <h5 className="font-serif font-bold text-sm text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-2">
                        {adjacent.next.title}
                      </h5>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              )}

              {/* Discussion & Comments */}
              <CommentsSection blogId={blog.id} />
            </main>

            {/* Right Sticky Sidebar (Table of Contents & Quick info) */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                <TableOfContents content={blog.content} />

                {/* Article Metadata Capsule */}
                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 text-xs space-y-3 text-neutral-600 dark:text-neutral-400">
                  <div className="flex justify-between py-1 border-b border-neutral-200/50 dark:border-neutral-800">
                    <span className="text-neutral-400">Published</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">{formattedDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200/50 dark:border-neutral-800">
                    <span className="text-neutral-400">Reading Time</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">{blog.readingTime} minutes</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Licensing</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">CC BY-NC 4.0</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Related Articles Grid */}
          {related.length > 0 && (
            <section className="mt-24 pt-12 border-t border-neutral-200 dark:border-neutral-800">
              <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400 mb-1">
                      More to explore
                    </h3>
                    <h4 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
                      Related Articles
                    </h4>
                  </div>
                  <Link
                    to="/blogs"
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {related.map((item) => (
                    <BlogCard key={item.id} blog={item} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogDetailPage;

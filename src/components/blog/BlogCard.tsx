import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, Eye, Sparkles } from 'lucide-react';
import { Blog } from '../../types';
import { useBlog } from '../../context/BlogContext';
import { useToast } from '../../context/ToastContext';

interface BlogCardProps {
  blog: Blog;
  variant?: 'standard' | 'compact' | 'horizontal';
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, variant = 'standard' }) => {
  const { isBookmarked, toggleBookmark } = useBlog();
  const { success, info } = useToast();
  const bookmarked = isBookmarked(blog.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(blog.id);
    if (!bookmarked) {
      success('Article saved to your reading bookmarks');
    } else {
      info('Article removed from bookmarks');
    }
  };

  const formattedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  if (variant === 'horizontal') {
    return (
      <article className="group flex flex-col sm:flex-row gap-5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-none">
        <Link to={`/blog/${blog.slug}`} className="sm:w-1/3 aspect-[16/10] sm:aspect-auto overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 relative flex-shrink-0">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                {blog.category}
              </span>
              <button
                onClick={handleBookmarkClick}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-brand-500 text-brand-500' : ''}`} />
              </button>
            </div>

            <Link to={`/blog/${blog.slug}`}>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-neutral-900 dark:text-neutral-50 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2 mt-1.5 leading-relaxed">
                {blog.excerpt}
              </p>
            </Link>
          </div>

          <div className="flex items-center justify-between pt-4 mt-3 border-t border-neutral-100 dark:border-neutral-800/60 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="font-medium text-neutral-700 dark:text-neutral-300">{blog.author.name}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {blog.readingTime} min
              </span>
              {blog.views > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {blog.views.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-none hover:-translate-y-1">
      <div>
        {/* Cover Photo */}
        <Link to={`/blog/${blog.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          {blog.featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900/85 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Featured
            </div>
          )}
          <button
            onClick={handleBookmarkClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-neutral-900/60 hover:bg-neutral-900/90 text-white backdrop-blur-md transition-colors"
            title={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-brand-400 text-brand-400' : ''}`} />
          </button>
        </Link>

        {/* Content Area */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
              {blog.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <Clock className="w-3.5 h-3.5" />
              {blog.readingTime} min read
            </span>
          </div>

          <Link to={`/blog/${blog.slug}`}>
            <h3 className="font-serif font-bold text-xl text-neutral-900 dark:text-neutral-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
              {blog.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2 mt-2 leading-relaxed">
              {blog.excerpt}
            </p>
          </Link>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="px-5 sm:px-6 pb-5 pt-0">
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{blog.author.name}</span>
          </div>
          <span>{formattedDate}</span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;

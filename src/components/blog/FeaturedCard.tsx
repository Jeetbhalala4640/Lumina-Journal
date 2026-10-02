import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Bookmark, Sparkles } from 'lucide-react';
import { Blog } from '../../types';
import { useBlog } from '../../context/BlogContext';
import { useToast } from '../../context/ToastContext';

interface FeaturedCardProps {
  blog: Blog;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ blog }) => {
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
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return (
    <article className="group relative rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xl transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Cover Photo */}
        <Link
          to={`/blog/${blog.slug}`}
          className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[440px] overflow-hidden bg-neutral-100 dark:bg-neutral-800 block"
        >
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 backdrop-blur-md text-white text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Featured Editorial</span>
          </div>
        </Link>

        {/* Text Details */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                {blog.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <Clock className="w-3.5 h-3.5" />
                  {blog.readingTime} min read
                </span>
                <button
                  onClick={handleBookmarkClick}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-brand-500 text-brand-500' : ''}`} />
                </button>
              </div>
            </div>

            <Link to={`/blog/${blog.slug}`}>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-[1.2] tracking-tight">
                {blog.title}
              </h2>
            </Link>

            <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed line-clamp-3">
              {blog.excerpt}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-800"
              />
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {blog.author.name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {formattedDate}
                </p>
              </div>
            </div>

            <Link
              to={`/blog/${blog.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 group/btn"
            >
              <span>Read article</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedCard;

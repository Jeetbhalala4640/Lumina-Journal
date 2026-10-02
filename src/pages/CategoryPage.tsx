import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag, Layers } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import BlogCard from '../components/blog/BlogCard';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogs, categories } = useBlog();

  const category = categories.find(
    (c) =>
      c.slug === slug ||
      c.name.toLowerCase() === slug?.toLowerCase() ||
      c.name.toLowerCase().replace(/\s+/g, '-') === slug?.toLowerCase()
  );

  const categoryBlogs = blogs.filter(
    (b) =>
      b.status === 'published' &&
      (b.category.toLowerCase() === category?.name.toLowerCase() ||
        b.category.toLowerCase().replace(/\s+/g, '-') === slug?.toLowerCase())
  );

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-serif font-bold text-3xl text-neutral-900 dark:text-white">
          Category Not Found
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          The topic you are looking for does not exist in our editorial catalog.
        </p>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Articles</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Category Banner */}
      <div className="max-w-3xl space-y-4">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all topics</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Editorial Topic</span>
        </div>

        <h1 className="font-serif font-bold text-3xl sm:text-5xl text-neutral-900 dark:text-white tracking-tight">
          {category.name}
        </h1>

        <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg leading-relaxed font-light">
          {category.description}
        </p>
      </div>

      {/* Articles Grid */}
      <div>
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {categoryBlogs.length} {categoryBlogs.length === 1 ? 'Article' : 'Articles'} in this topic
          </span>
        </div>

        {categoryBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8">
            <p className="text-sm text-neutral-500 italic">
              No published articles found in this category yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categoryBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, PenSquare, BookOpen, TrendingUp, Layers, Flame } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import FeaturedCard from '../components/blog/FeaturedCard';
import BlogCard from '../components/blog/BlogCard';
import NewsletterSection from '../components/blog/NewsletterSection';

const HomePage: React.FC = () => {
  const { blogs, categories } = useBlog();
  const { isAuthenticated } = useAuth();

  const publishedBlogs = blogs.filter((b) => b.status === 'published');
  const featuredBlog = publishedBlogs.find((b) => b.featured) || publishedBlogs[0];
  const latestBlogs = publishedBlogs.filter((b) => b.id !== featuredBlog?.id).slice(0, 6);
  const popularBlogs = [...publishedBlogs].sort((a, b) => b.views - a.views).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 border-b border-neutral-200/80 dark:border-neutral-800 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span>Volume IV — The Systems & Ergonomics Issue</span>
          </div>

          <h1 className="font-serif font-bold text-4xl sm:text-6xl lg:text-7xl text-neutral-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Thoughts, ideas, experiments &amp; everything I&apos;m learning.
          </h1>

          <p className="text-neutral-600 dark:text-neutral-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            A long-form journal on distributed architecture, modern frontend ergonomics, design systems, and thoughtful engineering craft.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-md active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {isAuthenticated ? (
              <Link
                to="/dashboard/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all shadow-md hover:shadow-brand-500/20 active:scale-95"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write a Blog</span>
              </Link>
            ) : (
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
              >
                <span>About Author</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20 sm:space-y-24">
        {/* Featured Article */}
        {featuredBlog && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <h2 className="text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                  Featured Story
                </h2>
              </div>
            </div>
            <FeaturedCard blog={featuredBlog} />
          </section>
        )}

        {/* Latest Articles */}
        <section className="space-y-8">
          <div className="flex items-end justify-between border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-4 h-4 text-brand-500" />
                <h2 className="text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                  Chronological
                </h2>
              </div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
                Latest Articles
              </h3>
            </div>
            <Link
              to="/blogs"
              className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1 group"
            >
              <span>View all ({publishedBlogs.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {latestBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </section>

        {/* Popular Articles + Topics Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Popular Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
              <Flame className="w-4 h-4 text-brand-500" />
              <h3 className="font-serif font-bold text-2xl text-neutral-900 dark:text-white">
                Popular &amp; High Impact
              </h3>
            </div>

            <div className="space-y-4">
              {popularBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} variant="horizontal" />
              ))}
            </div>
          </div>

          {/* Topics Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              <h3 className="font-serif font-bold text-2xl text-neutral-900 dark:text-white">
                Curated Topics
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="group p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-brand-500/40 dark:hover:border-brand-500/40 transition-all hover:shadow-sm flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-medium text-sm text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-neutral-400 group-hover:text-brand-500 transition-colors">
                    {cat.count !== undefined ? `${cat.count} articles` : 'Explore →'}
                  </span>
                </Link>
              ))}
            </div>

            {/* Author Mini Card */}
            <div className="p-6 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 text-center space-y-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                alt="Elena Rostova"
                className="w-16 h-16 rounded-full mx-auto object-cover ring-2 ring-brand-500/20"
              />
              <div>
                <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                  Elena Rostova
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Principal Systems Architect &amp; Writer
                </p>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Writing about decoupled architectures, UI ergonomics, and building tools that last decades.
              </p>
              <Link
                to="/about"
                className="inline-block text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Read full bio →
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Banner */}
        <NewsletterSection />
      </div>
    </div>
  );
};

export default HomePage;

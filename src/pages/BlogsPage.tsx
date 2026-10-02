import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, LayoutGrid, List, Sparkles, X, RotateCcw } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import BlogCard from '../components/blog/BlogCard';

const BlogsPage: React.FC = () => {
  const { blogs, categories } = useBlog();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || 'all');
  const [sort, setSort] = useState<'latest' | 'popular' | 'oldest'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'horizontal'>('grid');

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogs.forEach((b) => {
      if (b.status === 'published') {
        b.tags.forEach((t) => tags.add(t));
      }
    });
    return Array.from(tags);
  }, [blogs]);

  // Filtered and sorted published blogs
  const filteredBlogs = useMemo(() => {
    let list = blogs.filter((b) => b.status === 'published');

    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(
        (b) =>
          b.category.toLowerCase() === selectedCategory.toLowerCase() ||
          b.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory.toLowerCase()
      );
    }

    if (selectedTag && selectedTag !== 'all') {
      list = list.filter((b) =>
        b.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.subtitle.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sort === 'popular') {
      list.sort((a, b) => b.views - a.views);
    } else if (sort === 'oldest') {
      list.sort(
        (a, b) =>
          new Date(a.publishedAt || a.createdAt).getTime() -
          new Date(b.publishedAt || b.createdAt).getTime()
      );
    } else {
      list.sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
      );
    }

    return list;
  }, [blogs, selectedCategory, selectedTag, search, sort]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setSort('latest');
    setSearchParams({});
  };

  const hasActiveFilters = search || selectedCategory !== 'all' || selectedTag !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Index</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-5xl text-neutral-900 dark:text-white tracking-tight">
          All Essays &amp; Technical Articles
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg mt-3 font-light">
          Browse through {filteredBlogs.length} articles across architecture, engineering, design ergonomics, and system craft.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 mb-10">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, titles, or concepts..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls: Sort and View mode */}
          <div className="flex items-center gap-2.5 justify-end">
            {/* Sort */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="bg-transparent text-neutral-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="latest" className="bg-white dark:bg-neutral-900">Latest First</option>
                <option value="popular" className="bg-white dark:bg-neutral-900">Most Popular</option>
                <option value="oldest" className="bg-white dark:bg-neutral-900">Oldest First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('horizontal')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'horizontal'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
            }`}
          >
            All Topics ({blogs.filter((b) => b.status === 'published').length})
          </button>
          {categories.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
              selectedCategory.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase mr-1">
              Tags:
            </span>
            {allTags.map((tag) => {
              const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? 'all' : tag)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                    isSelected
                      ? 'bg-brand-500 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 font-semibold ml-2 hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Articles Display */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8">
          <Filter className="w-10 h-10 mx-auto text-neutral-400 mb-3 opacity-60" />
          <h3 className="font-serif font-bold text-xl text-neutral-900 dark:text-white">
            No matching articles found
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 max-w-sm mx-auto">
            We couldn&apos;t find any articles matching your search criteria. Try adjusting your search keywords or removing active filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} variant="horizontal" />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogsPage;

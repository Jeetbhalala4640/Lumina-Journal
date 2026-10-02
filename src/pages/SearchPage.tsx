import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Sparkles, BookOpen } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { Blog } from '../types';
import BlogCard from '../components/blog/BlogCard';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const { getFilteredBlogs } = useBlog();

  useEffect(() => {
    const runSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await getFilteredBlogs({ search: query, status: 'published' });
        setResults(data);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(runSearch, 200);
    return () => clearTimeout(timer);
  }, [query, getFilteredBlogs]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full-Text Search</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-5xl text-neutral-900 dark:text-white tracking-tight">
          Search the Journal
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-base">
          Query across full essay texts, code samples, architectural diagrams, topics, and authors.
        </p>
      </div>

      {/* Large Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Type keywords like 'architecture', 'edge compute', 'design'..."
          className="w-full pl-12 pr-12 py-4 text-base sm:text-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
        {query && (
          <button
            onClick={() => handleQueryChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Output */}
      <div>
        {query.trim() && (
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
            <span>
              Found {results.length} {results.length === 1 ? 'article' : 'articles'} for &ldquo;{query}&rdquo;
            </span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-neutral-400">Searching index...</div>
        ) : query.trim() && results.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-3">
            <BookOpen className="w-8 h-8 mx-auto text-neutral-400 opacity-60" />
            <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white">
              No matching articles
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Try searching for broader keywords like &lsquo;systems&rsquo;, &lsquo;ui&rsquo;, or &lsquo;engineering&rsquo;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

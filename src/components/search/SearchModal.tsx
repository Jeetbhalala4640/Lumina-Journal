import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, ArrowRight, Tag } from 'lucide-react';
import { useBlog } from '../../context/BlogContext';
import { Blog } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Blog[]>([]);
  const { getFilteredBlogs } = useBlog();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Keyboard shortcut listener for Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          inputRef.current?.focus();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const blogs = await getFilteredBlogs({ search: query, status: 'published' });
      setResults(blogs.slice(0, 6));
    }, 150);

    return () => clearTimeout(timer);
  }, [query, getFilteredBlogs]);

  if (!isOpen) return null;

  const handleSelect = (slug: string) => {
    onClose();
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, topics, keywords..."
            className="w-full bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-500 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3">
          {query.trim() && results.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-neutral-400 opacity-60" />
              <p className="text-sm font-medium">No articles found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-neutral-400 mt-1">Try searching for &lsquo;architecture&rsquo;, &lsquo;design&rsquo;, or &lsquo;ai&rsquo;</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 py-1.5">
                Articles ({results.length})
              </div>
              {results.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => handleSelect(blog.slug)}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/70 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400">
                        {blog.category}
                      </span>
                      <span className="text-xs text-neutral-400">{blog.readingTime} min read</span>
                    </div>
                    <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {blog.excerpt}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 px-4 text-center">
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
                Suggested Topics
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Engineering', 'Design Systems', 'Artificial Intelligence', 'Essays & Craft', 'Architecture'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      <Tag className="w-3 h-3 text-neutral-400" />
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950/50 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>Search articles by title, tag, or content</span>
          <span>Press <kbd className="font-mono bg-white dark:bg-neutral-800 px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

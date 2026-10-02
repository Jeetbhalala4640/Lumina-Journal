import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Rss, ArrowUpRight, Heart } from 'lucide-react';
import { useBlog } from '../../context/BlogContext';

const Footer: React.FC = () => {
  const { categories } = useBlog();

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-900 font-serif font-bold text-lg">
                L
              </span>
              <span className="font-serif font-bold text-xl tracking-tight text-neutral-900 dark:text-white">
                Lumina<span className="text-brand-500 font-sans font-medium text-xs ml-1.5 px-1.5 py-0.5 rounded bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 uppercase tracking-wider">Journal</span>
              </span>
            </Link>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed max-w-md">
              A curated editorial publication dedicated to deep technical investigations, modern software architecture, interface ergonomics, and the philosophy of building software that endures.
            </p>
            <div className="flex items-center gap-3 pt-2 text-neutral-500 dark:text-neutral-400">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="/rss.xml"
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors"
                aria-label="RSS Feed"
              >
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  All Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Search Index
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  About the Author
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  Author Studio <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
              Topics
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    {cat.count !== undefined && cat.count > 0 && (
                      <span className="text-xs text-neutral-400 dark:text-neutral-500">
                        {cat.count}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} Lumina Journal. All rights reserved. Crafted with care & precision.</p>
          <div className="flex items-center gap-1 text-neutral-400">
            <span>Built with React, TypeScript & Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

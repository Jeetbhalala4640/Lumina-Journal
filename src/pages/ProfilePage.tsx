import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Bookmark, BookOpen, PenSquare, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import BlogCard from '../components/blog/BlogCard';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { blogs, bookmarks } = useBlog();
  const [activeTab, setActiveTab] = useState<'articles' | 'bookmarks'>('articles');

  const publishedArticles = blogs.filter((b) => b.status === 'published');
  const bookmarkedArticles = blogs.filter((b) => bookmarks.includes(b.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Profile Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
          alt={user?.name}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-neutral-100 dark:ring-neutral-800 shadow-lg flex-shrink-0"
        />

        <div className="space-y-3 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Lead Author &amp; Editor</span>
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-4xl text-neutral-900 dark:text-white">
                {user?.name || 'Elena Rostova'}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                {user?.title || 'Principal Systems Architect & Essayist'}
              </p>
            </div>

            <Link
              to="/dashboard/create"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-md active:scale-95 transition-all self-center sm:self-start"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Write Essay</span>
            </Link>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed max-w-2xl font-light">
            {user?.bio || 'Writing on distributed architecture, modern frontend ergonomics, and resilient systems design.'}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-neutral-500 text-xs">
            {user?.socialLinks?.twitter && (
              <a href={user.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white flex items-center gap-1">
                <Twitter className="w-3.5 h-3.5" />
                <span>Twitter</span>
              </a>
            )}
            {user?.socialLinks?.github && (
              <a href={user.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white flex items-center gap-1">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {user?.socialLinks?.linkedin && (
              <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-1">
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'articles'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Authored Articles ({publishedArticles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'bookmarks'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Bookmarks ({bookmarkedArticles.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'articles' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedArticles.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div>
            {bookmarkedArticles.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8">
                <Bookmark className="w-8 h-8 mx-auto text-neutral-400 mb-2 opacity-60" />
                <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                  No bookmarks saved yet
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Click the bookmark icon on any article to save it to your reading list.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedArticles.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Eye, PenSquare, Archive, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useToast } from '../context/ToastContext';
import { Blog } from '../types';

const PublishedPage: React.FC = () => {
  const { blogs, unpublishBlog } = useBlog();
  const { success, error } = useToast();

  const published = blogs.filter((b) => b.status === 'published');

  const handleUnpublish = async (blog: Blog) => {
    try {
      await unpublishBlog(blog.id);
      success(`"${blog.title}" has been moved to Drafts.`);
    } catch {
      error('Failed to unpublish article.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-3 h-3" />
          <span>Live Index</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
          Published Articles ({published.length})
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Articles currently visible to all visitors and search engines.
        </p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-50/75 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 pl-6">Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Reads</th>
                <th className="py-3.5 px-4">Published Date</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {published.map((b) => (
                <tr key={b.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="py-4 pl-6 max-w-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="w-12 h-8 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800 flex-shrink-0"
                      />
                      <div className="truncate">
                        <Link
                          to={`/blog/${b.slug}`}
                          className="font-semibold text-neutral-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 truncate block text-sm"
                        >
                          {b.title}
                        </Link>
                        <span className="text-[10px] text-neutral-400 font-mono">/{b.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-neutral-600 dark:text-neutral-300">
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 font-medium">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-neutral-700 dark:text-neutral-300">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-neutral-400" />
                      {b.views.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-neutral-400">
                    {new Date(b.publishedAt || b.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 pr-6 text-right space-x-2 whitespace-nowrap">
                    <Link
                      to={`/blog/${b.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold"
                    >
                      <span>View Live</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                    <Link
                      to={`/dashboard/edit/${b.id}`}
                      className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 text-xs font-semibold"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleUnpublish(b)}
                      className="px-3 py-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-semibold"
                    >
                      Unpublish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PublishedPage;

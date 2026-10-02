import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PenSquare,
  Eye,
  Trash2,
  Copy,
  Globe,
  Archive,
  Search,
  CheckCircle2,
  FileText,
  Plus,
} from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useToast } from '../context/ToastContext';
import { Blog } from '../types';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';

const MyBlogsPage: React.FC = () => {
  const { blogs, deleteBlog, duplicateBlog, publishBlog, unpublishBlog } = useBlog();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      if (filter !== 'all' && b.status !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [blogs, filter, search]);

  const handleDuplicate = async (id: string) => {
    try {
      const dup = await duplicateBlog(id);
      success(`Duplicated as "${dup.title}"`);
    } catch {
      error('Failed to duplicate article.');
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    try {
      if (blog.status === 'published') {
        await unpublishBlog(blog.id);
        success(`"${blog.title}" has been moved to drafts.`);
      } else {
        await publishBlog(blog.id);
        success(`"${blog.title}" is now published and live on the index!`);
      }
    } catch {
      error('Failed to update publication status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    setIsDeleting(true);
    try {
      await deleteBlog(blogToDelete.id);
      success(`"${blogToDelete.title}" deleted.`);
      setDeleteModalOpen(false);
      setBlogToDelete(null);
    } catch {
      error('Failed to delete article.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Article Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Review, edit, publish, duplicate, or delete articles in your personal publication.
          </p>
        </div>

        <Link
          to="/dashboard/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-md active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All ({blogs.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'published'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Published ({blogs.filter((b) => b.status === 'published').length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'draft'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Drafts ({blogs.filter((b) => b.status === 'draft').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title or tag..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
      </div>

      {/* Articles Table */}
      <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-sm">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 p-6 space-y-3">
            <FileText className="w-8 h-8 mx-auto text-neutral-400 opacity-60" />
            <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
              No articles found
            </h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              There are no articles matching your current filter settings.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-neutral-50/75 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 pl-6">Article</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Reads</th>
                  <th className="py-3.5 px-3">Created</th>
                  <th className="py-3.5 px-3">Published</th>
                  <th className="py-3.5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {filteredBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                    {/* Cover & Title */}
                    <td className="py-4 pl-6 max-w-xs sm:max-w-sm">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-12 h-8 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800 flex-shrink-0"
                        />
                        <div className="truncate">
                          <Link
                            to={`/dashboard/edit/${b.id}`}
                            className="font-semibold text-neutral-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 truncate block text-sm"
                          >
                            {b.title}
                          </Link>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            /{b.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-3 text-neutral-600 dark:text-neutral-300">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 font-medium">
                        {b.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          b.status === 'published'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {b.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="py-4 px-3 font-semibold text-neutral-700 dark:text-neutral-300">
                      {b.views.toLocaleString()}
                    </td>

                    {/* Created */}
                    <td className="py-4 px-3 text-neutral-400">
                      {new Date(b.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Published */}
                    <td className="py-4 px-3 text-neutral-400">
                      {b.publishedAt
                        ? new Date(b.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 pr-6 text-right space-x-1 whitespace-nowrap">
                      {/* Edit */}
                      <Link
                        to={`/dashboard/edit/${b.id}`}
                        className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 inline-flex items-center transition-colors"
                        title="Edit article"
                      >
                        <PenSquare className="w-4 h-4" />
                      </Link>

                      {/* Preview */}
                      <Link
                        to={`/dashboard/preview/${b.id}`}
                        className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 inline-flex items-center transition-colors"
                        title="Preview article"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Publish / Unpublish Toggle */}
                      <button
                        onClick={() => handleTogglePublish(b)}
                        className={`p-1.5 rounded-lg transition-colors inline-flex items-center ${
                          b.status === 'published'
                            ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                            : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                        }`}
                        title={b.status === 'published' ? 'Unpublish to Draft' : 'Publish Article'}
                      >
                        {b.status === 'published' ? <Archive className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicate(b.id)}
                        className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 inline-flex items-center transition-colors"
                        title="Duplicate article"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          setBlogToDelete(b);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 inline-flex items-center transition-colors"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setBlogToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={blogToDelete?.title || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default MyBlogsPage;

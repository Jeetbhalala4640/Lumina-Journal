import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, PenSquare, Trash2, ArrowRight, Eye, Plus, Sparkles } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useToast } from '../context/ToastContext';
import { Blog } from '../types';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';

const DraftsPage: React.FC = () => {
  const { blogs, deleteBlog, publishBlog } = useBlog();
  const { success, error } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const drafts = blogs.filter((b) => b.status === 'draft');

  const handleDelete = async () => {
    if (!blogToDelete) return;
    setIsDeleting(true);
    try {
      await deleteBlog(blogToDelete.id);
      success('Draft deleted.');
      setDeleteModalOpen(false);
      setBlogToDelete(null);
    } catch {
      error('Failed to delete draft.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePublish = async (blog: Blog) => {
    try {
      await publishBlog(blog.id);
      success(`"${blog.title}" has been published live!`);
    } catch {
      error('Failed to publish draft.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-semibold uppercase tracking-wider mb-2">
            <FileText className="w-3 h-3" />
            <span>Work In Progress</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Draft Articles ({drafts.length})
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Unpublished essays and notes undergoing revisions. All changes autosaved.
          </p>
        </div>

        <Link
          to="/dashboard/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-md active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Draft</span>
        </Link>
      </div>

      {drafts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-8 space-y-4">
          <FileText className="w-10 h-10 mx-auto text-neutral-400 opacity-60" />
          <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white">
            No drafts currently
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            All your essays are either published or you haven&apos;t started drafting yet.
          </p>
          <Link
            to="/dashboard/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold shadow-sm"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Create a New Draft</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between space-y-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {draft.category}
                  </span>
                  <span className="text-xs text-neutral-400">
                    Last edited {new Date(draft.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <Link to={`/dashboard/edit/${draft.id}`}>
                  <h3 className="font-serif font-bold text-xl text-neutral-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2">
                    {draft.title}
                  </h3>
                </Link>

                <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm line-clamp-2 mt-2 leading-relaxed">
                  {draft.excerpt || 'No excerpt written yet.'}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setBlogToDelete(draft);
                      setDeleteModalOpen(true);
                    }}
                    className="p-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Delete draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/dashboard/preview/${draft.id}`}
                    className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Preview draft"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePublish(draft)}
                    className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Publish Now
                  </button>
                  <Link
                    to={`/dashboard/edit/${draft.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    <span>Continue Writing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setBlogToDelete(null);
        }}
        onConfirm={handleDelete}
        title={blogToDelete?.title || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default DraftsPage;

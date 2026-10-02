import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Save,
  Eye,
  Send,
  Image as ImageIcon,
  Search,
  ArrowLeft,
  X,
  Archive,
  Trash2,
} from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useToast } from '../context/ToastContext';
import RichTextEditor from '../components/editor/RichTextEditor';
import ImagePickerModal from '../components/editor/ImagePickerModal';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';
import { Blog } from '../types';

const EditBlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlogById, updateBlog, deleteBlog, categories } = useBlog();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [coverImage, setCoverImage] = useState('');
  const [coverImageCaption, setCoverImageCaption] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // SEO
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Editor states
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const found = await getBlogById(id);
        if (!isMounted) return;

        if (found) {
          setBlog(found);
          setTitle(found.title);
          setSubtitle(found.subtitle || '');
          setContent(found.content);
          setCategory(found.category);
          setCoverImage(found.coverImage);
          setCoverImageCaption(found.coverImageCaption || '');
          setTags(found.tags || []);
          setStatus(found.status === 'published' ? 'published' : 'draft');
          setMetaTitle(found.seo?.metaTitle || found.title);
          setMetaDescription(found.seo?.metaDescription || found.subtitle || '');
        } else {
          error('Article not found.');
          navigate('/dashboard/blogs');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [id, getBlogById, navigate, error]);

  // Debounced autosave
  const autosave = useCallback(async () => {
    if (!id || !blog || !title) return;
    setSaveStatus('saving');
    try {
      await updateBlog(id, {
        title,
        subtitle,
        content,
        category,
        coverImage,
        coverImageCaption,
        tags,
        seo: {
          metaTitle: metaTitle || title,
          metaDescription: metaDescription || subtitle,
          keywords: tags,
        },
      });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('unsaved');
    }
  }, [id, blog, title, subtitle, content, category, coverImage, coverImageCaption, tags, metaTitle, metaDescription, updateBlog]);

  useEffect(() => {
    if (loading) return;
    setSaveStatus('unsaved');
    const timer = setTimeout(() => {
      autosave();
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, subtitle, content, category, coverImage, tags, metaTitle, metaDescription, autosave, loading]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-neutral-400">
        Loading article in studio...
      </div>
    );
  }

  if (!blog) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleManualSave = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateBlog(id, {
        title,
        subtitle,
        content,
        category,
        coverImage,
        coverImageCaption,
        tags,
        seo: {
          metaTitle: metaTitle || title,
          metaDescription: metaDescription || subtitle,
          keywords: tags,
        },
      });
      setSaveStatus('saved');
      success('Changes saved successfully!');
    } catch {
      error('Failed to save changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const nextStatus = status === 'published' ? 'draft' : 'published';
      const updated = await updateBlog(id, {
        title,
        subtitle,
        content,
        category,
        coverImage,
        coverImageCaption,
        tags,
        status: nextStatus,
        seo: {
          metaTitle: metaTitle || title,
          metaDescription: metaDescription || subtitle,
          keywords: tags,
        },
      });

      setStatus(nextStatus);

      if (nextStatus === 'published') {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
        success('🎉 Article is live on Lumina Journal!');
        navigate(`/blog/${updated.slug}`);
      } else {
        success('Article has been moved to drafts.');
      }
    } catch {
      error('Failed to update article status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteBlog(id);
      success('Article deleted.');
      navigate('/dashboard/blogs');
    } catch {
      error('Failed to delete article.');
    }
  };

  const handlePreview = () => {
    navigate(`/dashboard/preview/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/blogs')}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-neutral-900 dark:text-white truncate max-w-md">
              Edit &ldquo;{title}&rdquo;
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-neutral-400">Author Studio</span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span
                className={`text-xs font-semibold ${
                  status === 'published'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {status === 'published' ? 'Live Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="p-2 text-neutral-400 hover:text-red-500 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Delete article"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleManualSave}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          <button
            type="button"
            onClick={handlePreview}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-all active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={handlePublishToggle}
            disabled={isSubmitting}
            className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl text-white transition-all shadow-md active:scale-95 disabled:opacity-50 ${
              status === 'published'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-brand-500 hover:bg-brand-600'
            }`}
          >
            {status === 'published' ? (
              <>
                <Archive className="w-3.5 h-3.5" />
                <span>Unpublish</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Main Editor Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title and Subtitle Inputs */}
          <div className="space-y-3 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Headline..."
              className="w-full font-serif font-bold text-2xl sm:text-4xl text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 focus:outline-none bg-transparent"
            />
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Subtitle or provocative thesis statement..."
              className="w-full text-base sm:text-lg text-neutral-600 dark:text-neutral-400 placeholder-neutral-300 dark:placeholder-neutral-700 focus:outline-none bg-transparent font-light"
            />
          </div>

          {/* TipTap Rich Text Editor */}
          <RichTextEditor
            content={content}
            onChange={(html) => setContent(html)}
            saveStatus={saveStatus}
          />
        </div>

        {/* Right Sidebar Settings Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cover Photo Capsule */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Cover Photo
              </label>
              <button
                type="button"
                onClick={() => setIsImagePickerOpen(true)}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Change Image</span>
              </button>
            </div>

            <div
              onClick={() => setIsImagePickerOpen(true)}
              className="aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative cursor-pointer group border border-neutral-200/60 dark:border-neutral-700/60"
            >
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                Click to change cover photo
              </div>
            </div>

            <input
              type="text"
              value={coverImageCaption}
              onChange={(e) => setCoverImageCaption(e.target.value)}
              placeholder="Cover caption / credit..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          {/* Category & Tags Capsule */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-5 shadow-sm">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Topic / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Multi-Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Article Tags
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 min-h-[42px]">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 shadow-2xs"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-neutral-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder={tags.length === 0 ? "Type tag & press Enter..." : "+ add tag"}
                  className="flex-1 bg-transparent text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none min-w-[80px]"
                />
              </div>
            </div>
          </div>

          {/* SEO & Metadata */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-brand-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                SEO &amp; Social Metadata
              </h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="SEO Title"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Brief summary for search engines..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image Picker Modal */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelectImage={(url, caption) => {
          setCoverImage(url);
          if (caption) setCoverImageCaption(caption);
        }}
        title="Change Article Cover Photo"
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={title}
      />
    </div>
  );
};

export default EditBlogPage;

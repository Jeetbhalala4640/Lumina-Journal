import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Heart, User } from 'lucide-react';
import { Comment } from '../../types';
import { blogService } from '../../services/blogService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface CommentsSectionProps {
  blogId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ blogId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    const loadComments = async () => {
      const data = await blogService.getComments(blogId);
      setComments(data);
    };
    loadComments();
  }, [blogId]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      error('Please fill in your name and comment');
      return;
    }

    setIsSubmitting(true);
    try {
      const avatar =
        user?.avatar ||
        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

      const newComment = await blogService.addComment(blogId, {
        blogId,
        authorName: name,
        authorEmail: email || 'reader@domain.com',
        authorAvatar: avatar,
        content,
      });

      setComments((prev) => [newComment, ...prev]);
      setContent('');
      success('Your comment has been posted!');
    } catch {
      error('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-10 border-t border-neutral-200/80 dark:border-neutral-800">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="w-5 h-5 text-brand-500" />
        <h3 className="font-serif font-bold text-2xl text-neutral-900 dark:text-white">
          Discussion ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-12 p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Join the conversation
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Email (optional, not published)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
            Your Comment *
          </label>
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, critiques, or technical perspective..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center py-8 text-sm text-neutral-500 dark:text-neutral-400 italic">
            No comments yet. Be the first to share your perspective!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={
                      comment.authorAvatar ||
                      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                        comment.authorName
                      )}`
                    }
                    alt={comment.authorName}
                    className="w-8 h-8 rounded-full object-cover bg-neutral-100 dark:bg-neutral-800"
                  />
                  <div>
                    <h5 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {comment.authorName}
                    </h5>
                    <p className="text-xs text-neutral-400">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed pl-10">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CommentsSection;

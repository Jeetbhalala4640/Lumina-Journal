import React, { useState } from 'react';
import { Twitter, Linkedin, Link as LinkIcon, Check, Heart, MessageCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useBlog } from '../../context/BlogContext';

interface ShareButtonsProps {
  title: string;
  url?: string;
  blogId?: string;
  initialLikes?: number;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  url = window.location.href,
  blogId,
  initialLikes = 0,
}) => {
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(() => {
    return blogId ? localStorage.getItem(`lumina_liked_${blogId}`) === 'true' : false;
  });
  const { success } = useToast();
  const { toggleLike } = useBlog();

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleLike = async () => {
    if (!blogId) return;
    const res = await toggleLike(blogId);
    setLikes(res.likes);
    setIsLiked(res.liked);
    if (res.liked) {
      success('Thanks for appreciating this article!');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-6 border-y border-neutral-200/80 dark:border-neutral-800/80 my-8">
      {/* Like Button */}
      {blogId && (
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            isLiked
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 shadow-sm'
              : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''} transition-transform`} />
          <span>{likes} {likes === 1 ? 'Appreciation' : 'Appreciations'}</span>
        </button>
      )}

      <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block mx-1" />

      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mr-1">
        Share:
      </span>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        title="Share on X / Twitter"
      >
        <Twitter className="w-4 h-4" />
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        title="Copy article link"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <LinkIcon className="w-4 h-4" />}
        <span>{copied ? 'Copied' : 'Copy link'}</span>
      </button>
    </div>
  );
};

export default ShareButtons;

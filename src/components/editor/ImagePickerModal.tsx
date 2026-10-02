import React, { useState } from 'react';
import { Upload, X, Search, Image as ImageIcon, Check } from 'lucide-react';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string, caption?: string) => void;
  title?: string;
}

const CURATED_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    title: 'Earth & Satellite Network Topography',
    category: 'Engineering',
  },
  {
    url: 'https://images.unsplash.com/photo-1507842229451-79b1be886a27?auto=format&fit=crop&w=1600&q=80',
    title: 'Minimalist Architecture & Natural Shadows',
    category: 'Design Systems',
  },
  {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    title: 'Generative Computational Geometry',
    category: 'Artificial Intelligence',
  },
  {
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
    title: 'Craftsman Workspace & Coffee',
    category: 'Essays & Craft',
  },
  {
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    title: 'High-Density Fiber Optic Servers',
    category: 'Engineering',
  },
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    title: 'Modern Glass Facade Skyscrapers',
    category: 'Design Systems',
  },
  {
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    title: 'Matrix Matrix Cryptographic Terminal',
    category: 'Engineering',
  },
  {
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80',
    title: 'Code Editor on Laptop in Dark Ambient Room',
    category: 'Engineering',
  },
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    title: 'Serene Alpine Lake & Mist',
    category: 'Essays & Craft',
  },
];

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'Select Cover Image',
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload' | 'url'>('gallery');
  const [customUrl, setCustomUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onSelectImage(reader.result, file.name);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    const url = activeTab === 'url' ? customUrl : selectedUrl;
    if (url) {
      onSelectImage(url, caption);
      onClose();
    }
  };

  const filteredImages = CURATED_IMAGES.filter(
    (img) =>
      img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-brand-500" />
            <h3 className="font-semibold text-neutral-900 dark:text-white text-base">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 px-6 pt-2 gap-4 text-sm font-medium">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'gallery'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Curated Gallery
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'url'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Custom Image URL
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter gallery by title or category..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredImages.map((img, idx) => {
                  const isSelected = selectedUrl === img.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedUrl(img.url);
                        setCaption(img.title);
                      }}
                      className={`group relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        isSelected
                          ? 'border-brand-500 ring-2 ring-brand-500/30'
                          : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-[10px] text-white font-medium truncate">
                          {img.title}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-brand-500 text-white p-1 rounded-full shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-10 text-center hover:border-brand-500 transition-colors">
              <Upload className="w-10 h-10 text-brand-500 mb-3" />
              <h4 className="font-semibold text-neutral-900 dark:text-white text-base">
                Click to upload or drag & drop
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
                PNG, JPG, WEBP or GIF (Max 10MB). Image is locally optimized and stored.
              </p>
              <label className="mt-4 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm">
                <span>Browse Local Files</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Direct Image URL
                </label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>

              {customUrl && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={customUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Optional Caption Field */}
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Image Caption / Credit (Optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Photo by NASA on Unsplash"
              className="w-full px-3.5 py-1.5 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-950/60 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={activeTab === 'gallery' ? !selectedUrl : activeTab === 'url' ? !customUrl : true}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition-colors disabled:opacity-40"
          >
            Use Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePickerModal;

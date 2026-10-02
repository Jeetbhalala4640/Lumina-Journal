import React, { useEffect, useState, useMemo } from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [activeId, setActiveId] = useState<string>('');

  const headings = useMemo(() => {
    if (!content) return [];
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const headingElements = doc.querySelectorAll('h1, h2, h3');

      const items: TocItem[] = [];
      headingElements.forEach((el, index) => {
        const text = el.textContent?.trim() || '';
        if (!text) return;
        const id = `heading-${index}-${text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;
        const level = parseInt(el.tagName.replace('H', ''), 10);
        items.push({ id, text, level });
      });

      return items;
    } catch {
      return [];
    }
  }, [content]);

  // Set IDs on rendered DOM elements after mount so jump works and setup IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    const article = document.querySelector('.editorial-prose');
    if (!article) return;

    const renderedHeadings = article.querySelectorAll('h1, h2, h3');
    headings.forEach((item, index) => {
      if (renderedHeadings[index]) {
        renderedHeadings[index].id = item.id;
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-70px 0% -60% 0%' }
    );

    renderedHeadings.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
        <List className="w-3.5 h-3.5 text-brand-500" />
        <span>Table of Contents</span>
      </div>
      <ul className="space-y-1.5 text-sm max-h-[60vh] overflow-y-auto">
        {headings.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={`${item.level === 3 ? 'ml-3 text-xs' : 'text-sm'}`}
            >
              <button
                onClick={() => scrollToHeading(item.id)}
                className={`text-left w-full transition-all py-1 line-clamp-2 rounded-md px-1.5 ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400 font-semibold bg-brand-500/10'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                }`}
              >
                {item.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TableOfContents;

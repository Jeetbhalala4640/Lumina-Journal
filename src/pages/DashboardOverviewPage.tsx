import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Eye,
  Heart,
  PenSquare,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { DashboardStats } from '../types';

const DashboardOverviewPage: React.FC = () => {
  const { blogs, getStats } = useBlog();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await getStats();
      setStats(data);
    };
    loadStats();
  }, [blogs, getStats]);

  const recentBlogs = blogs.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[11px] font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Studio Control Center</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Welcome back, {user?.name.split(' ')[0] || 'Author'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Here is what&apos;s happening with your essays and readership this week.
          </p>
        </div>

        <Link
          to="/dashboard/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 flex-shrink-0"
        >
          <PenSquare className="w-4 h-4" />
          <span>Write New Essay</span>
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Blogs */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Articles
            </span>
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">
            {stats?.totalBlogs || blogs.length}
          </p>
          <p className="text-xs text-neutral-400 flex items-center gap-1">
            <span className="text-emerald-500 font-medium">+2 this month</span>
          </p>
        </div>

        {/* Published */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Published
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">
            {stats?.publishedBlogs || blogs.filter((b) => b.status === 'published').length}
          </p>
          <p className="text-xs text-neutral-400">Live on public index</p>
        </div>

        {/* Drafts */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              In Progress
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">
            {stats?.draftBlogs || blogs.filter((b) => b.status === 'draft').length}
          </p>
          <Link
            to="/dashboard/drafts"
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline inline-block"
          >
            Continue writing →
          </Link>
        </div>

        {/* Total Views */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Reads
            </span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">
            {(stats?.totalViews || 0).toLocaleString()}
          </p>
          <p className="text-xs text-neutral-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span className="text-emerald-500 font-medium">+18.4%</span> this week
          </p>
        </div>
      </div>

      {/* Analytics Graph & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Readership Bar Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white">
                Readership Trajectory
              </h3>
              <p className="text-xs text-neutral-400">Aggregated pageviews over past 7 days</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              Last 7 Days
            </span>
          </div>

          <div className="pt-6 pb-2 grid grid-cols-7 gap-2 sm:gap-4 items-end h-44">
            {stats?.recentViews?.map((item, idx) => {
              const maxVal = Math.max(...stats.recentViews.map((v) => v.views), 1);
              const heightPercent = Math.max(15, Math.round((item.views / maxVal) * 100));

              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.views.toLocaleString()}
                  </div>
                  <div
                    className="w-full rounded-t-lg bg-neutral-200 dark:bg-neutral-800 group-hover:bg-brand-500 dark:group-hover:bg-brand-500 transition-all duration-300 relative"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-medium text-neutral-500">{item.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Tools Capsule */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white">
              Studio Shortcuts
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Fast actions to manage content, explore publication stats, or draft ideas.
            </p>

            <div className="space-y-2 pt-2">
              <Link
                to="/dashboard/create"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                <div className="flex items-center gap-2.5">
                  <PenSquare className="w-4 h-4 text-brand-500" />
                  <span>Start New Draft</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>

              <Link
                to="/dashboard/blogs"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span>Manage All Articles</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>

              <Link
                to="/profile"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-purple-500" />
                  <span>View Public Profile</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 text-xs text-neutral-500 space-y-1">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Autosave Active</span>
            <p className="text-[11px] leading-relaxed">
              Your edits in Studio are saved instantaneously to persistent local storage.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Articles Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-xl text-neutral-900 dark:text-white">
              Recent Articles &amp; Drafts
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">Quickly resume or manage recent writings</p>
          </div>
          <Link
            to="/dashboard/blogs"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            View all ({blogs.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Article</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Reads</th>
                <th className="pb-3">Last Updated</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {recentBlogs.map((b) => (
                <tr key={b.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 pl-2 max-w-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="w-10 h-7 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800 flex-shrink-0"
                      />
                      <div className="truncate">
                        <Link
                          to={b.status === 'published' ? `/blog/${b.slug}` : `/dashboard/edit/${b.id}`}
                          className="font-medium text-neutral-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 truncate block"
                        >
                          {b.title}
                        </Link>
                        <span className="text-[10px] text-neutral-400">{b.readingTime} min read</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-neutral-600 dark:text-neutral-300">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        b.status === 'published'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {b.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3.5 font-medium text-neutral-700 dark:text-neutral-300">
                    {b.views.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-neutral-400">
                    {new Date(b.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 pr-2 text-right space-x-2">
                    <Link
                      to={`/dashboard/edit/${b.id}`}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Edit
                    </Link>
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

export default DashboardOverviewPage;

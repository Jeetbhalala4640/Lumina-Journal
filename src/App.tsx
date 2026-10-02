import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Studio Dashboard Pages
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import MyBlogsPage from './pages/MyBlogsPage';
import CreateBlogPage from './pages/CreateBlogPage';
import EditBlogPage from './pages/EditBlogPage';
import DraftsPage from './pages/DraftsPage';
import PublishedPage from './pages/PublishedPage';
import SettingsPage from './pages/SettingsPage';
import BlogPreviewPage from './pages/BlogPreviewPage';

const App: React.FC = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/dashboard/preview');
  const isPreviewRoute = location.pathname.startsWith('/dashboard/preview');

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-brand-500/20 selection:text-brand-600 dark:selection:text-brand-400 font-sans transition-colors duration-200">
      {/* Public Navbar (hidden on dashboard and standalone preview) */}
      {!isDashboardRoute && !isPreviewRoute && <Navbar />}

      {/* Routes */}
      <div className="flex-1 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Standalone Preview Route */}
          <Route path="/dashboard/preview/:id" element={<BlogPreviewPage />} />

          {/* Studio Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverviewPage />} />
            <Route path="blogs" element={<MyBlogsPage />} />
            <Route path="create" element={<CreateBlogPage />} />
            <Route path="edit/:id" element={<EditBlogPage />} />
            <Route path="drafts" element={<DraftsPage />} />
            <Route path="published" element={<PublishedPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>

      {/* Public Footer */}
      {!isDashboardRoute && !isPreviewRoute && <Footer />}
    </div>
  );
};

export default App;

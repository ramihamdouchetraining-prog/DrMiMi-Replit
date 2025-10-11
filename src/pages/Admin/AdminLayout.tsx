import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
          <Link to="/admin/articles" className="block p-2 hover:bg-gray-700 rounded">Articles</Link>
          <Link to="/admin/cms" className="block p-2 hover:bg-gray-700 rounded">CMS</Link>
          <Link to="/admin/analytics" className="block p-2 hover:bg-gray-700 rounded">Analytics</Link>
          <Link to="/admin/users" className="block p-2 hover:bg-gray-700 rounded">Users</Link>
          <Link to="/admin/settings" className="block p-2 hover:bg-gray-700 rounded">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

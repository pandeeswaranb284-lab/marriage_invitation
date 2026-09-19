import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import PublicInvitation  from './pages/PublicInvitation';
import AdminLogin        from './pages/admin/AdminLogin';
import AdminLayout       from './pages/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import WeddingEditor     from './pages/admin/WeddingEditor';
import CoupleEditor      from './pages/admin/CoupleEditor';
import FamilyEditor      from './pages/admin/FamilyEditor';
import CeremonyEditor    from './pages/admin/CeremonyEditor';
import GalleryManager    from './pages/admin/GalleryManager';
import WishManager       from './pages/admin/WishManager';
import ThemeSettings     from './pages/admin/ThemeSettings';

export default function App() {
  return (
    <Routes>
      {/* Public Invitation Route */}
      <Route path="/"             element={<PublicInvitation />} />
      <Route path="/invite/:slug" element={<PublicInvitation />} />
      <Route path="/invite"       element={<PublicInvitation />} />

      {/* Admin Auth Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Portal Nested Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard"  element={<DashboardOverview />} />
        <Route path="wedding"    element={<WeddingEditor />} />
        <Route path="couple"     element={<CoupleEditor />} />
        <Route path="family"     element={<FamilyEditor />} />
        <Route path="marriage"   element={<CeremonyEditor type="marriage" />} />
        <Route path="reception"  element={<CeremonyEditor type="reception" />} />
        <Route path="gallery"    element={<GalleryManager />} />
        <Route path="wishes"     element={<WishManager />} />
        <Route path="settings"   element={<ThemeSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<PublicInvitation />} />
    </Routes>
  );
}

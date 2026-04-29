import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import RequireAuth from './components/RequireAuth';
import AppLayout from './components/AppLayout';
import PublicLayout from './components/PublicLayout';
import LoadingSpinner from './components/LoadingSpinner';

import Landing       from './pages/Landing';
import Listings      from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import Login         from './pages/Login';
import Signup        from './pages/Signup';
import NotFound      from './pages/NotFound';
import Unauthorized  from './pages/Unauthorized';

// Seller
import SellerDashboard      from './pages/seller/Dashboard';
import SellerProperties     from './pages/seller/Properties';
import SellerPropertyForm   from './pages/seller/PropertyForm';
import SellerPropertyDetail from './pages/seller/PropertyDetail';
import SellerEnquiries      from './pages/seller/Enquiries';
import SellerValuations     from './pages/seller/Valuations';

// Buyer
import BuyerDashboard      from './pages/buyer/Dashboard';
import BuyerBrowse         from './pages/buyer/Browse';
import BuyerPropertyDetail from './pages/buyer/PropertyDetail';
import BuyerEnquiries      from './pages/buyer/Enquiries';
import BuyerLoans          from './pages/buyer/Loans';

// RM
import RMDashboard  from './pages/rm/Dashboard';
import RMProperties from './pages/rm/Properties';
import RMEnquiries  from './pages/rm/Enquiries';
import RMValuations from './pages/rm/Valuations';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers     from './pages/admin/Users';

function RoleRedirect() {
  const { user, userProfile, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;
  if (!user)   return <Navigate to="/" replace />;
  const role = userProfile?.role;
  if (role === 'seller') return <Navigate to="/seller/dashboard" replace />;
  if (role === 'buyer')  return <Navigate to="/buyer/dashboard"  replace />;
  if (role === 'rm')     return <Navigate to="/rm/dashboard"     replace />;
  if (role === 'admin')  return <Navigate to="/admin/dashboard"  replace />;
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* ── Public pages (marketing site) ── */}
      <Route element={<PublicLayout />}>
        <Route path="/"             element={<Landing />} />
        <Route path="/listings"     element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
      </Route>

      {/* ── Auth pages ── */}
      <Route path="/login"        element={<Login />} />
      <Route path="/signup"       element={<Signup />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ── Role redirect (after login) ── */}
      <Route path="/dashboard" element={<RoleRedirect />} />

      {/* ── All authenticated pages share the AppLayout shell ── */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>

          {/* ── Seller ── */}
          <Route element={<RequireAuth roles={['seller', 'admin']} />}>
            <Route path="/seller/dashboard"           element={<SellerDashboard />} />
            <Route path="/seller/properties"          element={<SellerProperties />} />
            <Route path="/seller/properties/new"      element={<SellerPropertyForm />} />
            <Route path="/seller/properties/:id"      element={<SellerPropertyDetail />} />
            <Route path="/seller/properties/:id/edit" element={<SellerPropertyForm />} />
            <Route path="/seller/enquiries"           element={<SellerEnquiries />} />
            <Route path="/seller/valuations"          element={<SellerValuations />} />
          </Route>

          {/* ── Buyer ── */}
          <Route element={<RequireAuth roles={['buyer', 'admin']} />}>
            <Route path="/buyer/dashboard"        element={<BuyerDashboard />} />
            <Route path="/buyer/browse"           element={<BuyerBrowse />} />
            <Route path="/buyer/properties/:id"   element={<BuyerPropertyDetail />} />
            <Route path="/buyer/enquiries"        element={<BuyerEnquiries />} />
            <Route path="/buyer/loans"            element={<BuyerLoans />} />
          </Route>

          {/* ── RM ── */}
          <Route element={<RequireAuth roles={['rm', 'admin']} />}>
            <Route path="/rm/dashboard"   element={<RMDashboard />} />
            <Route path="/rm/properties"  element={<RMProperties />} />
            <Route path="/rm/enquiries"   element={<RMEnquiries />} />
            <Route path="/rm/valuations"  element={<RMValuations />} />
          </Route>

          {/* ── Admin ── */}
          <Route element={<RequireAuth roles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users"     element={<AdminUsers />} />
          </Route>

        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

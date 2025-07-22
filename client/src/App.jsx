import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminParlors from "./pages/admin-view/parlors";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingParlors from "./pages/shopping-view/parlors";
import ParlorDetail from "./pages/shopping-view/parlor-detail";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import KhaltiReturnPage from "./pages/shopping-view/khalti-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import PaymentFailedPage from "./pages/shopping-view/payment-failed";
import PaymentCancelledPage from "./pages/shopping-view/payment-cancelled";
import SearchProducts from "./pages/shopping-view/search";
import ParlorOwnerLayout from "./components/parlor-owner/layout";
import ParlorOwnerDashboard from "./pages/parlor-owner/dashboard";
import ParlorOwnerServices from "./pages/parlor-owner/services";
import ParlorOwnerInfo from "./pages/parlor-owner/parlor-info";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="parlors" element={<AdminParlors />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="parlors" element={<ShoppingParlors />} />
          <Route path="parlors/:id" element={<ParlorDetail />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="khalti-return" element={<KhaltiReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="payment-failed" element={<PaymentFailedPage />} />
          <Route path="payment-cancelled" element={<PaymentCancelledPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route
          path="/parlor-owner"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ParlorOwnerLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<ParlorOwnerDashboard />} />
          <Route path="services" element={<ParlorOwnerServices />} />
          <Route path="parlor-info" element={<ParlorOwnerInfo />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

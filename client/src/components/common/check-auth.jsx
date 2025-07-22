import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  console.log(
    "CheckAuth - location:",
    location.pathname,
    "isAuthenticated:",
    isAuthenticated,
    "user:",
    user
  );

  // Always redirect root path to login page, regardless of authentication status
  if (location.pathname === "/") {
    console.log("Root path accessed, redirecting to login");
    return <Navigate to="/auth/login" replace />;
  }

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user?.role === "parlor_owner") {
      return <Navigate to="/parlor-owner/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role !== "parlor_owner" &&
    location.pathname.includes("parlor-owner")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  if (
    isAuthenticated &&
    user?.role === "parlor_owner" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/parlor-owner" />;
  }

  return <>{children}</>;
}

CheckAuth.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
  children: PropTypes.node.isRequired,
};

export default CheckAuth;

import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const getRoleHome = (role) => (role === "member" ? "/member/dashboard" : "/dashboard");

const ProtectedRoute = ({ children, roles = [] }) => {
  const { booting, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <div className="screen-loader">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length && !roles.includes(user?.role)) {
    return <Navigate to={getRoleHome(user?.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;

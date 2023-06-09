import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return allowedRoles.includes(auth?.userType) ? (
    <Outlet />
  ) : auth?.username ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );

  //
  // return auth?.username ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to="/unauthorized" state={{ from: location }} replace />
  // );
};
export default RequireAuth;

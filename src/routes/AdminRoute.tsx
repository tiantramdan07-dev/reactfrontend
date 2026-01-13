import { Navigate, Outlet } from "react-router";
import { getUser } from "../utils/auth";

export default function AdminRoute() {
  const user = getUser();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

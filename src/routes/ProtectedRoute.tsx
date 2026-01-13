import { Navigate } from "react-router";
import { ReactNode } from "react";
import { getUser } from "../utils/auth";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

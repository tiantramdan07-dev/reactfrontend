// // src/components/ProtectedRoute.tsx
// import { Navigate } from "react-router";
// import { ReactNode } from "react";

// export default function ProtectedRoute({ children }: { children: ReactNode }) {
//   const token = localStorage.getItem("token");
//   if (!token) return <Navigate to="/AiScale/signin" replace />;
//   return <>{children}</>;
// }

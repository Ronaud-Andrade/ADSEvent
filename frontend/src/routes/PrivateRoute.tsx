import { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

interface Props {
  children: ReactNode;
}

export function PrivateRoute({
  children,
}: Props) {

  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
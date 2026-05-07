/* Hook personalizado para acessar o contexto de autenticação */
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  /* Garante que o hook só seja usado dentro do Provider */
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
/* Contexto de autenticação para gerenciar estado de login do usuário */
import React, { createContext, useState, useEffect, ReactNode } from "react";
/* Importa funções e tipos relacionados à autenticação */
import { User, authAPI } from "../lib/api";

/* Define o formato do contexto de autenticação */
interface AuthContextType {
  user: User | null; // Usuário logado ou null
  login: (username: string, password: string) => Promise<void>; // Função de login
  logout: () => Promise<void>; // Função de logout
  isLoading: boolean; // Estado de carregamento da autenticação
}

/* Criação do contexto de autenticação */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* Provider que envolve a aplicação e fornece o contexto */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  /* Estado do usuário logado */
  const [user, setUser] = useState<User | null>(null);

  /* Estado de carregamento da autenticação */
  const [isLoading, setIsLoading] = useState(true);

  /* Verifica se existe token ao carregar a aplicação */
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          /* Se existir token, busca os dados do usuário */
          const data = await authAPI.user();
          setUser(data); // Define usuário logado
        } catch {
          localStorage.removeItem("token"); // Remove token inválido
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  /* Função de login */
  const login = async (username: string, password: string) => {
    /* Faz requisição de login na API */
    const response = await authAPI.login({ username, password });

    /* Salva o token no localStorage */
    localStorage.setItem("token", response.token);

    /* Define o usuário logado */
    setUser(response.user);
  };

  /* Função de logout */
  const logout = async () => {
    /* Chama endpoint de logout no backend */
    await authAPI.logout();

    /* Remove token do armazenamento local */
    localStorage.removeItem("token");

    /* Remove usuário do estado */
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
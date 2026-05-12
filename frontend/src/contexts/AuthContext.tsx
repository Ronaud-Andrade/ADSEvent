/* Contexto de autenticação para gerenciar estado de login do usuário */
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

/* Importa funções e tipos relacionados à autenticação */
import { User, authAPI } from "../lib/api";

/* Define o formato do contexto de autenticação */
interface AuthContextType {
  user: User | null; // Usuário logado ou null

  login: (
    username: string,
    password: string
  ) => Promise<void>; // Função de login

  logout: () => Promise<void>; // Função de logout

  isLoading: boolean; // Estado de carregamento

  isAuthenticated: boolean; // Verifica se usuário está autenticado
}

/* Criação do contexto de autenticação */
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

/* Provider que envolve a aplicação e fornece o contexto */
export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  /* Estado do usuário logado */
  const [user, setUser] =
    useState<User | null>(null);

  /* Estado de carregamento */
  const [isLoading, setIsLoading] =
    useState(true);

  /* Verifica se o usuário está autenticado */
  const isAuthenticated = !!user;

  /* Verifica se existe token ao carregar a aplicação */
  useEffect(() => {

    const checkAuth = async () => {

      const accessToken =
        localStorage.getItem("access_token");
      const refreshToken =
        localStorage.getItem("refresh_token");

      if (accessToken) {

        try {

          /* Busca dados do usuário */
          const data =
            await authAPI.user();

          setUser(data);

        } catch {

          if (refreshToken) {
            try {
              const refreshed =
                await authAPI.refresh(refreshToken);

              localStorage.setItem(
                "access_token",
                refreshed.access
              );

              const data =
                await authAPI.user();

              setUser(data);
              setIsLoading(false);
              return;
            } catch {
              // Se refresh falhar, limpa sessão local.
            }
          }

          /* Remove token inválido */
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }

      setIsLoading(false);
    };

    checkAuth();

  }, []);

  /* Função de login */
  const login = async (
    username: string,
    password: string
  ) => {

    /* Faz login na API */
    const response =
      await authAPI.login({
        username,
        password,
      });

    /* Salva token */
    localStorage.setItem("access_token", response.access);
    localStorage.setItem("refresh_token", response.refresh);

    /* Define usuário */
    setUser(response.user);
  };

  /* Função de logout */
  const logout = async () => {

    const refreshToken =
      localStorage.getItem("refresh_token") || undefined;

    /* Chama logout da API */
    try {
      await authAPI.logout(refreshToken);
    } catch {
      // Mesmo que API falhe, sessão local deve ser encerrada.
    }

    /* Remove token */
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    /* Remove usuário */
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
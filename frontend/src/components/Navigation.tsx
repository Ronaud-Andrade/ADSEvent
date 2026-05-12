// Navigation.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import {
  NavBar,
  NavInner,
  LogoLink,
  NavLinks,
  NavItem,
  NavAnchor,
  LogoutButton
} from '../lib/ui';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <NavBar>
      <NavInner>
        <LogoLink to="/">
          ADS Event
        </LogoLink>

        {user && (
          <NavLinks>
            <NavItem>
              <NavAnchor to="/">
                Início
              </NavAnchor>
            </NavItem>

            <NavItem>
              <NavAnchor to="/events">
                Eventos
              </NavAnchor>
            </NavItem>

            <NavItem>
              <NavAnchor to="/categories">
                Categorias
              </NavAnchor>
            </NavItem>

            <NavItem>
              <NavAnchor to="/subscriptions">
                Inscrições
              </NavAnchor>
            </NavItem>

            <NavItem>
              <LogoutButton
                variant="danger"
                onClick={handleLogout}
              >
                Sair
              </LogoutButton>
            </NavItem>
          </NavLinks>
        )}
      </NavInner>
    </NavBar>
  );
};

export default Navigation;
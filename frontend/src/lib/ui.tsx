import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export type ButtonVariant =
  | 'primary'
  | 'success'
  | 'danger'
  | 'secondary';

/* Define a cor do botão baseado na variante */
const getButtonColor = (variant: ButtonVariant) => {
  switch (variant) {
    case 'success':
      return 'var(--success)';
    case 'danger':
      return 'var(--danger)';
    case 'secondary':
      return 'var(--secondary)';
    default:
      return 'var(--primary)';
  }
};

/* =========================
   LAYOUT
========================= */

export const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1.2rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const CenteredScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 1rem;
`;

export const Panel = styled.div`
  background: var(--bg);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
`;

export const Card = styled(Panel)`
  display: flex;
  flex-direction: column;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const GridTwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

/* Linha de informações (ex: data, vagas, status) */
export const InfoRow = styled.div`
  font-size: 0.9rem;
  color: #555;

  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

/* =========================
   HEADERS
========================= */

export const Heading = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: #2c3e50;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const SubTitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #666;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

/* =========================
   FORMULÁRIOS
========================= */

export const FormCard = styled(Panel)`
  padding: 2rem;
  max-width: 700px;
  margin: 2rem auto;
  width: 100%;
  box-sizing: border-box;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

export const FormControl = styled.input`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  min-height: 100px;
  resize: none;
  box-sizing: border-box;
`;

export const SelectControl = styled.select`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
`;

/* =========================
   BOTÕES
========================= */

const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0.8rem 1.2rem;
  border-radius: 8px;

  font-weight: 600;
  cursor: pointer;

  border: none;
  color: #fff;

  transition: 0.2s ease;

  /* evita overflow em layouts pequenos */
  max-width: 100%;
  min-width: 0;
  width: auto;

  white-space: nowrap;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const Button = styled.button<{ variant?: ButtonVariant }>`
  ${buttonStyles}
  background: ${(props) =>
    getButtonColor(props.variant ?? 'primary')};
`;

export const LinkButton = styled(Link)<{ variant?: ButtonVariant }>`
  ${buttonStyles}
  background: ${(props) =>
    getButtonColor(props.variant ?? 'primary')};
  text-decoration: none;
`;

/* Botão pequeno reutilizável */
export const SmallButton = styled(Button)`
  padding: 0.45rem 0.8rem;
  font-size: 0.9rem;
`;

/* Botão de logout com ajuste mobile */
export const LogoutButton = styled(Button)`
  padding: 0.45rem 0.8rem;
  min-width: auto;
  font-size: 0.9rem;
  white-space: nowrap;

  @media (max-width: 480px) {
    width: auto;
    align-self: center;
    margin: 0 auto;
  }
`;

/* =========================
   NAVBAR
========================= */

export const NavBar = styled.nav`
  background: var(--bg);
  border-bottom: 1px solid var(--border);
`;

export const NavInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0.7rem 1.2rem;
  gap: 1rem;

  flex-wrap: nowrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    flex-wrap: wrap;
  }
`;

export const LogoLink = styled(Link)`
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--primary);
  text-decoration: none;

  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const NavLinks = styled.ul`
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;

  flex-wrap: wrap;
  justify-content: center;

  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const NavItem = styled.li`
  display: flex;
`;

export const NavAnchor = styled(Link)`
  text-decoration: none;
  color: #333;

  padding: 0.5rem 0.75rem;
  border-radius: 6px;

  display: flex;
  justify-content: center;
  align-items: center;

  white-space: nowrap;

  &:hover {
    background: #eee;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

/* =========================
   UTILITÁRIOS UI
========================= */

export const MessageBox = styled.div`
  color: #dc3545;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #777;
`;

export const PaginationBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const CardFooter = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;

  margin-top: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const CardTitle = styled.h3`
  margin-bottom: 1rem;
  word-break: break-word;
`;

export const CardDescription = styled.p`
  margin-bottom: 1rem;
  color: #666;
  word-break: break-word;
`;
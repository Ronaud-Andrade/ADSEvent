import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export type ButtonVariant =
  | 'primary'
  | 'success'
  | 'danger'
  | 'secondary';

/* =========================
   CORES DOS BOTÕES
========================= */

const getButtonColor = (
  variant: ButtonVariant
) => {
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
  width: 100%;
  max-width: 1000px;
  padding: 2rem;
  margin: 0 auto;
  box-sizing: border-box;
  min-width: 0;
  overflow-x: hidden;

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

  min-height: 100vh;

  padding: 2rem;

  box-sizing: border-box;

  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    align-items: flex-start;

    padding: 1rem;
  }
`;

/* =========================
   PAINÉIS
========================= */

export const Panel = styled.div`
  background: var(--bg);

  border-radius: 18px;

  border: 1px solid var(--border);

  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.08);

  box-sizing: border-box;
`;

export const Card = styled(Panel)`
  display: flex;

  flex-direction: column;

  padding: 2rem;

  min-width: 0;
  overflow-wrap: anywhere;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const CardGrid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(240px, 1fr));

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

export const InfoRow = styled.div`
  font-size: 0.9rem;

  color: #555;

  display: flex;

  gap: 1rem;

  flex-wrap: wrap;

  margin-bottom: 1rem;

  width: 100%;
  min-width: 0;

  box-sizing: border-box;

  > span {
    min-width: 0;
    max-width: 100%;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  @media (max-width: 480px) {
    flex-direction: column;

    gap: 0.5rem;
  }
`;

/* =========================
   TÍTULOS
========================= */

export const Heading = styled.h1`
  font-size: 2.3rem;

  margin-bottom: 1.5rem;

  color: #2c3e50;

  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.7rem;
  }
`;

export const SubTitle = styled.p`
  font-size: 1.1rem;

  margin-bottom: 2rem;

  color: #666;

  text-align: center;
`;

/* =========================
   FORMULÁRIOS
========================= */

export const FormCard = styled(Panel)`
  width: 100%;
  max-width: min(500px, 100%);
  padding: 3rem 2.5rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.4rem;
  min-width: 0;
`;

export const FormLabel = styled.label`
  display: block;

  margin-bottom: 0.6rem;

  font-weight: 700;

  color: #333;
`;

export const FormControl = styled.input`
  width: 100%;

  padding: 1rem;

  border-radius: 12px;

  border: 1px solid #ccc;

  font-size: 1rem;

  transition: 0.2s ease;

  box-sizing: border-box;
  min-width: 0;

  &:focus {
    outline: none;

    border-color: var(--primary);

    box-shadow:
      0 0 0 3px rgba(0, 140, 255, 0.15);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;

  padding: 1rem;

  border-radius: 12px;

  border: 1px solid #ccc;

  min-height: 120px;

  resize: none;

  font-size: 1rem;

  box-sizing: border-box;

  &:focus {
    outline: none;

    border-color: var(--primary);

    box-shadow:
      0 0 0 3px rgba(0, 140, 255, 0.15);
  }
`;

export const SelectControl = styled.select`
  width: 100%;

  padding: 1rem;

  border-radius: 12px;

  border: 1px solid #ccc;

  font-size: 1rem;

  box-sizing: border-box;
  min-width: 0;

  &:focus {
    outline: none;

    border-color: var(--primary);

    box-shadow:
      0 0 0 3px rgba(0, 140, 255, 0.15);
  }
`;

/* =========================
   BOTÕES
========================= */

const buttonStyles = css`
  display: inline-flex;

  align-items: center;
  justify-content: center;

  padding: 0.95rem 1.3rem;

  border-radius: 12px;

  font-weight: 700;

  cursor: pointer;

  border: none;

  color: #fff;

  transition: 0.2s ease;

  max-width: 100%;

  min-width: 0;

  width: auto;

  white-space: normal;
  text-align: center;
  word-break: break-word;

  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);

    opacity: 0.95;
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

export const Button = styled.button<{
  variant?: ButtonVariant;
}>`
  ${buttonStyles}

  background: ${(props) =>
    getButtonColor(
      props.variant ?? 'primary'
    )};

  flex-shrink: 1;
  min-width: 0;
`;

export const LinkButton = styled(
  Link
)<{
  variant?: ButtonVariant;
}>`
  ${buttonStyles}

  background: ${(props) =>
    getButtonColor(
      props.variant ?? 'primary'
    )};

  text-decoration: none;
  flex-shrink: 1;
  min-width: 0;

  text-decoration: none;
`;

export const SmallButton = styled(Button)`
  padding: 0.55rem 0.9rem;

  font-size: 0.9rem;
`;

export const LogoutButton = styled(Button)`
  padding: 0.55rem 0.9rem;

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

  border-bottom: 1px solid
    var(--border);
`;

export const NavInner = styled.div`
  max-width: 1200px;

  margin: 0 auto;

  display: flex;

  align-items: center;
  justify-content: space-between;

  padding: 0.7rem 1.2rem;

  gap: 1rem;

  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;

    align-items: stretch;
  }
`;

export const LogoLink = styled(Link)`
  font-size: 1.5rem;

  font-weight: bold;

  color: var(--primary);

  text-decoration: none;

  white-space: normal;
  word-break: break-word;

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

  flex: 1;

  justify-content: flex-end;
  align-items: center;

  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;

    align-items: stretch;
    width: 100%;
  }
`;

export const NavItem = styled.li`
  display: flex;
`;

export const NavAnchor = styled(Link)`
  text-decoration: none;

  color: #333;

  padding: 0.6rem 0.85rem;

  border-radius: 8px;

  display: flex;

  justify-content: center;
  align-items: center;

  white-space: normal;
  word-break: break-word;
  text-align: center;

  transition: 0.2s ease;

  &:hover {
    background: #eee;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

/* =========================
   UTILITÁRIOS
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

  min-width: 0;

  & > * {
    min-width: 0;
  }

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const FilterSection = styled.div`
  display: flex;

  gap: 1rem;

  flex-wrap: wrap;

  margin-bottom: 1.5rem;
  min-width: 0;

  & > * {
    min-width: 0;
  }

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

  & > * {
    min-width: 0;
    flex: 1;
  }

  @media (max-width: 480px) {
    flex-direction: column;

    & > * {
      width: 100%;
    }
  }
`;

export const CardTitle = styled.h3`
  margin-bottom: 1rem;

  word-break: break-word;
  overflow-wrap: anywhere;
  max-width: 100%;
`;

export const CardDescription = styled.p`
  margin-bottom: 1rem;

  color: #666;

  word-break: break-word;
  overflow-wrap: anywhere;
  max-width: 100%;
`;
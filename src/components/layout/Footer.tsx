import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Send } from 'lucide-react';

// SVG customizado para Instagram
const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect width="24" height="24" rx="7" fill="currentColor" />
    <path d="M16.5 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-4.5 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm5.25 1.5c0-1.24-.01-2.21-.06-2.99a3.75 3.75 0 0 0-.53-1.53 3.75 3.75 0 0 0-1.53-.53C14.21 6.01 13.24 6 12 6s-2.21.01-2.99.06a3.75 3.75 0 0 0-1.53.53 3.75 3.75 0 0 0-.53 1.53C6.01 9.79 6 10.76 6 12s.01 2.21.06 2.99c.07.54.22 1.06.53 1.53.31.47.73.89 1.53 1.53.47.31.99.46 1.53.53.78.05 1.75.06 2.99.06s2.21-.01 2.99-.06c.54-.07 1.06-.22 1.53-.53.47-.31.89-.73 1.53-1.53.31-.47.46-.99.53-1.53.05-.78.06-1.75.06-2.99Z" fill="#fff"/>
  </svg>
);

// SVG customizado para Discord
const Discord = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect width="24" height="24" rx="7" fill="currentColor" />
    <path d="M17.5 17c-1.2-1.1-2.3-2-3.5-2s-2.3.9-3.5 2c-.2.2-.5.2-.7 0-.2-.2-.2-.5 0-.7C11.2 15.1 12.6 14 14 14s2.8 1.1 4.2 2.3c.2.2.2.5 0 .7-.2.2-.5.2-.7 0ZM9.5 11.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" fill="#fff"/>
  </svg>
);

// Componente para ícones sociais
const SocialIcon = ({
  href,
  icon: Icon,
}: {
  href: string;
  icon: React.ElementType;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
    style={{ backgroundColor: '#232323', color: '#8A8AA0' }}
    onMouseEnter={e => {
      e.currentTarget.style.backgroundColor = '#DDF247';
      e.currentTarget.style.color = '#161616';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.backgroundColor = '#232323';
      e.currentTarget.style.color = '#8A8AA0';
    }}
  >
    <Icon className="w-5 h-5" />
  </a>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full px-6 pb-6">
      <div
        className="border-t pt-6 flex flex-col md:flex-row items-center justify-between"
        style={{ borderColor: '#2a2a2a' }}
      >
        {/* Lado Esquerdo: Copyright */}
        <div className="text-sm" style={{ color: '#7A798A' }}>
          © {currentYear} Feedo - Made by Feedo | Feedbacks Inteligentes
        </div>

        {/* Centro: Ícones Sociais */}
        <div className="flex items-center space-x-3 my-4 md:my-0">
          <SocialIcon href="https://facebook.com/timefeedo" icon={Facebook} />
          <SocialIcon href="https://instagram.com/timefeedo" icon={Instagram} />
          <SocialIcon href="https://discord.gg/seulinkdiscord" icon={Discord} />
        </div>

        {/* Lado Direito: Links de Privacidade */}
        <div
          className="flex items-center space-x-6 text-sm"
          style={{ color: '#7A798A' }}
        >
          <Link to="/privacy-policy" className="hover:text-white transition-colors">
            Política de Privacidade
          </Link>
          <Link to="/terms-of-service" className="hover:text-white transition-colors">
            Termos de Serviço
          </Link>
        </div>
      </div>
    </footer>
  );
};
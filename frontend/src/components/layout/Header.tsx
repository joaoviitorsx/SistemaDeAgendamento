import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="bg-white shadow-sm border-b border-neutral-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">{title}</h1>
          {subtitle && <p className="text-neutral-600 mt-1.5 font-medium">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
};

export default Header;

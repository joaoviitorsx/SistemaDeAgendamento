import React from 'react';
import Sidebar from './Sidebar';

interface LayoutAdminProps {
  children: React.ReactNode;
}

const LayoutAdmin: React.FC<LayoutAdminProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default LayoutAdmin;

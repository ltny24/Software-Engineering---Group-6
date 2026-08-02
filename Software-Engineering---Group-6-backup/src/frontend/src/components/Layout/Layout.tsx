import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main authenticated layout: fixed sidebar + scrollable content area.
 * Wrap all protected pages with this component.
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Sidebar />
      <main id="main-content" className="layout__content">
        {children}
      </main>
    </div>
  );
}

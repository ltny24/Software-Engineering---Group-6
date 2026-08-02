import React from 'react';
import './PlaceholderPage.css';

interface PlaceholderPageProps {
  icon: string;
  title: string;
  description: string;
}

/**
 * Temporary skeleton page shown until the real feature page is implemented.
 * Replace this component with the actual page implementation.
 */
export default function PlaceholderPage({ icon, title, description }: PlaceholderPageProps) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-page__inner">
        <span className="placeholder-page__icon" aria-hidden="true">
          {icon}
        </span>
        <h1 className="placeholder-page__title">{title}</h1>
        <p className="placeholder-page__desc">{description}</p>
        <span className="badge badge--warning placeholder-page__badge">Coming Soon</span>
      </div>
    </div>
  );
}

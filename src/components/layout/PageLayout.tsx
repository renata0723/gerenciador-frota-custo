
import React from 'react';
import NewPageLayout from './NewPageLayout';

interface PageLayoutProps {
  children: React.ReactNode;
  showProjectionButton?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, showProjectionButton }) => {
  return (
    <NewPageLayout>
      {children}
    </NewPageLayout>
  );
};

export default PageLayout;

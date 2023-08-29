// components/Layout.tsx
import React from 'react';
import Header from './Header';
import Upload from './Upload';

type LayoutProps = {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      {/* <Header /> */}
      <main>{children}</main>
    </div>
  );
}

export default Layout;

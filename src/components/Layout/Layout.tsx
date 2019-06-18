import { Link } from 'gatsby';
import React from 'react';

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <div>
      <header>
        <h1>
          <Link to={'/'}>{title}</Link>
        </h1>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;

interface LayoutProps {
  location?: Location;
  title?: string;
  children?: any; // eslint-disable-line
}

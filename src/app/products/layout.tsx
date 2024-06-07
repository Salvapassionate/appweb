import React from 'react';
import '.././globals.css';
import { ProductProvider } from '../../context/ProductContext';
import { CategoryProvider } from '../../context/CategoryContext';

import { ConfigProvider } from 'antd';
import esES from 'antd/lib/locale/es_ES';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Business App</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <CategoryProvider>
        <ProductProvider>
          <ConfigProvider locale={esES}>
            {children}
          </ConfigProvider>
        </ProductProvider>
        </CategoryProvider>
      </body>
    </html>
  );
};

export default Layout
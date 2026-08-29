// Catalog provided to client components.
"use client";

import { createContext, useContext } from "react";

const ProductsContext = createContext([]);

export function ProductsProvider({ products, children }) {
  return (
    <ProductsContext.Provider value={products || []}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}

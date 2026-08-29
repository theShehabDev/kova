"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { CartProvider } from "./CartContext";
import { ProductsProvider } from "./ProductsContext";
import CartDrawer from "./CartDrawer";

export default function Chrome({ products, children }) {
  return (
    <ProductsProvider products={products}>
    <CartProvider products={products}>
      <Navbar />
      <CartDrawer />
      <div className="relative z-10 bg-cream-50">{children}</div>
      <div className="lg:sticky lg:bottom-0 lg:z-0">
        <Footer />
      </div>
    </CartProvider>
    </ProductsProvider>
  );
}

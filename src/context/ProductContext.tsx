"use client";
import { createContext, useContext, useState, ReactNode ,useEffect} from "react";
import { db } from "../lib/firebase";
import { collection, doc,getDocs,setDoc} from "firebase/firestore";
import { Product } from "../types";


interface ProductContextProps {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const fetchedProducts: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();   
        fetchedProducts.push({
          id: doc.id,
          logoUrl: data.logoUrl,
          nombre:data.nombre,
          descripcion: data.descripcion,
          precio: data.precio,
          categoria: data.categoria,
          empresa: data.empresa,
          //video: data.video,
          estado: data.estado,
        });
      });
      setProducts(fetchedProducts);
    };
  
    fetchProducts();
  }, []);

  const addProduct = (product: Product) => {
    const docRef = doc(collection(db, "products"));
 setProducts(prevProducts => [...prevProducts, { ...product, id: docRef.id }]);
};

  const updateProduct = async (updatedProduct: Product) => {
    const docRef = doc(db, "products", updatedProduct.id);
    await setDoc(docRef, updatedProduct, { merge: true });
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext debe usarse dentro de un ProductProvider");
  }
  return context;
};

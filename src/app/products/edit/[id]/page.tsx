"use client";
import { useEffect, useState } from "react";
import ProductForm from "../../../../components/ProductForm";
import { db } from "../../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { Product } from "@/types";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #eeeeee;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #0052FF;
  font-size: 2.5rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`;


const fetchProduct = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
    } as Product;
  }
  return null;
};

const EditProduct = () => {
  const { id } = useParams();
  console.log("ID:", id); // Imprime el ID para verificar si está llegando correctamente
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const fetchedCategory = await fetchProduct(id as string);
        if (fetchedCategory) {
          setProduct(fetchedCategory);
        }
      };
      fetchData();
    }
  }, [id]);
  console.log("ID de Producto:", id);
  return (
    <div>
    <PageContainer>
      <Title>Editar producto</Title>
      {product ? <ProductForm product={product} /> : <p>Empresa no encontrada</p>}
    </PageContainer>
    </div>
  );
};

export default EditProduct;
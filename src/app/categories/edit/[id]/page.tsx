"use client";
import { useEffect, useState } from "react";
import CategoryForm from "../../../../components/CategoryForm";
import { db } from "../../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { Category } from "@/types";
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

const fetchCategory = async (id: string): Promise<Category | null> => {
  const docRef = doc(db, "categories", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
    } as Category;
  }
  return null;
};
const EditCategory = () => {
  const { id } = useParams();
  console.log("ID:", id); // Imprime el ID para verificar si está llegando correctamente
  const [category, setCategory] = useState<Category | null>(null);


useEffect(() => {
  if (id) {
    const fetchData = async () => {
      const fetchedCategory = await fetchCategory(id as string);
      if (fetchedCategory) {
        setCategory(fetchedCategory);
      }
    };
    fetchData();
  }
}, [id]);
console.log("ID de categoria empresa:", id);
return (
  <div>
    <PageContainer>
     <Title>Editar Categorias de Productos</Title>
    {category ? <CategoryForm category={category} /> : <p>Empresa no encontrada</p>}
    </PageContainer>
  </div>
);
};

export default EditCategory;
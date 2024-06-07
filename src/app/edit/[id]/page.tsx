"use client";
import { useEffect, useState } from "react";
import BusinessForm from "../../../components/BusinessForm";
import { db } from "../../../lib/firebase";
import { doc, getDoc ,Timestamp} from "firebase/firestore";
import { Business } from "../../../types";
import { useParams, useRouter } from "next/navigation";
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

  const fetchBusiness = async (id: string): Promise<Business | null> => {
    const docRef = doc(db, "businesses", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
      } as Business;
    }
    return null;
  };
  const EditBusiness = () => {
    const { id } = useParams();
    console.log("ID:", id); // Imprime el ID para verificar si está llegando correctamente
    const [business, setBusiness] = useState<Business | null>(null);


  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const fetchedBusiness = await fetchBusiness(id as string);
        if (fetchedBusiness) {
          setBusiness(fetchedBusiness);
        }
      };
      fetchData();
    }
  }, [id]);
  console.log("ID de empresa:", id);
  return (
    <div>
      <PageContainer>
      <Title>Editar Empresas</Title>
      {business ? <BusinessForm business={business} /> : <p>Empresa no encontrada</p>}
      </PageContainer>
    </div>
  );
};
export default EditBusiness;



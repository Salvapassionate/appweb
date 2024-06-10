"use client";
import { createContext, useContext, useState, ReactNode,useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, doc,getDocs ,setDoc, addDoc,updateDoc,Timestamp} from "firebase/firestore";
import { Business } from "../types";

interface BusinessContextProps {
  businesses: Business[];
  addBusiness: (business: Business) => void;
  updateBusiness: (business: Business) => void;
}

const BusinessContext = createContext<BusinessContextProps | undefined>(undefined);

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);

 
  useEffect(() => {
    const fetchBusinesses = async () => {
      const querySnapshot = await getDocs(collection(db, "businesses"));
      const fetchedBusinesses: Business[] = [];
      querySnapshot.forEach((doc) => {
       // const data = doc.data();
        const data = doc.data() as Omit<Business, 'fechaCreacion' | 'fechaActualizacion'> & { fechaCreacion: Timestamp, fechaActualizacion: Timestamp };
        //Verificar si fechaCreacion y fechaActualizacion están definidos antes de acceder a toDate()
        const fechaCreacion = data.fechaCreacion ? data.fechaCreacion.toDate() : new Date();
        const fechaActualizacion = data.fechaActualizacion ? data.fechaActualizacion.toDate() : new Date();

        
        fetchedBusinesses.push({
          id: doc.id,
          logoUrl:data.logoUrl,
          nombreComercial: data.nombreComercial,
          sector: data.sector,
          quienesSomos:data.quienesSomos,
          sitioWeb: data.sitioWeb,
          razonSocial: data.razonSocial,
          horario:data.horario,
          inicio:data.inicio,
          fin:data.fin,
          dia:data.dia,
          telefono:data.telefono,
          facebook:data.facebook,
          instagram:data.instagram,
          linkedin:data.linkedin,
          youtube:data.youtube,
          direccion:data.direccion,
          direccionGeorreferenciada:data.direccionGeorreferenciada,
          estado:data.estado,
          fechaCreacion,
          fechaActualizacion,
        });
      });
      setBusinesses(fetchedBusinesses);
    };

    fetchBusinesses();
  }, []);

  
   
  const addBusiness = async (business: Business) => {
    const docRef = doc(collection(db, "businesses"));
   
    setBusinesses((prevBusinesses) => [...prevBusinesses, { ...business, id: docRef.id }]);
  };

  const updateBusiness = async (updatedBusiness: Business) => {
    const docRef = doc(db, "businesses", updatedBusiness.id);
    await setDoc(docRef, updatedBusiness, { merge: true });
    setBusinesses((prevBusinesses) =>
      prevBusinesses.map((business) =>
        business.id === updatedBusiness.id ? updatedBusiness : business
      )
    );
  };


  return (
    <BusinessContext.Provider value={{ businesses, addBusiness, updateBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusinessContext debe usarse dentro de un BusinessProvider");
  }
  return context;
};

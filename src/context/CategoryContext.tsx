"use client";
import { createContext, useContext, useState, ReactNode, useEffect} from "react";
import { db } from "../lib/firebase";
import { collection, doc,getDocs,setDoc} from "firebase/firestore";
import { Category } from "../types";



interface CategoryContextProps {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
}

const CategoryContext = createContext<CategoryContextProps | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);


useEffect(() => {
  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const fetchedCategories: Category[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();   
      fetchedCategories.push({
        id: doc.id,
        iconoUrl:data.iconoUrl,
        nombre: data.nombre,
        descripcion: data.descripcion,
        estado:data.estado,
      });
    });
    setCategories(fetchedCategories);
  };

  fetchCategories();
}, []);

const  addCategory = (category: Category) => {
  const docRef = doc(collection(db, "categories"));
 setCategories(prevCategories => [...prevCategories, { ...category, id: docRef.id }]);
};

const updateCategory = async (updatedCategory: Category) => {
  const docRef = doc(db, "businesses", updatedCategory.id);
  await setDoc(docRef, updatedCategory, { merge: true });
  setCategories((prevCategories) =>
    prevCategories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category
    )
  );
};

return (
  <CategoryContext.Provider value={{ categories, addCategory, updateCategory }}>
    {children}
  </CategoryContext.Provider>
);
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategoryContext debe usarse dentro de un CategoryProvider");
  }
  return context;
};
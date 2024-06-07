/*import { Form, Input, Button, Select,Switch,Upload,message,Tooltip  } from "antd";
import Link from "next/link";
import { UploadOutlined } from "@ant-design/icons";
import { useCategoryContext } from "../context/CategoryContext";
import { Category ,Product} from "../types";
import { useEffect,useState } from "react";
import { db,storage } from "../lib/firebase";
import { addDoc, collection, updateDoc, doc,getDoc, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styled from "styled-components";

const StyledForm = styled(Form)`
  background-color: #0052FF;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  margin: auto;
`;

const StyledFormItem = styled(Form.Item)`
  .ant-form-item-label > label {
    color: white;
  }
  .ant-form-item-control-input {
    input {
      background: transparent;
      border: none;
      border-bottom: 1px solid white;
      color: white;
    }
    textarea {
      background: transparent;
      border: none;
      border-bottom: 1px solid white;
      color: white;
    }
  }
`;

const StyledButton = styled(Button)`
  background: transparent;
  border: 1px solid white;
  color: white;
  &:hover {
    background: white;
    color: #001f3f;
  }
`;
const OrangeSwitch = styled(Switch)`
  .ant-switch-checked {
    background-color: orange;
  }
`;

interface CategoryFormProps {
  category?: Category;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category }) => {
  const { addCategory, updateCategory } = useCategoryContext();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [associatedProducts, setAssociatedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    if (category) {
      form.setFieldsValue(category);
      console.log("Category ID en CategoryForm:", category.id); // Verifica que el ID esté disponible
    }
  }, [category, form]);

  useEffect(() => {
    const fetchAssociatedProducts = async () => {
      if (category && category.id) {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("categoria", "==", category.nombre));
        const querySnapshot = await getDocs(q);
        const products: Product[] = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Product[];
        setAssociatedProducts(products);
        console.log("Productos asociados:", products); // Imprime los productos asociados
      }
    };

    fetchAssociatedProducts();
  }, [category]);

  const onFinish = async (values: any) => {
    setUploading(true);
    const now = new Date();
    const updatedCategory: Partial<Category> = {
      ...values,
      fechaActualizacion: now
    };

     console.log("Productos asociados después de la actualización del estado:", associatedProducts);

    try {
      let imageUrl = "";
      if (fileList.length > 0) {
        const file = fileList[0].originFileObj;
        console.log("Archivo seleccionado:", file);
        const storageRef = ref(storage, `logos/${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
        console.log("URL de la imagen subida:", imageUrl);
        updatedCategory.iconoUrl = imageUrl;
      }
      console.log("Datos del negocio antes de guardar en Firestore:", updatedCategory);
    // Verificar el ID antes de entrar a useEffect
    delete (updatedCategory as Category).logo;
      if (category && category.id) {
        // Si hay una categoría existente, actualiza los datos de la categoría
        const categoryRef = doc(db, "categories", category.id);
        const docSnap = await getDoc(categoryRef);
        if (docSnap.exists()) {
          await updateDoc(categoryRef, updatedCategory);
          const updatedCategoryData: Category = { ...category, ...updatedCategory };
          updateCategory(updatedCategoryData);
          console.log("Categoría actualizada correctamente:", category.id);
        } else {
          console.error("No se encontró el documento para actualizar");
        }
      } else {
        // Si no hay una categoría existente, crea una nueva
        const newCategory: Category = {
          ...updatedCategory,
          id: "", // id será asignado por Firestore
          fechaCreacion: now,
        } as Category;
        const docRef = await addDoc(collection(db, "categories"), newCategory);
        newCategory.id = docRef.id;
        await updateDoc(doc(db, "categories", docRef.id), { id: docRef.id });
        addCategory(newCategory);
        console.log("Categoría creada correctamente:", newCategory.id);
      }
      window.location.href = "/categories";
    } catch (error) {
      console.error("Error al crear/actualizar la categoría empresa:", error);
    }
  };
  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);
  };


  return (
    <StyledForm form={form} layout="vertical" initialValues={category} onFinish={onFinish}>
      <StyledFormItem
        name="logo"
        label="Logo"
        rules={[{ required: true, message: "Por favor, sube el logo de la categoria de producto" }]}
      >
        <Upload
          fileList={fileList}
          beforeUpload={(file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
              message.error('Solo puedes cargar archivos JPG/PNG!');
              return false;
            }
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isLt1M) {
              message.error('La imagen debe ser menor a 1MB!');
              return false;
            }
            return true;
          }}
          onChange={handleFileChange}
        >
          <StyledButton icon={<UploadOutlined />}>Subir Logo</StyledButton>
        </Upload>
      </StyledFormItem>
      <StyledFormItem
        name="nombre"
        label="Nombre Categoria Producto"
        rules={[{ required: true, message: "Por favor, ingresa el nombre de la categoría" }]}
      >
        <Input />
      </StyledFormItem>
      <StyledFormItem
        name="descripcion"
        label="Descripción de la cateogoria producto"
        rules={[{ required: true, message: "Por favor, ingresa la descripción de la categoría de producto" }]}
      >
        <Input.TextArea />
      </StyledFormItem>
      <StyledFormItem
        name="estado"
        label="Estado de categoria de Producto"
        valuePropName="checked"
        initialValue={category ? category.estado : true}
      >
        <Tooltip
          title={
            associatedProducts.length > 0
              ? "No puedes desactivar esta categoría porque tiene productos asociados."
              : ""
          }
        >
          <OrangeSwitch
            defaultChecked
            disabled={associatedProducts.length > 0}
            onChange={(checked) => {
              if (!checked && associatedProducts.length > 0) {
                message.error("No puedes desactivar esta categoría porque tiene productos asociados.");
                form.setFieldsValue({ estado: true });
              }
            }}
          />
        </Tooltip>
      </StyledFormItem>
      <Form.Item>
        <StyledButton type="primary" htmlType="submit">
          Guardar
        </StyledButton>
        <Link href="/categories">
          <StyledButton type="default">Cancelar</StyledButton>
        </Link>
      </Form.Item>
    </StyledForm>
  );
};


export default CategoryForm;*/

import { Form, Input, Button, Select, Switch, Upload, message, Tooltip } from "antd";
import Link from "next/link";
import { UploadOutlined } from "@ant-design/icons";
import { useCategoryContext } from "../context/CategoryContext";
import { Category, Product } from "../types";
import { useEffect, useState } from "react";
import { db, storage } from "../lib/firebase";
import { addDoc, collection, updateDoc, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styled from "styled-components";

const StyledForm = styled(Form)`
  background-color: #0052FF;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  margin: auto;
`;

const StyledFormItem = styled(Form.Item)`
  .ant-form-item-label > label {
    color: white;
  }
  .ant-form-item-control-input {
    input {
      background: transparent;
      border: none;
      border-bottom: 1px solid white;
      color: white;
    }
    textarea {
      background: transparent;
      border: none;
      border-bottom: 1px solid white;
      color: white;
    }
  }
`;

const StyledButton = styled(Button)`
  background: transparent;
  border: 1px solid white;
  color: white;
  &:hover {
    background: white;
    color: #001f3f;
  }
`;

const OrangeSwitch = styled(Switch)`
  .ant-switch-checked {
    background-color: orange;
  }
`;

interface CategoryFormProps {
  category?: Category;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category }) => {
  const { addCategory, updateCategory } = useCategoryContext();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [associatedProducts, setAssociatedProducts] = useState<Product[]>([]);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (category) {
      form.setFieldsValue(category);
      if (category.iconoUrl) {
        setExistingLogoUrl(category.iconoUrl);
        setFileList([
          {
            uid: '-1',
            name: 'logo.png',
            status: 'done',
            url: category.iconoUrl,
          },
        ]);
      }
      console.log("Category ID en CategoryForm:", category.id); // Verifica que el ID esté disponible
    }
  }, [category, form]);

  useEffect(() => {
    const fetchAssociatedProducts = async () => {
      if (category && category.id) {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("categoria", "==", category.nombre));
        const querySnapshot = await getDocs(q);
        const products: Product[] = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Product[];
        setAssociatedProducts(products);
        console.log("Productos asociados:", products); // Imprime los productos asociados
      }
    };

    fetchAssociatedProducts();
  }, [category]);

  const onFinish = async (values: any) => {
    setUploading(true);
    const now = new Date();
    const updatedCategory: Partial<Category> = {
      ...values,
      fechaActualizacion: now,
    };

    console.log("Productos asociados después de la actualización del estado:", associatedProducts);

    try {
      let imageUrl: string | undefined = existingLogoUrl;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj;
        console.log("Archivo seleccionado:", file);
        const storageRef = ref(storage, `logos/${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
        console.log("URL de la imagen subida:", imageUrl);
        updatedCategory.iconoUrl = imageUrl;
      } else {
        updatedCategory.iconoUrl = imageUrl;
      }
      console.log("Datos del negocio antes de guardar en Firestore:", updatedCategory);

      delete (updatedCategory as Category).logo;

      if (category && category.id) {
        // Si hay una categoría existente, actualiza los datos de la categoría
        const categoryRef = doc(db, "categories", category.id);
        const docSnap = await getDoc(categoryRef);
        if (docSnap.exists()) {
          await updateDoc(categoryRef, updatedCategory);
          const updatedCategoryData: Category = { ...category, ...updatedCategory };
          updateCategory(updatedCategoryData);
          console.log("Categoría actualizada correctamente:", category.id);
        } else {
          console.error("No se encontró el documento para actualizar");
        }
      } else {
        // Si no hay una categoría existente, crea una nueva
        const newCategory: Category = {
          ...updatedCategory,
          id: "", // id será asignado por Firestore
          fechaCreacion: now,
        } as Category;
        const docRef = await addDoc(collection(db, "categories"), newCategory);
        newCategory.id = docRef.id;
        await updateDoc(doc(db, "categories", docRef.id), { id: docRef.id });
        addCategory(newCategory);
        console.log("Categoría creada correctamente:", newCategory.id);
      }
      window.location.href = "/categories";
    } catch (error) {
      console.error("Error al crear/actualizar la categoría empresa:", error);
    }
  };

  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  return (
    <StyledForm form={form} layout="vertical" initialValues={category} onFinish={onFinish}>
      <StyledFormItem
        name="logo"
        label="Logo"
        rules={[{ required: !existingLogoUrl, message: "Por favor, sube el logo de la categoria de producto" }]}
      >
        <Upload
          fileList={fileList}
          beforeUpload={(file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
              message.error('Solo puedes cargar archivos JPG/PNG!');
              return false;
            }
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isLt1M) {
              message.error('La imagen debe ser menor a 1MB!');
              return false;
            }
            return true;
          }}
          onChange={handleFileChange}
          listType="picture"
        >
          <StyledButton icon={<UploadOutlined />}>Subir Logo</StyledButton>
        </Upload>
      </StyledFormItem>
      <StyledFormItem
        name="nombre"
        label="Nombre Categoria Producto"
        rules={[{ required: true, message: "Por favor, ingresa el nombre de la categoría" }]}
      >
        <Input />
      </StyledFormItem>
      <StyledFormItem
        name="descripcion"
        label="Descripción de la cateogoria producto"
        rules={[{ required: true, message: "Por favor, ingresa la descripción de la categoría de producto" }]}
      >
        <Input.TextArea />
      </StyledFormItem>
      <StyledFormItem
        name="estado"
        label="Estado de categoria de Producto"
        valuePropName="checked"
        initialValue={category ? category.estado : true}
      >
        <Tooltip
          title={
            associatedProducts.length > 0
              ? "No puedes desactivar esta categoría porque tiene productos asociados."
              : ""
          }
        >
          <OrangeSwitch
            defaultChecked
            disabled={associatedProducts.length > 0}
            onChange={(checked) => {
              if (!checked && associatedProducts.length > 0) {
                message.error("No puedes desactivar esta categoría porque tiene productos asociados.");
                form.setFieldsValue({ estado: true });
              }
            }}
          />
        </Tooltip>
      </StyledFormItem>
      <Form.Item>
        <StyledButton type="primary" htmlType="submit">
          Guardar
        </StyledButton>
        <Link href="/categories">
          <StyledButton type="default">Cancelar</StyledButton>
        </Link>
      </Form.Item>
    </StyledForm>
  );
};

export default CategoryForm;


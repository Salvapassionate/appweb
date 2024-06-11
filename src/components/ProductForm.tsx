
"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Select, InputNumber, Switch, message ,Tooltip} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { db, storage } from "../lib/firebase";
import Link from "next/link";
import { addDoc, collection, updateDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useProductContext } from "../context/ProductContext";
import { useCategoryContext } from "../context/CategoryContext";
import { useBusinessContext } from "../context/BusinessContext";
import { Product, Category, Business } from "../types";
import styled from "styled-components";

interface ProductFormProps {
  product?: Product;
}

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
    .ant-form-item-has-error  {
    input, textarea, .ant-input-number, .ant-select .ant-select-selector {
      background: blue;
      color: white;
    textarea {
      background: transparent;
      border: none;
      border-bottom: 1px solid white;
      color: white;
    }
    .ant-input-number {
      background: transparent;
      border: none;
      border-bottom: 1px solid white;
      color: white;
      width: 100%;
    }
    .ant-select {
      background: transparent;
      border: none;
      border-bottom: 1px solid white;
      .ant-select-selector {
        background: transparent !important;
        color: white !important;
      }
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

const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const [form] = Form.useForm();
  const { addProduct, updateProduct } = useProductContext();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const { categories } = useCategoryContext();
  const { businesses } = useBusinessContext();

  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [activeBusinesses, setActiveBusinesses] = useState<Business[]>([]);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    setActiveCategories(categories.filter(category => category.estado));
    setActiveBusinesses(businesses.filter(business => business.estado));
  }, [categories, businesses]);

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
      if (product.logoUrl) {
        setExistingLogoUrl(product.logoUrl);
        setFileList([
          {
            uid: '-1',
            name: 'logo.png',
            status: 'done',
            url: product.logoUrl,
          },
        ]);
      }
    }
  }, [product, form]);

  const onFinish = async (values: any) => {
    const selectedCategory = activeCategories.find(category => category.id === values.categoria);
    const selectedBusiness = activeBusinesses.find(business => business.id === values.empresa);

    values.categoria = selectedCategory ? selectedCategory.nombre : '';
    values.empresa = selectedBusiness ? selectedBusiness.nombreComercial : '';
   
    const now = new Date();
    const updatedProduct: Partial<Product> = {
      ...values,
      fechaActualizacion: now
    };

    try {
      let imageUrl: string | undefined = existingLogoUrl;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj;
        const storageRef = ref(storage, `products/${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
        updatedProduct.logoUrl = imageUrl;
      } else {
        updatedProduct.logoUrl = imageUrl;
      }

      delete updatedProduct.logo;

      if (product && product.id) {
        const productRef = doc(db, "products", product.id);
        const docSnap = await getDoc(productRef);
        if (docSnap.exists()) {
          await updateDoc(productRef, updatedProduct);
          const updatedProductData: Product = { ...product, ...updatedProduct };
          updateProduct(updatedProductData);
        } else {
          console.error("No se encontró el documento para actualizar");
        }
      } else {
        const newProduct: Product = {
          ...updatedProduct,
          id: "", 
          fechaCreacion: now,
          estado: true,
        } as Product;
        const docRef = await addDoc(collection(db, "products"), newProduct);
        newProduct.id = docRef.id;
        await updateDoc(doc(db, "products", docRef.id), { id: docRef.id });
        addProduct(newProduct);
      }
      window.location.href = "/products";
    } catch (error) {
      console.error("Error al crear/actualizar el producto:", error);
    }
  };

  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  return (
    <StyledForm form={form} layout="vertical" initialValues={product} onFinish={onFinish}>
      <StyledFormItem
        name="logo"
        label="Logo"
        rules={[{ required: !existingLogoUrl, message: "Por favor, sube el logo de la categoria de producto" }]}
      >
        <Upload
          fileList={fileList}
          beforeUpload={(file) => {
            const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
            const isVideo = file.type === 'video/mp4';

            if (isImage) {
              const imageFiles = fileList.filter(f => f.type === 'image/jpeg' || f.type === 'image/png');
              if (imageFiles.length >= 3) {
                message.error('Solo puedes cargar un máximo de 3 imágenes.');
                return Upload.LIST_IGNORE;
              }
              const isLt6M = file.size / 1024 / 1024 < 6;
              if (!isLt6M) {
                message.error('Cada imagen debe ser menor a 6MB!');
                return Upload.LIST_IGNORE;
              }
            } else if (isVideo) {
              const videoFiles = fileList.filter(f => f.type === 'video/mp4');
              if (videoFiles.length >= 1) {
                message.error('Solo puedes cargar un máximo de 1 video.');
                return Upload.LIST_IGNORE;
              }
              const isLt50M = file.size / 1024 / 1024 < 50;
              if (!isLt50M) {
                message.error('El video debe ser menor a 50MB!');
                return Upload.LIST_IGNORE;
              }
            } else {
              message.error('Solo puedes cargar archivos JPG/PNG/MP4!');
              return Upload.LIST_IGNORE;
            }

            return true;
          }}
          onChange={handleFileChange}
        >
          <StyledButton icon={<UploadOutlined />}>Subir Logo o Video</StyledButton>
        </Upload>
      </StyledFormItem>
      <StyledFormItem
        name="nombre"
        label="Nombre de producto"
        rules={[{ required: true, message: "Por favor, ingresa el nombre del producto" }]}
      >
        <Input />
      </StyledFormItem>
      <StyledFormItem
        name="descripcion"
        label="Descripción de producto"
        rules={[{ required: true, message: "Por favor, ingresa la descripción del producto" }]}
      >
        <Input.TextArea />
      </StyledFormItem>
      <StyledFormItem
       name="precio"
       label="Precio de producto"
       rules={[
         { 
           required: true, 
           message: "Por favor, ingresa el precio del producto" 
         },
         {
           pattern: /^[0-9]+(?:\.[0-9]+)?$/, 
           message: "El precio debe ser un número válido"
         }
       ]}
      >
        <Input  />
      </StyledFormItem>
      <StyledFormItem
  name="categoria"
  label="Categoría de producto"
  rules={[
    {
      validator: (_, value) => {
        if ((activeCategories.length > 0) && !value) {
          return Promise.reject(new Error("Por favor, selecciona la categoría del producto"));
        }
        return Promise.resolve();
      },
    },
  ]}
>
  <Select>
    {activeCategories.map((category) => (
      <Select.Option key={category.id} value={category.id}>
        {category.nombre}
      </Select.Option>
    ))}
  </Select>
</StyledFormItem>
      <StyledFormItem
        name="empresa"
        label="Empresa que vende el producto"
        rules={[ {
          validator: (_, value) => {
            if ((activeBusinesses.length > 0 ) && !value) {
              return Promise.reject(new Error("Por favor, selecciona la categoría del producto"));
            }
            return Promise.resolve();
          },
        },]}
      >
        <Select>
          {activeBusinesses.map((business) => (
            <Select.Option key={business.id} value={business.id}>
              {business.nombreComercial}
            </Select.Option>
          ))}
        </Select>
      </StyledFormItem>
      <StyledFormItem
  name="estado"
  label="Estado de producto"
  valuePropName="checked"
  initialValue={product ? product.estado : true}
>
  <Tooltip
    title={
      (!activeBusinesses.length || !activeCategories.length)
        ? "No puedes desactivar este producto porque está asociado a una Empresa o Categoría inactiva."
        : ""
    }
  >
    <Switch
      defaultChecked={product ? product.estado : true}
      onChange={(checked) => {
        if (!checked) {
          if (!activeBusinesses.length || !activeCategories.length) {
            message.error("No puedes desactivar este producto porque está asociado a una Empresa o Categoría inactiva.");
            form.setFieldsValue({ estado: true });
          } else {
            form.setFieldsValue({ estado: false });
          }
        } else {
          form.setFieldsValue({ estado: checked });
        }
      }}
      disabled={(!activeBusinesses.length || !activeCategories.length) && !product?.estado}
    />
  </Tooltip>
</StyledFormItem>
        <Form.Item>
          <StyledButton type="primary" htmlType="submit">
            Guardar
          </StyledButton>
          <Link href="/products">
            <StyledButton type="default">
              Cancelar
            </StyledButton>
          </Link>
        </Form.Item>
      </StyledForm>
    );
  };
  
  export default ProductForm;
  

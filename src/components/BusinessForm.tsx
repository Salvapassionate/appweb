
import { Form, Input, Button, Upload, Select, message, Switch, Tooltip } from "antd";
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBusinessContext } from "../context/BusinessContext";
import { Business } from "../types";
import { db, storage } from "../lib/firebase"; 
import { addDoc, collection, updateDoc, doc, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styled from "styled-components";

interface BusinessFormProps {
  business: Business;
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
    textarea {
      background: transparent;
      border: none;
      border-bottom: 1px solid white;
      color: white;
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

const BusinessForm: React.FC<BusinessFormProps> = ({ business }) => {
  const { addBusiness, updateBusiness } = useBusinessContext();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [associatedProducts, setAssociatedProducts] = useState<Business[]>([]);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (business) {
      form.setFieldsValue(business);
      if (business.logoUrl) {
        setExistingLogoUrl(business.logoUrl);
        setFileList([
          {
            uid: '-1',
            name: 'logo.png',
            status: 'done',
            url: business.logoUrl,
          },
        ]);
      }
      console.log("Business ID en BusinessForm:", business.id); // Verifica que el ID esté disponible
      console.log("Business logoUrl en BusinessForm:", business.logoUrl); // Verifica que el logoUrl esté disponible
    }
  }, [business, form]);

  useEffect(() => {
    if (business) {
      form.setFieldsValue(business);
    }
  }, [business, form]);

  useEffect(() => {
    const fetchAssociatedProducts = async () => {
      if (business && business.id) {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("empresa", "==", business.nombreComercial));
        const querySnapshot = await getDocs(q);
        const products: Business[] = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Business[];
        setAssociatedProducts(products);
      }
    };
    fetchAssociatedProducts();
  }, [business]);

  const onFinish = async (values: any) => {
    setUploading(true);
    const now = new Date();
    const updatedBusiness: Partial<Business> = {
      ...values,
      fechaActualizacion: now,
      facebook: values.facebook || "",
      instagram: values.instagram || "",
      linkedin: values.linkedin || "",
      youtube: values.youtube || "",
      direccionGeorreferenciada: values.direccionGeorreferenciada || "",
      sitioWeb: values.sitioWeb || "",
      horarios: values.horarios || []
    };

    try {
      let imageUrl: string | undefined = existingLogoUrl;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj;
        console.log("Archivo seleccionado:", file);
        const storageRef = ref(storage, `logos/${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
        console.log("URL de la imagen subida:", imageUrl);
        updatedBusiness.logoUrl = imageUrl;
      } else {
        updatedBusiness.logoUrl = imageUrl;
      }
      console.log("Datos del negocio antes de guardar en Firestore:", updatedBusiness);
      delete (updatedBusiness as Business).logo;

      if (business && business.id) {
        const businessRef = doc(db, "businesses", business.id);
        await updateDoc(businessRef, updatedBusiness);
        const updatedBusinessData: Business = { ...business, ...updatedBusiness };
        updateBusiness(updatedBusinessData);
      } else {
        const newBusiness: Business = {
          ...updatedBusiness,
          id: "",
          fechaCreacion: now,
          fechaActualizacion: now,
        } as Business;
        const docRef = await addDoc(collection(db, "businesses"), newBusiness);
        newBusiness.id = docRef.id;
        await updateDoc(doc(db, "businesses", docRef.id), { id: docRef.id });
        addBusiness(newBusiness);
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Error al crear/actualizar la empresa:", error);
    }
  };

  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);
  };
  console.log("Existe imagen",existingLogoUrl);

  return (
    <StyledForm
      form={form}
      layout="vertical"
      initialValues={business}
      onFinish={onFinish}
    >
      <StyledFormItem
        name="logo"
        label="Logo"
        rules={[{  required: !existingLogoUrl, message: "Por favor, sube el logo de la empresa" }]}
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
        name="nombreComercial"
        label="Nombre comercial"
        rules={[{ required: true, message: "Por favor, ingresa el nombre comercial" }]}
      >
        <Input />
      </StyledFormItem>
      <StyledFormItem
        name="sector"
        label="Sector"
        rules={[{ required: true, message: "Por favor, selecciona el sector" }]}
      >
        <Select>
          <Select.Option value="Tecnologia">Tecnología</Select.Option>
          <Select.Option value="Salud">Salud</Select.Option>
          <Select.Option value="Finanzas">Finanzas</Select.Option>
        </Select>
      </StyledFormItem>
      <StyledFormItem
        name="razonSocial"
        label="Razón social"
        rules={[{ required: true, message: "Por favor, ingresa la razón social" }]}
      >
        <Input />
      </StyledFormItem>
      <StyledFormItem
        name="quienesSomos"
        label="Quiénes somos"
        rules={[{ required: true, message: "Por favor, ingresa la descripción de quiénes somos" }]}
      >
        <Input.TextArea />
      </StyledFormItem>
      <StyledFormItem
      label="Horario"
      >
      <Form.List name="horario" >
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <div key={field.key} style={{ display: 'flex', marginBottom: 8, alignItems: 'center' }}>
                <StyledFormItem
                  {...field}
                  name={[field.name, 'dia']}
                  fieldKey={[field.key, 'dia']}
                  rules={[{ required: true, message: 'Por favor, ingresa el día' }]}
                >
                  <Input placeholder="Día (Ej. Lunes)" />
                </StyledFormItem>
                <StyledFormItem
                  {...field}
                  name={[field.name, 'inicio']}
                  fieldKey={[field.key, 'inicio']}
                  rules={[{ required: true, message: 'Por favor, ingresa la hora de inicio' }]}
                >
                  <Input placeholder="Hora de inicio (Ej. 08:00)" />
                </StyledFormItem>
                <StyledFormItem
                  {...field}
                  name={[field.name, 'fin']}
                  fieldKey={[field.key, 'fin']}
                  rules={[{ required: true, message: 'Por favor, ingresa la hora de fin' }]}
                >
                  <Input placeholder="Hora de fin (Ej. 17:00)" />
                </StyledFormItem>
                <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: 'white', marginLeft: 8 }} />
              </div>
            ))}
            <Form.Item
             rules={[{ required: true, message: "Por favor, ingresa el horario" }]}
            >
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Agregar horario
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      </StyledFormItem>
      <StyledFormItem
        name="instagram"
        label="Instagram"
        rules={[{ type: 'url', message: 'La URL no es válida' }]}
      >
        <Input />
      </StyledFormItem>
      <StyledFormItem
        name="linkedin"
        label="LinkedIn"
        rules={[{ type: 'url', message: 'La URL no es válida' }]}
      >
        <Input />
      </StyledFormItem>
      <StyledFormItem
        name="youtube"
        label="YouTube"
        rules={[{ type: 'url', message: 'La URL no es válida' }]}
      >
        <Input />
      </StyledFormItem>
      <StyledFormItem
        name="sitioWeb"
        label="Sitio web"
        rules={[
          { type: 'url', message: 'La URL no es válida' },
          { pattern: /\.com$/, message: 'El sitio web debe terminar con .com' }
        ]}
      >
        <Input />
      </StyledFormItem>
      <StyledFormItem
        name="direccion"
        label="Dirección"
        rules={[{ required: true, message: "Por favor, ingresa la dirección" }]}
      >
        <Input />
      </StyledFormItem>
      <StyledFormItem
        name="direccionGeorreferenciada"
        label="Dirección georreferenciada"
      >
        <Input />
      </StyledFormItem>
      <StyledFormItem
  name="estado"
  label="Estado de empresa"
  valuePropName="checked"
  initialValue={business ? business.estado : true}
>
  <Tooltip
    title={
      associatedProducts.length > 0
        ? "No puedes desactivar esta empresa porque tiene productos asociados."
        : ""
    }
  >
    <Switch
      defaultChecked={business ? business.estado : true}
      onChange={(checked) => {
        if (!checked && associatedProducts.length > 0) {
          message.error("No puedes desactivar esta empresa porque tiene productos asociados.");
          form.setFieldsValue({ estado: true });
        } else {
          form.setFieldsValue({ estado: checked });
        }
      }}
      disabled={associatedProducts.length > 0 && !business.estado}
    />
  </Tooltip>
</StyledFormItem>
      <StyledFormItem>
        <StyledButton type="primary" htmlType="submit">
          Guardar
        </StyledButton>
        <Link href="/">
          <StyledButton type="default">
            Cancelar
          </StyledButton>
        </Link>
      </StyledFormItem>
    </StyledForm>
  );
};

export default BusinessForm;






       


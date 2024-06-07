"use client";
import { Table, Button, Modal } from "antd";
import Link from "next/link";
import { useProductContext } from "../../context/ProductContext";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs ,doc, query, where} from "firebase/firestore";
import { Product,Business } from "@/types";
import styled from "styled-components";

interface ProductFormProps {
  product?: Product;
}

// Definimos los estilos utilizando styled-components
const PageContainer = styled.div`
  background-color: #f8f9fa; // Fondo de color suave
  padding: 20px;
  min-height: 100vh;
`;

const StyledButton = styled(Button)`
  margin-right: 8px;
  background-color: #007bff; // Primary color
  border-color: #007bff;
  &:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
`;

const StyledSecondaryButton = styled(Button)`
  background-color: #ef5a29; // Color secundario
  border-color: #ef5a29;
  color:#ffffff;
  &:hover {
    background-color: #ef5a29;
    border-color: #ef5a29;
    color:#ffffff;
  }
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff; // Fondo blanco
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Sombra en los bordes
  margin-bottom: 20px;
`;

const NavbarLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavbarLink = styled.span`
  margin-right: 16px;
  color: #007bff; // Color azul
  font-size: 18px; // Tamaño de fuente grande
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const TableContainer = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ModalContent = styled.div`
  p {
    margin-bottom: 8px;
  }
`;


const ProductList = () => {
  const { products, addProduct } = useProductContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  

    // Trae Objeto de Business
    
 
 
// Muestra el modal con la información del producto seleccionado.
 
   
  const showModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

// Maneja la acción de confirmar en el modal.
  
  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };


  //Maneja la acción de cancelar en el modal.
 
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // Definición de las columnas de la tabla
  const columns = [
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    { title: "Precio", dataIndex: "precio", key: "precio" },
    { title: "Estado", dataIndex: "estado", key: "estado", render: (estado: boolean) => (estado ? "Activo" : "Inactivo") },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: unknown, record: Product) => (
        <>
          <Link href={`/products/edit/${record.id}`}>
            <StyledButton type="primary">Editar</StyledButton>
          </Link>
          <Link href={`/products/details/${record.id}`}>
            <StyledButton type="primary" style={{ marginLeft: '8px' }}>
              Ver Ficha Técnica
            </StyledButton>
          </Link>
          <StyledSecondaryButton onClick={() => showModal(record)}>Ver Información</StyledSecondaryButton>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <Navbar>
      <NavbarLink>
          <div>I-STRATEGIES</div>
        </NavbarLink>
        <NavbarLinks>
          <Link href={`/products/create`}>
            <NavbarLink>Crear Producto</NavbarLink>
          </Link>
          <Link href={`/`}>
            <NavbarLink>Ver Empresas</NavbarLink>
          </Link>
          <Link href={`/categories`}>
            <NavbarLink>Ver Categorías de Productos</NavbarLink>
          </Link>
        </NavbarLinks>
      </Navbar>
      <TableContainer>
        <Table dataSource={products} columns={columns} rowKey="id" />
      </TableContainer>
      <Modal
        title="Información del Producto"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedProduct && (
          <ModalContent>
            {selectedProduct.logoUrl && <img src={selectedProduct.logoUrl} alt="Logo del Producto" />}
            <p>Nombre: {selectedProduct.nombre}</p>
            <p>Descripcion: {selectedProduct.descripcion}</p>
            <p>Precio: {selectedProduct.precio}</p>
            <p>Categoria del producto: {selectedProduct.categoria}</p>
            <p>Empresa del Producto: {selectedProduct.empresa}</p>
            <p>Estado: {selectedProduct.estado ? "Activo" : "Inactivo"}</p>

          </ModalContent>
        )}
      </Modal>
    </PageContainer>
  );
};

export default ProductList;

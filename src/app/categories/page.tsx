"use client";


import { Table, Button, Modal } from "antd";
import Link from "next/link";
import { useCategoryContext } from "../../context/CategoryContext";
import { useState } from "react";
import { Category } from "@/types";
import styled from "styled-components";

// Componentes con estilo para mejorar el aspecto visual
const PageContainer = styled.div`
  background-color: #f8f9fa; /* Color de fondo suave */
  padding: 20px;
  min-height: 100vh;
`;

const StyledButton = styled(Button)`
  margin-right: 8px;
  background-color: #007bff; /* Color de botón primario azul */
  border-color: #007bff;
  &:hover {
    background-color: #0056b3; /* Azul más oscuro al pasar el cursor */
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
  background-color: #ffffff; /* Fondo blanco */
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra en los bordes */
  margin-bottom: 20px;
`;

const NavbarLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavbarLink = styled.span`
  margin-right: 16px;
  color: #007bff; /* Color azul */
  font-size: 18px; /* Tamaño de fuente grande */
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
const Title = styled.h1`
  color: #0052FF;
  font-size: 2.5rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`;

const CategoryList = () => {
  const { categories } = useCategoryContext();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);


//Muestra el modal con la información de la categoría seleccionada.

  const showModal = (category: Category) => {
    setSelectedCategory(category);
    setIsModalVisible(true);
  };

//Maneja la acción "Aceptar" en el modal, cerrándolo.
  
  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedCategory(null);
  };

//Maneja la acción "Cancelar" en el modal, cerrándolo.

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCategory(null);
  };

  const columns = [
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    { title: "Estado", dataIndex: "estado", key: "estado", render: (estado: boolean) => (estado ? "Activo" : "Inactivo") },
    {
      title: "Acciones",
      key: "acciones",
      render: (text: any, record: Category) => (
        <div>
          <Link href={`/categories/edit/${record.id}`}>
            <StyledButton type="primary">Editar</StyledButton>
          </Link>
          <StyledSecondaryButton onClick={() => showModal(record)}>Ver</StyledSecondaryButton>
        </div>
      ),
    },
  ];
  console.log("Categoria Empresa",selectedCategory);
  return (
    <PageContainer>
      <Navbar>
      <NavbarLink>
          <div>I-STRATEGIES</div>
        </NavbarLink>
        <NavbarLinks>
          <Link href={`/categories/create`}>
            <NavbarLink>Crear categoría</NavbarLink>
          </Link>
          <Link href={`/`}>
            <NavbarLink>Ver empresas</NavbarLink>
          </Link>
          <Link href={`/products`}>
            <NavbarLink>Ver productos</NavbarLink>
          </Link>
        </NavbarLinks>
      </Navbar>
      <Title>Categoría de productos</Title>
      <TableContainer>
        <Table dataSource={categories} columns={columns} rowKey="id" />
      </TableContainer>
      <Modal
        title="Información de la categoría de producto"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedCategory && (
          <ModalContent>
            {selectedCategory.iconoUrl && <img src={selectedCategory.iconoUrl} alt="Icono de la categoria de la empresa" style={{ maxWidth: "200px" }} />}
            <p>Categoria: {selectedCategory.nombre}</p>
            <p>Descripcion: {selectedCategory.descripcion}</p>
          </ModalContent>
        )}
      </Modal>
    </PageContainer>
  );
};


export default CategoryList;
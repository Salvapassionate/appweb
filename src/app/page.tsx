"use client";
import { Table, Button, Modal } from "antd";
import Link from "next/link";
import { useBusinessContext } from "../context/BusinessContext";
import { useState } from "react";
import { Business } from "../types";
import styled from "styled-components";

// Definimos los estilos utilizando styled-components
const PageContainer = styled.div`
  background-color: #f8f9fa; // Fondo de color suave
  padding: 20px;
  min-height: 100vh;
`;

const StyledButton = styled(Button)`
  margin-right: 8px;
  background-color: #007bff; // Color primario
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
  img {
    max-width: 200px;
    margin-bottom: 20px;
  }
  p {
    margin-bottom: 8px;
  }
`;

const BusinessList = () => {
  const { businesses } = useBusinessContext();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  
   // Muestra el modal con la información de la empresa seleccionada.
   
   
   const showModal = (business: Business) => {
    setSelectedBusiness(business);
    setIsModalVisible(true);
  };

  
   // Maneja la acción de confirmar en el modal.
  
  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedBusiness(null);
  };

 
   //Maneja la acción de cancelar en el modal.
   
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBusiness(null);
  };

  // Definición de las columnas de la tabla
  const columns = [
    { title: "Nombre Comercial", dataIndex: "nombreComercial", key: "nombreComercial" },
    { title: "Sector", dataIndex: "sector", key: "sector" },
    { title: "Estado", dataIndex: "estado", key: "estado", render: (estado: boolean) => (estado ? "Activo" : "Inactivo") },
    { title: "Fecha de Creación", dataIndex: "fechaCreacion", key: "fechaCreacion", render: (fechaCreacion: Date) => new Date(fechaCreacion).toLocaleString() },
    { title: "Fecha de Actualización", dataIndex: "fechaActualizacion", key: "fechaActualizacion", render: (fechaActualizacion: Date) => new Date(fechaActualizacion).toLocaleString() },
    {
      title: "Acciones",
      key: "acciones",
      render: (text_: any, record: Business) => (
        <div>
          <Link href={`/edit/${record.id}`}>
            <StyledButton type="primary">Editar</StyledButton>
          </Link>
          <StyledSecondaryButton onClick={() => showModal(record)}>Ver</StyledSecondaryButton>
        </div>
      ),
    },
  ];
  console.log("Empresa",selectedBusiness?.logoUrl);

  return (
    <PageContainer>
      <Navbar>
        <NavbarLink>
          <div>I-STRATEGIES</div>
        </NavbarLink>
        <NavbarLinks>
          <Link href={`/create`}>
            <NavbarLink>Crear Empresa</NavbarLink>
          </Link>
          <Link href={`/categories`}>
            <NavbarLink>Ver Categorías de Productos</NavbarLink>
          </Link>
          <Link href={`/products`}>
            <NavbarLink>Ver Productos</NavbarLink>
          </Link>
        </NavbarLinks>
      </Navbar>
      <TableContainer>
        <Table dataSource={businesses} columns={columns} rowKey="id" />
      </TableContainer>
      <Modal
        title="Información de la Empresa"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedBusiness && (
          <ModalContent>
            {selectedBusiness.logoUrl && <img src={selectedBusiness.logoUrl} alt="Logo de la empresa" />}
            <p>Razon Social: {selectedBusiness.razonSocial}</p>
            <p>Nombre Comercial: {selectedBusiness.nombreComercial}</p>
            <p>Quienes somos: {selectedBusiness.quienesSomos}</p>
            <p>Sector: {selectedBusiness.sector}</p>
            <p>Horario: {selectedBusiness.horario}</p>
            <p>Telefono: {selectedBusiness.telefono}</p>
            <p>Facebook: {selectedBusiness.facebook}</p>
            <p>Instragam: {selectedBusiness.instagram}</p>
            <p>Linkedin: {selectedBusiness.linkedin}</p>
            <p>YouTube: {selectedBusiness.youtube}</p>
            <p>Sitio Web: {selectedBusiness.sitioWeb}</p>
            <p>Direccion: {selectedBusiness.direccion}</p>
            <p>Direccion Georreferencia: {selectedBusiness.direccionGeorreferenciada}</p>
          </ModalContent>
        )}
      </Modal>
    </PageContainer>
  );
};

export default BusinessList;


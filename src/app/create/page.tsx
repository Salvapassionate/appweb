/*"use client";
import BusinessForm from "../../components/BusinessForm";

const CreateBusiness = () => {
  return (
    <div>
      <h1>Crear Empresa</h1>
      <BusinessForm />
    </div>
  );
};

export default CreateBusiness;*/
"use client";
import styled from "styled-components";
import BusinessForm from "../../components/BusinessForm";

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


const CreateCategory = () => {
  return (
    <PageContainer>
      <Title>Crear empresa</Title>
        <BusinessForm />
    </PageContainer>
  );
};

export default CreateCategory;
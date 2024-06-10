/*"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { Business, Product } from '../../../../types';
import QRCode from '../../../../components/QRCode';
import DownloadPDFButton from '../../../../components/DownloadPDFButton';
import { useParams } from 'next/navigation';
import BusinessForm from '@/components/BusinessForm';

const fetchProduct = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Datos del producto:", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      console.error("¡No existe documento para este producto!");
    }
  } catch (error) {
    console.error("Error al obtener producto:", error);
  }
  return null;
};

const fetchBusinessByName = async (nombreComercial: string): Promise<Business | null> => {
  try {
    const q = query(collection(db, "businesses"), where("nombreComercial", "==", nombreComercial));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      console.log("Datos del negocio:", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() } as Business;
    } else {
      console.error("¡No existe documento para esta empresa!");
    }
  } catch (error) {
    console.error("Error al obtener la empresa: ", error);
  }
  return null;
};

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (id) {
      console.log("Obteniendo producto con ID:", id);
      fetchProduct(id as string).then((fetchedProduct) => {
        if (fetchedProduct) {
          console.log("Producto obtenido:", fetchedProduct);
          setProduct(fetchedProduct);
          if (fetchedProduct.empresa) {
            console.log("Obteniendo empresa con nombre:", fetchedProduct.empresa);
            fetchBusinessByName(fetchedProduct.empresa).then((fetchedBusiness) => {
              console.log("Empresa obtenido:", fetchedBusiness);
              setBusiness(fetchedBusiness);
            });
          } else {
            console.error("No empresa en el campo");
          }
        }
      });
    }
  }, [id]);

  if (!product || !business) return <div>Loading...</div>;

  const qrValue = `${window.location.origin}/products/${product.id}`;
  console.log("Logo:", business?.logoUrl);

  return (
    <div id="techSheet">
      <h1>Ficha Técnica del Producto</h1>
      {business.logoUrl && <img src={business.logoUrl} alt="Logo de la empresa" style={{ maxWidth: "200px" }} />}
      <p><strong>Nombre de la empresa:</strong> {business.nombreComercial}</p>
      <p><strong>Nombre del Producto:</strong> {product.nombre}</p>
      <p><strong>Costo del Producto:</strong> ${product.precio}</p>
      <p><strong>Descripción del Producto:</strong> {product.descripcion}</p>
      <QRCode value={`Empresa: ${product.empresa},Producto: ${product.nombre},  Fecha: ${new Date().toLocaleString()}`} />
      <DownloadPDFButton
        logoUrl={business.logoUrl}
        productEmpresa={product.empresa}
        productName={product.nombre}
        productPrice={product.precio}
        productDescription={product.descripcion}
      />
    </div>
  );
};

export default ProductDetail;*/
/*"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { Business, Product } from '../../../../types';
import QRCode from '../../../../components/QRCode';
import DownloadPDFButton from '../../../../components/DownloadPDFButton';
import { useParams } from 'next/navigation';

const fetchProduct = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      console.error("¡No existe documento para este producto!");
    }
  } catch (error) {
    console.error("Error al obtener producto:", error);
  }
  return null;
};

const fetchBusinessByName = async (nombreComercial: string): Promise<Business | null> => {
  try {
    const q = query(collection(db, "businesses"), where("nombreComercial", "==", nombreComercial));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as Business;
    } else {
      console.error("¡No existe documento para esta empresa!");
    }
  } catch (error) {
    console.error("Error al obtener la empresa: ", error);
  }
  return null;
};

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id as string).then((fetchedProduct) => {
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          if (fetchedProduct.empresa) {
            fetchBusinessByName(fetchedProduct.empresa).then((fetchedBusiness) => {
              setBusiness(fetchedBusiness);
            });
          } else {
            console.error("No empresa en el campo");
          }
        }
      });
    }
  }, [id]);

  if (!product || !business) return <div>Loading...</div>;

  // URL por IP
  const productUrl = `http://192.168.58.102:3000/products/details/${product.id}`;

  return (
    <div id="techSheet">
      <h1>Ficha Técnica del Producto</h1>
      {business.logoUrl && <img src={business.logoUrl} alt="Logo de la empresa" style={{ maxWidth: "200px" }} />}
      <p><strong>Nombre de la empresa:</strong> {business.nombreComercial}</p>
      <p><strong>Nombre del Producto:</strong> {product.nombre}</p>
      <p><strong>Costo del Producto:</strong> ${product.precio}</p>
      <p><strong>Descripción del Producto:</strong> {product.descripcion}</p>
      <QRCode value={productUrl} />
      <DownloadPDFButton
        productUrl={productUrl}
        logoUrl={business.logoUrl}
        productEmpresa={product.empresa}
        productName={product.nombre}
        productPrice={product.precio}
        productDescription={product.descripcion}
      />
    </div>
  );
};

export default ProductDetail;*/
"use client";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { Business, Product } from '../../../../types';
import QRCode from '../../../../components/QRCode';
import DownloadPDFButton from '../../../../components/DownloadPDFButton';
import { useParams } from 'next/navigation';


const StyledTechSheet = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
    text-transform: uppercase;
    font-weight: bold;
    color: #333;
  }

  p {
    font-size: 16px;
    margin-bottom: 10px;
    color: #555;
  }

  img {
    max-width: 200px;
    margin-bottom: 20px;
  }

  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const fetchProduct = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      console.error("¡No existe documento para este producto!");
    }
  } catch (error) {
    console.error("Error al obtener producto:", error);
  }
  return null;
};

const fetchBusinessByName = async (nombreComercial: string): Promise<Business | null> => {
  try {
    const q = query(collection(db, "businesses"), where("nombreComercial", "==", nombreComercial));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as Business;
    } else {
      console.error("¡No existe documento para esta empresa!");
    }
  } catch (error) {
    console.error("Error al obtener la empresa: ", error);
  }
  return null;
};

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id as string).then((fetchedProduct) => {
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          if (fetchedProduct.empresa) {
            fetchBusinessByName(fetchedProduct.empresa).then((fetchedBusiness) => {
              setBusiness(fetchedBusiness);
            });
          } else {
            console.error("No empresa en el campo");
          }
        }
      });
    }
  }, [id]);

  if (!product || !business) return <div>Loading...</div>;

  // URL por IP
  const productUrl = `http://192.168.58.102:3000/products/details/${product.id}`;

  return (
    <StyledTechSheet>
      <h1>Ficha Técnica</h1>
      <div className="center">
      <p><strong>Logo del producto</strong></p>
        {product.logoUrl && <img src={product.logoUrl} alt="Logo del producto" />}
        <p><strong>Nombre del producto:</strong> {product.nombre}</p>
        <p><strong>Costo del producto:</strong> ${product.precio}</p>
        <p><strong>Descripción del producto:</strong> {product.descripcion}</p>
        <p><strong>Categoria del producto:</strong> {product.categoria}</p>
        <p><strong>Empresa del producto:</strong> {product.empresa}</p>
        <p><strong>Logo de la empresa:</strong></p>
        {business.logoUrl && <img src={business.logoUrl} alt="Logo de la empresa" />}
        <p><strong>Nombre de la empresa</strong> {business.nombreComercial}</p>
        <p><strong>Razon social:</strong> {business.razonSocial}</p>
        <p><strong>Quienes somos:</strong> {business.quienesSomos}</p>
        <p><strong>Sector:</strong> {business.sector}</p>
        <div>
        <strong><p>Horario:</p></strong>
            <ul>
              {business.horario.map((entry, index) => (
                <li key={index}>
                  {entry.dia}: {entry.inicio} - {entry.fin}
                </li>
              ))}
            </ul>
          </div>
        <p><strong>Telefono:</strong> {business.telefono}</p>
        <p><strong>Facebook:</strong> {business.facebook}</p>
        <p><strong>Instagram:</strong> {business.instagram}</p>
        <p><strong>Linkedin</strong> {business.linkedin}</p>
        <p><strong>Youtube:</strong> {business.youtube}</p>
        <p><strong>Sitio Web:</strong> {business.sitioWeb}</p>
        <p><strong>Direccion:</strong> {business.direccion}</p>
        <p><strong>Direccion georreferncia</strong> {business.direccionGeorreferenciada}</p>
      </div>
      <QRCode value={productUrl} />
      <DownloadPDFButton
        productUrl={productUrl}
        logoUrl={business.logoUrl}
        productEmpresa={product.empresa}
        productName={product.nombre}
        productPrice={product.precio}
        productDescription={product.descripcion}
      />
    </StyledTechSheet>
  );
};


export default ProductDetail;
/*"use client";
import React, { useEffect, useState } from 'react';
import { db, storage } from '../../../../lib/firebase';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { Business, Product } from '../../../../types';
import QRCode from '../../../../components/QRCode';
import DownloadPDFButton from '../../../../components/DownloadPDFButton';
import { useParams } from 'next/navigation';

const fetchProduct = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      console.error("¡No existe documento para este producto!");
    }
  } catch (error) {
    console.error("Error al obtener producto:", error);
  }
  return null;
};

const fetchBusinessByName = async (nombreComercial: string): Promise<Business | null> => {
  try {
    const q = query(collection(db, "businesses"), where("nombreComercial", "==", nombreComercial));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as Business;
    } else {
      console.error("¡No existe documento para esta empresa!");
    }
  } catch (error) {
    console.error("Error al obtener la empresa: ", error);
  }
  return null;
};

const getBase64ImageFromUrl = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id as string).then((fetchedProduct) => {
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          if (fetchedProduct.empresa) {
            fetchBusinessByName(fetchedProduct.empresa).then((fetchedBusiness) => {
              setBusiness(fetchedBusiness);
              if (fetchedBusiness?.logoUrl) {
                const logoRef = ref(storage, fetchedBusiness.logoUrl);
                getDownloadURL(logoRef).then((url) => {
                  getBase64ImageFromUrl(url).then((base64) => {
                    setLogoBase64(base64);
                  });
                }).catch((error) => {
                  console.error("Error al obtener URL de descarga de imagen:", error);
                });
              }
            });
          } else {
            console.error("No empresa en el campo");
          }
        }
      });
    }
  }, [id]);

  if (!product || !business) return <div>Loading...</div>;

  const productUrl = `${window.location.origin}/detail/${product.id}`;

  return (
    <div id="techSheet">
      <h1>Ficha Técnica del Producto</h1>
      {logoBase64 && <img src={logoBase64} alt="Logo de la empresa" style={{ maxWidth: "200px" }} />}
      <p><strong>Nombre de la empresa:</strong> {business.nombreComercial}</p>
      <p><strong>Nombre del Producto:</strong> {product.nombre}</p>
      <p><strong>Costo del Producto:</strong> ${product.precio}</p>
      <p><strong>Descripción del Producto:</strong> {product.descripcion}</p>
      <QRCode value={productUrl} />
      <DownloadPDFButton
        productUrl={productUrl}
        logoBase64={logoBase64}
        productEmpresa={product.empresa}
        productName={product.nombre}
        productPrice={product.precio}
        productDescription={product.descripcion}
      />
    </div>
  );
};

export default ProductDetail;
*/
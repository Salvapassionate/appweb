
/*import React from 'react';
import { Button } from 'antd';
import jsPDF from 'jspdf';
import Link from 'next/link';

interface DownloadPDFButtonProps {
  productEmpresa:string;
  productName: string;
  productPrice: number;
  productDescription: string;
  logoUrl: string;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({
  productEmpresa,
  productName,
  productPrice,
  productDescription,
  logoUrl
}) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Añadir titulo
    doc.setFontSize(18);
    doc.text('Ficha Técnica del Producto', 14, 22);

     // Añadir logo para PDF
     console.log("URL del logo:", logoUrl); // Verifica la URL del logo
     if (logoUrl) {
      doc.addImage(logoUrl, 'JPEG', 15, 15, 30, 30); // Adjust these values as needed
    }
    // Añadir campos
    doc.setFontSize(12);
    doc.text('Nombre de la empresa:', 14, 30);
    doc.setFontSize(10);
    doc.text(productEmpresa, 14, 35);

    doc.setFontSize(12);
    doc.text('Nombre del Producto:', 14, 47);
    doc.setFontSize(10);
    doc.text(productName, 14, 52);

    doc.setFontSize(12);
    doc.text('Costo del Producto:', 14, 62);
    doc.setFontSize(10);
    doc.text(`$${productPrice}`, 14, 67);

    doc.setFontSize(12);
    doc.text('Descripción del Producto:', 14, 77);
    doc.setFontSize(10);
    doc.text(productDescription, 14, 82);

    // Guardar en pdf
    doc.save('ficha_tecnica.pdf');
  };

  return (
    <div>
    <Button type="primary" onClick={handleDownloadPDF}>
      Descargar PDF
    </Button>
      <Link href={`/products`}>
      <Button type='primary' style={{ marginLeft: '8px' }}>
        Regresar
      </Button>
    </Link>
    </div>
  );
};


export default DownloadPDFButton;*/
/*
import React from 'react';
import { Button } from 'antd';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import Link from 'next/link';

interface DownloadPDFButtonProps {
  productUrl: string;
  productEmpresa: string;
  productName: string;
  productPrice: number;
  productDescription: string;
  logoUrl: string;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({
  productUrl,
  productEmpresa,
  productName,
  productPrice,
  productDescription,
  logoUrl,
}) => {
  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleString();

    // Añadir título
    doc.setFontSize(18);
    doc.text('Ficha Técnica del Producto', 14, 22);
    console.log("Logo", logoUrl);
    // Añadir logo para PDF
    if (logoUrl) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        doc.addImage(img, 'JPEG', 15, 15, 30, 30);
      };
      img.src = logoUrl;
    }

    // Añadir campos
    doc.setFontSize(12);
    doc.text('Nombre de la empresa:', 14, 50);
    doc.setFontSize(10);
    doc.text(productEmpresa, 14, 55);

    doc.setFontSize(12);
    doc.text('Nombre del Producto:', 14, 67);
    doc.setFontSize(10);
    doc.text(productName, 14, 72);

    doc.setFontSize(12);
    doc.text('Costo del Producto:', 14, 82);
    doc.setFontSize(10);
    doc.text(`$${productPrice}`, 14, 87);

    doc.setFontSize(12);
    doc.text('Descripción del Producto:', 14, 97);
    doc.setFontSize(10);
    doc.text(productDescription, 14, 102);

    // Añadir fecha y hora de generación
    doc.setFontSize(12);
    doc.text('Fecha y hora de generación:', 14, 112);
    doc.setFontSize(10);
    doc.text(currentDate, 14, 117);

    // Generar y añadir QR Code que redirige a la página del producto
    const qrDataURL = await QRCode.toDataURL(productUrl);
    doc.addImage(qrDataURL, 'PNG', 14, 130, 50, 50);

    // Guardar en PDF
    doc.save('ficha_tecnica.pdf');
  };

  return (
    <div>
      <Button type="primary" onClick={handleDownloadPDF}>
        Descargar PDF
      </Button>
      <Link href={`/products`}>
        <Button type="primary" style={{ marginLeft: '8px' }}>
          Regresar
        </Button>
      </Link>
    </div>
  );
};

export default DownloadPDFButton;*/

import React from 'react';
import { Button } from 'antd';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import Link from 'next/link';

interface DownloadPDFButtonProps {
  productUrl: string;
  productEmpresa: string;
  productName: string;
  productPrice: number;
  productDescription: string;
  logoUrl: string;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({
  productUrl,
  productEmpresa,
  productName,
  productPrice,
  productDescription,
  logoUrl,
}) => {
  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleString();

    // Añadir título
    doc.setFontSize(18);
    doc.text('Ficha Técnica del producto', 14, 22);

    // Añadir logo para PDF si está disponible
    if (logoUrl) {
      try {
        const imgData = await loadImageAsDataURL(logoUrl);
        doc.addImage(imgData, 'JPEG', 35, 35, 60, 60);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    }
 // Ajustar coordenadas Y para el texto después de la imagen
 let textY = 115; // Inicialmente, 55 unidades debajo de la parte superior de la página

 // Añadir campos
 doc.setFontSize(12);
 doc.text('Nombre de la empresa:', 14, textY);
 doc.setFontSize(10);
 doc.text(productEmpresa, 14, textY + 5);

 doc.setFontSize(12);
 doc.text('Nombre del producto:', 14, textY + 17);
 doc.setFontSize(10);
 doc.text(productName, 14, textY + 22);

 doc.setFontSize(12);
 doc.text('Costo del producto:', 14, textY + 32);
 doc.setFontSize(10);
 doc.text(`$${productPrice}`, 14, textY + 37);

 doc.setFontSize(12);
 doc.text('Descripción del producto:', 14, textY + 47);
 doc.setFontSize(10);
 doc.text(productDescription, 14, textY + 52);

 // Añadir fecha y hora de generación
 doc.setFontSize(12);
 doc.text('Fecha y hora de generación:', 14, textY + 62);
 doc.setFontSize(10);
 doc.text(currentDate, 14, textY + 67);

 // Generar y añadir QR Code que redirige a la página del producto
 const qrDataURL = await QRCode.toDataURL(productUrl);
 doc.addImage(qrDataURL, 'PNG', 14, textY + 80, 50, 50); // Ajustar la coordenada Y según sea necesario

    // Guardar en PDF
    doc.save('ficha_tecnica.pdf');
  };

  const loadImageAsDataURL = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  };

  return (
    <div>
      <Button type="primary" onClick={handleDownloadPDF}>
        Descargar PDF
      </Button>
      <Link href={`/products`}>
        <Button type="primary" style={{ marginLeft: '8px' }}>
          Regresar
        </Button>
      </Link>
    </div>
  );
};

export default DownloadPDFButton;

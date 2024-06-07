import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value: string;
}

const QRCode: React.FC<QRCodeProps> = ({ value }) => {
  return <QRCodeSVG value={value} size={256} />;
};

export default QRCode;
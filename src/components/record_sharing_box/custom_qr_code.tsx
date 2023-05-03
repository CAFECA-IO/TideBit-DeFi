// CustomQRCode.tsx
import React, {useEffect, useState} from 'react';
import QRCode, {QRCodeToDataURLOptions} from 'qrcode';

async function generateQRCodeWithStyledEyeBorders(text: string): Promise<string> {
  const options = {
    type: 'svg',
    color: {
      dark: '#000',
      light: '#fff',
    },
  };

  const svgString = await QRCode.toString(text, {type: 'svg'});

  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svgDocument.documentElement;

  // Modify the eye borders in the SVG
  styleEyeBorders(svgElement);

  const serializer = new XMLSerializer();
  const styledSvgString = serializer.serializeToString(svgElement);

  return styledSvgString;
}

function styleEyeBorders(svgElement: Element): void {
  const eyeBorderRects = svgElement.querySelectorAll('rect[width="14"]');
  eyeBorderRects.forEach(rect => {
    const x = parseFloat(rect.getAttribute('x') || '0');
    const y = parseFloat(rect.getAttribute('y') || '0');

    // Remove the rectangle
    rect.remove();

    // Create a new circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', (x + 7).toString());
    circle.setAttribute('cy', (y + 7).toString());
    circle.setAttribute('r', '7');
    circle.setAttribute('fill', '#000');

    // Add the circle to the SVG
    svgElement.appendChild(circle);
  });
}

interface CustomQRCodeProps {
  text: string;
}

const CustomQRCode: React.FC<CustomQRCodeProps> = ({text}) => {
  const [svgString, setSvgString] = useState('');

  useEffect(() => {
    generateQRCodeWithStyledEyeBorders(text)
      .then(styledSvgString => {
        setSvgString(styledSvgString);
      })
      .catch(error => {
        // console.error('Error:', error);
      });
  }, [text]);

  return <div dangerouslySetInnerHTML={{__html: svgString}} style={{width: 100, height: 100}} />;
};

export default CustomQRCode;

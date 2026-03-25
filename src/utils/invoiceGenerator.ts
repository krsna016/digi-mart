import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface InvoiceData {
  orderId: string;
  date: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  items: InvoiceItem[];
  totalPrice: number;
  paymentMethod: string;
}

export const generateInvoice = (data: InvoiceData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Color Palette
  const primaryColor = [28, 28, 28]; // Stone-900
  const secondaryColor = [120, 113, 108]; // Stone-500

  // 1. Header: Brand
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('DIGIMART', 20, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('PREMIUM ESSENTIALS FOR MODERN LIVING', 20, 32);

  // 2. Invoice Details (Right Aligned)
  doc.setFontSize(20);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('INVOICE', pageWidth - 20, 25, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`#${data.orderId.toUpperCase()}`, pageWidth - 20, 32, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(`Date: ${data.date}`, pageWidth - 20, 38, { align: 'right' });

  // 3. Billing & Shipping Info
  doc.setDrawColor(231, 229, 228); // Stone-200
  doc.line(20, 50, pageWidth - 20, 50);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('BILL TO:', 20, 65);

  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.text(data.customerName, 20, 72);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const addressLines = [
    data.shippingAddress.address,
    `${data.shippingAddress.city}, ${data.shippingAddress.postalCode}`,
    data.shippingAddress.country
  ];
  doc.text(addressLines, 20, 78);

  // 4. Table of Items
  const tableColumn = ["Description", "Quantity", "Price", "Amount"];
  const tableRows = data.items.map(item => [
    item.name,
    item.qty.toString(),
    `INR ${item.price.toFixed(2)}`,
    `INR ${(item.qty * item.price).toFixed(2)}`
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 100,
    theme: 'grid',
    headStyles: {
      fillColor: [28, 28, 28],
      textColor: [255, 255, 255],
      fontSize: 10,
      font: 'helvetica',
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      font: 'times',
      textColor: [41, 37, 36], // Stone-800
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center', cellWidth: 30 },
      2: { halign: 'right', cellWidth: 40 },
      3: { halign: 'right', cellWidth: 40 }
    },
    alternateRowStyles: {
      fillColor: [250, 250, 249] // Stone-50
    },
    margin: { left: 20, right: 20 }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // 5. Totals
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  
  const totalX = pageWidth - 20;
  doc.text('Subtotal:', totalX - 50, finalY);
  doc.text(`INR ${data.totalPrice.toFixed(2)}`, totalX, finalY, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Shipping:', totalX - 50, finalY + 7);
  doc.text('Complimentary', totalX, finalY + 7, { align: 'right' });

  doc.setDrawColor(28, 28, 28);
  doc.setLineWidth(0.5);
  doc.line(totalX - 60, finalY + 12, totalX, finalY + 12);

  doc.setFontSize(14);
  doc.setFont('times', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Total:', totalX - 50, finalY + 22);
  doc.text(`INR ${data.totalPrice.toFixed(2)}`, totalX, finalY + 22, { align: 'right' });

  // 6. Payment Method & Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(`Payment Method: ${data.paymentMethod}`, 20, finalY + 40);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for choosing DigiMart for your premium essentials.', pageWidth / 2, pageWidth > 250 ? 280 : 285, { align: 'center' });

  // Save the PDF
  doc.save(`Invoice_DigiMart_${data.orderId.toUpperCase()}.pdf`);
};

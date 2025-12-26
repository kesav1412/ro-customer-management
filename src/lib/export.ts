import { Customer, Service } from './supabase';
import { format, addMonths } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportToCSV(customers: Customer[]) {
  const headers = [
    'Name',
    'Phone 1',
    'Phone 2',
    'Street',
    'City',
    'Pincode',
    'Purchase Date',
    'Installation Date',
    'Next Service Date',
    'RO Model',
  ];

  const rows = customers.map(customer => {
    const nextService = addMonths(new Date(customer.installation_date), 3);
    return [
      customer.name,
      customer.phone1,
      customer.phone2 || '',
      customer.street,
      customer.city,
      customer.pincode,
      format(new Date(customer.purchase_date), 'dd/MM/yyyy'),
      format(new Date(customer.installation_date), 'dd/MM/yyyy'),
      format(nextService, 'dd/MM/yyyy'),
      customer.ro_model,
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `john-aqua-customers-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(customers: Customer[]) {
  const headers = [
    'Name',
    'Phone 1',
    'Phone 2',
    'Street',
    'City',
    'Pincode',
    'Purchase Date',
    'Installation Date',
    'Next Service Date',
    'RO Model',
  ];

  const rows = customers.map(customer => {
    const nextService = addMonths(new Date(customer.installation_date), 3);
    return [
      customer.name,
      customer.phone1,
      customer.phone2 || '',
      customer.street,
      customer.city,
      customer.pincode,
      format(new Date(customer.purchase_date), 'dd/MM/yyyy'),
      format(new Date(customer.installation_date), 'dd/MM/yyyy'),
      format(nextService, 'dd/MM/yyyy'),
      customer.ro_model,
    ];
  });

  const htmlTable = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #ea580c; color: white; font-weight: bold; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `john-aqua-customers-${format(new Date(), 'yyyy-MM-dd')}.xls`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Service Export Functions
export function exportServicesToCSV(services: Service[]) {
  const headers = [
    'Customer Name',
    'Phone',
    'Street',
    'City',
    'Service Date',
    'Service Type',
    'Status',
    'Technician',
    'Notes',
  ];

  const rows = services.map(service => [
    service.customer_name,
    service.customer_phone,
    service.customer_street,
    service.customer_city,
    format(new Date(service.service_date), 'dd/MM/yyyy'),
    service.service_type.replace('_', ' '),
    service.status.replace('_', ' '),
    service.technician || '',
    service.notes || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `john-aqua-services-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportServicesToExcel(services: Service[]) {
  const headers = [
    'Customer Name',
    'Phone',
    'Street',
    'City',
    'Service Date',
    'Service Type',
    'Status',
    'Technician',
    'Notes',
  ];

  const rows = services.map(service => [
    service.customer_name,
    service.customer_phone,
    service.customer_street,
    service.customer_city,
    format(new Date(service.service_date), 'dd/MM/yyyy'),
    service.service_type.replace('_', ' '),
    service.status.replace('_', ' '),
    service.technician || '',
    service.notes || '',
  ]);

  const htmlTable = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #ea580c; color: white; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>John Aqua Cure System - Services Report</h2>
        <p>Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `john-aqua-services-${format(new Date(), 'yyyy-MM-dd')}.xls`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// PDF Export Functions
export function exportToPDF(customers: Customer[]) {
  const doc = new jsPDF('landscape');
  
  // Add title
  doc.setFontSize(18);
  doc.setTextColor(234, 88, 12); // Orange color
  doc.text('John Aqua Cure System - Customers Report', 14, 20);
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 28);
  
  // Prepare table data
  const headers = [
    ['Name', 'Phone 1', 'Phone 2', 'Street', 'City', 'Pincode', 'Purchase Date', 'Installation Date', 'Next Service', 'RO Model']
  ];
  
  const rows = customers.map(customer => {
    const nextService = addMonths(new Date(customer.installation_date), 3);
    return [
      customer.name,
      customer.phone1,
      customer.phone2 || '-',
      customer.street,
      customer.city,
      customer.pincode,
      format(new Date(customer.purchase_date), 'dd/MM/yyyy'),
      format(new Date(customer.installation_date), 'dd/MM/yyyy'),
      format(nextService, 'dd/MM/yyyy'),
      customer.ro_model,
    ];
  });
  
  // Add table
  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 35,
    theme: 'striped',
    headStyles: {
      fillColor: [234, 88, 12], // Orange color
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 20 },
      6: { cellWidth: 25 },
      7: { cellWidth: 25 },
      8: { cellWidth: 25 },
      9: { cellWidth: 25 },
    },
  });
  
  // Save PDF
  doc.save(`john-aqua-customers-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

export function exportServicesToPDF(services: Service[]) {
  const doc = new jsPDF('landscape');
  
  // Add title
  doc.setFontSize(18);
  doc.setTextColor(234, 88, 12); // Orange color
  doc.text('John Aqua Cure System - Services Report', 14, 20);
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 28);
  
  // Prepare table data
  const headers = [
    ['Customer Name', 'Phone', 'Street', 'City', 'Service Date', 'Service Type', 'Status', 'Technician', 'Notes']
  ];
  
  const rows = services.map(service => [
    service.customer_name,
    service.customer_phone,
    service.customer_street,
    service.customer_city,
    format(new Date(service.service_date), 'dd/MM/yyyy'),
    service.service_type.replace('_', ' ').toUpperCase(),
    service.status.replace('_', ' ').toUpperCase(),
    service.technician || '-',
    service.notes || '-',
  ]);
  
  // Add table
  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 35,
    theme: 'striped',
    headStyles: {
      fillColor: [234, 88, 12], // Orange color
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 },
      6: { cellWidth: 22 },
      7: { cellWidth: 25 },
      8: { cellWidth: 40 },
    },
  });
  
  // Save PDF
  doc.save(`john-aqua-services-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

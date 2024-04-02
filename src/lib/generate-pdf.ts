import { DriverIButton, Vehicle } from "@prisma/client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { dateFormat } from "./utils";

interface VehicleProps extends Vehicle {
  fleet: {
    name: string;
  };
}

interface DriverIButtonProps extends DriverIButton {
  driver: {
    name: string;
  };
  ibutton: {
    number: string;
    code: string;
  };
}

export const vehicleReport = (data: VehicleProps[]) => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.text(`Relatório de veículos monitorados - STAR SEG`, 15, 10);

  const headers = [
    "Frota",
    "Modelo",
    "Placa",
    "Código",
    "Renavam",
    "Chassis",
    "Ano",
    "Data de instalação",
    "Status",
  ];

  const tableData = data.map((row) => [
    row.fleet.name,
    row.model,
    row.licensePlate,
    row.code,
    row.renavam,
    row.chassis,
    row.year,
    dateFormat(row.installationDate),
    row.status === "ACTIVE" ? "Ativo" : "Inativo",
  ]);

  // Transforme os dados em objetos
  const tableRows = tableData.map((row) => {
    const obj: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });

  doc.setFontSize(12);

  const columnWidths = [40, 40, 30, 30, 40, 30];
  autoTable(doc, {
    body: tableRows,
    columns: headers.map((header, index) => ({
      header,
      dataKey: header,
      width: columnWidths[index],
    })),
    margin: { top: 25 },
    startY: 25,
    theme: "striped", // Pode ajustar conforme preferir
  });

  // Insira a tabela no documento PDF
  // doc.table(10, 30, tableRows, headers, { autoSize: true });

  doc.save(`Relatório_de_veículos_-_Star_Seg.pdf`);
};

export const driversIButtonsReport = (data: DriverIButtonProps[]) => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.text(`Relatório de veículos monitorados - STAR SEG`, 15, 10);

  const headers = [
    "IButton",
    "Motorista",
    "Vinculação",
    "Observação",
    "Status",
  ];

  const tableData = data.map((row) => {
    const ibutton = `${row.ibutton.code} - ${row.ibutton.number}`;
    return [
      ibutton,
      row.driver.name,
      dateFormat(row.startDate),
      row.comments,
      row.status === "ACTIVE" ? "Ativo" : "Inativo",
    ];
  });

  // Transforme os dados em objetos
  const tableRows = tableData.map((row) => {
    const obj: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });

  doc.setFontSize(12);

  const columnWidths = [40, 40, 30, 30, 40, 30];
  autoTable(doc, {
    body: tableRows,
    columns: headers.map((header, index) => ({
      header,
      dataKey: header,
      width: columnWidths[index],
    })),
    margin: { top: 25 },
    startY: 25,
    theme: "striped", // Pode ajustar conforme preferir
  });

  // Insira a tabela no documento PDF
  // doc.table(10, 30, tableRows, headers, { autoSize: true });

  doc.save(`Relatório_Motoristas-IButtons_-_Star_Seg.pdf`);
};

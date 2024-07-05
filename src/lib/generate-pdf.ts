import { DriverIButton, Vehicle, Driver, VehicleTracker } from "@prisma/client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { dateFormat } from "./utils";
import { subDays } from "date-fns";

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

interface DriverProps extends Driver {
  fleet: {
    name: string;
  };
}

interface VehicleTrackerProps extends VehicleTracker {
  vehicle: {
    licensePlate: string;
    code: string;
    fleet: {
      fleetId: number;
      name: string;
      color: string;
    };
  };
  tracker: {
    number: string;
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

export const driversIButtonsReport = (
  data: DriverIButtonProps[],
  active: boolean,
  lastMonthOnly: boolean
) => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.text(`Relatório de motoristas + IButtons - STAR SEG`, 15, 10);

  const headers = [
    "IButton",
    "Motorista",
    "Vinculação",
    "Observação",
    "Status",
  ];

  const oneMonthAgo = subDays(new Date(), 30);

  const tableData = data
    .filter((row) => {
      const startDate = new Date(row.startDate);

      if (active && row.status === "INACTIVE") return false;
      if (lastMonthOnly && startDate < oneMonthAgo) return false;

      return true;
    })
    .map((row) => {
      const ibutton = `${row.ibutton.code} - ${row.ibutton.number}`;
      return [
        ibutton,
        row.driver.name,
        dateFormat(row.startDate),
        row.comments ? row.comments : "Nenhuma",
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

export const driversReport = (data: DriverProps[]) => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.text(`Relatório de motoristas - STAR SEG`, 15, 10);

  const headers = ["Frota", "Nome", "CPF", "CNH", "Observação", "Status"];

  const tableData = data.map((row) => {
    return [
      row.fleet.name,
      row.name,
      row.cpf,
      row.cnh,
      row.comments ? row.comments : "Nenhuma",
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

  doc.save(`Relatório_Motoristas_-_Star_Seg.pdf`);
};

export const vehiclesTrackersReport = (
  data: VehicleTrackerProps[],
  active: boolean,
  lastMonthOnly: boolean
) => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.text(`Relatório de veículos e rastreadores - STAR SEG`, 15, 10);

  const headers = [
    "Rastreador",
    "Veículo",
    "Vinculação",
    "Observação",
    "Status",
  ];

  const oneMonthAgo = subDays(new Date(), 30);

  const tableData = data
    .filter((row) => {
      const startDate = new Date(row.startDate);

      if (active && row.status === "INACTIVE") return false;
      if (lastMonthOnly && startDate < oneMonthAgo) return false;

      return true;
    })
    .map((row) => {
      return [
        row.tracker.number,
        row.vehicle.licensePlate +
          " - " +
          row.vehicle.code +
          "\n" +
          row.vehicle.fleet.name,
        dateFormat(row.startDate),
        row.comments ? row.comments : "Nenhuma",
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

  doc.save(`Relatório_Veículos-Rastreadores_-_Star_Seg.pdf`);
};

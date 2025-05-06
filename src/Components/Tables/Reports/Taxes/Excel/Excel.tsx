import * as XLSX from "xlsx";

import style from "./Excel.module.css";
import exportSvg from "../../../../../assets/svg/export.svg";

interface Props {
  taxes: any;
}

export default function Excel({ taxes }: Props) {
  const handleExport = () => {
    if (!taxes || !taxes.months) return;

    // Crear una hoja de cálculo a partir de los datos
    const worksheet = XLSX.utils.json_to_sheet(taxes.months);

    // Crear un libro de trabajo y agregar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Months");

    // Exportar el archivo Excel
    XLSX.writeFile(workbook, "Taxes_Report.xlsx");
  };

  return (
    <button
      className={`btn btn-primary ${style.export}`}
      onClick={handleExport}
    >
      <img src={exportSvg} alt="export" />
      <span>Export</span>
    </button>
  );
}

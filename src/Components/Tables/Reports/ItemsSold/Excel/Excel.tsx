import { ExportSales } from "../../../../../interfaces/interfaces";
import * as XLSX from "xlsx";

import style from "./Excel.module.css";
import exportSvg from "../../../../../assets/svg/export.svg";

interface Props {
  sales: ExportSales[];
}

export default function Excel({ sales }: Props) {
  const exportToExcel = () => {
    if (sales.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(sales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items Sold");

    XLSX.writeFile(workbook, "Items_sold_report.xlsx");
  };

  return (
    <button
      className={`btn btn-primary ${style.export}`}
      onClick={exportToExcel}
    >
      <img src={exportSvg} alt="export" />
      <span>Export</span>
    </button>
  );
}

import * as XLSX from "xlsx";

import style from "./Excel.module.css";
import exportSvg from "../../../../../assets/svg/export.svg";

interface Props {
  expired: any;
}

export default function Excel({ expired }: Props) {
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(expired);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items Expired");

    // Configurar el nombre del archivo
    XLSX.writeFile(workbook, "Items_expired_report.xlsx");
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

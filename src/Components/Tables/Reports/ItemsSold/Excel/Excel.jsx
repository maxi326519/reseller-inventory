import ReactExport from "react-export-excel";

import style from "./Excel.module.css";
import exportSvg from "../../../../../assets/svg/export.svg";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function Excel({ sales }) {

  const columns = sales.length !== 0
    ? Object.keys(sales[0]).map((key) => ({
        label: key,
        value: key,
      }))
    : [];

  return (
    <ExcelFile
      element={
        <button className={`btn btn-primary ${style.export}`}>
          <img src={exportSvg} alt="export" />
          <span>Export</span>
        </button>
      }
      filename="Items sold report"
    >
      <ExcelSheet data={sales} name="Employees">
        {columns.map((column, i ) => (
          <ExcelColumn key={i} label={column.label} value={column.value} />
        ))}
      </ExcelSheet>
    </ExcelFile>
  );
}
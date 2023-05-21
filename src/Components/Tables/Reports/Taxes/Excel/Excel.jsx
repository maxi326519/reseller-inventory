import ReactExport from "react-export-excel";

import style from "./Excel.module.css";
import exportSvg from "../../../../../assets/svg/export.svg";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const cellStyles = {
  fill: { fgColor: { rgb: "FFFFAA00" } },
  font: { color: { rgb: "FFFFAA00" }, italic: true },
};

export default function Excel({ taxes }) {
  /*   const totals = {
    sales: taxes.salesTotal,
    expenses: taxes.expensesTotal,
    profit: taxes.profitTotal,
  }; */

  const columns = taxes
    ? Object.keys(taxes.months[0]).map((key) => ({
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
    >
      {/*       <ExcelSheet data={[totals]} name="Totals">
        <ExcelColumn label="Total sales" value="sales" />
        <ExcelColumn label="Total Expenses" value="expenses" />
        <ExcelColumn label="Total profit" value="profit" />
      </ExcelSheet> */}

      <ExcelSheet data={taxes.months} name="Months">
        {columns.map((column) => (
          <ExcelColumn
            label={column.label}
            value={column.value}
            style={cellStyles}
          />
        ))}
      </ExcelSheet>
    </ExcelFile>
  );
}

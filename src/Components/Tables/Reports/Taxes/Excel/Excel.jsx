import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function Excel({ taxes }) {
  const data = [];

  return (
    <ExcelFile element={<button className="btn btn-primary">Exportar</button>}>
      <ExcelSheet data={data} name="Employees">
        <ExcelColumn label="Total Sales and Shipping" value="null" />
        <ExcelColumn label="Total Expenses" value="null" />
        <ExcelColumn label="Total Profit" value="null" />
      </ExcelSheet>
      <ExcelSheet data={data} name="Employees">
        <ExcelColumn label="Month" value="null" />
        <ExcelColumn label="Sales / Shipping" value="null" />
        <ExcelColumn label="Expenses" value="null" />
      </ExcelSheet>
    </ExcelFile>
  );
}

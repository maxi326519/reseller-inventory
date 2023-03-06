import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function Excel({ sales }) {
/* 
    const data = []; */

    return (
    <ExcelFile element={<button className="btn btn-primary">Exportar</button>}>
      <ExcelSheet data={sales} name="Employees">
        <ExcelColumn label="Item ID" value="id" />
        <ExcelColumn label="Unit Cost" value="cost" />
        <ExcelColumn label="Description" value="description" />
      </ExcelSheet>
    </ExcelFile>
  );
}

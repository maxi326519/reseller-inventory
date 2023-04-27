import ReactExport from "react-export-excel";

import style from "./Excel.module.css";
import exportSvg from "../../../../../assets/svg/export.svg";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function Excel({ sales }) {
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
        <ExcelColumn label="Invoice ID" value="invoiceId" />
        <ExcelColumn label="Item ID" value="itemId" />
        <ExcelColumn label="Date" value="date" />
        <ExcelColumn label="Unit Cost" value="unitCost" />
        <ExcelColumn label="Price" value="price" />
        <ExcelColumn label="Shipment Income" value="shipmentIncome" />
        <ExcelColumn label="Description" value="description" />
      </ExcelSheet>
    </ExcelFile>
  );
}

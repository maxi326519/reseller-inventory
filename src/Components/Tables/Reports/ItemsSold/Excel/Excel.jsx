import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function Excel({ sales }) {

    return (
    <ExcelFile element={<button className="btn btn-primary">Exportar</button>}>
      <ExcelSheet data={sales} name="Employees">
        <ExcelColumn label="Invoice ID" value="invoiceId" />
        <ExcelColumn label="Item ID" value="id" />
        <ExcelColumn label="Date" value="date" />
        <ExcelColumn label="Description" value="description" />
        <ExcelColumn label="Unit Cost" value="cost" />
      </ExcelSheet>
    </ExcelFile>
  );
}

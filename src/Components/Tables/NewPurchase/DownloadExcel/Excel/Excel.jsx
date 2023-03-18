import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function Excel({ data, handleClose}) {

    return (
    <ExcelFile element={<button className="btn btn-primary" onClick={handleClose}>Yes, export</button>}>
      <ExcelSheet data={data} name="Employees">
        <ExcelColumn label="ID" value="id" />
        <ExcelColumn label="Description" value="description" />
      </ExcelSheet>
    </ExcelFile>
  );
}

import * as XLSX from "xlsx";

interface Props {
  data: any;
  onClose: () => void;
}

export default function Excel({ data, onClose }: Props) {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    // Generar archivo Excel
    XLSX.writeFile(workbook, "Employees.xlsx");
    onClose();
  };

  return (
    <button className="btn btn-primary" onClick={exportToExcel}>
      Yes, export
    </button>
  );
}

import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function Excel({ taxes }) {

  const totals = {
    sales: taxes.salesTotal,
    expenses: taxes.expensesTotal,
    profit: taxes.profitTotal,
  };

  return (
    <ExcelFile element={<button className="btn btn-primary" filename="Taxes report">Exportar</button>}>
{/*       <ExcelSheet data={[totals]} name="Totals">
        <ExcelColumn label="Total sales" value="sales" />
        <ExcelColumn label="Total Expenses" value="expenses" />
        <ExcelColumn label="Total profit" value="profit" />
      </ExcelSheet> */}

      <ExcelSheet data={taxes.months} name="Months">
        <ExcelColumn label="Month" value="month" />
        <ExcelColumn label="Sales" value="sales" />
        <ExcelColumn label="Shipment" value="shipment" />
        <ExcelColumn label="Total Sales" value="salesTotal" />
        <ExcelColumn label="COGS" value="COGS" />
        <ExcelColumn label="Ship Label" value="shipLabel" />
        <ExcelColumn label="Ebay Fees" value="ebayFees" />
        <ExcelColumn label="Ads Fee" value="adsFee" />
        <ExcelColumn label="Other Expense" value="otherExpense" />
        <ExcelColumn label="Total Expenses" value="expensesTotal" />
      </ExcelSheet>
    </ExcelFile>
  );
}

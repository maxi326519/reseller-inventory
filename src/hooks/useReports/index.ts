import { ItemReport, YearReport, ItemType, initYearReport } from "./Interfaces";
import { Expense, RootState, Sale } from "../../interfaces/interfaces";
import { collection, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { postReports } from "../../redux/actions/reports";

export default function useReports() {
  const dispatch = useDispatch();
  const list = useSelector((state: RootState) => state.reports);

  async function updateReports() {
    const sales: Sale[] = [];
    const expenses: Expense[] = [];
    let newReports: YearReport[] = [];

    // Data ref
    const userColl = collection(db, `Users`);
    const userDoc = doc(userColl, auth.currentUser!.uid);
    const expenseColl = collection(userDoc, "Expenses");
    const salesColl = collection(userDoc, "Sales");

    // Get expenses
    (await getDocs(expenseColl)).forEach((doc) =>
      expenses.push(doc.data() as Expense)
    );

    // Get Sales
    (await getDocs(salesColl)).forEach((doc) => sales.push(doc.data() as Sale));

    // Convert data
    const saleItems: ItemReport[] = [];
    sales.forEach((sale) => saleToItem(sale).forEach(data => saleItems.push(data)));

    const expenseItems: ItemReport[] = expenses.map((expense) =>
      expenseToItem(expense)
    );

    // Set items
    newReports = setItems(newReports, saleItems, "SALE");
    newReports = setItems(newReports, expenseItems, "EXPENSE");

    // POST new reports
    await dispatch<any>(postReports(newReports));

    // Return report
    return newReports;
  }

  function setItems(
    report: YearReport[],
    items: ItemReport[],
    type: "SALE" | "EXPENSE"
  ): YearReport[] {
    const newReport = [...report];

    // Save the expenses
    for (const item of items) {
      // Get dates
      const year: number = new Date(`${item.date} 00:00:00`).getFullYear();
      const month: number = new Date(`${item.date} 00:00:00`).getMonth() + 1;

      // Get year report
      let yearReport = newReport.find((report) => report.year === year);

      // if don't exist create new yer report
      if (!yearReport) {
        yearReport = initYearReport();
        yearReport.year = year;
        newReport.push(yearReport);
      }

      // Get month report
      let monthReport = yearReport.months[month];

      // Add item
      type === "SALE" && monthReport.sales.push(item);
      type === "EXPENSE" && monthReport.expenses.push(item);
    }

    return newReport;
  }

  function deleteItems(
    report: YearReport[],
    items: ItemReport[],
    type: "SALE" | "EXPENSE"
  ): YearReport[] {
    const newReport = [...report];

    for (const itemToDelete of items) {
      // Get dates
      const year: number = new Date(`${itemToDelete.date} 00:00:00`).getFullYear();
      const month: number = new Date(`${itemToDelete.date} 00:00:00`).getMonth() + 1;

      // Get year report
      let yearReport = newReport.find((report) => report.year === year);
      if (!yearReport)
        throw new Error(`Month report don't exist: ${itemToDelete.date}`); // Check if month report exist, else return error

      // Get monthReport
      let monthReport = yearReport.months[month];

      // Delete item with a filter
      const itemsFiltered =
        type === "SALE"
          ? monthReport.sales.filter((item) => item.id !== itemToDelete.id)
          : monthReport.expenses.filter((item) => item.id !== itemToDelete.id);

      // Save items filtered
      monthReport[`${type === "SALE" ? "sales" : "expenses"}`] = itemsFiltered;
    }

    return newReport;
  }

  function updateItems(
    report: YearReport[],
    newItem: ItemReport,
    type: "SALE" | "EXPENSE"
  ): YearReport[] {
    const newReport = [...report];

    // Get dates
    const year: number = new Date(newItem.date).getFullYear();
    const month: number = new Date(newItem.date).getMonth() + 1;

    // Get year report
    let yearReport = newReport.find((report) => report.year === year);
    if (!yearReport)
      throw new Error(`Month report don't exist: ${newItem.date}`); // Check if month report exist, else return error

    // Get monthReport
    let monthReport = yearReport.months[month];

    // Delete item with a filter
    const itemsFiltered =
      type === "SALE"
        ? monthReport.sales.map((item) =>
          item.id === newItem.id ? newItem : item
        )
        : monthReport.expenses.map((item) =>
          item.id === newItem.id ? newItem : item
        );

    // Save items filtered
    monthReport[`${type === "SALE" ? "sales" : "expenses"}`] = itemsFiltered;

    return newReport;
  }

  function saleToItem(data: Sale): ItemReport[] {
    // Create sale item
    let items = [{
      id: data.id,
      type: ItemType.sales,
      category: "Sale",
      date: data.date.toDate().toISOString().split("T")[0],
      price: Number(data.price),
    }];

    // Check if the sale have shipment and push
    if (data.shipment.value) {
      items.push({
        id: data.id,
        type: ItemType.sales,
        category: "Shipment",
        date: data.date.toDate().toISOString().split("T")[0],
        price: Number(data.shipment.amount),
      });
    }

    return items;
  }

  function expenseToItem(data: Expense): ItemReport {
    return {
      id: data.id,
      type: ItemType.expenses,
      category: data.category,
      date: data.date.toDate().toISOString().split("T")[0],
      price: Number(data.price),
    };
  }

  return { list, updateReports, setItems, updateItems, deleteItems };
}

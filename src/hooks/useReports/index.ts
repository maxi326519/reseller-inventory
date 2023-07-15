import { useState } from "react";
import { ItemReport, YearReport, ItemType, initYearReport } from "./Interfaces";
import { Expense, RootState, Sale } from "../../interfaces/interfaces";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useSelector } from "react-redux";

export default function useReports() {
  const list = useSelector((state: RootState) => state.reports);

  async function updateReports(reports: YearReport[]) {
    const sales: Sale[] = [];
    const expenses: Expense[] = [];
    let newReports: YearReport[] = [...reports];

    console.log("Actualizando");

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
    const saleItems: ItemReport[] = sales.map((sale) => saleToItem(sale));
    const expenseItems: ItemReport[] = expenses.map((expense) =>
      expenseToItem(expense)
    );

    // Set items
    newReports = setItems(newReports, saleItems, "SALE");
    newReports = setItems(newReports, expenseItems, "EXPENSE");

    // POST new reports
    const reportColl = collection(userDoc, "Reports");
    const reportDoc = doc(reportColl, newReports[0].year.toString());
    await setDoc(reportDoc, newReports[0]);

    console.log("Actualizado");

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
      const year: number = new Date(item.date).getFullYear();
      const month: number = new Date(item.date).getMonth() + 1;

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
      const year: number = new Date(itemToDelete.date).getFullYear();
      const month: number = new Date(itemToDelete.date).getMonth() + 1;

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

  function saleToItem(data: Sale): ItemReport {
    return {
      id: data.id,
      type: ItemType.sales,
      date: data.date.toDate().toISOString().split("T")[0],
      price: Number(data.price),
    };
  }

  function expenseToItem(data: Expense): ItemReport {
    return {
      id: data.id,
      type: ItemType.expenses,
      date: data.date.toDate().toISOString().split("T")[0],
      price: Number(data.price),
    };
  }

  return { list, updateReports, setItems, updateItems, deleteItems };
}

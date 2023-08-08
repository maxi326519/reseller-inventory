import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../interfaces/interfaces";
import { YearTaxesData, initYearTaxesData } from "./interfaces";

interface Totals {
  year: number;
  sales: number;
  expenses: number;
  profit: number;
}

export default function useTaxes() {
  const reports = useSelector((state: RootState) => state.reports);
  const [taxes, setTaxes] = useState<YearTaxesData[]>([]);
  const [totals, setTotals] = useState<Totals[]>([]);

  useEffect(() => {
    let totals: Totals[] = [];

    taxes.forEach((tax) => {
      // Create a new taxes data
      const currentTotals = {
        year: tax.year,
        sales: 0,
        expenses: 0,
        profit: 0,
      }

      // Calculate totals
      currentTotals.sales = tax.month.reduce((acumulator, month) => acumulator += month.sales.total, 0);
      currentTotals.expenses = tax.month.reduce((acumulator, month) => acumulator += month.expenses.total, 0);
      currentTotals.profit = currentTotals.sales - currentTotals.expenses;

      // Save totals
      totals.push(currentTotals)
    });

    setTotals(totals);

    console.log("Totals", totals);
  }, [taxes])

  function update() {
    // Create new taxes array
    let newTaxesReports: YearTaxesData[] = [];

    // Iterates the reports
    reports.forEach((report) => {
      let currentTaxes: YearTaxesData = initYearTaxesData(report.year);

      // Iterate month reports
      for (let i = 1; i <= 12; i++) {
        report.months[i].sales.forEach((sale) => {
          const taxesIndex = i - 1;

          // Check the category and add price to total
          if (sale.category === "Sale") {
            currentTaxes.month[taxesIndex].sales.sales += sale.price;
          } else if (sale.category === "Shipment") {
            currentTaxes.month[taxesIndex].sales.shipment += sale.price;
          }

          // Add price to total
          currentTaxes.month[taxesIndex].sales.total += sale.price;
        });

        // Iterate month expenses
        report.months[i].expenses.forEach((expense) => {
          const taxesIndex = i - 1;

          // Check the category and add price to total
          if (expense.category === "COGS") {
            currentTaxes.month[taxesIndex].expenses.COGS += expense.price;
          } else if (expense.category === "Ship Label") {
            currentTaxes.month[taxesIndex].expenses.shipLabel += expense.price;
          } else if (expense.category === "Ebay Fees") {
            currentTaxes.month[taxesIndex].expenses.ebayFees += expense.price;
          } else if (expense.category === "Ads Fee") {
            currentTaxes.month[taxesIndex].expenses.adsFee += expense.price;
          } else {
            currentTaxes.month[taxesIndex].expenses.otherExpenses += expense.price;

            // Check if the category already exist, else create them
            const name = expense.category;
            let category = currentTaxes.month[taxesIndex].expenses.otherCategories.find((category) => category.category === name);

            // If exist, add price
            if (category) {
              category.total += expense.price;
            } else {
              // Else create new category               
              currentTaxes.month[taxesIndex].expenses.otherCategories.push({
                category: expense.category,
                total: expense.price,
              });
            }
          }

          // Add price to total
          currentTaxes.month[taxesIndex].expenses.total += expense.price;
        });
      }

      console.log(currentTaxes);

      // Save new taxes report
      newTaxesReports.push(currentTaxes);
    });

    console.log("Taxes report:", newTaxesReports);

    // Saves th enew taxes reports data
    setTaxes(newTaxesReports);
  }

  return {
    list: taxes,
    totals,
    update
  };
}
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../interfaces/interfaces";
import { YearTaxesData, initYearTaxesData } from "./interfaces";

export default function useTaxes() {
  const reports = useSelector((state: RootState) => state.reports);
  const [taxes, setTaxes] = useState<YearTaxesData[]>([]);

  function toCamelCase(text: string): string {
    return text
      .replace(/[-_]+/g, " ")
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  };

  function update() {
    // Create new taxes array
    let newTaxesReports: YearTaxesData[] = [];

    // Iterates the reports
    reports.forEach((report) => {
      let currentTaxes: YearTaxesData = initYearTaxesData(report.year);

      // Iterate month reports
      for (let i = 1; i <= 12; i++) {
        report.months[i].sales.forEach((sale) => {

          // Check the category and add price to total
          if (sale.category === "Sale") {
            currentTaxes.month[i - 1].sales.sales += sale.price;
          } else if (sale.category === "Shipment") {
            currentTaxes.month[i - 1].sales.shipment += sale.price;
          }

          // Add price to total
          currentTaxes.month[i - 1].sales.total += sale.price;
        });

        // Iterate month expenses
        report.months[i].expenses.forEach((expense) => {

          // Check the category and add price to total
          if (expense.category === "COGS") {
            currentTaxes.month[i - 1].expenses.COGS += expense.price;
          } else if (expense.category === "Ship Label") {
            currentTaxes.month[i - 1].expenses.shipLabel += expense.price;
          } else if (expense.category === "Ebay Fees") {
            currentTaxes.month[i - 1].expenses.ebayFees += expense.price;
          } else if (expense.category === "Ads Fee") {
            currentTaxes.month[i - 1].expenses.adsFee += expense.price;
          } else {
            currentTaxes.month[i - 1].expenses.otherExpenses += expense.price;

            // Check if the category already exist, else create them
            const name = toCamelCase(expense.category);
            let category = currentTaxes.month[i - 1].expenses.otherCategories.find((category) => category.category === name);

            // If exist, add price
            if (category) {
              category.total += expense.price;
            } else {
              // Else create new category               
              currentTaxes.month[i - 1].expenses.otherCategories.push({
                category: expense.category,
                total: expense.price,
              });
            }
          }

          // Add price to total
          currentTaxes.month[i - 1].expenses.total += expense.price;
        });
      }

      console.log(currentTaxes);

      // Save new taxes report
      newTaxesReports.push(currentTaxes);
    });

    console.log(newTaxesReports);

    // Saves th enew taxes reports data
    setTaxes(newTaxesReports);
  }

  return {
    list: taxes,
    update
  };
}
import { YearTaxesData } from "../hooks/useTaxes/interfaces";

export function convertToExportYearTaxesData(yearData: YearTaxesData)/*:  ExportYearTaxesData */ {
/*     // Obtener un conjunto de todas las categorías únicas
    const uniqueCategories = new Set<string>();
    yearData.month.forEach((monthData) => {
      monthData.expenses.otherCategories.forEach((category) => {
        uniqueCategories.add(category.category);
      });
    });
  
    const categoriesArray = Array.from(uniqueCategories); // Convertir el conjunto en un arreglo
  
    const months: ExportMonthTaxes[] = yearData.month.map((monthData) => {
      // Crear un objeto con todas las categorías y sus valores en 0
      const categories: Record<string, number> = {};
      categoriesArray.forEach((category) => {
        categories[category] = 0;
      });
  
      // Agregar los valores de las categorías en el mes actual
      monthData.expenses.otherCategories.forEach((category) => {
        categories[category.category] = category.total;
      });
  
      return {
        month: monthData.month.name,
        salesTotal: monthData.sales.total,
        sales: monthData.sales.sales,
        shipment: monthData.expenses.shipLabel,
        expensesTotal: monthData.expenses.total,
        COGS: monthData.expenses.COGS,
        shipLabel: monthData.expenses.shipLabel,
        ebayFees: monthData.expenses.ebayFees,
        adsFee: monthData.expenses.adsFee,
        otherExpense: monthData.expenses.otherExpense,
        otherCategories: categoriesArray.map((category) => ({
          category,
          total: categories[category],
        })),
      };
    });
  
    const salesTotal = yearData.month.reduce((acc, monthData) => acc + monthData.sales.total, 0);
    const expensesTotal = yearData.month.reduce((acc, monthData) => acc + monthData.expenses.total, 0);
    const profitTotal = salesTotal - expensesTotal;
  
    return {
      salesTotal,
      expensesTotal,
      profitTotal,
      months,
    }; */
  }
  
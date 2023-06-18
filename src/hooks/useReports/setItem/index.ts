import {
  ItemReport,
  YearReport,
  ItemType,
  initYearReport,
} from "../Interfaces";

export default function setItem(
  reports: YearReport[],
  items: ItemReport[],
  type: ItemType
): YearReport[] {
  const itemType = type === ItemType.sales ? "sales" : "expenses";

  let newReports = checkAndAddYears(reports, items);

  items.forEach((item) => {
    newReports.forEach((report) => {
      if (report.year === getYear(item)) {
        report.months[getMonth(item)][itemType].push(item);
      }
    });
  });
  return newReports;
}

function checkAndAddYears(
  reports: YearReport[],
  items: ItemReport[]
): YearReport[] {
  const newReports: YearReport[] = [...reports];
  items.forEach((item) => {
    if (
      !reports.some(
        (report) => report.year === new Date(item.date).getFullYear()
      )
    ) {
      newReports.push({
        ...initYearReport,
        year: new Date(item.date).getFullYear(),
      });
    }
  });
  return newReports;
}

function getYear(item: ItemReport): Number {
  return new Date(item.date).getFullYear();
}

function getMonth(
  items: ItemReport
): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 {
  const numberMonth = new Date(items.date).getMonth() + 1;
  return numberMonth as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

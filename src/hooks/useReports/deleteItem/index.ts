import { ItemReport, YearReport, ItemType } from "../Interfaces";

interface ItemDelete {
  id: number;
  date: string;
  type?: string;
}

export default function deleteItem(
  reports: YearReport[],
  items: ItemDelete[],
  type: ItemType
): YearReport[] {
  const itemType = type === ItemType.sales ? "sales" : "expenses";

  let newReports = [...reports];

  items.forEach((item) => {
    // Find year report and delete item
    newReports.forEach((report) => {
      // Compare years
      if (report.year === getYear(item)) {
        // Add item
        report.months[getMonth(item)][itemType] = report.months[getMonth(item)][
          itemType
        ].filter((listItem) => {
          if (listItem.id === item.id) {
            if (item.type) {
/*               if (item.type === listItem.type) {
                return false;
              } else return true; */
            } else return false;
          } else return true;
        });
      }
    });
  });
  return newReports;
}

function getYear(item: ItemDelete): Number {
  return new Date(item.date).getFullYear();
}

function getMonth(
  items: ItemDelete
): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 {
  const numberMonth = new Date(items.date).getMonth() + 1;
  return numberMonth as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

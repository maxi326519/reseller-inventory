import { useState } from "react";
import setItem from "./setItem";
import deleteItem from "./deleteItem";
import { ItemReport, YearReport, ItemType } from "./Interfaces";

/* export interface ReportsActions {
  reportsState: YearReport[];
  reportsActions: {
    setItems: (
      reports: YearReport[],
      items: ItemReport[],
      type: ItemType
    ) => YearReport[];
    delelteItems: (
      reports: YearReport[],
      items: ItemReport[],
      type: ItemType
    ) => YearReport[];
    setState: (state: YearReport[]) => void;
  };
} */

export default function useReports() {
  const [reportState, setReports] = useState<YearReport[]>([]);
  const reportActions = {
    setItems: (reports = reportState, items: ItemReport[], type: ItemType) =>
      setItem(reports, items, type),
    delelteItems: (
      reports = reportState,
      items: ItemReport[],
      type: ItemType
    ) => deleteItem(reports, items, type),
    setState: (state: YearReport[]) => setReports(state),

    /*     save: (reports = reportState) => saveData(reports), */
  };

  return {reportState, reportActions};
}

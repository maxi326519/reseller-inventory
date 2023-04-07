import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Timestamp } from "firebase/firestore";
import { Item, RootState, Sale, YearReport } from "../../../../interfaces";
import { getFirstAndLastDayOfMonth } from "../../../../functions/date";
import { closeLoading, loading } from "../../../../redux/actions/loading";
import { restoreItems } from "../../../../redux/actions/items";
import { postExpenses } from "../../../../redux/actions/expenses"
import { updateReports } from "../../../../redux/actions/reports"

import DataFilter from "./DateFilter/DateFilter";
import Table from "./Table/Table";
import Refound from "./Refound/Refound";

import Excel from "./Excel/Excel.jsx";
import styles from "./ItemsSold.module.css";
import swal from "sweetalert";

interface Dates {
  firstDay: string;
  lastDay: string;
}

const initialDates: Dates = getFirstAndLastDayOfMonth(new Date());

export default function ItemsSold() {
  const dispatch = useDispatch();
  const sales: Sale[] = useSelector((state: RootState) => state.sales);
  const items: Item[] = useSelector((state: RootState) => state.items);
  const reports: YearReport[] = useSelector(
    (state: RootState) => state.reports
  );
  const [itemsSold, setItemSold] = useState<any[]>([]);
  const [dates, setDates] = useState(initialDates);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [refound, setRefound] = useState(false);
  const [refoundSelected, setRefoundSelected] = useState<number>();

  useEffect(() => {
    const itemsSold = items.filter((s: Item) => s.state === "Sold")
    const newItemsList = itemsSold.map((item) => {
      const sale: Sale | undefined = sales.find((s) => s.id === item.id);
      return {
        ...item,
        ...sale,
      };
    });
    console.log(newItemsList);
    setItemSold(newItemsList);
  }, [items, sales, dates]);

  useEffect(() => {
    let total = 0;
    let totaltems = 0;
    itemsSold.forEach((item) => {
      total += Number(item.cost);
      totaltems++;
    });
    setTotal(total);
    setTotalItems(totaltems);
  }, [itemsSold]);

  function handleRefoundSelected(id: number) {
    setRefoundSelected(id);
  }

  // Refound
  function handleClose() {
    setRefound(!refound);
  }

  function handleRefound(amount: number) {
    if (refoundSelected === undefined) return false;
    const newExpense = [
      {
        id: refoundSelected,
        date: Timestamp.fromDate(new Date()),
        price: amount,
        category: "Refound",
        description: "Refound expense",
      },
    ];

    dispatch(loading());
    dispatch<any>(restoreItems(refoundSelected))
      .then(() => {
        dispatch<any>(postExpenses(newExpense))
          .then(() => {
            dispatch<any>(updateReports(newExpense, reports, null))
              .then(() => {
                swal("Refounded", "Refounded item successfully", "success");
                dispatch(closeLoading());
              })
              .catch((err: any) => {
                swal(
                  "Error",
                  "Error to update reports, try again later",
                  "error"
                );
                dispatch(closeLoading());
                console.log(err);
              });
          })
          .catch((err: any) => {
            swal("Error", "Error to refound item, try again later", "error");
            dispatch(closeLoading());
            console.log(err);
          });
      })
      .catch((err: any) => {
        swal("Error", "Error to refound item, try again later", "error");
        dispatch(closeLoading());
        console.log(err);
      });
  }

  function handleFilterPerDate(dateFilter: any) {
    const year = dateFilter.year.toString();
    let month = dateFilter.month === "00" ? null : dateFilter.month;

    console.log(year, month);

    /*     Promise.all(
          dispatch<any>(getExpenses(year, month))
        ) */
  }

  return (
    <div className={styles.itemsSold}>
      {refound ? (
        <Refound handleClose={handleClose} handleSubmit={handleRefound} />
      ) : null}
      <div className={styles.controls}>
        <DataFilter years={[2023]} handleFilterPerDate={handleFilterPerDate} />
        <Excel sales={itemsSold} />
        <span className={styles.total}>Total items: {totalItems}</span>
        <span className={styles.total}>
          Total cost: ${Number(total).toFixed(2)}
        </span>
        <span className={styles.total}>Order total: 0</span>
      </div>
      <Table
        items={itemsSold}
        sales={sales}
        handleClose={handleClose}
        handleRefoundSelected={handleRefoundSelected}
      />
    </div>
  );
}

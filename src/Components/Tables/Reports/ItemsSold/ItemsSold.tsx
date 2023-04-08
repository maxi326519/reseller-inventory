import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Timestamp } from "firebase/firestore";
import { Expense, Item, RootState, Sale, YearReport } from "../../../../interfaces";
import { getFirstAndLastDayOfMonth } from "../../../../functions/date";
import { closeLoading, loading } from "../../../../redux/actions/loading";
import { restoreItems } from "../../../../redux/actions/items";
import { postExpenses } from "../../../../redux/actions/expenses"
import { getSoldReportData, updateReports } from "../../../../redux/actions/reports"

import DataFilter from "./DateFilter/DateFilter";
import Table from "./Table/Table";
import Refound from "./Refound/Refound";

import Excel from "./Excel/Excel.jsx";
import styles from "./ItemsSold.module.css";
import swal from "sweetalert";
import Expenses from "./Expenses/Expenses";

interface Dates {
  firstDay: string;
  lastDay: string;
}

interface Rows {
  item: Item | undefined,
  sale: Sale,
}

const initialDates: Dates = getFirstAndLastDayOfMonth(new Date());

export default function ItemsSold() {
  const dispatch = useDispatch();
  const sales: Sale[] = useSelector((state: RootState) => state.sales.sales);
  const items: Item[] = useSelector((state: RootState) => state.sales.items);
  const expenses: Expense[] = useSelector((state: RootState) => state.sales.expenses);
  const [expenseSelected, setExpenseSelected] = useState<Expense[]>([]);
  const reports: YearReport[] = useSelector(
    (state: RootState) => state.reports
  );
  const [rows, setRows] = useState<Rows[]>([]);
  const [dates, setDates] = useState(initialDates);
  const [totalCost, setTotalCost] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [expensesDetails, setExpensesDetails] = useState(false);
  const [refound, setRefound] = useState(false);
  const [refoundSelected, setRefoundSelected] = useState<number>();

  useEffect(() => {
    const rows: Rows[] = sales.map((sale: Sale): Rows => ({
      item: items.find((i: Item) => i.id === sale.productId),
      sale
    }));
    
    let totalCost = 0;
    let orderTotal = 0;

    rows.map((row) => totalCost += Number(row.sale.cost));
    rows.map((row) => orderTotal += Number(row.sale.price));

    setTotalItems(rows.length);
    setTotalCost(totalCost);
    setOrderTotal(orderTotal);
    setRows(rows);
  }, [items, sales, dates]);

  function handleRefoundSelected(id: number) {
    setRefoundSelected(id);
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
        invoiceId: 0,
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

    dispatch(loading());
    dispatch<any>(getSoldReportData(year, month)).then(() => {
      dispatch(closeLoading());
    })
  }

  // Refound
  function handleClose() {
    setRefound(!refound);
  }

  function handleShowExpensesDetails(productId: number) {
    console.log(productId);
    const data: Expense[] = expenses.filter((e) => e.id === productId);
    console.log(expenses);
    console.log(data);
    setExpenseSelected(data);
    handleCloseDetails();
  }

  function handleCloseDetails() {
    setExpensesDetails(!expensesDetails);
  }
  return (
    <div className={styles.itemsSold}>
      {refound ? (
        <Refound handleClose={handleClose} handleSubmit={handleRefound} />
      ) : null}
      {expensesDetails ? (<Expenses expenses={expenseSelected} handleClose={handleCloseDetails} />) : null}
      <div className={styles.controls}>
        <DataFilter years={[2023]} handleFilterPerDate={handleFilterPerDate} />
        {/*         <Excel sales={itemsSold} /> */}
        <span className={styles.total}>
          Total items: {totalItems}
        </span>
        <span className={styles.total}>
          Total cost: ${Number(totalCost).toFixed(2)}
        </span>
        <span className={styles.total}>
          Order total: ${Number(orderTotal).toFixed(2)}
          </span>
      </div>
      <Table
        rows={rows}
        handleClose={handleClose}
        handleRefoundSelected={handleRefoundSelected}
        handleShowExpensesDetails={handleShowExpensesDetails}
      />
    </div>
  );
}

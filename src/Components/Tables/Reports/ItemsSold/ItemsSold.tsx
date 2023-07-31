import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Timestamp } from "firebase/firestore";
import { deleteSale, getSales } from "../../../../redux/actions/sales";
import { closeLoading, loading } from "../../../../redux/actions/loading";
import { YearReport } from "../../../../hooks/useReports/Interfaces";
import {
  Expense,
  ExportSales,
  InvoiceType,
  Item,
  Refounded,
  RootState,
  Sale,
} from "../../../../interfaces/interfaces";
import {
  deleteInvoiceDetails,
  getItemsFromInvoice,
  refoundItems,
} from "../../../../redux/actions/items";
import changeDateFormat from "../../../../functions/changeDateFormat";
import swal from "sweetalert";

import DateFilter from "./DateFilter/DateFilter";
import Table from "./Table/Table";
import Refound from "./Refound/Refound";
import Excel from "./Excel/Excel.jsx";
import Expenses from "./Expenses/Expenses";
import Details from "../../Invoices/Details/Details";

import styles from "./ItemsSold.module.css";

interface Rows {
  item: Item | undefined;
  sale: Sale;
}

interface Props {
  typeReport: any;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function ItemsSold({ typeReport, handleChange }: Props) {
  const dispatch = useDispatch();
  const sales: Sale[] = useSelector((state: RootState) => state.sales.sales);
  const items: Item[] = useSelector((state: RootState) => state.sales.items);
  const expenses: Expense[] = useSelector(
    (state: RootState) => state.sales.expenses
  );
  const [expenseSelected, setExpenseSelected] = useState<Expense[]>([]);
  const reports: YearReport[] = useSelector(
    (state: RootState) => state.reports
  );
  const invoiceDetail = useSelector((state: RootState) => state.items.details);
  const [expensesDetails, setExpensesDetails] = useState(false);
  const [refound, setRefound] = useState(false);
  const [refoundSelected, setRefoundSelected] = useState<{
    item: Item | null;
    saleId: number;
  }>({ item: null, saleId: 0 });
  const [years, setYears] = useState<number[]>([]);
  const [dateFilter, setDateFilter] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const [rows, setRows] = useState<Rows[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [shipmentTotal, setShipmentTotal] = useState(0);
  const [exports, setExports] = useState<ExportSales[]>([]);
  const [details, setDetails] = useState<boolean>(false);

  useEffect(() => {
    const rows: Rows[] = sales.map(
      (sale: Sale): Rows => ({
        item: items.find((i: Item) => i.id === sale.productId),
        sale,
      })
    );

    let totalCost = 0;
    let orderTotal = 0;
    let shipmentTotal = 0;

    rows.forEach((row) => {
      totalCost += Number(row.sale.cost);
      orderTotal += Number(row.sale.price);
      shipmentTotal += Number(row.sale.shipment.amount);
    });

    setTotalItems(rows.length);
    setTotalCost(totalCost);
    setOrderTotal(orderTotal);
    setShipmentTotal(shipmentTotal);
    setRows(
      rows
        .filter((row) => row.item)
        .sort((a, b) => b.sale.date.toMillis() - a.sale.date.toMillis())
    );
  }, [items, sales]);

  useEffect(() => {
    setYears(reports.map((r) => Number(r.year)));
  }, [reports]);

  useEffect(() => {
    let categories: any = {};

    // Traer las expensas
    const year = dateFilter.year.toString();
    let month =
      dateFilter.month.toString() === "00" ? null : dateFilter.month.toString();

    // Extraer las categorias
    expenses.forEach((expense) => {
      categories[expense.category] = 0;
    });

    // Traer las expensas
    const data = rows.map(({ item, sale }) => {
      const data: any = {
        invoiceId: item?.invoiceId || 0,
        itemId: item?.id || 0,
        date: changeDateFormat(sale.date.toDate().toISOString().split("T")[0]),
        unitCost: item ? Number(item.cost) : 0, // El signo + convierte un string a un número
        price: Number(sale.price),
        shipmentIncome: Number(sale.shipment.amount),
        description: item?.description || "",
        ...categories,
      };

      // Cargar los datos de las expensas
      const itemsExpenses = expenses.filter(
        (expense) => expense.id === item?.id
      );

      itemsExpenses.forEach(
        (expense) => (data[expense.category] = expense.price)
      );
      return data;
    });
    setExports(data);
  }, [rows]);


  function handleFilterPerDate(dateFilter: any) {
    if (dateFilter.year !== 0) {
      const year = dateFilter.year.toString();
      let month =
        dateFilter.month.toString() === "00"
          ? null
          : dateFilter.month.toString();

      dispatch(loading());
      dispatch<any>(getSales(year, month)).then(() => {
        dispatch(closeLoading());
      });
    }
  }

  function handleRefoundSelected(item: Item, saleId: number) {
    setRefoundSelected({ item, saleId });
  }

  function handleRefound(data: Refounded) {
    if (refoundSelected === undefined) return false;
    const newExpenses: Expense[] = [
      {
        id: refoundSelected.saleId,
        date: Timestamp.fromDate(new Date()),
        price: data.amount,
        category: "Refound",
        description: "Refound expense",
        invoiceId: refoundSelected.item?.invoiceId!,
        productId: refoundSelected.item?.id!,
      },
    ];

    dispatch(loading());
    dispatch<any>(
      refoundItems(
        refoundSelected.item!,
        refoundSelected.saleId,
        data,
        newExpenses
      )
    )
      .then(() => {
        swal("Refounded", "Refounded item successfully", "success");
        dispatch(closeLoading());
      })
      .catch((err: any) => {
        swal("Error", "Error to refound item, try again later", "error");
        dispatch(closeLoading());
        console.log(err);
      });
  }

  function handleDeleteSale(sale: Sale) {
    swal({
      title: "Atention!",
      text: "Are you sure are you want to delete this sale? \n This action is irreversible",
      icon: "warning",
      buttons: {
        Accept: true,
        Cancel: true,
      },
    }).then((response) => {
      if (response === "Accept") {
        dispatch(loading());
        dispatch<any>(deleteSale(sale))
          .then(() => {
            dispatch(closeLoading());
            swal("Deleted", "Sold deleted successfully", "success");
          })
          .catch((err: any) => {
            swal(
              "Error",
              "Error to delete this sale, try again later",
              "error"
            );
            dispatch(closeLoading());
            console.log(err);
          });
      }
    });
  }

  function handleClose() {
    setRefound(!refound);
  }

  function handleShowExpensesDetails(productId: number) {
    const data: Expense[] = expenses.filter((e) => e.productId === productId);
    setExpenseSelected(data);
    handleCloseDetails();
  }

  function handleCloseDetails() {
    setExpensesDetails(!expensesDetails);
  }

  function handleInvoiceDetail(invoiceId?: number) {
    setDetails(!details);
    if (details) {
      dispatch<any>(deleteInvoiceDetails());
    } else if (invoiceId) {
      dispatch<any>(getItemsFromInvoice(invoiceId));
    }
  }

  return (
    <div className={styles.itemsSold}>
      {refound ? (
        <Refound handleClose={handleClose} handleSubmit={handleRefound} />
      ) : null}
      {expensesDetails ? (
        <Expenses expenses={expenseSelected} handleClose={handleCloseDetails} />
      ) : null}
      {details ? (
        <Details
          handleClose={handleInvoiceDetail}
          invoiceType={InvoiceType.Purchase}
          invoiceId={invoiceDetail.invoice.id}
          itemsList={invoiceDetail.items}
          image={invoiceDetail.invoice.image}
        />
      ) : null}
      <div className={styles.controls}>
        <div className="form-floating">
          <select
            className="form-select"
            id="filter"
            defaultValue={typeReport}
            onChange={handleChange}
          >
            <option value="1">Items Sold</option>
            <option value="2">Items Expired</option>
            <option value="3">Taxes</option>
          </select>
          <label className="form-label" htmlFor="filter">
            Filter by:
          </label>
        </div>
        <DateFilter years={years} handleFilterPerDate={handleFilterPerDate} />
        <Excel sales={exports} />
        <div>
          <span className={styles.total}>Total items: {totalItems}</span>
          <span className={styles.total}>
            Total inventory cost: ${Number(totalCost).toFixed(2)}
          </span>
          <span className={styles.total}>
            Total order income: ${Number(orderTotal).toFixed(2)}
          </span>
          <span className={styles.total}>
            Shipment income: ${Number(shipmentTotal).toFixed(2)}
          </span>
        </div>
      </div>
      <Table
        rows={rows}
        handleClose={handleClose}
        handleRefoundSelected={handleRefoundSelected}
        handleDeleteSale={handleDeleteSale}
        handleShowExpensesDetails={handleShowExpensesDetails}
        handleInvoiceDetail={handleInvoiceDetail}
      />
    </div>
  );
}

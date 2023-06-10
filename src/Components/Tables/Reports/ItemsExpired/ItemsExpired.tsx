import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ExportExpired,
  InvoiceType,
  Item,
  RootState,
  YearReport,
} from "../../../../interfaces";
import { closeLoading, loading } from "../../../../redux/actions/loading";

import Table from "./Table/Table";

import styles from "./ItemsExpired.module.css";
import swal from "sweetalert";
import DateFilter from "./DateFilter/DateFilter";
import { updateReportsItems } from "../../../../redux/actions/reports";
import {
  deleteInvoiceDetails,
  getExpired,
  getItemsFromInvoice,
  restoreItem,
} from "../../../../redux/actions/items";
import Excel from "./Excel/Excel";
import changeDateFormat from "../../../../functions/changeDateFormat";
import Details from "../../Invoices/Details/Details";

interface Props {
  typeReport: any;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function ItemsExpired({ typeReport, handleChange }: Props) {
  const dispatch = useDispatch();
  const items: Item[] = useSelector((state: RootState) => state.expired);
  const reports: YearReport[] = useSelector(
    (state: RootState) => state.reports
  );
  const invoiceDetail = useSelector((state: RootState) => state.items.details);
  const [exports, setExports] = useState<ExportExpired[]>();
  const [total, setTotal] = useState(0);
  const [years, setYears] = useState<number[]>([]);
  const [rows, setRows] = useState<Item[]>([]);
  const [details, setDetails] = useState<boolean>(false);

  useEffect(() => {
    setRows(
      items.sort((a, b) => b.expired!.toMillis()! - a.expired!.toMillis())
    );
  }, [items]);

  useEffect(() => {
    setYears(reports.map((r) => Number(r.year)));
  }, [reports]);

  useEffect(() => {
    let total = 0;
    rows.forEach((item) => (total += Number(item.cost)));
    setTotal(total);
  }, [rows]);

  useEffect(() => {
    const data = rows.map((item) => {
      const data: ExportExpired = {
        id: item.id,
        invoiceId: item.invoiceId,
        date: item.expired
          ? changeDateFormat(item.expired?.toDate().toISOString().split("T")[0])
          : "",
        unitCost: Number(item.cost),
        description: item.description,
      };
      return data;
    });
    setExports(data);
  }, [rows]);

  function handleRestore(id: number) {
    swal({
      title: "Warning",
      text: `Do you want to restore this item?`,
      icon: "warning",
      buttons: { confirm: true, cancel: true },
    }).then((response) => {
      if (response) {
        dispatch<any>(loading());
        dispatch<any>(restoreItem(id))
          .then(() => {
            dispatch(closeLoading());
            dispatch<any>(updateReportsItems([id], ["Expired"], reports))
              .then(() => {
                dispatch(closeLoading());
                swal("Restored", "Item restores successfully", "success");
              })
              .catch((e: any) => {
                swal(
                  "Error",
                  "Error trying to update reports, try again leter",
                  "error"
                );
                console.log(e);
              });
          })
          .catch((e: any) => {
            swal(
              "Error",
              "Error trying to expire some items, try again leter",
              "error"
            );
            console.log(e);
          });
      }
    });
  }

  function handleFilterPerDate(dateFilter: any) {
    const year = dateFilter.year.toString();
    let month = dateFilter.month === "00" ? null : dateFilter.month;

    dispatch(loading());
    dispatch<any>(getExpired(year, month)).then(() => {
      dispatch(closeLoading());
    });
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
        <Excel expired={exports} />
        <div>
          <span className={styles.total}>
            Total cost: ${Number(total).toFixed(2)}
          </span>
        </div>
      </div>
      <Table
        items={rows}
        handleRestore={handleRestore}
        handleInvoiceDetail={handleInvoiceDetail}
      />
    </div>
  );
}

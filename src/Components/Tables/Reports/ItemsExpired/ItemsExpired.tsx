import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Item, RootState, YearReport } from "../../../../interfaces";
import { getFirstAndLastDayOfMonth } from "../../../../functions/date";
import { closeLoading, loading } from "../../../../redux/actions/loading";

import Table from "./Table/Table";

import styles from "./ItemsExpired.module.css";
import swal from "sweetalert";
import DateFilter from "./DateFilter/DateFilter";
import {
  getExpiredItems,
  updateReportsItems,
} from "../../../../redux/actions/reports";
import { refoundItems } from "../../../../redux/actions/items";

interface Dates {
  firstDay: string;
  lastDay: string;
}

interface Props {
  typeReport: any;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function ItemsExpired({ typeReport, handleChange }: Props) {
  const dispatch = useDispatch();
  const items: Item[] = useSelector((state: RootState) => state.sales.expired);
  const reports: YearReport[] = useSelector(
    (state: RootState) => state.reports
  );
  const [itemsExpired, setItemsExpired] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    console.log(itemsExpired);
    setItemsExpired(items);
  }, [items]);

  useEffect(() => {
    setYears(reports.map((r) => Number(r.year)));
  }, [reports]);

  useEffect(() => {
    let total = 0;
    itemsExpired.forEach((item) => (total += Number(item.cost)));
    setTotal(total);
  }, [itemsExpired]);

  function handleRestore(id: number) {
    swal({
      title: "Warning",
      text: `Do you want to restore this item?`,
      icon: "warning",
      buttons: { confirm: true, cancel: true },
    }).then((response) => {
      if (response) {
        dispatch<any>(loading());
        dispatch<any>(refoundItems(id))
          .then(() => {
            dispatch(closeLoading());
            dispatch<any>(
              updateReportsItems([id], ["Sale", "Ebay Fees"], reports)
            )
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
    dispatch<any>(getExpiredItems(year, month)).then(() => {
      dispatch(closeLoading());
    });
  }

  return (
    <div className={styles.itemsSold}>
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
        <span className={styles.total}>
          Total cost: ${Number(total).toFixed(2)}
        </span>
      </div>
      <Table items={itemsExpired} handleRestore={handleRestore} />
    </div>
  );
}

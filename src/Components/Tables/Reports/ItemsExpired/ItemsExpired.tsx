import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Item, RootState, YearReport } from "../../../../interfaces";
import { getFirstAndLastDayOfMonth } from "../../../../functions/date";
import { closeLoading, loading } from "../../../../redux/actions/loading";
import { restoreItems } from "../../../../redux/actions/items";

import Table from "./Table/Table";

import styles from "./ItemsExpired.module.css";
import swal from "sweetalert";
import DateFilter from "./DateFilter/DateFilter";
import { getExpiredItems, updateReportsItems } from "../../../../redux/actions/reports";

interface Dates {
  firstDay: string;
  lastDay: string;
}

const initialDates: Dates = getFirstAndLastDayOfMonth(new Date());

export default function ItemsExpired() {
  const dispatch = useDispatch();
  const items: Item[] = useSelector((state: RootState) => state.sales.expired);
  const reports: YearReport[] = useSelector((state: RootState) => state.reports);
  const [itemsExpired, setItemsExpired] = useState<Item[]>([]);
  const [dates, setDates] = useState(initialDates);
  const [total, setTotal] = useState(0);
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    setItemsExpired(
      filterAndSortItems(
        dates.firstDay,
        dates.lastDay,
        items
      )
    );
  }, [items, dates]);

  useEffect(() => {
    setYears(reports.map((r) => Number(r.year)));
  }, [reports])

  useEffect(() => {
    let total = 0;
    itemsExpired.forEach((item) => (total += Number(item.cost)));
    setTotal(total);
  }, [itemsExpired]);

  function filterAndSortItems(
    dateFrom: string,
    dateTo: string,
    items: Item[]
  ): Item[] {
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);

    // Filtrar los elementos que estén dentro del rango de fechas
    const filteredItems = items.filter((item) => {
      const itemDate = item.date.toDate();
      return itemDate >= fromDate && itemDate <= toDate;
    });

    // Ordenar los elementos por fecha de mayor a menor
    filteredItems.sort((a, b) => {
      const dateA = a.date.toDate();
      const dateB = b.date.toDate();
      return dateB.getTime() - dateA.getTime();
    });

    return filteredItems;
  }

  function handleRestore(id: number) {
    swal({
      title: "Warning",
      text: `Do you want to restore this item?`,
      icon: "warning",
      buttons: { confirm: true, cancel: true },
    }).then((response) => {
      if (response) {
        dispatch<any>(loading());
        dispatch<any>(restoreItems(id))
          .then(() => {
            dispatch(closeLoading());
            dispatch<any>(updateReportsItems([id], ["Sale", "Ebay Fees"], reports))
              .then(() => {
                dispatch(closeLoading());
                swal(
                  "Restored",
                  "Item restores successfully",
                  "success"
                );
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
    })
  }

  return (
    <div className={styles.itemsSold}>
      <div className={styles.controls}>
        <DateFilter years={years} handleFilterPerDate={handleFilterPerDate} />
        <span className={styles.total}>
          Total cost: ${Number(total).toFixed(2)}
        </span>
      </div>
      <Table items={itemsExpired} handleRestore={handleRestore} />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Item, RootState } from "../../../../interfaces";
import { getFirstAndLastDayOfMonth } from "../../../../functions/date";
import { closeLoading, loading } from "../../../../redux/actions/loading";
import { restoreItems } from "../../../../redux/actions/items";

import Table from "./Table/Table";

import styles from "./ItemsExpired.module.css";
import swal from "sweetalert";

interface Dates {
  firstDay: string;
  lastDay: string;
}

const initialDates: Dates = getFirstAndLastDayOfMonth(new Date());

export default function ItemsExpired() {
  const dispatch = useDispatch();
  const items: Item[] = useSelector((state: RootState) => state.items);
  const [itemsExpired, setItemsExpired] = useState<Item[]>([]);
  const [dates, setDates] = useState(initialDates);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setItemsExpired(
      filterAndSortItems(
        dates.firstDay,
        dates.lastDay,
        items.filter((i) => i.state === "Expired")
      )
    );
  }, [items, dates]);

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
      const itemDate = new Date(item.date);
      return itemDate >= fromDate && itemDate <= toDate;
    });

    // Ordenar los elementos por fecha de mayor a menor
    filteredItems.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    return filteredItems;
  }

  function handleChangeDate(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    const value = event.target.value;
    setDates({ ...dates, [name]: value });
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
            swal(
              "Restored",
              "Item restores successfully",
              "success"
            );
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

  return (
    <div className={styles.itemsSold}>
      <div className={styles.controls}>
        <div className="form-floating">
          <input
            className="form-control"
            id="formDate"
            name="firstDay"
            type="date"
            value={dates.firstDay}
            onChange={handleChangeDate}
          />
          <label className="form-label" htmlFor="formDate">
            From:
          </label>
        </div>
        <div className="form-floating">
          <input
            className="form-control"
            id="toDate"
            name="lastDay"
            type="date"
            value={dates.lastDay}
            onChange={handleChangeDate}
          />
          <label className="form-label" htmlFor="toDate">
            From:
          </label>
        </div>
        <span className={styles.total}>
          Total cost: ${Number(total).toFixed(2)}
        </span>
      </div>
      <Table items={itemsExpired} handleRestore={handleRestore} />
    </div>
  );
}

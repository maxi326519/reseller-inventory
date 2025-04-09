import { getStockItems, updateItem } from "../../redux/actions/items";
import { useDispatch, useSelector } from "react-redux";
import { closeLoading, loading } from "../../redux/actions/loading";
import { useEffect, useState } from "react";
import { Item, RootState } from "../../interfaces/interfaces";

import styles from "./ChangeLocation.module.css";

interface Props {
  onClose: () => void;
}

export default function ChangeLocation({ onClose }: Props) {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.items);
  const locations = useSelector((state: RootState) => state.user.locations);
  const [location, setLocation] = useState<string>("");
  const [itemId, setItemId] = useState<string>("");
  const [itemsFiltred, setItemsFiltred] = useState<Item[]>([]);

  useEffect(() => {
    if (items.data.length > 0) dispatch<any>(getStockItems());
  }, []);

  useEffect(() => {
    setItemsFiltred(
      items.data.filter((item) => (itemId ? item.id === Number(itemId) : true))
    );
  }, [itemId, items.data]);

  const handleChangeLocation = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLocation(event.target.value);
  };

  const handleChangeItem = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemId(event.target.value);
  };

  const handleSubmit = () => {
    dispatch(loading());
    const item = items.data.find((item) => item.id === Number(itemId));

    if (item) {
      const itemUpdated = { ...item, location };
      dispatch<any>(updateItem(itemUpdated))
        .then(() => dispatch(closeLoading()))
        .catch(() => dispatch(closeLoading()));
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.modal}>
        <div className={styles.container}>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              value={itemId}
              placeholder="Write the code"
              onChange={handleChangeItem}
            />
            <label className="form-label" htmlFor="date">
              Item code:
            </label>
          </div>

          <div className="form-floating mb-3">
            <select
              className="form-select"
              id="form"
              value={location}
              placeholder="Select a location"
              onChange={handleChangeLocation}
            >
              <option value="">Select</option>
              {locations.map((location) => (
                <option value={location}>{location}</option>
              ))}
            </select>
            <label className="form-label" htmlFor="form">
              Form of Purchase:
            </label>
          </div>
          <div className={styles.items}>
            {itemsFiltred.map((item) => (
              <div>
                {item.id} - {item.description} ({item.location || "-"})
              </div>
            ))}
          </div>
          <div className={styles.btnContainer}>
            <button className="btn btn-primary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!location}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

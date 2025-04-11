import { getStockItems, updateItem } from "../../redux/actions/items";
import { useDispatch, useSelector } from "react-redux";
import { closeLoading, loading } from "../../redux/actions/loading";
import { useEffect, useState } from "react";
import { RootState } from "../../interfaces/interfaces";

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

  useEffect(() => {
    if (items.data.length > 0) dispatch<any>(getStockItems());
  }, []);

  const handleChangeLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
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

          <div className={styles.dropDown}>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                value={location}
                placeholder="Write the code"
                onChange={handleChangeLocation}
              />
              <label className="form-label" htmlFor="date">
                Location:
              </label>
            </div>
            <div className={styles.options}>
              {locations
                .filter((item) =>
                  item.toLowerCase().includes(location.toLowerCase())
                )
                .map((location) => (
                  <span onClick={() => setLocation(location)}>{location}</span>
                ))}
            </div>
          </div>

          <div className={styles.items}>
            {items.data
              .filter((item) => item.id.toString().includes(itemId))
              .map((item) => (
                <div onClick={() => setItemId(item.id?.toString())}>
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
              disabled={
                !locations.some((loc) => loc === location) ||
                !items.data.some((item) => item.id === Number(itemId))
              }
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

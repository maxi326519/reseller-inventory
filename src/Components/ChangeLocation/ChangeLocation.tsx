import { getStockItems, updateItem } from "../../redux/actions/items";
import { useDispatch, useSelector } from "react-redux";
import { closeLoading, loading } from "../../redux/actions/loading";
import { useEffect, useRef, useState } from "react";
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

  const itemInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (items.data.length > 0) dispatch<any>(getStockItems());
    if (itemInputRef.current) {
      itemInputRef.current.focus(); // Foco inicial en el primer input
    }
  }, []);

  const handleChangeLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleChangeItem = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemId(event.target.value);
    locationInputRef.current?.focus();
  };

  const handlePasteItem = (event: React.ClipboardEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (locationInputRef.current) {
        locationInputRef.current.focus(); // Cambiar el foco al segundo input
      }
    }, 0); // Delay to ensure paste completes in the first input
  };

  const handleSubmit = () => {
    dispatch(loading());
    const item = items.data.find((item) => item.id.toString().includes(itemId));

    if (item) {
      const itemUpdated = { ...item, location };
      dispatch<any>(updateItem(itemUpdated))
        .then(() => {
          dispatch(closeLoading());
          setItemId("");
          setLocation("");
          itemInputRef.current?.focus();
        })
        .catch(() => dispatch(closeLoading()));
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.modal}>
        <div className={styles.close}>
          <h4>Categories</h4>
          <button
            className="btn btn-danger"
            type="button"
            onClick={onClose}
          >
            x
          </button>
        </div>
        <div className={styles.container}>
          <div className="form-floating mb-3">
            <input
              ref={itemInputRef}
              className="form-control"
              value={itemId}
              placeholder="Write the code"
              onChange={handleChangeItem}
              onPaste={handlePasteItem}
            />
            <label className="form-label" htmlFor="date">
              Item code
            </label>
          </div>

          <div className={styles.dropDown}>
            <div className="form-floating mb-3">
              <input
                ref={locationInputRef}
                className="form-control"
                value={location}
                placeholder="Write the location"
                onChange={handleChangeLocation}
              />
              <label className="form-label" htmlFor="date">
                Location
              </label>
            </div>
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
                !(
                  items.data.filter((item) =>
                    item.id.toString().includes(itemId)
                  )?.length === 1
                )
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

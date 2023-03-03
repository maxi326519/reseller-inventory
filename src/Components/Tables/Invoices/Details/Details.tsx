import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, Item } from "../../../../interfaces";

import styles from "./Details.module.css";

interface Props {
  handleClose: () => void;
  itemsList: Item[];
}

export default function Details({ handleClose, itemsList }: Props) {

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.close}>
          <h4>Categories</h4>
          <button
            className="btn btn-danger"
            type="button"
            onClick={handleClose}
          >
            x
          </button>
        </div>
        <div className={styles.list}>{
          itemsList.map((item) => (
            <div>
              <span>{item.id}</span>
              <span>{item.description}</span>
              <span>{item.cost}</span>
              <span>{item.state}</span>
              <button>-</button>
            </div>
          ))
        }</div>
      </div>
    </div>
  );
}

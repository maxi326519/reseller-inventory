import { useEffect, useState } from "react";
import { Item, Expense, InvoiceType } from "../../../../interfaces/interfaces";

import styles from "./Details.module.css";
import PurchaseData from "./PurchaseData/PurchaseData";
import ExpenseData from "./ExpenseData/ExpenseData";

interface Props {
  handleClose: () => void;
  invoiceType: InvoiceType;
  invoiceId: number;
  itemsList: Item[] | Expense[];
  image: string;
}

export default function Details({
  handleClose,
  invoiceType,
  invoiceId,
  itemsList,
  image,
}: Props) {
  const [showImage, setShowImage] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let total = 0;
    if (invoiceType === InvoiceType.Purchase) {
      itemsList.forEach((item) => {
        const data = item as Item;
        total += Number(data.cost);
      });
    }

    setTotal(total);
  }, [itemsList]);

  useEffect(() => {
    console.log(invoiceType);
    console.log(invoiceId);
    console.log(itemsList);
    console.log(image);
  }, []);

  function localHandleCLose() {
    handleClose();
    setShowImage(false);
  }

  return (
    <div className={styles.background}>
      {showImage ? (
        <div className={styles.backImage}>
          <img src={image} alt="invoice" />
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => setShowImage(!showImage)}
          >
            x
          </button>
        </div>
      ) : null}
      <div className={`toTop ${styles.container}`}>
        <div className={styles.close}>
          <h4>Invoice Details</h4>
          <button
            className="btn btn-danger"
            type="button"
            onClick={localHandleCLose}
          >
            x
          </button>
        </div>
        <div className={styles.info}>
          <span>
            <b>Items:</b> {itemsList.length}
          </span>
          <span>
            <b>Invoice ID:</b> {invoiceId}
          </span>
          <span>
            <b>Total:</b> ${total.toFixed(2)}
          </span>
        </div>
        <div className={styles.data}>
          <div className={styles.list}>
            {itemsList.map((item, i) =>
              invoiceType === InvoiceType.Purchase ? (
                <PurchaseData key={i} item={item as Item} />
              ) : (
                <ExpenseData key={i} item={item as Expense} />
              )
            )}
          </div>
          {image ? (
            <div className={styles.imageContainer}>
              <button
                className={styles.imgButton}
                type="button"
                onClick={() => setShowImage(!showImage)}
              >
                Ver
              </button>
              <img src={image} alt="invoice" />
            </div>
          ) : (
            <div className={styles.imageContainer}>
              <span>No image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

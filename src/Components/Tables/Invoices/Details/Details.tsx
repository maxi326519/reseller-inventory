import { useEffect, useState } from "react";
import { Item, Expense, InvoiceType } from "../../../../interfaces";

import styles from "./Details.module.css";
import PurchaseData from "./PurchaseData/PurchaseData";
import ExpenseData from "./ExpenseData/ExpenseData";

interface Props {
  handleClose: () => void;
  invoiceType: InvoiceType;
  itemsList: Item[] | Expense[];
  image: string;
}

export default function Details({
  handleClose,
  invoiceType,
  itemsList,
  image,
}: Props) {
  const [showImage, setShowImage] = useState(false);

  function localHandleCLose() {
    handleClose();
    setShowImage(false);
  }

  useEffect(() => {
    console.log(itemsList);
  });

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
        <span>Items: {itemsList.length}</span>
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

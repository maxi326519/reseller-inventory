import styles from "./Details.module.css";
import ExpenseData from "./ExpenseData/ExpenseData";

interface Props {
  itemsList: any[];
  handleClose: () => void;
}

export default function Details({
  itemsList,
  handleClose,
}: Props) {

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.close}>
          <h4>Other categories</h4>
          <button
            className="btn btn-danger"
            type="button"
            onClick={handleClose}
          >
            x
          </button>
        </div>
        <div className={styles.data}>
          <div className={styles.list}>
            {itemsList.map((item, i) =>
              <ExpenseData key={i} item={item} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

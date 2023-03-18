import styles from "./DownloadExcel.module.css";
import Excel from "./Excel/Excel";

interface Props {
  handleClose: () => void;
  data: Array<{
    id: number;
    description: string;
  }>;
}

export default function DownloadExcel({ handleClose, data }: Props) {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.close}>
          <button
            className="btn btn-danger"
            type="button"
            onClick={handleClose}
          >
            x
          </button>
        </div>
        <span className={styles.question}>
          Do you want to download the id in excel?
        </span>
        <div className={styles.bntContainer}>
          <Excel handleClose={handleClose} data={data} />
          <button
            className={`btn btn-danger ${styles.cancel}`}
            type="button"
            onClick={handleClose}
          >
            No, close
          </button>
        </div>
      </div>
    </div>
  );
}

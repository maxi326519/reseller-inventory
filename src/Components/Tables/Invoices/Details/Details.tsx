import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, Item } from "../../../../interfaces";

import styles from "./Details.module.css";

interface Props {
  handleClose: () => void;
  itemsList: Item[];
  image: string;
}

export default function Details({ handleClose, itemsList, image }: Props) {
  const [showImage, setShowImage] = useState(false);

  function localHandleCLose(){
    handleClose();
    setShowImage(false);
  }

  return (
    <div className={styles.background}>
      {showImage ? (
        <div className={styles.backImage}>
          <img src={image} alt="invoice" />
          <button className="btn btn-danger" type="button" onClick={() => setShowImage(!showImage)}>x</button>
        </div>
      ) : null}
      <div className={styles.container}>
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
        <div className={styles.data}>
          <div className={styles.list}>
            {itemsList.map((item) => (
              <div key={item.id} className={styles.inputs}>
                <div className="mb-3 form-floating">
                  <input
                    id="id"
                    className="form-control"
                    value={item.id}
                    disabled
                  />
                  <label htmlFor="id" className="form-label">
                    Id:{" "}
                  </label>
                </div>
                <div>
                  <div className={styles.inputContainer}>
                    <div className="mb-3 form-floating">
                      <input
                        id="state"
                        className="form-control"
                        value={item.state}
                        disabled
                      />
                      <label htmlFor="state" className="form-label">
                        State:{" "}
                      </label>
                    </div>
                    <div className="mb-3 form-floating">
                      <input
                        id="cost"
                        className="form-control"
                        value={item.cost}
                        disabled
                      />
                      <label htmlFor="cost" className="form-label">
                        Cost:{" "}
                      </label>
                    </div>
                  </div>
                  <div className="mb-3 form-floating">
                    <input
                      id="description"
                      className="form-control"
                      value={item.description}
                      disabled
                    />
                    <label htmlFor="description" className="form-label">
                      Description:{" "}
                    </label>
                  </div>
                  <hr></hr>
                </div>
              </div>
            ))}
          </div>
          {image ? (
            <div className={styles.imageContainer}>
              <button className={styles.imgButton} type="button" onClick={() => setShowImage(!showImage)}>
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

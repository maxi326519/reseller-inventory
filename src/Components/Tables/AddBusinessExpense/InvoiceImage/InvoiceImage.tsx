import { useEffect, useState } from "react";

import style from "./InvoiceImage.module.css";
import invoice from "../../../../assets/svg/invoice.svg";

interface Props {
  file: File | null;
  setFile: (image: File) => void;
}

export default function InvoiceImage({ file, setFile }: Props) {
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    if (file === null) setImage("");
    else setImage(URL.createObjectURL(file));
  }, [file]);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setFile(file);
  }

  return (
    <div className={style.container}>
      <div className={style.imageContainer}>
        {image ? (
          <img src={image} alt="invoice" />
        ) : (
          <img className={style.invoiceIcon} src={invoice} alt="invoice" />
        )}
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          id="image"
          type="file"
          onChange={handleFile}
          placeholder="Elegir archivo"
        />
      </div>
    </div>
  );
}

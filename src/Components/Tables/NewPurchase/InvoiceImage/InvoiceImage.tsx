import { useState } from "react";

import style from "./InvoiceImage.module.css";

interface Props {
  setFile: (image: File) => void;
}

export default function InvoiceImage({ setFile }: Props) {
  const [image, setImage] = useState<string>("");

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      console.log(URL.createObjectURL(file));
      setImage(URL.createObjectURL(file));
    }
  }

  return (
    <div className={style.container}>
      <div className={style.imageContainer}>
        <img src={image} alt="invoice" />
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

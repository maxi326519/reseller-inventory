import { useState } from "react";

import style from "./InvoiceImage.module.css";

export default function InvoiceImage() {
  /*     const [file, setFile] = useState<File || null>();
    const [image, setImage] = useState<File || null>(null); */

  /*     function handleFile(event: React.ChangeEvent<HTMLInputElement>){
        const file = event.target.files[0];
        if(!file) return false;
        setFile(file);
        setImage();
    } */

  return (
    <div className={style.container}>
      <div className={style.imageContainer}>{/*                 <img src={null}/> */}</div>
      <div className="mb-3">
        <label className="form-label" htmlFor="image">
          Add invoice image
        </label>
        <input className="form-control" id="image" type="file" />
      </div>
    </div>
  );
}

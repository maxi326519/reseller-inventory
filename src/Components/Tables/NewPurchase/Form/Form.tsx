import { Invoice, Item, RootState } from "../../../../interfaces/interfaces";
import { useSelector } from "react-redux";
import { Timestamp } from "@firebase/firestore";
import { useState } from "react";

import styles from "../../Tables.module.css";

interface Props {
  invoice: Invoice;
  setInvoice: (invoice: Invoice) => void;
  items: Item[];
  setItems: (items: Item[]) => void;
}

interface Error {
  source: null | string;
  location: null | string;
  description: null | string;
  cost: null | string;
  amount: null | string;
  image: null | string;
}

export default function Form({ invoice, setInvoice, items, setItems }: Props) {
  const maxDate = new Date().toISOString().split("T")[0];
  const [amount, setAmount] = useState<any>("");
  const sources: string[] = useSelector(
    (state: RootState) => state.user.sources
  );
  const locations: string[] = useSelector(
    (state: RootState) => state.user.locations
  );
  const initialState: Item = {
    id: 0,
    date: invoice.date,
    invoiceId: invoice.id,
    state: "In Stock",
    cost: "",
    description: "",
    location: "",
  };
  const [newItem, setNewItems] = useState<Item>(initialState);

  const [error, setError] = useState<Error>({
    source: null,
    location: null,
    description: null,
    cost: null,
    amount: null,
    image: null,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (handleVerification()) {
      let allItems: Item[] = [];

      for (let i: number = 1; i <= amount; i++) {
        allItems.push({
          ...newItem,
          id: createUniqueId(
            Math.floor(Number(newItem.cost)),
            items.map((i) => i.id)
          ),
        });
      }

      setItems([...items, ...allItems]);
      setNewItems(initialState);
      setAmount("");
    }
  }

  function handleInvoice(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.name === "date") {
      const fechaInput = event.target.value;
      const fechaUTC = new Date(fechaInput);
      fechaUTC.setUTCHours(0, 0, 0, 0);
      const date = Timestamp.fromDate(fechaUTC);
      setInvoice({
        ...invoice,
        date: date,
      });
    } else {
      setInvoice({ ...invoice, [event.target.name]: event.target.value });
      setError({ ...error, [event.target.name]: null });
    }
  }

  function handleInvoiceSelect(
    event: React.ChangeEvent<HTMLSelectElement>
  ): void {
    setInvoice({ ...invoice, [event.target.name]: event.target.value });
    setError({ ...error, [event.target.name]: null });
  }

  function handleNewItems(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.name === "description") {
      setNewItems({ ...newItem, [event.target.name]: event.target.value });
      setError({ ...error, [event.target.name]: null });
    } else {
      setNewItems({
        ...newItem,
        [event.target.name]: event.target.value,
      });
      setError({ ...error, [event.target.name]: null });
    }
  }

  function handleNewItemsSelect(
    event: React.ChangeEvent<HTMLSelectElement>
  ): void {
    setNewItems({ ...newItem, [event.target.name]: event.target.value });
    setError({ ...error, [event.target.name]: null });
  }

  function handleAmount(event: React.ChangeEvent<HTMLInputElement>): void {
    setAmount(event.target.value);
    setError({ ...error, [event.target.name]: null });
  }

  function createUniqueId(price: number, existingIds: number[]): number {
    let productId = Number(`${price}${Math.floor(Math.random() * 1000000)}`);
    while (existingIds.includes(productId)) {
      productId = Number(`${price}${Math.floor(Math.random() * 1000000)}`);
    }
    return productId;
  }

  function handleVerification(): boolean {
    let errors = 0;
    let errObj = { ...error };

    /* Sourse */
    if (invoice.source === "0") {
      errObj.source = "Select a source";
      errors++;
    } else {
      errObj.source = null;
    }

    /* Description */
    if (newItem.description === "") {
      errObj.description = "Description is empty";
      errors++;
    } else {
      errObj.description = null;
    }

    /* Amount */
    if (amount === "0") {
      errObj.amount = "Amount is 0";
      errors++;
    } else if (amount === "") {
      errObj.amount = "Undefined amount";
      errors++;
    } else if (Number(amount) > 100) {
      errObj.amount = "Limit of 100 units";
      errors++;
    } else {
      errObj.amount = null;
    }
    setError(errObj);
    if (errors === 0) return true;
    return false;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h4>Invoice</h4>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="date"
          id="date"
          name="date"
          value={invoice.date.toDate().toISOString().split("T")[0]}
          max={maxDate}
          onChange={handleInvoice}
        />
        <label className="form-label" htmlFor="date">
          Date of Purchase:
        </label>
      </div>

      <div className="form-floating mb-3">
        <select
          className="form-select"
          id="form"
          name="form"
          value={invoice.form}
          onChange={handleInvoiceSelect}
        >
          <option value="Cash">Cash</option>
          <option value="Debit">Debit</option>
          <option value="Paypal">Paypal</option>
        </select>
        <label className="form-label" htmlFor="form">
          Form of Purchase:
        </label>
      </div>
      <div className="form-floating mb-3">
        <select
          id="source"
          name="source"
          className={`form-select ${error.source ? "is-invalid" : null}`}
          value={invoice.source}
          onChange={handleInvoiceSelect}
        >
          <option value="0">Select</option>
          {sources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
        <label className="form-label" htmlFor="source">
          Source:
        </label>
        {!error.source ? null : <small>{error.source}</small>}
      </div>
      <hr />
      <h4>Items</h4>

      <div className="form-floating mb-3">
        <select
          id="location"
          name="location"
          className={`form-select ${error.location ? "is-invalid" : null}`}
          value={newItem.location}
          onChange={handleNewItemsSelect}
        >
          <option value="0">Select</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <label className="form-label" htmlFor="location">
          Location:
        </label>
        {!error.location ? null : <small>{error.location}</small>}
      </div>
      <div className="form-floating mb-3">
        <input
          id="description"
          className={`form-control ${error.description ? "is-invalid" : null}`}
          name="description"
          type="text"
          value={newItem.description}
          onChange={handleNewItems}
        />
        <label className="form-label" htmlFor="description">
          Description:
        </label>
        {!error.description ? null : <small>{error.description}</small>}
      </div>

      <div className="form-floating mb-3">
        <input
          id="cost"
          name="cost"
          className={`form-control ${error.cost ? "is-invalid" : null}`}
          type="number"
          value={newItem.cost}
          onChange={handleNewItems}
        />
        <label className="form-label" htmlFor="cost">
          Unit cost $:
        </label>
        {!error.cost ? null : <small>{error.cost}</small>}
      </div>

      <div className="form-floating mb-3">
        <input
          id="amount"
          name="amount"
          className={`form-control ${error.amount ? "is-invalid" : null}`}
          type="number"
          value={amount}
          onChange={handleAmount}
        />
        <label className="form-label" htmlFor="amount">
          Number of Items:
        </label>
        {!error.amount ? null : <small>{error.amount}</small>}
      </div>
      <button className="btn btn-primary" type="submit">
        Add Item
      </button>
    </form>
  );
}

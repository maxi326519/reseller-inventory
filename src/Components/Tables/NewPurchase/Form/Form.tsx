import { useState } from "react";
import { Invoice, Item } from "../../../../interfaces";

import styles from "../../Tables.module.css";

interface Props {
  invoice: Invoice;
  setInvoice: (invoice: Invoice) => void;
  items: Item[];
  setItems: (items: Item[]) => void;
}

interface Error {
  source: null | string;
  description: null | string;
  cost: null | string;
  amount: null | string;
  image: null | string;
}

export default function Form({ invoice, setInvoice, items, setItems }: Props) {
  const maxDate = new Date().toISOString().split("T")[0];
  const [amount, setAmount] = useState<any>(0);
  const [newItem, setNewItems] = useState<Item>({
    id: 0,
    date: invoice.date,
    invoiceId: invoice.id,
    state: "In Stock",
    cost: 0,
    description: "",
  });

  const [error, setError] = useState<Error>({
    source: null,
    description: null,
    cost: null,
    amount: null,
    image: null,
  });

  function handleInvoice(event: React.ChangeEvent<HTMLInputElement>) {
    setInvoice({ ...invoice, [event.target.name]: event.target.value });
  }

  function handleInvoiceSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    console.log(event.target.name, event.target.value);
    setInvoice({ ...invoice, [event.target.name]: event.target.value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (handleVerification()) {
      let allItems: Item[] = [];

      for (let i: number = 1; i <= amount; i++) {
        allItems.push({
          ...newItem,
          id: createUniqueId(invoice.date, newItem.cost, items.map((i) => i.id )),
        });
      }

      setItems([...items, ...allItems]);
      setInvoice({
        ...invoice,
        items: [...invoice.items, ...allItems.map((i) => i.id)],
      });
    }
  }

  function createUniqueId(dateStr: string, price: number, existingIds: number[]): number {
    const date = new Date(dateStr);
    const formattedDate = Number(`${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`);
    let productId = Number(`${formattedDate}${price}${Math.floor(Math.random() * 1000000)}`);
    while (existingIds.includes(productId)) {
      productId = Number(`${formattedDate}${price}${Math.floor(Math.random() * 1000000)}`);
    }
    return productId;
  }

  function handleNewItems(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === "description") {
      setNewItems({ ...newItem, [event.target.name]: event.target.value });
    } else {
      setNewItems({
        ...newItem,
        [event.target.name]: parseFloat(event.target.value),
      });
    }
  }

  function handleVerification(): boolean {
    let errors = 0;
    let errObj = { ...error };

    /* Sourse */
    if (invoice.source === "") {
      errObj.source = "Source is empty";
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
    if (amount === 0) {
      errObj.amount = "Amount is 0";
      errors++;
    } else if (amount === "") {
      errObj.amount = "Undefined amount";
      errors++;
    } else {
      errObj.amount = null;
    }
    setError(errObj);
    if (errors === 0) return true;
    return false;
  }

  return (
    <div className={styles.form}>
      <div>
        <h4>Invoice</h4>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            type="date"
            id="date"
            name="date"
            max={maxDate}
            value={invoice.date}
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
          <input
            className={`form-control ${error.source ? "is-invalid" : null}`}
            type="text"
            id="source"
            name="source"
            value={invoice.source}
            onChange={handleInvoice}
          />
          <label className="form-label" htmlFor="source">
            Source:
          </label>
          {!error.source ? null : <small>{error.source}</small>}
        </div>
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
        <h4>Items</h4>

        <div className="form-floating mb-3">
          <input
            className={`form-control ${
              error.description ? "is-invalid" : null
            }`}
            type="text"
            id="description"
            name="description"
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
            className={`form-control ${error.cost ? "is-invalid" : null}`}
            type="number"
            id="cost"
            name="cost"
            value={newItem.cost}
            onChange={handleNewItems}
          />
          <label className="form-label" htmlFor="cost">
            Unit cost:
          </label>
          {!error.cost ? null : <small>{error.cost}</small>}
        </div>

        <div className="form-floating mb-3">
          <input
            className={`form-control ${error.amount ? "is-invalid" : null}`}
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmount(e.target.value)
            }
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
    </div>
  );
}

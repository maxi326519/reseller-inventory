import { useState } from "react";
import { Invoice, Items } from "../../../../interfaces";

import styles from "../../Tables.module.css";

interface Props {
  invoice: Invoice;
  setInvoice: (Invoice: Invoice) => void;
  items: Items[];
  setItems: (items: Items[]) => void;
}

export default function Form({ invoice, setInvoice, items, setItems }: Props) {
  const [newItem, setNewItems] = useState<Items>({
    id: 0,
    invoiceId: 0,
    amount: 0,
    state: true,
    cost: 0,
    description: "",
  });

  function handleInvoice(event: React.ChangeEvent<HTMLInputElement>) {
    setInvoice({ ...invoice, [event.target.name]: event.target.value });
  }

  function handleInvoiceSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    setInvoice({ ...invoice, [event.target.name]: event.target.value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let allItems: Items[] = [];

    for(let i: number = 0; i <= newItem.amount; i++){
      if(allItems.length > newItem.amount ) break;
      allItems.push({ ...newItem, id: 1 });
    }

    console.log(allItems);

    setItems([ ...items, ...allItems ]);
  }

  function handleNewItems(event: React.ChangeEvent<HTMLInputElement>) {
    setNewItems({ ...newItem, [event.target.name]: event.target.value });
  }

  return (
    <div className={styles.form}>
      <div>
        <h4>Invoice</h4>
        <label className="form-label" htmlFor="date">
          Date of Purchase:
        </label>
        <input
          className="form-control"
          type="date"
          id="date"
          name="date"
          value={invoice.date}
          onChange={handleInvoice}
          required
        />

        <label className="form-label" htmlFor="form">
          Form of Purchase:
        </label>
        <select
          className="form-select"
          id="form"
          name="form"
          value={invoice.source}
          onChange={handleInvoiceSelect}
          required
        >
          <option value="1">Cash</option>
          <option value="2">Debit</option>
        </select>
        <label className="form-label" htmlFor="source">
          Source:
        </label>
        <input
          className="form-control"
          type="text"
          id="source"
          name="source"
          value={invoice.source}
          onChange={handleInvoice}
          required
        />
      </div>
      <hr/>
      <form onSubmit={handleSubmit}>
        <h4>Items</h4>

        <label className="form-label" htmlFor="description">
          Description:
        </label>
        <input
          className="form-control"
          type="text"
          id="description"
          name="description"
          onChange={handleNewItems}
          required
        />

        <label className="form-label" htmlFor="amount">
          Number of Items:
        </label>
        <input
          className="form-control"
          type="number"
          id="amount"
          name="amount"
          onChange={handleNewItems}
          required
        />

        <label className="form-label" htmlFor="cost">
          Unit cost:
        </label>
        <input
          className="form-control"
          type="number"
          id="cost"
          name="cost"
          onChange={handleNewItems}
          required
        />

        <button className="btn btn-primary" type="submit">Add Item</button>
      </form>
    </div>
  );
}

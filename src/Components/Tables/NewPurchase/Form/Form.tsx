import { useState } from "react";
import { Invoice, Item } from "../../../../interfaces";

import styles from "../../Tables.module.css";

interface Props {
  invoice: Invoice;
  setInvoice: (invoice: Invoice) => void;
  items: Item[];
  setItems: (items: Item[]) => void;
}

export default function Form({ invoice, setInvoice, items, setItems }: Props) {
  const [amount, setAmount] = useState<number>(1);
  const [newItem, setNewItems] = useState<Item>({
    id: 0,
    date: invoice.date,
    invoiceId: invoice.id,
    state: "In Stock",
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
    let allItems: Item[] = [];

    for (let i: number = 1; i <= amount; i++) {
      allItems.push({
        ...newItem,
        id: gererateId(items.length + i, newItem.cost, invoice.date),
      });
    }

    setItems([...items, ...allItems]);
    setInvoice({
      ...invoice,
      items: [...invoice.items, ...allItems.map((i) => i.id)],
    });
  }

  function gererateId(sequential: number, cost: number, date: string) {
    const toDay: string[] = date.split("-");
    const day: string = toDay[0];
    const month: string = toDay[1];
    const year: string = toDay[2].toString().slice(-2);

    const idStr: string = `${cost}${day}${month}${year}${sequential}`;
    const idNumber: number = Number(idStr);
    return idNumber;
  }

  function handleNewItems(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === "description") {
      setNewItems({ ...newItem, [event.target.name]: event.target.value });
    } else {
      setNewItems({
        ...newItem,
        [event.target.name]: min(Number(event.target.value), 0),
      });
    }
  }

  function min(number: number, min: number) {
    if (number < min) return min;
    return number;
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
      <hr />
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
          value={newItem.description}
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
          min="0"
          value={newItem.cost}
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
          value={amount}
          min="1"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAmount(min(Number(e.target.value), 1))
          }
          required
        />

        <button className="btn btn-primary" type="submit">
          Add Item
        </button>
      </form>
    </div>
  );
}

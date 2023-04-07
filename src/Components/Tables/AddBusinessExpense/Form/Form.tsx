import { useState } from "react";
import { useSelector } from "react-redux";
import { Timestamp } from "firebase/firestore";
import { Expense, InvoiceExpenses } from "../../../../interfaces";
import { RootState } from "../../../../interfaces";

import styles from "../../Tables.module.css";

const initialState: Expense = {
  id: 0,
  date: Timestamp.fromDate(new Date()),
  category: "0",
  description: "",
  price: "",
  invoiceId: 0,
};

interface Error {
  category: null | string;
  description: null | string;
  price: null | string;
  amount: null | string;
}

interface Props {
  invoice: InvoiceExpenses;
  setInvoice: (invoice: InvoiceExpenses) => void;
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  amount: any;
  setAmount: (amount: any) => void;
}

export default function Form({
  invoice,
  setInvoice,
  expenses,
  setExpenses,
  amount,
  setAmount,
}: Props) {
  const maxDate = new Date().toISOString().split("T")[0];
  const [expense, setExpense] = useState<Expense>(initialState);
  const categories: string[] = useSelector(
    (state: RootState) => state.user.categories
  );
  const [error, setError] = useState<Error>({
    category: null,
    description: null,
    price: null,
    amount: null,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (handleVerification()) {
      let allExpenses: Expense[] = [];

      for (let i: number = 1; i <= amount; i++) {
        allExpenses.push({
          ...expense,
          id: createUniqueId(
            invoice.date.toDate().toISOString().split("T")[0],
            Math.floor(Number(expense.price)),
            null
          ),
          date: invoice.date,
          invoiceId: invoice.id
        });
      }
      setExpenses([...expenses, ...allExpenses]);
      setExpense(initialState);
      setAmount("");
    }
  }

  function createUniqueId(
    dateStr: string,
    price: number,
    existingIds: number[] | null
  ): number {
    const date = new Date(dateStr);
    const formattedDate = Number(
      `${date.getFullYear()}${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`
    );
    let productId = Number(
      `${formattedDate}${price}${Math.floor(Math.random() * 1000000)}`
    );
    if (existingIds !== null) {
      while (existingIds.includes(productId)) {
        productId = Number(
          `${formattedDate}${price}${Math.floor(Math.random() * 1000000)}`
        );
      }
    }
    return productId;
  }

  function handleInvoiceChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    if (event.target.name === "date") {
      setInvoice({ ...invoice, date: Timestamp.fromDate(new Date(event.target.value)) });
    } else {
      setInvoice({ ...invoice, [event.target.name]: event.target.value });
    }
  }

  function handleChangeSelect(
    event: React.ChangeEvent<HTMLSelectElement>
  ): void {
    setInvoice({ ...invoice, [event.target.name]: event.target.value });
    setExpense({ ...expense, [event.target.name]: event.target.value });
    setError({ ...error, [event.target.name]: null });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setExpense({ ...expense, [event.target.name]: event.target.value });
    setError({ ...error, [event.target.name]: null });
  }

  function handleAmount(event: React.ChangeEvent<HTMLInputElement>): void {
    setAmount(event.target.value);
    setError({ ...error, amount: null });
  }

  function handleVerification(): boolean {
    let errors = 0;
    let errObj = { ...error };

    /* Category */
    if (invoice.category === "0") {
      errObj.category = "Select an option";
      errors++;
    } else {
      errObj.category = null;
    }

    /* Description */
    if (expense.description === "") {
      errObj.description = "Description is empty";
      errors++;
    } else {
      errObj.description = null;
    }

    /* Unit cost */
    if (expense.price === "") {
      errObj.price = "Add cost";
      errors++;
    } else {
      errObj.price = null;
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
    <form className={styles.form} onSubmit={handleSubmit}>
      <h4>Invoice</h4>
      <div className="mb-3 form-floating">
        <input
          className="form-control"
          type="date"
          id="date"
          name="date"
          value={invoice.date.toDate().toISOString().split("T")[0]}
          max={maxDate}
          onChange={handleInvoiceChange}
        />
        <label className="form-label" htmlFor="date">
          Date of Expenses:
        </label>
      </div>

      <div className="mb-3 form-floating">
        <select
          className={`form-select ${error.category ? "is-invalid" : null}`}
          id="category"
          name="category"
          value={invoice.category}
          onChange={handleChangeSelect}
        >
          <option value="0">Select category</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="form-label" htmlFor="category">
          Category:
        </label>
        {!error.category ? null : <small>{error.category}</small>}
      </div>

      <h4>Expense</h4>
      <div className="mb-3 form-floating">
        <input
          className={`form-control ${error.description ? "is-invalid" : null}`}
          type="text"
          id="description"
          name="description"
          value={expense.description}
          onChange={handleChange}
        />
        <label className="form-label" htmlFor="description">
          Description:
        </label>
        {!error.description ? null : <small>{error.description}</small>}
      </div>

      <div className="mb-3 form-floating">
        <input
          className="form-control"
          type="number"
          id="price"
          name="price"
          value={expense.price}
          onChange={handleChange}
        />
        <label className="form-label" htmlFor="price">
          Unit cost:
        </label>
        {!error.price ? null : <small>{error.price}</small>}
      </div>

      <div className="mb-3 form-floating">
        <input
          className={`form-control ${error.amount ? "is-invalid" : null}`}
          type="number"
          id="amount"
          name="amount"
          value={amount}
          onChange={handleAmount}
        />
        <label className="form-label" htmlFor="amount">
          Number of Expenses:
        </label>
        {!error.amount ? null : <small>{error.amount}</small>}
      </div>

      <button className="btn btn-primary" type="submit">
        Add Expense
      </button>
    </form>
  );
}

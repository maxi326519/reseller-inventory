import { Timestamp } from "firebase/firestore";
import { Expense } from "./interfaces";

export const initExpense: Expense = {
  id: 0,
  date: Timestamp.fromDate(new Date()),
  category: "0",
  description: "",
  price: "",
  invoiceId: 0,
  productId: 0,
};

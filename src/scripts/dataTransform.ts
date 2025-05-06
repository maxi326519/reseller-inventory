import { Expense, Invoice, Item, Sale } from "../interfaces/interfaces";
import { db } from "../firebase/config";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  writeBatch,
} from "firebase/firestore";

export function getAllData() {
  // User ref
  const usersColl = collection(db, "Users");
  const userDoc = doc(usersColl, "IyCaesiBamPlOhsecDJm4G72uww2");

  // Data ref
  const invoicesColl = collection(userDoc, "Invoices");
  const expensesColl = collection(userDoc, "Expenses");
  const itemsColl = collection(userDoc, "Items");
  const salesColl = collection(userDoc, "Sales");

  // Save data
  const invoicesData: any[] = [];
  const expensesData: any[] = [];
  const itemsData: any[] = [];
  const salesData: any[] = [];

  // Get data
  getDocs(invoicesColl).then((snapshot) => {
    snapshot.forEach((doc) =>
      invoicesData.push({ ...doc.data(), idKey: doc.id })
    );
    localStorage.setItem("Invoices", JSON.stringify(invoicesData));
  });
  getDocs(expensesColl).then((snapshot) => {
    snapshot.forEach((doc) =>
      expensesData.push({ ...doc.data(), idKey: doc.id })
    );
    localStorage.setItem("Expenses", JSON.stringify(expensesData));
  });
  getDocs(itemsColl).then((snapshot) => {
    snapshot.forEach((doc) => itemsData.push({ ...doc.data(), idKey: doc.id }));
    localStorage.setItem("Items", JSON.stringify(itemsData));
  });
  getDocs(salesColl).then((snapshot) => {
    snapshot.forEach((doc) => salesData.push({ ...doc.data(), idKey: doc.id }));
    localStorage.setItem("Sales", JSON.stringify(salesData));
  });
}

export function updateItems() {
  let items = JSON.parse(localStorage.getItem("Items") || "");
  let sales = JSON.parse(localStorage.getItem("Sales") || "");

  let errors: Array<{ type: string; id: number; description: string }> = [];

  let newItems = items.map((data: any): Item => {
    let newItem: Item = {
      id: data.id,
      date: data.date,
      state: data.state,
      cost: Number(data.cost),
      description: data.description,
      invoiceId: Number(data.invoiceId),
      location: data.location,
    };

    console.log(data.date);
    console.log(new Date(data.date.seconds * 1000));

    // If saleDate exist
    if (data.saleDate) {
      // Find sale of item
      const itemSale = sales.find(
        (sale: any) => Number(sale.productId) === Number(data.id)
      );
      if (itemSale) {
        newItem.sales = [
          {
            id: Number(data.id + "0"),
            saleDate: itemSale.date,
          },
        ];
      } else {
        errors.push({
          type: "Item",
          id: data.id,
          description: "No se encontro la venta",
        });
      }
    }

    // If expired exist
    if (data.expired) {
      newItem.expired = data.expired;
    }

    return newItem;
  });

  console.log("New Items: ", newItems);
  console.log("Errores", errors);

  // User ref
  const newusersColl = collection(db, "Users");
  const newuserDoc = doc(newusersColl, "IyCaesiBamPlOhsecDJm4G72uww2");

  // Data ref
  const newitemsColl = collection(newuserDoc, "Items");

  const batch = writeBatch(db);
  const batch2 = writeBatch(db);

  let counter = 0;

  newItems.forEach((data: Item) => {
    if (counter < 450) {
      batch.update(doc(newitemsColl, data.id.toString()), { ...data });
    } else {
      batch2.update(doc(newitemsColl, data.id.toString()), { ...data });
    }
    counter++;
  });
}

export function updateData() {
  let invoices = JSON.parse(localStorage.getItem("Invoices") || "");
  let expenses = JSON.parse(localStorage.getItem("Expenses") || "");
  let items = JSON.parse(localStorage.getItem("Items") || "");
  let sales = JSON.parse(localStorage.getItem("Sales") || "");

  let errors: Array<{ type: string; id: number; description: string }> = [];

  let newInvoices = invoices.map(
    (data: any): Invoice => ({
      id: data.idKey,
      type: Number(data.type),
      date: Timestamp.fromDate(new Date(data.date.seconds * 1000)),
      items: data.items.length || 0,
      form: data.form || "",
      source: data.source || "",
      total: Number(data.total),
      image: data.image,
      imageRef: data.imageRef,
    })
  );

  let newItems = items.map((data: any): Item => {
    let newItem: Item = {
      id: data.id,
      date: Timestamp.fromDate(new Date(data.date.seconds * 1000)),
      state: data.state,
      cost: Number(data.cost),
      description: data.description,
      invoiceId: Number(data.invoiceId),
      location: data.location,
    };

    // If saleDate exist
    if (data.saleDate) {
      // Find sale of item
      const itemSale = sales.find(
        (sale: any) => Number(sale.productId) === Number(data.id)
      );
      if (itemSale) {
        newItem.sales = [
          {
            id: Number(data.id + "0"),
            saleDate: itemSale.date,
          },
        ];
      } else {
        errors.push({
          type: "Item",
          id: data.id,
          description: "No se encontro la venta",
        });
      }
    }

    // If expired exist
    if (data.expired) {
      newItem.expired = data.expired;
    }

    return newItem;
  });

  let newExpenses: Expense[] = expenses.map((data: any): Expense => {
    let newExpense: Expense = {
      id: data.idKey,
      date: Timestamp.fromDate(new Date(data.date.seconds * 1000)),
      price: Number(data.price),
      category: data.category,
      description: data.description,
      invoiceId: 0,
      productId: data.id,
    };

    const item = items.find((item: any) => item.id === newExpense.productId);

    if (item) {
      newExpense.invoiceId = item.invoiceId;
    } else {
      errors.push({
        type: "Expense",
        id: data.id,
        description: `No se encontro el item: ${data.productId}`,
      });
    }

    return newExpense;
  });

  newExpenses = newExpenses.filter(
    (expense) =>
      !errors.some(
        (error) => error.type === "Expense" && error.id === expense.productId
      )
  );

  let newSales = sales.map((data: any): Sale => {
    const newSale: Sale = {
      id: Number(data.productId + "0"),
      date: Timestamp.fromDate(new Date(data.date.seconds * 1000)),
      cost: Number(data.cost),
      price: Number(data.price),
      productId: Number(data.productId),
      invoiceId: 0,
      shipment: {
        amount: Number(data.shipment.amount) || 0,
        value: data.shipment.value,
      },
    };

    const item = items.find((item: any) => item.id === newSale.productId);

    if (item) {
      newSale.invoiceId = item.invoiceId;
    } else {
      errors.push({
        type: "Sale",
        id: data.id,
        description: `No se encontro el item: ${data.productId}`,
      });
    }

    return newSale;
  });

  console.log("New Invoices: ", newInvoices);
  console.log("New Expenses: ", newExpenses);
  console.log("New Items: ", newItems);
  console.log("New Sales: ", newSales);

  console.log("Errores", errors);

  // User ref
  const newusersColl = collection(db, "Users");
  const newuserDoc = doc(newusersColl, "IyCaesiBamPlOhsecDJm4G72uww2");

  // Data ref
  const newinvoicesColl = collection(newuserDoc, "Invoices");
  const newexpensesColl = collection(newuserDoc, "Expenses");
  const newitemsColl = collection(newuserDoc, "Items");
  const newsalesColl = collection(newuserDoc, "Sales");

  const batch = writeBatch(db);
  const batch2 = writeBatch(db);
  const batch3 = writeBatch(db);

  newInvoices.forEach((data: Invoice) => {
    batch.set(doc(newinvoicesColl, data.id.toString()), data);
  });

  newExpenses.forEach((data: Expense) => {
    batch.set(doc(newexpensesColl, data.id.toString()), data);
  });

  newSales.forEach((data: Sale) => {
    batch.set(doc(newsalesColl, data.id.toString()), data);
  });

  let counter = 0;

  newItems.forEach((data: Item) => {
    if (counter < 450) {
      batch2.set(doc(newitemsColl, data.id.toString()), data);
    } else {
      batch3.set(doc(newitemsColl, data.id.toString()), data);
    }

    counter++;
  });

  batch.commit();
  batch2.commit();
  batch3.commit();
}

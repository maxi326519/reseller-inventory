import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { closeLoading, loading } from "../../../redux/actions/loading";
import { logOut } from "../../../redux/actions/login";
import swal from "sweetalert";

import style from "./List.module.css";

interface Prop {
  active: boolean;
}

export default function List({ active }: Prop) {
  const dispatch = useDispatch();
  const redirect = useNavigate();

  function handleLogOut() {
    swal({
      text: "¿Are you sure you want to log out?",
      buttons: {
        Yes: true,
        No: true
      }
    }).then((response) => {
      if (response === "Yes") {
        dispatch(loading());
        dispatch<any>(logOut())
          .then(() => {
            dispatch(closeLoading());
            redirect("/login");
          })
          .catch(() => {
            dispatch(closeLoading());
          });
      }
    });
  }

  return (
    <div className={`${style.btnContainer} ${active ? style.menu : ""}`}>
      <Link className="btn btn-primary" to="/newPurchase">
        Add New Purchase
      </Link>
      <Link className="btn btn-primary" to="/inventory">
        Inventory
      </Link>
      <Link className="btn btn-primary" to="/invoices">
        Invoices
      </Link>
      <Link className="btn btn-primary" to="/addExpense">
        Add Business Expense
      </Link>
      <Link className="btn btn-primary" to="/reports">
        Reports
      </Link>
      <button className="btn btn-primary" type="button" onClick={handleLogOut}>
        Logout
      </button>
    </div>
  );
}

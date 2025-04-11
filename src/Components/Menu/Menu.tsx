import { useState } from "react";

import List from "./List/List";

import Charts from "./Charts/Charts";
import img from "../../assets/img/logo.png";
import menu from "../../assets/svg/menu.svg";
import close from "../../assets/svg/close.svg";

import style from "./Menu.module.css";
import ChangeLocation from "../ChangeLocation/ChangeLocation";

export default function Menu() {
  const [active, setActive] = useState<boolean>(false);
  const [location, setLocation] = useState<boolean>(false);

  function handleActive() {
    setActive(!active);
  }

  return (
    <div className={style.container}>
      {location && <ChangeLocation onClose={() => setLocation(false)} />}
      <img className={style.image} src={img} alt="logo" />
      <div className={style.dataContainer}>
        <div className={style.navBar} onClick={handleActive}>
          {active ? (
            <img src={active ? close : menu} alt="menu" />
          ) : (
            <img src={active ? close : menu} alt="menu" />
          )}
        </div>
        <List
          active={active}
          onClose={() => setActive(false)}
          openModal={() => setLocation(true)}
        />
        <Charts />
      </div>
    </div>
  );
}

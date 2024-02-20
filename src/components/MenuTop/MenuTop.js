import React from "react";
import { CreditCardOutlined } from "@ant-design/icons";
import "./MenuTop.css";

const MenuTop = () => {
  return (
    <div className="menu-top">
      <h1>Expense Tracker</h1>
      <CreditCardOutlined />
    </div>
  );
};

export default MenuTop;

import React from "react";
import { BsFillInboxFill } from "react-icons/bs";

const EmptyTransactionList = () => {
  return (
    <div className="empty">
      <span>Brak elementów :/</span>
      <BsFillInboxFill />
    </div>
  );
};

export default EmptyTransactionList;

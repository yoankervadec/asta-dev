//
// client/src/pages/Transactions/index.jsx

import React, { useState } from "react";
import useFetchTransactions from "../../hooks/fetch/transactions/useFetchTransactions";

import TransactionsTable from "./TransactionsTable";
import NavigationBar from "../../components/NavigationBar";
import InputBox from "../../components/InputBox";
import Loading from "../../components/loaders/Loading";

const Transactions = () => {
  const [filterText, setFilterText] = useState("");

  const { data, isLoading } = useFetchTransactions();
  const rows = data?.data?.transactions || [];

  const navIcons = [
    {
      type: "link",
      to: "/home",
      title: "Home",
      icon: "fas fa-house",
    },
  ];

  return (
    <div className="content-wrapper">
      <div className="content">
        <div className="action-header-container">
          <InputBox inputValue={filterText} setInputValue={setFilterText} />
        </div>
        <TransactionsTable rows={rows} />
      </div>
      <NavigationBar navIcons={navIcons} />
    </div>
  );
};

export default Transactions;

//
// client/src/pages/CustomerOrders/index.jsx

import React, { useState } from "react";
import useFetchCustomerOrders from "../../hooks/fetch/customerOrders/useFetchCustomerOrders";
import { fuzzySearch } from "../../utils/fuzzySearch";
import { useUserFilters } from "../../hooks/useUserFilters";

import Loading from "../../components/loaders/Loading";
import InputBox from "../../components/InputBox";
import UserFilterPanel from "../../components/userFilterPanel";
import NavigationBar from "../../components/NavigationBar";
import CustomerOrdersTable from "./CustomerOrdersTable";

const defaultFilters = {
  posted: "",
  quote: "",
};

const CustomerOrders = () => {
  const { filters, setFilters } = useUserFilters(
    defaultFilters,
    "customerOrdersFilters"
  );
  const [filterText, setFilterText] = useState("");
  const { data, isLoading } = useFetchCustomerOrders(filters);

  const rows = data?.data?.groupedOrders || [];

  const filteredRows = fuzzySearch(
    rows,
    filterText,
    ["customer.name", "customer.contact.email"],
    ["meta.orderNo", "customer.contact.phone"]
  );

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
      {isLoading ? <Loading /> : null}
      <div className="content">
        <div className="action-header-container">
          <InputBox inputValue={filterText} setInputValue={setFilterText} />
          <UserFilterPanel filters={filters} setFilters={setFilters} />
        </div>
        <CustomerOrdersTable rows={filteredRows} />
      </div>
      <NavigationBar navIcons={navIcons} />
    </div>
  );
};

export default CustomerOrders;

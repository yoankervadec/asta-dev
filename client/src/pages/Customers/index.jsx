//
// client/src/pages/Customers/index.jsx

import React, { useState } from "react";
import useFetchCustomers from "../../hooks/fetch/customers/useFetchCustomers";
import { fuzzySearch } from "../../utils/fuzzySearch";

import NavigationBar from "../../components/NavigationBar";
import InputBox from "../../components/InputBox";
import CustomersTable from "./CustomersTable";
import Loading from "../../components/loaders/Loading";
import CreateCustomerModal from "./CreateCustomerModal";

import usePostSelectCustomer from "../../hooks/fetch/customers/usePostSelectCustomer";

const Customers = () => {
  const [filterText, setFilterText] = useState("");
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const postSelectCustomer = usePostSelectCustomer();

  const { data, isLoading } = useFetchCustomers();
  const rows = data?.data?.clients || [];

  const filteredRows = fuzzySearch(
    rows,
    filterText,
    [
      "names.name",
      "name.name2",
      "contact.email",
      "location.address",
      "location.city",
      "location.postalCode",
      "extra.extra",
    ],
    ["clientId", "contact.phone"]
  );

  const handleSelectClient = (clientId) => {
    setSelectedClientId(clientId);
  };

  const handlePostSelectCustomer = () => {
    if (!selectedClientId || postSelectCustomer.isPending) return;
    postSelectCustomer.mutate({ clientId: selectedClientId });
  };

  const navIcons = [
    {
      type: "link",
      to: "/home",
      title: "Home",
      icon: "fas fa-house",
    },
    {
      type: "button",
      title: "Select customer",
      icon: "fas fa-check",
      onClick: () => handlePostSelectCustomer(),
    },
    {
      type: "button",
      title: "New Customer",
      icon: "fas fa-user-plus",
      onClick: () => setShowNewCustomerModal(true),
    },
  ];

  return (
    <div className="content-wrapper">
      {(isLoading || postSelectCustomer.isPending) && <Loading />}
      <div className="content">
        <div className="action-header-container">
          <InputBox inputValue={filterText} setInputValue={setFilterText} />
        </div>
        <CustomersTable
          rows={filteredRows}
          onSelectClient={handleSelectClient}
          selectedClientId={selectedClientId}
        />
        {showNewCustomerModal && (
          <CreateCustomerModal onClose={() => setShowNewCustomerModal(false)} />
        )}
      </div>
      <NavigationBar navIcons={navIcons} />
    </div>
  );
};

export default Customers;

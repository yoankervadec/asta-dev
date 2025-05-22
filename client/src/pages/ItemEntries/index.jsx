//
// client/src/pages/ItemEntries/index.jsx

import React, { useState } from "react";
import useFetchItemEntries from "../../hooks/fetch/itemEntries/useFetchItemEntries";
import { fuzzySearch } from "../../utils/fuzzySearch";

import Loading from "../../components/loaders/Loading";
import InputBox from "../../components/InputBox";
import NavigationBar from "../../components/NavigationBar";
import ItemEntriesTable from "./ItemEntriesTable";

const ItemEntries = () => {
  const [filterText, setFilterText] = useState("");

  const { data, isLoading } = useFetchItemEntries();

  const rows = data?.data?.lines || [];

  const filteredRows = fuzzySearch(
    rows,
    filterText,
    ["item.description"],
    ["item.itemNo"]
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
      {isLoading && <Loading />}
      <div className="content">
        <div className="action-header-container">
          <InputBox inputValue={filterText} setInputValue={setFilterText} />
        </div>
        <ItemEntriesTable rows={filteredRows} />
      </div>
      <NavigationBar navIcons={navIcons} />
    </div>
  );
};

export default ItemEntries;

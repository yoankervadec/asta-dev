//
// client/src/pages/Products/index.jsx

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { fetchHelper } from "../../api/fetchHelper";
import useFetchProducts from "../../hooks/fetch/products/useFetchProducts";
import usePostAddToCart from "../../hooks/fetch/products/usePostAddToCart";
import { fuzzySearch } from "../../utils/fuzzySearch";

import Loading from "../../components/loaders/Loading";
import InputBox from "../../components/InputBox";
import NavigationBar from "../../components/NavigationBar";
import ProductsTable from "./ProductsTable";
import ValidateProductsModal from "./ValidateProductsModal";
import CreateProductModal from "./CreateProductModal";

const Products = () => {
  const navigate = useNavigate();
  const postAddToCart = usePostAddToCart();
  const queryClient = useQueryClient();
  const [filterText, setFilterText] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const { data, isLoading } = useFetchProducts();

  const rows = data?.data?.products || [];

  const handleSelectProduct = async (itemNo) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(itemNo)
        ? prevSelected.filter((no) => no !== itemNo)
        : [...prevSelected, itemNo]
    );

    // Prefetch the productCard when selecting a row
    await queryClient.prefetchQuery({
      queryKey: ["productCard", itemNo],
      queryFn: () => fetchHelper(`/product/card/${itemNo}`),
    });
  };

  const handleValidateProducts = () => {
    if (selectedProducts.length > 0) {
      setShowValidateModal(true);
    }
  };

  const handleAddToCard = async ({ itemNo, attribute, quantity, isLast }) => {
    await postAddToCart.mutateAsync({ itemNo, attribute, quantity });
    if (isLast) navigate("/home");
  };

  const filteredRows = fuzzySearch(
    rows,
    filterText,
    ["naming.description", "details.createdByName"], // Fuzzy
    ["itemNo", "naming.description"] // Exact
  );

  const navIcons = [
    {
      type: "link",
      to: "/home",
      title: "Home",
      icon: "fas fa-house",
    },
    {
      type: "button",
      title: "New product",
      icon: "fas fa-plus",
      onClick: () => setShowNewProductModal(true),
    },
    {
      type: "button",
      title: "Add to cart",
      icon: "fas fa-check",
      onClick: () => handleValidateProducts(),
    },
  ];

  return (
    <div className="content-wrapper">
      {isLoading ? <Loading /> : null}
      <div className="content">
        <div className="action-header-container">
          <InputBox inputValue={filterText} setInputValue={setFilterText} />
        </div>
        <ProductsTable
          rows={filteredRows}
          onSelectProduct={handleSelectProduct}
          selectedProducts={selectedProducts}
        />
        {showValidateModal && (
          <ValidateProductsModal
            products={selectedProducts}
            onClose={() => setShowValidateModal(false)}
            onValidate={handleAddToCard}
          />
        )}
        {showNewProductModal && (
          <CreateProductModal onClose={() => setShowNewProductModal(false)} />
        )}
      </div>
      <NavigationBar navIcons={navIcons} />
    </div>
  );
};

export default Products;

//
// client/src/pages/Home/index.jsx

import styles from "./styles.module.css";

import React, { useState } from "react";
import { usePostHelper } from "../../api/postHelper";
import { useModalNavigation } from "../../hooks/useModalNavigation";
import { useQueryClient } from "@tanstack/react-query";
import useFetchPosPage from "../../hooks/fetch/pos/useFetchPosPage";
import usePostAddToCard from "../../hooks/fetch/products/usePostAddToCart";
import usePostVoidLine from "../../hooks/fetch/pos/usePostVoidLine";

import NavigationBar from "../../components/NavigationBar";
import InputBox from "../../components/InputBox";
import Loading from "../../components/loaders/Loading";
import PosTable from "./PosTable";
import PosFooter from "./PosFooter";
import ValidateProductsModal from "../Products/ValidateProductsModal";
import PaymentModal from "./PaymentModal";

const Home = () => {
  // Hooks
  const queryClient = useQueryClient();
  const postAddToCart = usePostAddToCard();
  const postVoidLine = usePostVoidLine();
  // States
  const [userInput, setUserInput] = useState("");
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [validatedProducts, setValidatedProducts] = useState([]);
  const { syncOpenModal } = useModalNavigation();

  const { data, isLoading } = useFetchPosPage();
  const rows = data?.data?.page?.transactionLines || [];
  const footerData = data?.data?.page?.transactionHeader || {};
  const products = data?.data?.products || [];

  const { mutate: voidTransaction, isPending } = usePostHelper(
    "/request/request/void-transaction",
    {}
  );

  const handleVoidTransaction = () => {
    // Check if theres actually something to void
    if (rows.length > 0 || footerData?.client?.clientId !== null) {
      voidTransaction({});
    }
  };

  const handleEnterPress = (inputValue) => {
    setValidatedProducts([inputValue]); // Store input as an array
    setShowValidateModal(true);
  };

  const handleAddToCart = async ({ itemNo, attribute, quantity, isLast }) => {
    await postAddToCart.mutateAsync({ itemNo, attribute, quantity });
  };

  const handleOpenPaymentModal = () => {
    if (rows.length > 0 && footerData?.client?.clientId !== null) {
      setShowPaymentModal(true);
    }
  };

  const handleVoidLine = (lineNo) => {
    if (!postVoidLine.isPending) {
      postVoidLine.mutate(
        {
          lineNo,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["posPage"]);
          },
        }
      );
    }
  };

  const navIcons = [
    {
      type: "link",
      to: "/products",
      title: "Products",
      icon: "fas fa-magnifying-glass",
    },
    {
      type: "link",
      to: "/customers",
      title: "Customers",
      icon: "fas fa-users",
    },
    {
      type: "link",
      to: "/customer-orders",
      title: "Customer orders",
      icon: "fas fa-book",
    },
    {
      type: "link",
      to: "/dashboard",
      title: "Dashboard",
      icon: "fas fa-chart-line",
    },
    {
      type: "link",
      to: "/transactions",
      title: "Transactions",
      icon: "fas fa-list",
    },
    {
      type: "button",
      title: "Void transaction",
      icon: "fas fa-ban",
      onClick: handleVoidTransaction,
    },
    {
      type: "button",
      title: "Payment",
      icon: "fas fa-dollar-sign",
      onClick: handleOpenPaymentModal,
    },
  ];

  return (
    <>
      <div className="content-wrapper">
        {isLoading || (isPending && <Loading />)}
        <div className="content">
          <div className="action-header-container">
            <InputBox
              inputValue={userInput}
              setInputValue={setUserInput}
              onEnter={handleEnterPress}
              dataList={products.map((product) => product.itemNo)}
            />
          </div>
          <PosTable rows={rows} onVoidLine={handleVoidLine} />
          <PosFooter data={footerData} />
          {showValidateModal && (
            <ValidateProductsModal
              products={validatedProducts} // userInput
              onClose={() => setShowValidateModal(false)}
              onValidate={handleAddToCart}
            />
          )}
          {showPaymentModal && (
            <PaymentModal
              data={footerData}
              onClose={() => setShowPaymentModal(false)}
            />
          )}
        </div>
        <NavigationBar navIcons={navIcons} />
      </div>
    </>
  );
};

export default Home;

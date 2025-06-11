//
// client/src/components/modals/CustomerOrderCard/index.jsx

import ASModalWrapper from "../../ASModalWrapper";
import ASModalStyles from "../../ASModalWrapper/styles.module.css";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useModalNavigation } from "../../../hooks/useModalNavigation";
import useFetchCustomerOrderCard from "../../../hooks/fetch/customerOrders/useFetchCustomerOrderCard";
import usePostCancelCoLine from "../../../hooks/fetch/customerOrders/usePostCancelCoLine";
import usePostRequestCancelCoLine from "../../../hooks/fetch/customerOrders/usePostRequestCancelCoLine";
import usePostPayCo from "../../../hooks/fetch/customerOrders/usePostPayCo";
import usePostRequestShipCo from "../../../hooks/fetch/customerOrders/usePostRequestShipCo";
import usePostAddCoLine from "../../../hooks/fetch/customerOrders/usePostAddCoLine";

import SectionInformation from "./SectionInformation";
import SectionCustomer from "./SectionCustomer";
import SectionItems from "./SectionItems";
import SectionPaymentEntries from "./SectionPaymentEntries";
import PaymentModal from "./PaymentModal";
import SmallProductsModal from "../../../pages/Products/SmallProductsModal";
import ValidateProductsModal from "../../../pages/Products/ValidateProductsModal";
import PrintModal from "./PrintModal";

const CustomerOrderCard = ({ isHidden, onClose }) => {
  const queryClient = useQueryClient();
  const { modalParams } = useModalNavigation();
  const orderNo = modalParams?.orderNo;
  const postCancelCoLine = usePostCancelCoLine();
  const requestPostCancelCoLine = usePostRequestCancelCoLine();
  const postPayCo = usePostPayCo();
  const postRequestShipCo = usePostRequestShipCo();
  const postAddCoLine = usePostAddCoLine();

  // States
  const [paymentModalData, setPaymentModalData] = useState({
    isShow: false,
    isRequired: false,
    suggestedAmount: 0,
    paymentMethod: 1,
    lineNo: null, // only for refund
  });
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Fetch and Deconstruct Data
  const { data, isLoading } = useFetchCustomerOrderCard(orderNo ?? null);
  const {
    orderHeader = {},
    orderLines = [],
    paymentEntries = [],
    invoices = [],
  } = data?.data?.customerOrderCard || {};
  const { meta, customer, orderInfo, totals } = orderHeader || {};
  const remainingBalance = totals?.balanceAsDecimal;

  //
  // Payment / Cancel(Refund)
  const handleShowPaymentModal = () => {
    setPaymentModalData({
      isShow: true,
      isRequired: false,
      suggestedAmount: remainingBalance,
      paymentMethod: 1,
      lineNo: null,
    });
  };

  const handleRequestDeleteLine = (lineNo) => {
    const line = orderLines.find((r) => r.lineNo === lineNo);
    // Ignore canceled or shipped lines
    if (line.status.shipped === 1 || line.status.active === 0) return;

    const refundAmountAsDecimal = calculateRefundForLine(lineNo);
    const refundAmount = refundAmountAsDecimal.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
    if (refundAmountAsDecimal < 0) {
      setPaymentModalData({
        isShow: true,
        isRequired: true,
        suggestedAmount: refundAmount,
        paymentMethod: 1,
        lineNo,
      });
    } else {
      if (!requestPostCancelCoLine.isPending) {
        // Send request to confirmation end-point
        requestPostCancelCoLine.mutate({
          orderNo: meta.orderNo,
          lineNo,
        });
      }
    }
  };

  // Helper for cancelation(refund)
  const calculateRefundForLine = (lineNo) => {
    const line = orderLines.find((r) => r.lineNo === lineNo);
    const canceledAmount = line?.pricing?.lineTotalAsDecimal || 0;

    return remainingBalance - canceledAmount;
  };

  const handleSubmitPayment = () => {
    if (!paymentModalData) return;

    const { isRequired, paymentMethod, suggestedAmount, lineNo } =
      paymentModalData;

    if (isRequired) {
      // From cancelation
      if (!postCancelCoLine.isPending) {
        postCancelCoLine.mutate(
          {
            orderNo: meta.orderNo,
            lineNo,
            paymentMethod,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries([
                "customerOrderCard",
                meta.orderNo,
              ]);
            },
          }
        );
      }
    } else {
      // Regular payment
      if (!postPayCo.isPending) {
        postPayCo.mutate(
          {
            orderNo: meta.orderNo,
            paymentMethod,
            paymentAmount: suggestedAmount,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries([
                "customerOrderCard",
                meta.orderNo,
              ]);
            },
          }
        );
      }
    }

    setPaymentModalData(null);
  };

  //
  // Ship line
  const handleShip = () => {
    if (!postCancelCoLine.isPending) {
      postRequestShipCo.mutate({ orderNo: meta.orderNo });
    }
  };

  //
  // Add Product(s) to Order
  const handleShowProductsModal = () => {
    setShowProductsModal(true);
  };

  const handleSelectProduct = async (itemNo) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(itemNo)
        ? prevSelected.filter((no) => no !== itemNo)
        : [...prevSelected, itemNo]
    );
  };

  const handleValidateProducts = () => {
    if (selectedProducts.length > 0) {
      setShowValidateModal(true);
    }
  };

  const handleAddCoLine = async ({ itemNo, attribute, quantity, isLast }) => {
    await postAddCoLine.mutateAsync(
      {
        orderNo: meta.orderNo,
        itemNo,
        quantity,
        attribute,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["customerOrderCard", meta.orderNo]);
          // Close small products table and clear selected products
          if (isLast) {
            setShowProductsModal(false);
            setSelectedProducts([]);
          }
        },
      }
    );
  };

  // Handle Open PrintModal
  const handleShowPrintModal = () => {
    setShowPrintModal(true);
  };

  if (!modalParams) return null;
  return (
    <ASModalWrapper isHidden={isHidden} onClose={onClose} size="fullScreen">
      <div className={ASModalStyles.stickyTitleBar}>
        <div className={ASModalStyles.title}>
          <h3>{`Customer Order ${"\u2022"} ${customer?.name || ""}`}</h3>
        </div>
        <div className={ASModalStyles.titleButtons}>
          <button
            className="small-btn cancel-btn"
            onClick={() => handleShip()}
            disabled={meta?.toggles?.shipDisable}
          >
            <i className="fas fa-truck-fast"></i>Ship
          </button>
          <button
            className="small-btn cancel-btn"
            onClick={() => handleShowPaymentModal()}
            disabled={meta?.toggles?.payDisable}
          >
            <i className="fas fa-dollar-sign"></i>Pay
          </button>
          <button
            className="small-btn cancel-btn"
            disabled={meta?.toggles?.convertDisable}
          >
            <i className="fas fa-repeat"></i>
            Convert to order
          </button>
          <button
            className="small-btn cancel-btn"
            onClick={() => {
              // downloadPdf(`/pdf/order-card`, orderNo);
              handleShowPrintModal();
            }}
          >
            <i className="fas fa-file-pdf"></i>Export
          </button>
        </div>
      </div>

      {/* Sections ... */}
      <div className={ASModalStyles.modalBody}>
        <SectionInformation meta={meta} data={orderHeader} />
        <SectionCustomer meta={meta} data={customer} />
        <SectionItems
          rows={orderLines}
          meta={meta}
          onDeleteLine={handleRequestDeleteLine}
          onOpenAddItem={handleShowProductsModal}
        />
        <SectionPaymentEntries rows={paymentEntries} />
      </div>
      <div className="btn-container">
        <button onClick={onClose} className="regular-btn cancel-btn">
          Close
        </button>
      </div>

      {/* Modals ... */}
      {paymentModalData?.isShow && (
        <PaymentModal
          isRequired={paymentModalData.isRequired}
          onClose={() => setPaymentModalData(null)}
          suggestedAmount={paymentModalData.suggestedAmount}
          paymentMethod={paymentModalData.paymentMethod}
          paymentAmount={paymentModalData.suggestedAmount}
          onChange={(field, value) =>
            setPaymentModalData((prev) => ({ ...prev, [field]: value }))
          }
          onSubmit={handleSubmitPayment}
        />
      )}
      {showProductsModal && (
        <SmallProductsModal
          onClose={() => setShowProductsModal(false)}
          onSelectProduct={handleSelectProduct}
          selectedProducts={selectedProducts}
          onValidateProduct={handleValidateProducts}
        />
      )}
      {showValidateModal && (
        <ValidateProductsModal
          products={selectedProducts}
          onClose={() => setShowValidateModal(false)}
          onValidate={handleAddCoLine}
        />
      )}
      {showPrintModal && (
        <PrintModal
          onClose={() => setShowPrintModal(false)}
          order={orderHeader}
          invoices={invoices}
        />
      )}
    </ASModalWrapper>
  );
};

export default CustomerOrderCard;

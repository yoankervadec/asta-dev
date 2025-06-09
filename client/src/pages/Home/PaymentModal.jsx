//
// client/src/pages/Home/PaymentModal.jsx

import React from "react";

import InputCell from "../../components/Inputcell";
import useFormField from "../../hooks/useFormField";

import { useQueryClient } from "@tanstack/react-query";
import usePostCreateOrder from "../../hooks/fetch/pos/usePostCreateOrder";

import styles from "../../modals/global/ProductModal/styles.module.css";

const PaymentModal = ({ onClose, data }) => {
  const queryClient = useQueryClient();
  const postCreateOrder = usePostCreateOrder();
  const updateUrl = `/pos/update-header`;
  const refetchQueries = ["posPage"];

  const { client, details, payment, totals } = data || {};

  const handleCreateOrder = () => {
    if (!postCreateOrder.isPending) {
      postCreateOrder.mutate(
        {},
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["posPage"]);
            onClose();
          },
        }
      );
    }
  };

  const {
    value: clientName,
    handleChange: handleClientNameChange,
    handleBlur: handleClientNameBlur,
    isLoading: isLoadingClientName,
  } = useFormField(
    client?.clientName ?? "",
    client?.clientName,
    updateUrl,
    `clientName`,
    refetchQueries
  );
  const {
    value: clientAddress,
    handleChange: handleClientAddressChange,
    handleBlur: handleClientAddressBlur,
    isLoading: isLoadingClientAddress,
  } = useFormField(
    client?.location?.address ?? "",
    client?.location?.address,
    updateUrl,
    `clientAddress`,
    refetchQueries
  );
  const {
    value: clientCity,
    handleChange: handleClientCityChange,
    handleBlur: handleClientCityBlur,
    isLoading: isLoadingClientCity,
  } = useFormField(
    client?.location?.city ?? "",
    client?.location?.city,
    updateUrl,
    `clientCity`,
    refetchQueries
  );
  const {
    value: clientPostalCode,
    handleChange: handleClientPostalCodeChange,
    handleBlur: handleClientPostalCodeBlur,
    isLoading: isLoadingClientPostalCode,
  } = useFormField(
    client?.location?.postalCode ?? "",
    client?.location?.postalCode,
    updateUrl,
    `clientPostalCode`,
    refetchQueries
  );
  const {
    value: clientPhone,
    handleChange: handleClientPhoneChange,
    handleBlur: handleClientPhoneBlur,
    isLoading: isLoadingClientPhone,
  } = useFormField(
    client?.contact?.phone ?? "",
    client?.contact?.phone,
    updateUrl,
    `clientPhone`,
    refetchQueries
  );
  const {
    value: clientPhone2,
    handleChange: handleClientPhone2Change,
    handleBlur: handleClientPhone2Blur,
    isLoading: isLoadingClientPhone2,
  } = useFormField(
    client?.contact?.phone2 ?? "",
    client?.contact?.phone2,
    updateUrl,
    `clientPhone2`,
    refetchQueries
  );
  const {
    value: clientEmail,
    handleChange: handleClientEmailChange,
    handleBlur: handleClientEmailBlur,
    isLoading: isLoadingClientEmail,
  } = useFormField(
    client?.contact?.email ?? "",
    client?.contact?.email,
    updateUrl,
    `clientEmail`,
    refetchQueries
  );
  const {
    value: orderExtra,
    handleChange: handleOrderExtraChange,
    handleBlur: handleOrderExtraBlur,
    isLoading: isLoadingOrderExtra,
  } = useFormField(
    details?.orderExtra ?? "",
    details?.orderExtra,
    updateUrl,
    `orderExtra`,
    refetchQueries
  );
  const {
    value: quote,
    handleChange: handleQuoteChange,
    handleBlur: handleQuoteBlur,
    isLoading: isLoadingQuote,
  } = useFormField(
    !!details?.isQuote,
    !!details?.isQuote,
    updateUrl,
    `quote`,
    refetchQueries
  );
  const {
    value: requiredDate,
    handleChange: handleRequiredDateChange,
    handleBlur: handleRequiredDateBlur,
    isLoading: isLoadingRequiredDate,
  } = useFormField(
    details?.requiredDate ?? "",
    details?.requiredDate,
    updateUrl,
    `requiredDate`,
    refetchQueries
  );
  const {
    value: paymentMethod,
    handleChange: handlePaymentMethodChange,
    handleBlur: handlePaymentMethodBlur,
    isLoading: isLoadingPaymentMethod,
  } = useFormField(
    payment?.paymentMethodId ?? "",
    payment?.paymentMethodId,
    updateUrl,
    `paymentMethod`,
    refetchQueries
  );
  const {
    value: paymentAmount,
    handleChange: handlePaymentAmountChange,
    handleBlur: handlePaymentAmountBlur,
    isLoading: isLoadingPaymentAmount,
  } = useFormField(
    payment?.paymentAmountToString ?? "",
    payment?.paymentAmountToString,
    updateUrl,
    `paymentAmount`,
    refetchQueries
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content medium-modal-container">
        <div className="modal-content-wrapper">
          <div className={styles.productCardContainer}>
            <div className={styles.mainTitleWrapper}>
              <div className={styles.titleContent}>
                <h3>{`Validation and Payment ${"\u2022"} ${
                  client?.clientName ?? ""
                }`}</h3>
                <div className={styles.mainButtonWrapper}></div>
              </div>
            </div>
            <div className={styles.productCardContent}>
              <section className="df-section-wrapper">
                <div className="df-section-title">
                  <h3>Information</h3>
                </div>
                <div
                  className="df-section-content-wrapper"
                  style={{ "--column-width": "25em" }}
                >
                  <div className="df-section-content">
                    <h4>Client</h4>
                    <InputCell
                      label="Client ID :"
                      type="number"
                      value={client?.clientId}
                      readOnly
                      disabled
                    />
                    <InputCell
                      label="Name :"
                      value={clientName}
                      onChange={handleClientNameChange}
                      onBlur={() => handleClientNameBlur()}
                      readOnly={isLoadingClientName}
                    />
                    <InputCell
                      label="Address :"
                      value={clientAddress}
                      onChange={handleClientAddressChange}
                      onBlur={() => handleClientAddressBlur()}
                      readOnly={isLoadingClientAddress}
                    />
                    <InputCell
                      label="City :"
                      value={clientCity}
                      onChange={handleClientCityChange}
                      onBlur={() => handleClientCityBlur()}
                      readOnly={isLoadingClientCity}
                    />
                    <InputCell
                      label="Postal Code :"
                      value={clientPostalCode}
                      onChange={handleClientPostalCodeChange}
                      onBlur={() => handleClientPostalCodeBlur()}
                      readOnly={isLoadingClientPostalCode}
                    />
                  </div>
                  <div className="df-section-content">
                    <h4>Contact</h4>
                    <InputCell
                      label="Phone :"
                      value={clientPhone}
                      onChange={handleClientPhoneChange}
                      onBlur={() => handleClientPhoneBlur()}
                      readOnly={isLoadingClientPhone}
                    />
                    <InputCell
                      label="Phone2 :"
                      value={clientPhone2}
                      onChange={handleClientPhone2Change}
                      onBlur={() => handleClientPhone2Blur()}
                      readOnly={isLoadingClientPhone2}
                    />
                    <InputCell
                      label="Email :"
                      value={clientEmail}
                      onChange={handleClientEmailChange}
                      onBlur={() => handleClientEmailBlur()}
                      readOnly={isLoadingClientEmail}
                    />
                  </div>
                  <div className="df-section-content">
                    <h4>General Comments</h4>
                    <InputCell
                      label="General Comments :"
                      value={orderExtra}
                      onChange={handleOrderExtraChange}
                      onBlur={() => handleOrderExtraBlur()}
                      readOnly={isLoadingOrderExtra}
                    />
                  </div>
                  <div className="df-section-content">
                    <h4>Totals</h4>
                    <InputCell
                      label="Subtotal :"
                      value={totals?.subtotalToString}
                      readOnly
                      disabled
                    />
                    <InputCell
                      label="Total Discount :"
                      value={totals?.discountAmountToString}
                      readOnly
                      disabled
                    />
                    <InputCell
                      label="TPS :"
                      value={totals?.pstAmountToString}
                      readOnly
                      disabled
                    />
                    <InputCell
                      label="TVQ :"
                      value={totals?.gstAmountToString}
                      readOnly
                      disabled
                    />
                    <InputCell
                      label="Total :"
                      value={totals?.totalAmountToString}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="df-section-content">
                    <h4>Details</h4>
                    <InputCell
                      label="Quote :"
                      type="toggle"
                      value={quote}
                      onChange={handleQuoteChange}
                      onBlur={handleQuoteBlur()}
                      readOnly={isLoadingQuote}
                    />
                    <InputCell
                      label="Required Date :"
                      type="date"
                      value={requiredDate}
                      onChange={handleRequiredDateChange}
                      onBlur={() => handleRequiredDateBlur()}
                      readOnly={isLoadingRequiredDate}
                    />
                  </div>
                  <div className="df-section-content">
                    <h4>Payment</h4>
                    <InputCell
                      label="Payment Method :"
                      type="select"
                      value={paymentMethod}
                      onChange={handlePaymentMethodChange}
                      onBlur={handlePaymentMethodBlur()}
                      options={[
                        { label: "Cash", value: 1 },
                        { label: "Cheque", value: 2 },
                        { label: "E-transfer", value: 3 },
                      ]}
                      disabled={isLoadingPaymentMethod}
                    />
                    <InputCell
                      label="Payment Amount :"
                      value={paymentAmount}
                      onChange={handlePaymentAmountChange}
                      onBlur={() => handlePaymentAmountBlur()}
                      readOnly={isLoadingPaymentAmount}
                    />
                  </div>
                </div>
              </section>
            </div>
            <div className="btn-container">
              <button className="regular-btn cancel-btn" onClick={onClose}>
                Close
              </button>
              <button
                className="regular-btn confirm-btn"
                onClick={() => handleCreateOrder()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

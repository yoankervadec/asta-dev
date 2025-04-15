//
// client/src/components/modals/CustomerOrderCard/SectionCustomer.jsx

import React, { useEffect, useState } from "react";
import useFormField from "../../../hooks/useFormField";
import { useModalNavigation } from "../../../hooks/useModalNavigation";

import InputCell from "../../Inputcell";

const SectionCustomer = ({ meta, data }) => {
  const { syncOpenModal } = useModalNavigation();
  const { contact, location, details } = data || {};

  const [modifyDisable, setModifyDisable] = useState(true);

  useEffect(() => {
    setModifyDisable(meta?.toggles?.modifyDisable ?? true);
  }, [meta?.toggles?.modifyDisable]); // Depend on actual prop

  // UseFormField
  const updateUrl = `/customer-order/card/alter/${meta?.orderNo}`;
  const refetchQueries = ["customerOrderCard", meta?.orderNo];

  const {
    value: clientName,
    handleChange: handleClientNameChange,
    handleBlur: handleClientNameBlur,
  } = useFormField(
    data?.name ?? "",
    data?.name,
    updateUrl,
    `clientName`,
    refetchQueries
  );
  const {
    value: clientName2,
    handleChange: handleClientName2Change,
    handleBlur: handleClientName2Blur,
  } = useFormField(
    data?.name2 ?? "",
    data?.name2,
    updateUrl,
    `clientName2`,
    refetchQueries
  );
  const {
    value: clientExtra,
    handleChange: handleClientExtraChange,
    handleBlur: handleClientExtraBlur,
  } = useFormField(
    details?.extra ?? "",
    details?.extra,
    updateUrl,
    `clientExtra`,
    refetchQueries
  );
  const {
    value: clientPhone,
    handleChange: handleClientPhoneChange,
    handleBlur: handleClientPhoneBlur,
  } = useFormField(
    contact?.phone ?? "",
    contact?.phone,
    updateUrl,
    `clientPhone`,
    refetchQueries
  );
  const {
    value: clientPhone2,
    handleChange: handleClientPhone2Change,
    handleBlur: handleClientPhone2Blur,
  } = useFormField(
    contact?.phone2 ?? "",
    contact?.phone2,
    updateUrl,
    `clientPhone2`,
    refetchQueries
  );
  const {
    value: clientEmail,
    handleChange: handleClientEmailChange,
    handleBlur: handleClientEmailBlur,
  } = useFormField(
    contact?.email ?? "",
    contact?.email,
    updateUrl,
    `clientEmail`,
    refetchQueries
  );
  const {
    value: clientAddress,
    handleChange: handleClientAddressChange,
    handleBlur: handleClientAddressBlur,
  } = useFormField(
    location?.address ?? "",
    location?.address,
    updateUrl,
    `clientAddress`,
    refetchQueries
  );
  const {
    value: clientCity,
    handleChange: handleClientCityChange,
    handleBlur: handleClientCityBlur,
  } = useFormField(
    location?.city ?? "",
    location?.city,
    updateUrl,
    `clientCity`,
    refetchQueries
  );
  const {
    value: clientPostalCode,
    handleChange: handleClientPostalCodeChange,
    handleBlur: handleClientPostalCodeBlur,
  } = useFormField(
    location?.postalCode ?? "",
    location?.postalCode,
    updateUrl,
    `clientPostalCode`,
    refetchQueries
  );

  return (
    <section
      className="df-section-wrapper"
      style={{ "--column-width": "22em" }}
    >
      <div className="df-section-title">
        <h3>Customer</h3>
      </div>
      <div
        className="df-section-content-wrapper"
        style={{ "--column-width": "22em" }}
      >
        <div className="df-section-content">
          <h4>General</h4>
          <InputCell
            label="Customer ID&nbsp;:"
            value={data?.clientId}
            readOnly
            onClick={() =>
              syncOpenModal("clientCard", { clientId: data?.clientId })
            }
          />
          <InputCell
            label="Name&nbsp;:"
            value={clientName}
            onChange={handleClientNameChange}
            onBlur={() => handleClientNameBlur()}
            readOnly={modifyDisable}
          />
          <InputCell
            label="Name2&nbsp;:"
            value={clientName2}
            onChange={handleClientName2Change}
            onBlur={() => handleClientName2Blur()}
            readOnly={modifyDisable}
          />
        </div>
        <div className="df-section-content">
          <h4>Contact</h4>
          <InputCell
            label="Phone&nbsp;:"
            value={clientPhone}
            onChange={handleClientPhoneChange}
            onBlur={() => handleClientPhoneBlur()}
            readOnly={modifyDisable}
          />
          <InputCell
            label="Phone2&nbsp;:"
            value={clientPhone2}
            onChange={handleClientPhone2Change}
            onBlur={() => handleClientPhone2Blur()}
            readOnly={modifyDisable}
          />
          <InputCell
            label="Email&nbsp;:"
            value={clientEmail}
            onChange={handleClientEmailChange}
            onBlur={() => handleClientEmailBlur()}
            readOnly={modifyDisable}
          />
        </div>
        <div className="df-section-content">
          <h4>Address</h4>
          <InputCell
            label="Address&nbsp;:"
            value={clientAddress}
            onChange={handleClientAddressChange}
            onBlur={() => handleClientAddressBlur()}
            readOnly={modifyDisable}
          />
          <InputCell
            label="City&nbsp;:"
            value={clientCity}
            onChange={handleClientCityChange}
            onBlur={() => handleClientCityBlur()}
            readOnly={modifyDisable}
          />
          <InputCell
            label="Postal Code&nbsp;:"
            value={clientPostalCode}
            onChange={handleClientPostalCodeChange}
            onBlur={() => handleClientPostalCodeBlur()}
            readOnly={modifyDisable}
          />
        </div>
        <div className="df-section-content">
          <h4>Extra</h4>
          <InputCell
            label="Notes&nbsp;:"
            value={clientExtra}
            onChange={handleClientExtraChange}
            onBlur={() => handleClientPostalCodeBlur()}
            readOnly={modifyDisable}
          />
        </div>
      </div>
    </section>
  );
};

export default SectionCustomer;

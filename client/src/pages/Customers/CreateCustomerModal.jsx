//
// client/src/pages/Customers/CreateCustomerModal.jsx

import React, { useState } from "react";

import InputCell from "../../components/Inputcell";

import usePostNewClient from "../../hooks/fetch/customers/usePostNewClient";

const CreateCustomerModal = ({ onClose }) => {
  const postNewClient = usePostNewClient();
  const [formData, setFormData] = useState({
    name: "",
    name2: "",
    phone: "",
    phone2: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    extra: "",
  });

  const updateField = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!postNewClient.isPending) {
      postNewClient.mutate(formData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-content-wrapper">
          <div className="medium-modal-container">
            <div className="modal-title-wrapper">
              <div className="modal-title-content">
                <h3>New Customer Form</h3>
              </div>
            </div>
            <div className="modal-body">
              <div className="df-section-wrapper">
                <div className="df-section-title">
                  <h3>Customer</h3>
                </div>
                <div
                  className="df-section-content-wrapper"
                  style={{ "--column-width": "22em" }}
                >
                  <div className="df-section-content">
                    <h4>Name</h4>
                    <InputCell
                      label="Name&nbsp;:"
                      value={formData.name}
                      onChange={updateField("name")}
                    />
                    <InputCell
                      label="Name2&nbsp;:"
                      value={formData.name2}
                      onChange={updateField("name2")}
                    />
                  </div>
                  <div className="df-section-content">
                    <h4>Contact</h4>
                    <InputCell
                      label="Phone&nbsp;:"
                      value={formData.phone}
                      onChange={updateField("phone")}
                    />
                    <InputCell
                      label="Phone2&nbsp;:"
                      value={formData.phone2}
                      onChange={updateField("phone2")}
                    />
                    <InputCell
                      label="Email&nbsp;:"
                      value={formData.email}
                      onChange={updateField("email")}
                    />
                  </div>
                  <div className="df-section-content">
                    <h4>Address</h4>
                    <InputCell
                      label="Address&nbsp;:"
                      value={formData.address}
                      onChange={updateField("address")}
                    />
                    <InputCell
                      label="City&nbsp;:"
                      value={formData.city}
                      onChange={updateField("city")}
                    />
                    <InputCell
                      label="Postal Code&nbsp;:"
                      value={formData.postalCode}
                      onChange={updateField("postalCode")}
                    />
                  </div>
                  <div className="df-section-content">
                    <h4>Extra</h4>
                    <InputCell
                      label="Client Notes&nbsp;:"
                      value={formData.extra}
                      onChange={updateField("extra")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="btn-container">
            <button className="regular-btn cancel-btn" onClick={onClose}>
              Close
            </button>
            <button className="regular-btn confirm-btn" onClick={handleSubmit}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomerModal;

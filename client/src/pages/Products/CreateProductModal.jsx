//
// client/src/pages/Products/CreateProductModal.jsx

import React, { useState, useEffect } from "react";
import InputCell from "../../components/Inputcell";

import usePostNewProduct from "../../hooks/fetch/products/usePostNewProduct";
import { parseItemNo } from "./productParser.util";

const CreateProductModal = ({ onClose, existingProducts = [] }) => {
  const postNewProduct = usePostNewProduct();
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [formData, setFormData] = useState({
    itemNo: "",
    description: "",
    type: "",
    pricePerThousand: 1500,
    thickness: 0,
    width: 0,
    length: 0,
    cost: 0,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = formData.itemNo.trim().toLowerCase();
      const duplicate = existingProducts.some(
        (p) => p.itemNo.trim().toLowerCase() === trimmed
      );
      setIsDuplicate(duplicate);
    }, 300); // debounce delay

    return () => clearTimeout(timeout); // cleanup on re-type
  }, [formData.itemNo, existingProducts]);

  const updateField = (field) => (value) => {
    if (field === "itemNo") {
      const parsed = parseItemNo(value);

      setFormData((prev) => ({
        ...prev,
        itemNo: value,
        ...(parsed || {}), // only overwrite fields if parsed successfully
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      pricePerThousand: parseFloat(formData.pricePerThousand) || 0,
      thickness: parseFloat(formData.thickness) || 0,
      width: parseFloat(formData.width) || 0,
      length: parseFloat(formData.length) || 0,
      cost: parseFloat(formData.cost) || 0,
    };

    if (!postNewProduct.isPending) {
      postNewProduct.mutate(payload, {
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
                <h3>New Product Form</h3>
              </div>
            </div>
            <div className="modal-body">
              <div className="df-section-wrapper">
                <div className="df-section-title">
                  <h3>Product</h3>
                </div>
                <div
                  className="df-section-content-wrapper"
                  style={{ "--column-width": "22em" }}
                >
                  <div className="df-section-content">
                    <h4>General</h4>
                    <InputCell
                      label="Item No.&nbsp;:"
                      value={formData.itemNo}
                      onChange={updateField("itemNo")}
                    />
                    {isDuplicate && (
                      <p
                        style={{
                          color: "red",
                          marginTop: "-0.5em",
                        }}
                      >
                        **This item number already exists.**
                      </p>
                    )}
                    <InputCell
                      label="Description&nbsp;:"
                      value={formData.description}
                      onChange={updateField("description")}
                    />
                    <InputCell
                      label="Type&nbsp;:"
                      type="select"
                      value={formData.type}
                      onChange={updateField("type")}
                      options={[
                        { label: "--", value: "" },
                        { label: "Pin", value: "Pin" },
                        { label: "Erable", value: "Erable" },
                        { label: "Pruche", value: "Pruche" },
                        { label: "Cedre", value: "Cedre" },
                        { label: "Chene", value: "Chene" },
                      ]}
                    />
                    <InputCell
                      label="Price per thousand&nbsp;:"
                      value={formData.pricePerThousand}
                      type="number"
                      onChange={updateField("pricePerThousand")}
                    />
                  </div>
                  <div className="df-section-content">
                    <h4>Details</h4>
                    <InputCell
                      label="Thickness&nbsp;:"
                      value={formData.thickness}
                      type="number"
                      onChange={updateField("thickness")}
                    />
                    <InputCell
                      label="Width&nbsp;:"
                      value={formData.width}
                      type="number"
                      onChange={updateField("width")}
                    />
                    <InputCell
                      label="Length&nbsp;:"
                      value={formData.length}
                      type="number"
                      onChange={updateField("length")}
                    />
                    <InputCell
                      label="Cost&nbsp;:"
                      type="number"
                      value={formData.cost}
                      onChange={updateField("cost")}
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

export default CreateProductModal;

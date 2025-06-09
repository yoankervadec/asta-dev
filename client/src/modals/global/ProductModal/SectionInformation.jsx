//
// client/src/components/modals/ProductModal/SectionInformation.jsx

import useFormField from "../../../hooks/useFormField";
import InputCell from "../../../components/Inputcell";

import styles from "./styles.module.css";

const SectionInformation = ({ data }) => {
  const { itemNo, naming, dimensions, pricing, details } = data || {};

  const updateUrl = `/product/alter/${itemNo}`;
  const refetchQueries = ["productCard", itemNo];

  const {
    value: description,
    handleChange: handleDescriptionChange,
    handleBlur: handleDescriptionBlur,
  } = useFormField(
    naming?.description ?? "",
    naming?.description,
    updateUrl,
    `description`,
    refetchQueries
  );
  const {
    value: type,
    handleChange: handleTypeChange,
    handleBlur: handleTypeBlur,
  } = useFormField(
    naming?.type ?? "",
    naming?.type,
    updateUrl,
    `type`,
    refetchQueries
  );
  const {
    value: thickness,
    handleChange: handleThicknessChange,
    handleBlur: handleThicknessBlur,
  } = useFormField(
    dimensions?.thickness ?? "",
    dimensions?.thickness,
    updateUrl,
    `thickness`,
    refetchQueries
  );
  const {
    value: width,
    handleChange: handleWidthChange,
    handleBlur: handleWidthBlur,
  } = useFormField(
    dimensions?.width ?? "",
    dimensions?.width,
    updateUrl,
    `width`,
    refetchQueries
  );
  const {
    value: length,
    handleChange: handleLengthChange,
    handleBlur: handleLengthBlur,
  } = useFormField(
    dimensions?.length ?? "",
    dimensions?.length,
    updateUrl,
    `length`,
    refetchQueries
  );
  const {
    value: pricePerThousandToString,
    handleChange: handlePricePerThousandToStringChange,
    handleBlur: handlePricePerThousandToStringBlur,
  } = useFormField(
    pricing?.pricePerThousandToString ?? "",
    pricing?.pricePerThousandToString,
    updateUrl,
    `pricePerThousandToString`,
    refetchQueries
  );
  const {
    value: costToString,
    handleChange: handleCostToStringChange,
    handleBlur: handleCostToStringBlur,
  } = useFormField(
    pricing?.costToString ?? "",
    pricing?.costToString,
    updateUrl,
    `costToString`,
    refetchQueries
  );

  return (
    <section className="df-section-wrapper">
      <div className="df-section-title">
        <h3>General Information</h3>
      </div>
      <div
        className="df-section-content-wrapper"
        style={{ "--column-width": "28em" }}
      >
        <div className="df-section-content">
          <h4>General</h4>
          <InputCell label="Item No.&nbsp;:" value={itemNo} readOnly />
          <InputCell
            label="Description&nbsp;:"
            value={description}
            onChange={handleDescriptionChange}
            onBlur={() => handleDescriptionBlur()}
          />
          <InputCell
            label="Type&nbsp;:"
            value={type}
            onChange={handleTypeChange}
            onBlur={() => handleTypeBlur()}
          />
        </div>
        <div className="df-section-content">
          <h4>Dimensions</h4>
          <InputCell
            label="Thickness&nbsp;:"
            value={thickness}
            onChange={handleThicknessChange}
            onBlur={() => handleThicknessBlur()}
          />
          <InputCell
            label="Width&nbsp;:"
            value={width}
            onChange={handleWidthChange}
            onBlur={() => handleWidthBlur()}
          />
          <InputCell
            label="Length&nbsp;:"
            value={length}
            onChange={handleLengthChange}
            onBlur={() => handleLengthBlur()}
          />
        </div>
        <div className="df-section-content">
          <h4>Pricing</h4>
          <InputCell
            label="Boardfeet&nbsp;:"
            value={pricing?.boardfeetToString}
            readOnly
          />
          <InputCell
            label="Price per thousand&nbsp;:"
            value={pricePerThousandToString}
            onChange={handlePricePerThousandToStringChange}
            onBlur={() => handlePricePerThousandToStringBlur()}
          />
          <InputCell
            label="Unit price&nbsp;:"
            value={pricing?.unitPriceToString}
            readOnly
          />
          <InputCell
            label="Cost&nbsp;:"
            value={costToString}
            onChange={handleCostToStringChange}
            onBlur={() => handleCostToStringBlur()}
          />
        </div>
        <div className="df-section-content">
          <h4>Details</h4>
          <InputCell
            label="Created at&nbsp;:"
            value={details?.createdAt}
            readOnly
          />
          <InputCell
            label="Create by&nbsp;:"
            value={details?.createdByName}
            readOnly
          />
        </div>
      </div>
    </section>
  );
};

export default SectionInformation;

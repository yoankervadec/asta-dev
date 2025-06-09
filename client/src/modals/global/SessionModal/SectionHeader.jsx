//
// client/src/components/modals/SessionModal/SectionHeader.jsx

import InputCell from "../../../components/Inputcell";

const SectionHeader = ({ data }) => {
  const { warehouse, details } = data || {};

  return (
    <section className="df-section-wrapper">
      <div className="df-section-title">
        <h3>Title</h3>
      </div>
      <div
        className="df-section-content-wrapper"
        style={{ "--column-width": "22em" }}
      >
        <div className="df-section-content">
          <h4>General</h4>
          <InputCell
            label="Session No.&nbsp;:"
            value={data?.sessionNo}
            readOnly
          />
          <InputCell
            label="Posted&nbsp;:"
            type="toggle"
            value={data?.isPosted}
            readOnly
            disabled
          />
          <InputCell label="Posted at&nbsp;:" value={data?.postedAt} readOnly />
        </div>
        <div className="df-section-content">
          <h4>Warehouse</h4>
          <InputCell
            label="Warehouse&nbsp;:"
            value={warehouse?.warehouseName}
            readOnly
          />
          <InputCell
            label="Lines on session&nbsp;:"
            value={details?.lines}
            readOnly
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
            label="Created by&nbsp;:"
            value={details?.createdByName}
            readOnly
          />
        </div>
      </div>
    </section>
  );
};

export default SectionHeader;

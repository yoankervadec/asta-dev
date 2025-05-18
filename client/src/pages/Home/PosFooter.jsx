//
// client/src/pages/Home/PosFooter.jsx

import styles from "./styles.module.css";

const PosFooter = ({ data }) => {
  const { client, details, payment, totals } = data || {};
  return (
    <section className={`border-shadow ${styles.footerContainer}`}>
      <div className={styles.gridContainer}>
        <div className={styles.columnWrapper}>
          <FooterCell title="User&nbsp;:" value={details?.createdByNameShort} />
          <FooterCell title="Client ID&nbsp;:" value={client?.clientId} />
          <FooterCell title="Name&nbsp;:" value={client?.clientName} />
          <FooterCell title="Phone&nbsp;:" value={client?.contact?.phone} />
        </div>
        <div className={styles.columnWrapper}>
          <FooterCell
            title="Boardfeet&nbsp;:"
            value={details?.totalBoardfeetToString}
          />
          <FooterCell title="Tax Region&nbsp;:" value={payment?.taxRegion} />
        </div>
        <div className={styles.columnWrapper}>
          <FooterCell
            title="Subtotal&nbsp;:"
            value={totals?.subtotalToString}
          />
          <FooterCell
            title="Discount&nbsp;:"
            value={totals?.discountAmountToString}
          />
          <FooterCell title="TVQ&nbsp;:" value={totals?.pstAmountToString} />
          <FooterCell title="TPS&nbsp;:" value={totals?.gstAmountToString} />
          <FooterCell
            title="Total&nbsp;:"
            value={totals?.totalAmountToString}
          />
        </div>
      </div>
    </section>
  );
};

const FooterCell = ({ title, value }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ width: "6em" }}>{title}</label>
      <input value={value} disabled></input>
    </div>
  );
};

export default PosFooter;

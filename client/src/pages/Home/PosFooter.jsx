//
// client/src/pages/Home/PosFooter.jsx

import styles from "./styles.module.css";

const PosFooter = ({ data }) => {
  const { client, details, payment, totals } = data || {};
  return (
    <section className={`border-shadow ${styles.footerContainer}`}>
      <div className={styles.gridContainer}>
        <FooterCell title="Client ID&nbsp;:" value={client?.clientId} />
        <FooterCell title="Name&nbsp;:" value={client?.clientName} />
        <FooterCell title="Phone&nbsp;:" value={client?.contact?.phone} />
        <FooterCell
          title="Boardfeet&nbsp;:"
          value={details?.totalBoardfeetToString}
        />
        <FooterCell title="User&nbsp;:" value={details?.createdByNameShort} />
        <FooterCell title="Subtotal&nbsp;:" value={totals?.subtotalToString} />
        <FooterCell
          title="Discount&nbsp;:"
          value={totals?.discountAmountToString}
        />
        <FooterCell title="TVQ&nbsp;:" value={totals?.pstAmountToString} />
        <FooterCell title="TPS&nbsp;:" value={totals?.gstAmountToString} />
        <FooterCell title="Total&nbsp;:" value={totals?.totalAmountToString} />
        <FooterCell
          title="Payment&nbsp;:"
          value={payment?.paymentAmountToString}
        />
        <FooterCell title="Tax Region&nbsp;:" value={payment?.taxRegion} />
      </div>
    </section>
  );
};

const FooterCell = ({ title, value }) => {
  return (
    <div>
      <span>{title}</span>
      <span>{value}</span>
    </div>
  );
};

export default PosFooter;

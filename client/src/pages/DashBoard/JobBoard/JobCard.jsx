//
// client/src/pages/DashBoard/JobBoard/JobCard.jsx

import { useModalNavigation } from "../../../hooks/useModalNavigation";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import styles from "../styles.module.css";

const JobCard = ({ job }) => {
  const { syncOpenModal } = useModalNavigation();
  const { meta, customer, totals, orderInfo, orderLines } = job;
  const { orderNo, status } = meta;
  const { name, contact } = customer;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: orderNo });

  const dndStyles = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Status / requiredDate color
  // Function to determine the color for the status
  const getStatusColor = (status) => {
    switch (status) {
      case "Quote":
        return "var(--status-quote)";
      case "Ready":
        return "var(--status-ready)";
      case "Waiting":
        return "var(--status-waiting)";
      case "Payment Pending":
        return "var(--status-payment-pending)";
      case "Shipped with balance":
        return "var(--status-ready)";
      case "Processing":
        return "var(--status-processing)";
      default:
        return "var(--status-quote)"; // Default to gray
    }
  };

  // Function to calculate the required date color
  const getRequiredDateColor = (requiredDate) => {
    const now = new Date();
    const requiredDateObj = new Date(requiredDate);
    const differenceInDays = (requiredDateObj - now) / (1000 * 60 * 60 * 24); // Difference in days

    if (differenceInDays > 5) {
      return "var(--required-date-future)"; // More than 5 days in the future - Green
    } else if (differenceInDays > 0) {
      return "var(--required-date-soon)"; // Between 0 and 5 days - Yellow
    } else {
      return "var(--required-date-past)"; // Past due - Red
    }
  };

  const statusColor = getStatusColor(status);
  const requiredDateColor = getRequiredDateColor(orderInfo.requiredDate);

  return (
    <article
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={dndStyles}
      className={`${styles.cardContainer} border-shadow`}
    >
      {/* Top Status Bar */}
      <div className={styles.statusBar}>
        <div className={styles.status}>
          <span style={{ backgroundColor: requiredDateColor }}>
            {orderInfo.requiredDate}
          </span>
          <span style={{ backgroundColor: statusColor }}>{status}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className={styles.cardBody}>
        {/* Order Information */}
        <section className={styles.orderInformation}>
          <h3>{customer.name}</h3>
          <p>{customer.contact.phone}</p>
          {/* Order Details */}
          <div className={styles.jobDetails}>
            <div style={{ display: "flex" }}>
              <label>Order No.&nbsp;:</label>
              <input value={orderInfo.orderNo} disabled></input>
            </div>
            <div style={{ display: "flex" }}>
              <label>Created at&nbsp;:</label>
              <input value={orderInfo.createdAt.split(" ")[0]} disabled></input>
            </div>
          </div>
        </section>

        {/* Items on Order */}
        <section></section>
      </div>
    </article>
  );
};

const JobItems = ({ lines }) => {
  const { syncOpenModal } = useModalNavigation();
  return (
    <div style={{ overflowY: "auto", flexFlow: "1", height: "200px" }}>
      <table className={styles.itemsTable}>
        <thead>
          <tr>
            <th className={styles.quantity}>
              <span>Quantity</span>
            </th>
            <th className={styles.itemNo}>
              <span>Item No.</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.lineNo}>
              <td className={styles.quantity}>
                <span>{line.item.quantity}</span>
              </td>
              <td className={styles.itemNo}>
                <span
                  className="key-row-selector"
                  onPointerUp={() =>
                    syncOpenModal("productCard", { itemNo: line?.item?.itemNo })
                  }
                >
                  {line.item.itemNo}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobCard;

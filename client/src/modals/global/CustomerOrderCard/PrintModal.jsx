//
// client/src/components/modals/CustomerOrderCard/PrintModal.jsx

import ASModalWrapper from "../../ASModalWrapper";
import ASModalStyles from "../../ASModalWrapper/styles.module.css";

import { viewPdf } from "../../../api/pdf/viewPdf";
import { downloadPdf } from "../../../api/pdf/downloadPdf";

const PrintModal = ({ onClose, order = {}, invoices = [] }) => {
  const { customer, meta, orderInfo, totals } = order || {};
  return (
    <ASModalWrapper onClose={onClose} size="small">
      <div className={ASModalStyles.stickyTitleBar}>
        <div className={ASModalStyles.title}>
          <h3>Print Documents</h3>
        </div>
      </div>
      <div className={ASModalStyles.modalBody}>
        <div className="table-container medium-table">
          <table>
            <colgroup>
              <col style={{ width: "10em" }} />
              <col style={{ width: "10em" }} />
              <col style={{ width: "12em" }} />
              <col style={{ width: "8em" }} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <span>Document Type</span>
                </th>
                <th>
                  <span>Document No.</span>
                </th>
                <th>
                  <span>Created At</span>
                </th>
                <th>
                  <span>Amount</span>
                </th>
                <th style={{ textAlign: "center" }}>
                  <span>Print</span>
                </th>
                <th style={{ textAlign: "center" }}>
                  <span>Download</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span>Customer Order</span>
                </td>
                <td>
                  <span>{orderInfo?.orderNo}</span>
                </td>
                <td>
                  <span>{orderInfo?.createdAt}</span>
                </td>
                <td>
                  <span>{totals?.totalToString}</span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="small-btn cancel-btn"
                    onClick={() => {
                      viewPdf(
                        "/pdf/order-card",
                        orderInfo?.orderNo,
                        orderInfo?.documentType
                      );
                    }}
                  >
                    Print
                  </button>
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="small-btn cancel-btn"
                    onClick={() => {
                      downloadPdf(
                        "/pdf/order-card",
                        orderInfo?.orderNo,
                        orderInfo?.documentType
                      );
                    }}
                  >
                    Download
                  </button>
                </td>
              </tr>
              {invoices.map((invoice) => (
                <tr key={invoice?.invoiceNo}>
                  <td>
                    <span>Invoice</span>
                  </td>
                  <td>
                    <span>{invoice?.invoiceNo}</span>
                  </td>
                  <td>
                    <span>{invoice?.details?.createdAt}</span>
                  </td>
                  <td>
                    <span>{invoice?.totals?.totalToString}</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="small-btn cancel-btn"
                      onClick={() => {
                        viewPdf(
                          "/pdf/invoice",
                          invoice?.invoiceNo,
                          invoice?.details?.documentType
                        );
                      }}
                    >
                      Print
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="small-btn cancel-btn"
                      onClick={() => {
                        downloadPdf(
                          "/pdf/invoice",
                          invoice?.invoiceNo,
                          invoice?.details?.documentType
                        );
                      }}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="btn-container">
        <button className="regular-btn cancel-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </ASModalWrapper>
  );
};

export default PrintModal;

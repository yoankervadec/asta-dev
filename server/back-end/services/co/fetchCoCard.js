//
// server/back-end/services/co/fetchCoCard.js

// USE ONLY FOR PDF. MUST CHANGE

import { format } from "date-fns";

import { selectCoCard } from "../../models/co/selectCoCard.js";

import { returnLineAmount } from "../../utils/financial/returnLineAmount.js";
import { returnLineDiscount } from "../../utils/financial/returnLineDiscount.js";
import { returnPlusTax } from "../../utils/financial/returnPlusTax.js";
import { returnTaxAmount } from "../../utils/financial/returnTaxAmount.js";

import { formatDate } from "../../utils/dates/dateHelper.js";

import { returnOrderStatus } from "../../utils/status/returnOrderStatus.js";
import { returnLineStatus } from "../../utils/status/returnLineStatus.js";

export const fetchCoCard = async (orderNo) => {
  const { orderInformation, itemsList, paymentEntries } = await selectCoCard(
    orderNo
  );

  // Initialize totals
  let subtotal = 0;
  let totalLineDiscount = 0;

  // Items List
  const processedItemsList = itemsList.map((item) => {
    const lineAmount = returnLineAmount(
      item.quantity,
      item.unit_price,
      item.discount
    );
    const lineDiscount = returnLineDiscount(
      item.quantity,
      item.unit_price,
      item.discount
    );
    const lineStatus = returnLineStatus(
      item.shipped,
      item.active,
      item.posted,
      item.status_name
    );

    subtotal += lineAmount;
    totalLineDiscount += lineDiscount;

    return {
      ...item,
      discount: parseFloat(item.discount).toFixed(2),
      unit_price: parseFloat(item.unit_price).toFixed(2),
      lineAmount: lineAmount.toFixed(2),
      lineDiscount: lineDiscount.toFixed(2),
      lineStatus,
    };
  });

  // Calculate totals
  const taxPercentage =
    parseFloat(orderInformation[0].gst) + parseFloat(orderInformation[0].pst);
  const totalWithTax = returnPlusTax(subtotal, taxPercentage);
  const taxAmount = returnTaxAmount(subtotal, taxPercentage);

  // Calculate payment amount
  const paymentAmount = paymentEntries.reduce(
    (sum, entry) => sum + parseFloat(entry.payment_amount),
    0
  );

  // Customer Information
  const customerInformation = {
    client_id: orderInformation[0].client_id,
    name: orderInformation[0].name,
    name2: orderInformation[0].name2,
    phone: orderInformation[0].phone,
    phone2: orderInformation[0].phone2,
    email: orderInformation[0].email,
    address: orderInformation[0].address,
    city: orderInformation[0].city,
    postal_code: orderInformation[0].postal_code,
    client_extra: orderInformation[0].client_extra,
  };

  // Order Details
  const orderDetails = {
    order_no: orderInformation[0].order_no,
    required_date: format(
      new Date(orderInformation[0].required_date),
      "yyyy-MM-dd"
    ),
    created_at: formatDate(orderInformation[0].created_at),
    priority: orderInformation[0].priority,
    quote: orderInformation[0].quote,
    consolidated: orderInformation[0].consolidated,
    tax_region: orderInformation[0].tax_region,
    order_extra: orderInformation[0].order_extra,
    subtotal: parseFloat(subtotal).toFixed(2),
    totalLineDiscount: parseFloat(totalLineDiscount).toFixed(2),
    totalWithTax: parseFloat(totalWithTax).toFixed(2),
    taxAmount: parseFloat(taxAmount).toFixed(2),
    paymentAmount: parseFloat(paymentAmount).toFixed(2),
    balance: parseFloat(totalWithTax - paymentAmount).toFixed(2),
  };

  // Payment Entries
  const enhancedPaymentEntries = paymentEntries.map((entry) => ({
    ...entry,
    date: formatDate(entry.date),
    payment_amount: parseFloat(entry.payment_amount).toFixed(2),
  }));

  // Determine order status
  const orderStatus = returnOrderStatus(
    orderDetails.quote,
    orderDetails.consolidated,
    processedItemsList,
    orderDetails.balance
  );

  // Determine post toggle (ship) status
  const postToggle =
    !orderDetails.consolidated &&
    !processedItemsList.some(
      (item) =>
        item.shipped === 0 &&
        item.active === 1 &&
        item.posted === 0 &&
        item.status_name === "ready"
    ) &&
    orderDetails.quote === 0;

  const orderMetaData = {
    order_no: orderInformation[0].order_no,
    quoteToggle: !orderDetails.quote,
    postToggle, // ship toggle
    paymentToggle:
      parseFloat(orderDetails.balance) !== 0 && !orderDetails.quote,
    orderStatus,
    balance: parseFloat(orderDetails.balance),
  };

  return {
    orderMetaData,
    orderInformation: orderDetails,
    customerInformation,
    itemsList: processedItemsList,
    paymentEntries: enhancedPaymentEntries,
  };
};

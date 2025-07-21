//
// client/src/hooks/fetch/customerOrders/usePostConvertQuoteToOrder.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";

const usePostConvertQuoteToOrder = () => {
  const navigate = useNavigate();

  return usePostHelper("customer-order/convert-to-order", {}, navigate);
};

export default usePostConvertQuoteToOrder;

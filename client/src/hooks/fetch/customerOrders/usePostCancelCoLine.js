//
// client/src/hooks/fetch/customerOrders/usePostCancelCoLine.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";

const usePostCancelCoLine = () => {
  const navigate = useNavigate();

  return usePostHelper("/customer-order/cancel-line", {}, navigate);
};

export default usePostCancelCoLine;

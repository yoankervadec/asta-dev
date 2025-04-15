//
// client/src/hooks/fetch/customerOrders/usePostAddCoLine.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";

const usePostAddCoLine = () => {
  const navigate = useNavigate();

  return usePostHelper("/customer-order/add-line", {}, navigate);
};

export default usePostAddCoLine;

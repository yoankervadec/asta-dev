//
// client/src/hooks/fetch/customerOrders/usePostPayCo.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";

const usePostPayCo = () => {
  const navigate = useNavigate();

  return usePostHelper("/customer-order/card/pay", {}, navigate);
};

export default usePostPayCo;

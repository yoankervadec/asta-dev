//
// client/src/hooks/fetch/pos/usePostCreateOrder.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";

const usePostCreateOrder = () => {
  const navigate = useNavigate();

  return usePostHelper("/pos/create-order", {}, navigate);
};

export default usePostCreateOrder;

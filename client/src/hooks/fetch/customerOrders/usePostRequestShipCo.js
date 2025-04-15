//
// client/src/hooks/fetch/customerOrders/usePostRequestShipCo.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";

const usePostRequestShipCo = () => {
  const navigate = useNavigate();

  return usePostHelper("/request/request/ship", {}, navigate);
};

export default usePostRequestShipCo;

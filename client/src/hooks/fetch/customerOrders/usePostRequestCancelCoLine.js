//
// client/src/hooks/fetch/customerOrders/usePostRequestCancelCoLine.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";

const usePostRequestCancelCoLine = () => {
  const navigate = useNavigate();

  return usePostHelper("/request/request/cancel-line", {}, navigate);
};

export default usePostRequestCancelCoLine;

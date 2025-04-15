//
// client/src/hooks/fetch/customers/usePostSelectCustomer.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";

const usePostSelectCustomer = () => {
  const navigate = useNavigate();
  return usePostHelper(
    "/clients/select-client",
    {
      onSuccess: () => {
        navigate("/home");
      },
    },
    navigate
  );
};

export default usePostSelectCustomer;

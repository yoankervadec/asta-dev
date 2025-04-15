//
// client/src/hooks/fetch/production/usePostSessionProduct.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const usePostSessionProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return usePostHelper(
    "/production/session/add",
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["productCard", variables.itemNo]);
      },
    },
    navigate
  );
};

export default usePostSessionProduct;

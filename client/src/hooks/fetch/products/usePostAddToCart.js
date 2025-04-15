//
// client/src/hooks/fetch/products/usePostAddToCart.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const usePostAddToCart = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return usePostHelper(
    "/pos/add-to-cart",
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posPage"]);
      },
    },
    navigate
  );
};

export default usePostAddToCart;

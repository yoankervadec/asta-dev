//
// client/src/hooks/fetch/products/usePostNewProduct.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const usePostNewProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return usePostHelper(
    "/product/new-product",
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["productsList"]);
      },
    },
    navigate
  );
};

export default usePostNewProduct;

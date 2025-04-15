//
// client/src/hooks/fetch/products/useFetchProducts.js

import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "../../../api/fetchHelper";
import { useNavigate } from "react-router-dom";

const useFetchProducts = () => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["productsList"],
    queryFn: () => fetchHelper("/product/products", navigate), // Pass navigate from here
  });
};

export default useFetchProducts;

//
// client/src/hooks/fetch/products/useFetchProductCard.js

import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "../../../api/fetchHelper";
import { useNavigate } from "react-router-dom";

const useFetchProductCard = (itemNo) => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["productCard", itemNo],
    queryFn: () => fetchHelper(`/product/card/${itemNo}`, navigate),
    enabled: !!itemNo,
  });
};

export default useFetchProductCard;

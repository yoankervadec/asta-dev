//
// client/src/hooks/fetch/customerOrders/useFetchCustomerOrderCard.js

import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "../../../api/fetchHelper";
import { useNavigate } from "react-router-dom";

const useFetchCustomerOrderCard = (orderNo) => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["customerOrderCard", orderNo],
    queryFn: () => fetchHelper(`/customer-order/card/${orderNo}`, navigate),
    enabled: !!orderNo,
  });
};

export default useFetchCustomerOrderCard;

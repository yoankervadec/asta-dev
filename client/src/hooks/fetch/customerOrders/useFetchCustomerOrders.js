//
// client/src/hooks/fetch/customerOrders/useFetchCustomerOrders.js

import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "../../../api/fetchHelper";
import { useNavigate } from "react-router-dom";

const useFetchCustomerOrders = (filters) => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["customerOrders", filters],
    queryFn: () =>
      fetchHelper("/customer-order/customer-orders", navigate, {
        params: filters,
      }),
  });
};

export default useFetchCustomerOrders;

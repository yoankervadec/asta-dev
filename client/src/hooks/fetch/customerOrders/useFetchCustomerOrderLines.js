//
// client/src/hooks/fetch/customerOrders/useFetchCustomerOrderLines.js

import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "../../../api/fetchHelper";
import { useNavigate } from "react-router-dom";

const useFetchCustomerOrderLines = (filters) => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["customerOrderLines", filters],
    queryFn: () =>
      fetchHelper("customer-order/orders-list", navigate, {
        params: filters,
      }),
  });
};

export default useFetchCustomerOrderLines;

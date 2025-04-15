//
// client/src/hooks/fetch/customers/useFetchCustomers.js

import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "../../../api/fetchHelper";
import { useNavigate } from "react-router-dom";

const useFetchCustomers = () => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => fetchHelper("/clients/clients", navigate),
  });
};

export default useFetchCustomers;

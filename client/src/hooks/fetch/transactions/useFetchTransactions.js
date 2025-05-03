//
// client/src/hooks/fetch/transactions/useFetchTransactions.js

import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "../../../api/fetchHelper";
import { useNavigate } from "react-router-dom";

const useFetchTransactions = () => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => fetchHelper("/transactions/transactions", navigate),
  });
};

export default useFetchTransactions;

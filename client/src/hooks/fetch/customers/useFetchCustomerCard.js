//
// client/src/hooks/fetch/customers/useFetchCustomerCard.js

import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "../../../api/fetchHelper";
import { useNavigate } from "react-router-dom";

const useFetchCustomerCard = (clientId) => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["clientCard", clientId],
    queryFn: () => fetchHelper(`/clients/client-card/${clientId}`, navigate),
    enabled: !!clientId,
  });
};

export default useFetchCustomerCard;

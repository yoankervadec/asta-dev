//
// client/src/hooks/fetch/pos/useFetchPosPage.js

import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "../../../api/fetchHelper";
import { useNavigate } from "react-router-dom";

const useFetchPosPage = () => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["posPage"],
    queryFn: () => fetchHelper("/pos/pos", navigate),
  });
};

export default useFetchPosPage;

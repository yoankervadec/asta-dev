//
// client/src/hooks/fetch/itemEntries/useFetchItemEntries.js

import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "../../../api/fetchHelper";
import { useNavigate } from "react-router-dom";

const useFetchItemEntries = () => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["itemEntries"],
    queryFn: () => fetchHelper("/item-entries/item-entries", navigate),
  });
};

export default useFetchItemEntries;

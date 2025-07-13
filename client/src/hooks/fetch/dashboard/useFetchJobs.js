//
// client/src/hooks/fetch/dashboard/useFetchJobs.js

import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "../../../api/fetchHelper";
import { useNavigate } from "react-router-dom";

const useFetchJobs = (filters) => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["dashboardJobs", filters],
    queryFn: () =>
      fetchHelper("/dashboard/jobs", navigate, { params: filters }),
  });
};

export default useFetchJobs;

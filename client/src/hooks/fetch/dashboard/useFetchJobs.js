//
// client/src/hooks/fetch/dashboard/useFetchJobs.js

import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "../../../api/fetchHelper";
import { useNavigate } from "react-router-dom";

const useFetchJobs = () => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["dashboardJobs"],
    queryFn: () => fetchHelper("/dashboard/jobs", navigate),
  });
};

export default useFetchJobs;

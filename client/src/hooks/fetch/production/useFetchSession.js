//
// client/src/hooks/fetch/production/useFetchSession.js

import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "../../../api/fetchHelper";
import { useNavigate } from "react-router-dom";

const useFetchSession = (
  enabled = true,
  sessionNo = null,
  itemNo = null,
  posted = null
) => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["session", sessionNo, itemNo, posted],
    queryFn: () =>
      fetchHelper("/production/session/view", navigate, {
        params: {
          sessionNo,
          itemNo,
          posted,
        },
      }),
    enabled: !!enabled,
  });
};

export default useFetchSession;

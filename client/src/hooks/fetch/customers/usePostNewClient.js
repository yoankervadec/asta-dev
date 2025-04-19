//
// client/src/hooks/fetch/customers/usePostNewClient.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const usePostNewClient = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return usePostHelper(
    "/clients/new-client",
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["customers"]);
      },
    },
    navigate
  );
};

export default usePostNewClient;

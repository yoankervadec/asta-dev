//
// client/src/hooks/fetch/production/usePostRequestCommitSession.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";

const usePostRequestCommitSession = () => {
  const navigate = useNavigate();

  return usePostHelper("/request/request/post-session", {}, navigate);
};

export default usePostRequestCommitSession;

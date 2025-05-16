//
// client/src/hooks/fetch/pos/usePostVoidLine.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";

const usePostVoidLine = () => {
  const navigate = useNavigate();

  return usePostHelper("/request/request/void-stage-line", {}, navigate);
};

export default usePostVoidLine;

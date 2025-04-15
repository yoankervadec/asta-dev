//
// client/src/hooks/fetch/auth/useAuth.js

import { usePostHelper } from "../../../api/postHelper";
import { useNavigate } from "react-router-dom";

// Login Hook
export const useLogin = () => {
  const navigate = useNavigate();
  return usePostHelper("/auth/login", {
    onSuccess: () => {
      navigate("/home");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

// Logout Hook
export const useLogout = () => {
  return usePostHelper("/auth/logout", {
    onSuccess: () => {
      console.log("User logged out");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};

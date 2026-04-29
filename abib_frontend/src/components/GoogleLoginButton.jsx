import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { API_URL } from "../config/api";

function GoogleLoginButton({ setUserId, onError, onSuccess }) {
  const handleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse?.credential;

      if (!token) {
        throw new Error("Google credential missing");
      }

      const { data } = await axios.post(`${API_URL}/auth/google`, { token });

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));

      if (setUserId) {
        setUserId(data.user.id);
      }

      onSuccess?.(data.user);
    } catch (error) {
      if (onError) {
        onError(
          error.response?.data?.message || "Google sign-in failed. Check your Google client configuration."
        );
      }
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() =>
        onError?.("Google sign-in was cancelled or could not be started.")
      }
      useOneTap={false}
      theme="outline"
      text="continue_with"
      shape="pill"
      size="large"
      width="100%"
    />
  );
}

export default GoogleLoginButton;

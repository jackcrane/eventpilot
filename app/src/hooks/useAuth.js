import { useState, useEffect, useCallback } from "react";
import { u } from "../util/url";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wantsOTP, setWantsOTP] = useState(false); // Track if OTP is needed
  const [emailForOTP, setEmailForOTP] = useState(""); // Track email during OTP process
  const [error, setError] = useState(null); // Track errors
  const [loading, setLoading] = useState(true); // Track loading state

  // Helper to fetch user data (e.g. after page reload)
  const fetchUser = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(u("/auth/me"), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }); // Example endpoint
      const data = await response.json();
      if (response.ok && data) {
        setUser(data);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        if (
          !document.location.pathname.includes("/auth") &&
          !(document.location.pathname === "/")
        ) {
          document.location.href = "/auth/login";
        }
      }
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false); // Stop loading
    }
  }, []);

  // Login function (sends OTP to the provided email)
  const login = async (email, password) => {
    setLoading(true); // Start loading
    try {
      setError(null); // Clear any previous errors
      const response = await fetch(u`/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setEmailForOTP(email); // Save email to be used in OTP verification
        setWantsOTP(true); // Set OTP process to active
        return true;
      } else {
        setError(data.message || "Login failed. Please try again.");
        return false;
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      return false;
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Verify OTP function
  const verifyOTP = async (email, otp) => {
    setLoading(true); // Start loading
    try {
      setError(null); // Clear any previous errors
      const response = await fetch(u`/auth/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: parseInt(otp) }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user); // Set the logged-in user
        setIsLoggedIn(true);
        setWantsOTP(false); // OTP process completed
        setEmailForOTP(""); // Clear email state after successful login
        // Save JWT token in local storage
        localStorage.setItem("token", data.token);
        return true;
      } else {
        setError(data.message || "OTP verification failed. Please try again.");
        return false;
      }
    } catch (error) {
      setError("OTP verification failed. Please try again.");
      return false;
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Logout function
  const logout = async () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    console.log("Toodles");
  };

  // Signup function
  const signup = async (name, email, password) => {
    setLoading(true); // Start loading
    try {
      setError(null); // Clear any previous errors
      const response = await fetch(u("/auth/signup"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setEmailForOTP(email); // Save email to be used in OTP verification
        setWantsOTP(true); // Set OTP process to active
        return true;
      } else {
        setError(data.message || "Signup failed. Please try again.");
        return false;
      }
    } catch (error) {
      setError("Signup failed. Please try again.");
      return false;
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchUser(); // Fetch user data on component mount
  }, [fetchUser]);

  return {
    user,
    isLoggedIn,
    login,
    verifyOTP, // Expose OTP verification function
    wantsOTP, // Expose OTP state to the UI
    logout,
    signup,
    error, // Expose the error state to the UI
    loading, // Expose the loading state to the UI
  };
};

export default useAuth;

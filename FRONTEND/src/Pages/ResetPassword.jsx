import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Client, Account } from "appwrite";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "./CSS/ResetPassword.css"; // Import external CSS

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const togglePassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  const togglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  // Fetch user email from Appwrite
  useEffect(() => {
    async function fetchEmail() {
      try {
        const user = await account.get();
        setEmail(user.email);
        //console.log(user.email);
      } catch (error) {
        console.error("Failed to fetch user email", error);
      }
    }
    fetchEmail();
  }, []);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await account.updateRecovery(userId, secret, password, confirmPassword);
      //console.log("Password updated successfully!", password);

      const response = await fetch("http://localhost:4000/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          newPassword: password,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setSuccess(true);
        alert("Password updated successfully!");
        navigate("/login");
        location.reload();
      } else {
        setError(data.message);
      }
    } catch (error) {
      alert(error + " !");
      setError("Password reset failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>Reset Password</h2>
        <input
          type={showPassword1 ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="reset-input"
        />
        <div className="toggle-login1">
          {showPassword1 ? (
            <BsEyeSlash onClick={togglePassword1} />
          ) : (
            <BsEye onClick={togglePassword1} />
          )}
        </div>
        <input
          type={showPassword2 ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`reset-input1 ${
            password && confirmPassword && password !== confirmPassword
              ? "error-border"
              : ""
          }`}
        />
        <div className="toggle-login2">
          {showPassword2 ? (
            <BsEyeSlash onClick={togglePassword2} />
          ) : (
            <BsEye onClick={togglePassword2} />
          )}
        </div>
        {error && <p className="error-text">{error}</p>}
        {success && (
          <p className="success-text">
            Password updated successfully! Redirecting...
          </p>
        )}

        <button
          onClick={handleResetPassword}
          className="reset-button"
          disabled={loading}
        >
          {loading ? "Processing..." : "Reset Password"}
        </button>

        {/* Loading Spinner */}
        {loading && <div className="loading-spinner"></div>}
      </div>
    </div>
  );
}

export default ResetPassword;

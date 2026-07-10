import { useState } from "react";
import { registerUser, verifyOtp } from "../services/api";

function Register() {
  const [step, setStep] = useState("register"); // "register" or "otp"

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");

  const handleRegister = async () => {
    try {
      const res = await registerUser({
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        mobile_number: mobile,
        password: password,
        confirm_password: confirmPassword
      });

      console.log("REGISTER RESPONSE:", res);

      if (res.status === "Pending") {
        alert("OTP sent to your email");
        setStep("otp");
      } else {
        alert(res.detail || "Registration failed");
      }
    } catch (err) {
      console.log("REGISTER ERROR:", err);
      alert("Registration failed");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp({
        email_address: email,
        otp: otp
      });

      console.log("OTP RESPONSE:", res);

      if (res.status === "Active") {
        alert("Account verified! You can now login.");
      } else {
        alert(res.detail || "OTP verification failed");
      }
    } catch (err) {
      console.log("OTP ERROR:", err);
      alert("OTP verification failed");
    }
  };

  if (step === "otp") {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Verify OTP</h2>
        <p>Enter the OTP sent to {email}</p>

        <input
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <br /><br />

        <button onClick={handleVerifyOtp}>Verify OTP</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      <input
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
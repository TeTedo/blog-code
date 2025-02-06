import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "repository/firebase";
import { Style } from "./AdminPage.style";

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard"); // Redirect to Admin Dashboard
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <Style.LoginWrapper>
      <Style.Title>Admin Login</Style.Title>
      <Style.Form onSubmit={handleLogin}>
        <Style.Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Style.Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <Style.ErrorMessage>{error}</Style.ErrorMessage>}
        <Style.Button type="submit">Login</Style.Button>
      </Style.Form>
    </Style.LoginWrapper>
  );
};

export default AdminLoginPage;

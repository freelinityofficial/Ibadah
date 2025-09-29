/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { login, register } from "@/api";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    if (isLogin) {
      const data = await login(username, password);
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", username);
      localStorage.setItem("userId", data.user.id);
      alert("Login successful ✅");
      navigate("/dashboard");
    } else {
      // send correct data
      await register(firstName, lastName, phone, username, password);
      alert("Account created ✅, now please log in.");
      setIsLogin(true);
    }
  } catch (err: any) {
    setError(err.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </button>

        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            {isLogin ? "Sign In" : "Sign Up"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-4">
                {/* First + Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="First Name"
                    name="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Last Name"
                    name="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <Input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Username + Password */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button className="w-full" type="submit">
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          {error && (
            <p className="mt-2 text-center text-sm text-red-500">{error}</p>
          )}

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-semibold"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
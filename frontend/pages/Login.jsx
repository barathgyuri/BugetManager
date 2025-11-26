import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../src/auth/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log('Authentication started')
    try {
      if (isRegister) {
        // perform registration then log the user in using the returned token/user
        console.log('Register process')
        const res = await axios.post("/api/auth/register", { name, email, password });
        console.log('Login process')
        await login(res.data);
        navigate("/");
      } else {
        console.log('Login process')
        await login(email, password, false);
        console.log('Login completed, call navigate')
        navigate("/");
      }
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #08111B 0%, #0F1A28 100%)'}}>
      <div className="rounded-3xl shadow-xl p-8 w-full max-w-md" style={{backgroundColor: 'rgba(8, 17, 27, 0.9)', border: '1px solid rgba(129, 54, 125, 0.3)'}}>
        <h1 className="text-2xl font-bold text-center mb-6" style={{color: '#D8E4F3'}}>
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h1>

        {error && (
          <div className="px-4 py-2 rounded mb-4 text-sm" style={{backgroundColor: 'rgba(129, 54, 125, 0.15)', border: '1px solid rgba(129, 54, 125, 0.3)', color: '#D8E4F3'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1" style={{color: '#2FA6AC'}}>
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition"
                style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}}
                placeholder="Your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1" style={{color: '#2FA6AC'}}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition"
              style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1" style={{color: '#2FA6AC'}}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition"
              style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold transition opacity-100 hover:opacity-90 disabled:opacity-50"
            style={{backgroundColor: '#3469A9', color: '#D8E4F3'}}
          >
            {loading ? "Please wait..." : isRegister ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsRegister(false)}
                className="text-blue-400 font-medium hover:text-blue-300"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsRegister(true)}
                className="text-blue-400 font-medium hover:text-blue-300"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

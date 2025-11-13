import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../src/auth/AuthContext";

export default function Register() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [err, setErr] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await axios.post("/api/auth/register", form);
      login(res.data);
    } catch (error) {
      setErr(error?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      {err && <p className="text-red-500 mb-2">{err}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input name="name" value={form.name} onChange={handle} placeholder="Full name" className="w-full border rounded p-2" />
        <input name="email" type="email" value={form.email} onChange={handle} placeholder="Email" className="w-full border rounded p-2" required />
        <input name="password" type="password" value={form.password} onChange={handle} placeholder="Password" className="w-full border rounded p-2" required />
        <button className="w-full bg-green-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}

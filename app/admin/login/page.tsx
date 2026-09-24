"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("RodrigoAdm");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.error || "Invalid username or password.");
        return;
      }

      router.push("/admin/workshops");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="row flex min-h-[70vh] items-center justify-center px-5 py-20 text-white lg:px-0">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-brand-200">Admin</p>
        <h1 className="mb-6 text-3xl font-bold text-white">Log in to the dashboard</h1>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-gray-200">Username</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand-200"
            />
          </div>

          {error && <p className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

          <button type="submit" disabled={loading} aria-busy={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-200 px-5 py-3 text-sm font-semibold text-[#050123] disabled:cursor-wait disabled:opacity-70">
            {loading && (
              <svg aria-hidden="true" className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            <span>{loading ? "Logging in..." : "Log in"}</span>
          </button>
        </div>
      </form>
    </main>
  );
}

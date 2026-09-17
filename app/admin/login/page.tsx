"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok || !data.ok) {
      setError(data.error || "Credenciais inválidas.");
      return;
    }

    router.push("/admin/workshops");
    router.refresh();
  };

  return (
    <main className="row flex min-h-[70vh] items-center justify-center px-5 py-20 text-white lg:px-0">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-brand-200">Admin</p>
        <h1 className="mb-6 text-3xl font-bold text-white">Login do painel</h1>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-gray-200">Usuário</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-200">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand-200"
            />
          </div>

          {error && <p className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

          <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center rounded-full bg-brand-200 px-5 py-3 text-sm font-semibold text-[#050123] disabled:opacity-60">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </main>
  );
}

"use client";

import { useState, FormEvent } from "react";
import { Save, Lock } from "lucide-react";

export default function AdminSenha() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPass.length < 6) {
      setError("A nova senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (newPass !== confirm) {
      setError("As senhas não conferem");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/auth/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
    });
    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setMessage(data.message);
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } else {
      setError(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Alterar Senha</h1>
        <p className="text-sm text-muted-foreground mt-1">Atualize sua senha de acesso</p>
      </div>

      <div className="rounded-2xl bg-card border border-border/50 p-6 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Senha atual</label>
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required className="w-full rounded-xl bg-background border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Nova senha</label>
          <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required className="w-full rounded-xl bg-background border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Confirmar nova senha</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="w-full rounded-xl bg-background border border-border/50 px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors" />
        </div>
      </div>

      {message && <p className="text-sm text-green-400">{message}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40"
      >
        <Lock size={16} />
        {saving ? "Alterando..." : "Alterar Senha"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mascot } from "@/components/mascot";
import { Input } from "@/components/ui/input";
import { setStoredUser } from "@/lib/user";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Enter a username");
      return;
    }
    setStoredUser({ username: trimmed });
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col items-center gap-6"
      >
        <Link href="/" className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-extrabold text-foreground tracking-tight">
            Sign<span className="text-primary">Sense</span>
          </span>
        </Link>

        <Mascot mood="excited" size="lg" message="What should we call you?" />

        <motion.form
          onSubmit={handleSubmit}
          className="w-full bg-card rounded-3xl p-6 shadow-lg border-2 border-border flex flex-col gap-4"
          style={{ borderBottomWidth: "5px" }}
        >
          <label
            htmlFor="username"
            className="text-sm font-bold text-muted-foreground uppercase tracking-wider"
          >
            Username
          </label>
          <Input
            id="username"
            type="text"
            placeholder="e.g. SignMaster"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-12 rounded-xl text-base font-bold border-2"
            maxLength={32}
            autoComplete="username"
            autoFocus
          />
          {error && (
            <p className="text-sm font-bold text-destructive">{error}</p>
          )}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-primary-foreground font-extrabold text-lg py-3.5 rounded-2xl shadow-lg hover:brightness-110 transition-all mt-2"
            style={{ boxShadow: "0 4px 0 0 var(--primary-dark)" }}
          >
            Let&apos;s go
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}

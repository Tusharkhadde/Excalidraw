"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Pen, Sparkles } from "lucide-react";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const { token, signin } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) router.replace("/");
  }, [token, router]);

  const title = useMemo(() => (isSignin ? "Welcome back" : "Create your account"), [isSignin]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isSignin) {
        const data = await api.post<{ token: string }>("/signin", {
          email: email.trim(),
          password,
        });
        signin(data.token);
        router.push("/");
      } else {
        await api.post("/signup", {
          email: email.trim(),
          password,
          name: name.trim(),
        });
        router.push("/signin");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sky-signal/3 blur-[150px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Pen className="h-6 w-6 text-ember-red" />
          <span className="text-lg font-semibold tracking-tight">Excelidraw</span>
        </Link>

        <div className="rounded-modals border border-graphite-500 bg-graphite-700 p-8 shadow-xl-dark">
          <div className="mb-6">
            <h1 className="text-heading-sm font-semibold tracking-heading-sm text-snow">{title}</h1>
            <p className="mt-2 text-sm text-slate-200">
              {isSignin
                ? "Sign in to continue to your whiteboard."
                : "Sign up to start creating collaborative rooms."}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isSignin && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-200" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="input-raycast w-full"
                  required
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-200" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-raycast w-full"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-200" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input-raycast w-full"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-ember-red bg-ember-dark/30 px-3 py-2 rounded-badges">
                <Sparkles className="h-3 w-3 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-buttons bg-ash-50 text-[#2F3031] hover:bg-[#d4d4d4] h-10 px-4 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Please wait..." : isSignin ? "Sign in" : "Sign up"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-200 text-center">
            {isSignin ? "Need an account?" : "Already have an account?"}{" "}
            <Link
              href={isSignin ? "/signup" : "/signin"}
              className="font-medium text-snow hover:text-ash-50 underline underline-offset-2 transition-colors"
            >
              {isSignin ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

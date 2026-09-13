"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowUpRight, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Brand } from "./Brand";
import { BoardPreview } from "./BoardPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const { token, signin } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** Account exists but auto sign-in failed — offer a retry instead of a dead form. */
  const [created, setCreated] = useState(false);

  useEffect(() => {
    if (token) router.replace("/");
  }, [token, router]);

  function fail(message: string) {
    setError(message);
    setShake((n) => n + 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError("");
    if (!isSignin && !created && !name.trim()) return fail("Please enter your name.");
    setIsSubmitting(true);
    try {
      if (!isSignin && !created) {
        await api.post("/signup", { name: name.trim(), email: email.trim(), password });
        setCreated(true);
      }
      const data = await api.post<{ token: string }>("/signin", { email: email.trim(), password });
      signin(data.token);
      toast.success(isSignin ? "Welcome back." : "Your account is ready.");
      router.replace("/");
    } catch (err) {
      fail(err instanceof ApiError ? err.message : "We couldn't reach the server. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const signupMode = !isSignin && !created;

  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-2">
      {/* Aside */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-ink-foreground lg:flex">
        <div className="pointer-events-none absolute -left-20 -top-20 size-[420px] rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 size-[360px] rounded-full bg-fuchsia-400/20 blur-3xl" />
        <Brand light className="relative" />
        <div className="relative reveal">
          <span className="eyebrow text-white/60">A little space. A big possibility.</span>
          <h2 className="display mt-4 text-5xl">
            Bring your ideas.
            <br />
            <em className="text-[#c8b3ed]">We’ll bring the canvas.</em>
          </h2>
          <p className="mt-5 max-w-sm text-white/70">From a passing thought to a shared plan. Good things happen when we create together.</p>
          <BoardPreview compact className="mt-10 text-foreground" />
        </div>
        <p className="relative font-serif text-sm italic text-white/60">Less friction. More imagination.</p>
      </aside>

      {/* Form */}
      <main className="flex flex-col p-6 sm:p-10">
        <div className="flex items-center justify-between">
          <Brand className="lg:hidden" />
          <Button asChild variant="ghost" size="sm" className="ml-auto text-muted-foreground">
            <Link href="/">
              <ArrowLeft /> Back to home
            </Link>
          </Button>
        </div>

        <div className="mx-auto my-auto w-full max-w-sm py-12 animate-rise-in">
          <h1 className="text-3xl font-semibold tracking-tight">{isSignin ? "Welcome back." : created ? "You're all set." : "Make room for your ideas."}</h1>
          <p className="prose-muted mt-2 text-sm">
            {isSignin
              ? "Your next great idea is right where you left it."
              : created
                ? "Your account was created. Sign in below to open your workspace."
                : "Create your free account to save boards and work together."}
          </p>

          {created && (
            <div className="mt-6 flex items-center gap-2.5 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-3 text-sm text-emerald-800 dark:text-emerald-300">
              <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-white animate-check-pop">
                <Check size={12} strokeWidth={3} />
              </span>
              Account created for <strong className="font-medium">{email}</strong>
            </div>
          )}

          <form key={shake} className={cn("mt-8 space-y-5", shake > 0 && "animate-shake")} onSubmit={handleSubmit} aria-busy={isSubmitting} noValidate={false}>
            {signupMode && (
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input id="name" name="name" autoComplete="name" placeholder="Alex Morgan" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting || created} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {signupMode && <span className="text-xs text-muted-foreground">At least 6 characters</span>}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={visible ? "text" : "password"}
                  autoComplete={isSignin ? "current-password" : "new-password"}
                  placeholder={isSignin ? "Enter your password" : "Create a password"}
                  required
                  minLength={signupMode ? 6 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="pr-11"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1 text-muted-foreground"
                  aria-label={visible ? "Hide password" : "Show password"}
                  aria-pressed={visible}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-destructive/25 bg-destructive/[0.06] px-3.5 py-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> {isSignin || created ? "Signing in…" : "Creating your account…"}
                </>
              ) : (
                <>
                  {isSignin || created ? "Log in to your workspace" : "Create free account"} <ArrowUpRight />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignin ? "New to Drawboard?" : "Already have an account?"}{" "}
            <Link href={isSignin ? "/signup" : "/signin"} className="font-medium text-primary underline-offset-4 hover:underline">
              {isSignin ? "Create an account" : "Log in"}
            </Link>
          </p>

          <div className="my-7 flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">or just explore</span>
            <Separator className="flex-1" />
          </div>

          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/canvas/guest">
              Try a guest canvas <ArrowUpRight />
            </Link>
          </Button>
          <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
            Guest drawings stay in this session.
            <br />
            Create an account for saved rooms and team collaboration.
          </p>
        </div>
      </main>
    </div>
  );
}

"use client";

import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { AuthService } from "@/features/auth";
import { toast } from "sonner";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const loginResponse = await AuthService.login({ email, password });

      // ── Sync Zustand store so role / navbar update immediately ──────────────
      const { authStore } = await import("@/shared/store/auth.store");
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        authStore.login(token, {
          firstName: "",
          lastName: "",
          email,
          phoneNumber: "",
          avatarUrl: "",
        });
      }

      toast.success("Signed in successfully! Redirecting...");
      const targetUrl = "/" + (loginResponse.firstLogin ? "onboarding" : "");
      router.push(targetUrl);
    } catch (err: any) {
      // Check if it is a network error (e.g. backend server down)
      if (err.message === "Network Error") {
        const networkError = "Network Connection Error: Cannot connect to the authorization server. Please verify that the API Gateway is running on port 8087.";
        setError(networkError);
        toast.error("Connection failed. Please check your network or server status.");
        return;
      }

      // Check if the error returned an object or api error response structure
      let parsedError = "";
      if (err.data && typeof err.data === "object") {
        const errData = err.data;
        if (errData.message) {
          if (typeof errData.message === "object") {
            parsedError = Object.entries(errData.message)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(", ");
          } else if (typeof errData.message === "string") {
            parsedError = errData.message;
          }
        }
      }

      const errorMsg = parsedError || (err instanceof Error ? err.message : "Invalid email or password. Please try again.");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-headline-md font-bold text-on-surface mb-2">Sign In</h2>
        <p className="text-body-md text-on-surface-variant">
          Enter your credentials to access your account.
        </p>
      </div>

      {error && (
        <div
          className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm font-semibold border border-error/20 animate-in fade-in slide-in-from-top-2 duration-200"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface-variant block" htmlFor="email">
            Email Address
          </label>
          <div className="relative group">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors flex items-center"
              aria-hidden="true"
            >
              <Mail className="size-5" />
            </span>
            <input
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/70 text-on-surface"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              className="text-label-md font-bold text-on-surface-variant block"
              htmlFor="password"
            >
              Password
            </label>
            <Link
              className="text-label-sm font-semibold text-primary hover:underline transition-all"
              href="#"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative group">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors flex items-center"
              aria-hidden="true"
            >
              <Lock className="size-5" />
            </span>
            <input
              className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border border-outline-variant/80 rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/70 text-on-surface"
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full py-6 bg-primary-container text-on-primary text-label-md font-semibold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
          {!isLoading && <ArrowRight className="size-5" />}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-8 flex items-center gap-4">
        <div className="flex-1 h-[1px] bg-outline-variant/30" />
        <span className="text-label-sm font-semibold text-outline uppercase tracking-wider text-xs">
          or continue with
        </span>
        <div className="flex-1 h-[1px] bg-outline-variant/30" />
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          type="button"
          className="flex items-center justify-center gap-3 py-3 px-4 border border-outline-variant/80 rounded-lg hover:bg-surface-container-low active:scale-[0.98] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-label-md font-semibold text-on-surface">Google</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-3 py-3 px-4 border border-outline-variant/80 rounded-lg hover:bg-surface-container-low active:scale-[0.98] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 text-on-surface" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.05 20.28c-.96.95-2.21 1.72-3.69 1.72-1.74 0-2.31-1.07-4.13-1.07-1.85 0-2.6 1.04-4.13 1.07-1.28 0-2.62-.77-3.65-1.72-2.1-1.94-3.23-5.32-3.23-8.15 0-3.32 2.06-5.06 4-5.06 1 0 1.95.53 2.76.53.81 0 1.57-.53 2.73-.53 1.6 0 2.91.82 3.73 1.97-3.34 1.41-2.8 5.75.57 7.24-.74 1.83-1.63 3.52-2.96 5zm-3.08-16.14c0 1.98-1.55 3.53-3.41 3.53-.05-2.07 1.71-3.69 3.41-3.53z" />
          </svg>
          <span className="text-label-md font-semibold text-on-surface">Apple</span>
        </button>
      </div>

      {/* Footer Link */}
      <div className="text-center">
        <p className="text-body-md text-on-surface-variant">
          Don&apos;t have an account?
          <Link
            className="text-label-md font-bold text-primary hover:underline ml-1.5 transition-all"
            href="/auth/signup"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

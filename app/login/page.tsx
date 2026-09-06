"use client";
import { useActionState } from "react";
import { signin } from "../actions/login-actions";
import Link from "next/link";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signin, undefined);

  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-12 w-full">
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-5 sm:p-8">
          <h2 className="card-title text-xl sm:text-2xl font-bold mb-1">Welcome Back</h2>
          <p className="text-xs sm:text-sm text-base-content/60 mb-3">Sign in to your account</p>
          <form action={action} className="flex flex-col gap-4">
            <div>
              <input 
                type="email" 
                name="email" 
                placeholder="Email address" 
                required
                className="input input-bordered w-full min-h-[44px]"
              />
              {state?.errors?.email && (
                <p className="text-error text-xs mt-1">{state.errors.email[0]}</p>
              )}
            </div>
            <div>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                required
                className="input input-bordered w-full min-h-[44px]"
              />
              {state?.errors?.password && (
                <p className="text-error text-xs mt-1">
                  {state.errors.password[0]}
                </p>
              )}
            </div>
            {state?.errors?.general && (
              <p className="text-error text-xs">
                {state.errors.general[0]}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="btn btn-primary w-full min-h-[44px] text-sm sm:text-base mt-1"
            >
              {pending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Logging in...
                </>
              ) : "Login"}
            </button>
            <p className="text-center text-xs sm:text-sm mt-2 text-base-content/70">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="link link-primary font-medium">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

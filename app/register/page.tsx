"use client";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth-actions";
import Link from "next/link";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-12 w-full">
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-5 sm:p-8">
          <h2 className="card-title text-xl sm:text-2xl font-bold mb-1">Create Account</h2>
          <p className="text-xs sm:text-sm text-base-content/60 mb-3">Join us to start shopping</p>
          <form action={action} className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                className="input input-bordered w-full min-h-[44px]"
              />
              {state?.errors?.name && (
                <p className="text-error text-xs mt-1">
                  {state.errors.name[0]}
                </p>
              )}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                className="input input-bordered w-full min-h-[44px]"
              />
              {state?.errors?.email && (
                <p className="text-error text-xs mt-1">
                  {state.errors.email[0]}
                </p>
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
              <p className="text-error text-xs">{state.errors.general[0]}</p>
            )}
            {state?.message && <p className="text-success text-xs">{state.message}</p>}

            <button
              type="submit"
              disabled={pending}
              className="btn btn-primary w-full min-h-[44px] text-sm sm:text-base mt-1"
            >
              {pending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </button>
            <p className="text-center text-xs sm:text-sm mt-2 text-base-content/70">
              Already have an account?{" "}
              <Link href="/login" className="link link-primary font-medium">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

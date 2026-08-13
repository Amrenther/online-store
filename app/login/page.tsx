"use client";
import { useActionState } from "react";
import { signin } from "../actions/login-actions";
import Link from "next/link";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signin, undefined);

  return (
    <div className="max-w-md mx-auto mt-10">
    <div className="card bg-base-100 shadow">
        <div className="card-body">
        <h2 className="card-title text-2xl font-bold">Login</h2>
        <form action={action} className="flex flex-col gap-4">
            <div>
            <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                className="input w-full"
            />
            {state?.errors?.email && (
                <p className="text-error text-sm mt-1">{state.errors.email[0]}</p>
            )}
            </div>
            <div>
            <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                className="input w-full"
            />
            {state?.errors?.password && (
                <p className="text-error text-sm mt-1">
                {state.errors.password[0]}
                </p>
            )}
            </div>
            {state?.errors?.general && (
            <p className="text-error text-sm">
                {state.errors.general[0]}
            </p>
            )}
            <button
            type="submit"
            disabled={pending}
            className="btn btn-primary w-full"
            >
            {pending ? (
                <>
                    <span className="loading loading-spinner loading-sm"></span>
                    loading
                </>
            ): "Login"}
            </button>
            <p className="text-center text-sm mt-2">
            Don't have an account?{" "}
            <Link href="/register" className="link link-primary">
                Sign Up
            </Link>
            </p>
        </form>
        </div>
    </div>
    </div>
  );
}

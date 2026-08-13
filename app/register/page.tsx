"use client";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth-actions";
import Link from "next/link";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="max-w-md mx-auto mt-10">
    <div className="card bg-base-100 shadow">
        <div className="card-body">
        <h2 className="card-title text-2xl font-bold">Create Account</h2>
        <form action={action} className="flex flex-col gap-4">
            <div>
            <input
                type="text"
                name="name"
                placeholder="Name"
                className="input w-full"
            />
            {state?.errors?.name && (
                <p className="text-error text-sm mt-1">
                {state.errors.name[0]}
                </p>
            )}
            </div>
            <div>
            <input
                type="email"
                name="email"
                placeholder="Email"
                className="input w-full"
            />
            {state?.errors?.email && (
                <p className="text-error text-sm mt-1">
                {state.errors.email[0]}
                </p>
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
            <p className="text-error text-sm">{state.errors.general[0]}</p>
            )}
            {state?.message && <p className="text-success text-sm">{state.message}</p>}

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
            ) : (
                "Register"
            )}
            </button>
        </form>
        </div>
    </div>
    </div>
  );
}

"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";

type FormErrors = {
    email?: string[];
    password?: string[];
    general?: string[];
}

type SigninState = {
    success?: boolean;
    message?: string;
    errors?: FormErrors;
}

const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password is too short - should be at least 6 characters"),
});


export async function signin(prevState: unknown, formData: FormData): Promise<SigninState> {
    const validated = signInSchema.safeParse(
        Object.fromEntries(formData)
    );

    if (!validated.success) {
        return {
            errors: z.flattenError(validated.error).fieldErrors as FormErrors,
        }
    }

    const { email, password } = validated.data;

    try {
        
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/",
        });

    } catch (error) {
        if (error instanceof AuthError) {
            return {
                errors: { general: [error.message] },
            }
        }

        throw error;
    }

    return {};
};
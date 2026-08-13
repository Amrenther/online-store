"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

type FormErrors = {
    name?: string[];
    email?: string[];
    password?: string[];
    general?: string[];
}

type SignupState = {
    success?: boolean;
    message?: string;
    errors?: FormErrors;
}

const signUpSchema = z.object({
  name: z.string().optional(),
  email: z.email(),
  password: z.string().min(8),
});


export async function signup(prevState: unknown, formData: FormData): Promise<SignupState> {

    const validated = signUpSchema.safeParse(
        Object.fromEntries(formData)
    ); 

    if (!validated.success) {
        return {
            errors: z.flattenError(validated.error).fieldErrors as FormErrors,
        }
    }


    const { name, email, password } = validated.data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return {
            errors: { email: ["Email is already registered"] },
        };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "user",
            },
        });

        return { 
            success: true,
            message: "User registered successfully",
         };
    } catch (error) {
        return {
            errors: { general: ["An error occurred during registration"] },
        };
    }
}
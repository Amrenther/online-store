import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";


export const {handlers, signIn, signOut, auth} = NextAuth({
    session: { strategy: "jwt" },

    providers: [
        Credentials({
            async authorize(credentials) {

                const parsed = z.object({
                    email: z.email(),
                    password: z.string().min(6)
                }).safeParse(credentials);

                if(!parsed.success) return null

                const { email, password } = parsed.data;

                const user = await prisma.user.findUnique({ where: { email } });

                if(!user) return null

                const valid = await bcrypt.compare(password, user.password);

                if(!valid) return null

                return {
                    id: String(user.id),
                    email: user.email,
                    name: user.name
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if(user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {

            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            
            return session;
        },
    },

    pages: {
        signIn: "/login"
    }
})

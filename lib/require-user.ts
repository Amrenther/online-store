import { auth, signOut } from "@/auth";
import prisma from "@/lib/prisma";

/**
 * Resolves the logged-in user id from the session and DB.
 * If the JWT still references a user removed from the DB (e.g. after migrate reset), signs out and redirects to login.
 */
export async function requireUserId(): Promise<number> {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("You must be logged in");
    }
    const userId = parseInt(session.user.id, 10);
    if (Number.isNaN(userId)) {
        throw new Error("You must be logged in");
    }

    const exists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });

    if (!exists) {
        await signOut({ redirectTo: "/login" });
        throw new Error("Session no longer valid");
    }

    return userId;
}

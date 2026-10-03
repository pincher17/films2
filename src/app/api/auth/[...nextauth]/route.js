import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { prisma } from "@/server/prisma";

const PROFILE_COOKIE = "fh_profile";

/**
 * Вход через Google.
 *
 * Сессии на JWT: нам не нужны токены Google после входа, достаточно id
 * пользователя. Поэтому схема базы остаётся простой (User + Account).
 *
 * Ключевой момент — привязка анонимного профиля: если у человека уже есть
 * cookie с анонимным профилем, аккаунт Google привязывается ИМЕННО к нему,
 * и вся накопленная история просмотра сохраняется.
 */
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const email = String(profile?.email || user?.email || "").toLowerCase() || null;
        const providerAccountId = String(account?.providerAccountId || "");
        if (!providerAccountId) return false;

        const cookieId = cookies().get(PROFILE_COOKIE)?.value || null;

        // 1. анонимный профиль из cookie — сохраняем его позиции
        let target = cookieId
          ? await prisma.user.findUnique({ where: { id: cookieId } })
          : null;

        // 2. иначе ищем по почте (человек уже входил раньше)
        if (!target && email) {
          target = await prisma.user.findUnique({ where: { email } });
        }

        // 3. иначе создаём нового
        if (!target) {
          target = await prisma.user.create({
            data: {
              email,
              name: user?.name ?? null,
              image: user?.image ?? null,
            },
          });
        } else {
          // дополняем пустые поля, ничего не затирая
          target = await prisma.user.update({
            where: { id: target.id },
            data: {
              email: target.email ?? email,
              name: target.name ?? user?.name ?? null,
              image: target.image ?? user?.image ?? null,
            },
          });
        }

        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: "google",
              providerAccountId,
            },
          },
          create: {
            userId: target.id,
            provider: "google",
            providerAccountId,
            email,
          },
          update: { userId: target.id, email },
        });

        // дальше по цепочке пойдёт наш id — он и попадёт в сессию
        user.id = target.id;
        return true;
      } catch (error) {
        console.error("[auth] не удалось связать аккаунт:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user?.id) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.uid) session.user.id = token.uid;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

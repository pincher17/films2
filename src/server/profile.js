import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const PROFILE_COOKIE = "fh_profile";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // год

/**
 * Профиль из cookie: анонимный пользователь, который позже привязывается
 * к аккаунту Google. create=false — только чтение, create=true — создать
 * при отсутствии.
 */
export async function currentProfile(create = false) {
  const store = cookies();
  const id = store.get(PROFILE_COOKIE)?.value;

  if (id) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (existing) return existing.id;
  }
  if (!create) return null;

  const user = await prisma.user.create({ data: {} });
  store.set(PROFILE_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return user.id;
}

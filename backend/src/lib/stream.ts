import { StreamChat } from "stream-chat";
import type { Env } from "./env.js";
import type { UserRole } from "../db/schema.js";

export function streamChatDisplayName(
  role: UserRole,
  name: string | null,
  email: string,
): string {
  const base = name ?? email.split("@")[0];
  if (role === "admin") return `Admin · ${base}`;
  if (role === "support") return `Support · ${base}`;
  return base;
}

export function getStreamChatServer(env: Env) {
  return StreamChat.getInstance(env.STREAM_API_KEY, env.STREAM_API_SECRET);
}

export function streamUserId(clerkUserId: string) {
  return `clerk_${clerkUserId}`;
}

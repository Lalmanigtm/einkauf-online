// import { Request, Response } from "express";

// export async function clerkWebhookHandler(req: Request, res: Response) {}
import type { Request as ExpressRequest, Response } from "express";
import { getEnv } from "../lib/env";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { parseRole } from "../lib/roles";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export async function clerkWebhookHandler(req: ExpressRequest, res: Response) {
  const env = getEnv();

  try {
    // webhook verification needs a shared secret; without it we cannot trust incoming POSTs.
    if (!env.CLERK_WEBHOOK_SECRET) {
      res.status(503).send("Webhooks secret is not provided");
      return;
    }

    // Clerk's verifier expects a Web Request with the raw body; Express may give Buffer or string.
    const payload =
      req.body instanceof Buffer
        ? req.body.toString("utf8")
        : typeof req.body === "string"
          ? req.body
          : JSON.stringify(req.body);

    const webhookRequest = new globalThis.Request(
      "http://internal/webhooks/clerk",
      {
        method: "POST",
        headers: new Headers(req.headers as HeadersInit),
        body: payload,
      },
    );

    // throws if signature is wrong or body was tampered with; only then we trust evt.
    const evt = await verifyWebhook(webhookRequest, {
      signingSecret: env.CLERK_WEBHOOK_SECRET,
    });

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data;

      const email =
        u.email_addresses?.find((e) => e.id === u.primary_email_address_id)
          ?.email_address ??
        u.email_addresses?.[0]?.email_address ??
        "";

      const name =
        [u.first_name, u.last_name].filter(Boolean).join(" ") ||
        u.username ||
        "Unknown User";

      // after this line write first create a file in lib as roles.ts then write a code there:

      const role = parseRole(u.public_metadata?.role);

      await db
        .insert(users)
        .values({
          clerkUserId: u.id,
          email,
          name,
          role,
        })
        .onConflictDoUpdate({
          target: users.clerkUserId,
          set: {
            email,
            name,
            role,
            updatedAt: new Date(),
          },
        });
    }

    if (evt.type === "user.deleted") {
      const id = evt.data.id;
      if (id) {
        await db.delete(users).where(eq(users.clerkUserId, id));
      }
    }

    res.json({ ok: true });
  } catch (err) {
    // Bad signature, malformed payload, or DB error — do not leak details to the client.
    console.error("Clerk webhook error", err);
    res.status(400).json({ error: "Invalid webhook" });
  }
}

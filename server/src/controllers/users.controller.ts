import { Webhook } from "svix";
import { Request, Response } from "express";
import { WebhookEvent } from "@clerk/clerk-sdk-node";
import prisma from "../../prisma/client";

async function handleClerkWebhook(req: Request, res: Response) {
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    console.error("Missing Clerk signing secret");
    throw new Error("Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local");
  }

  // get headers
  const svixId = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  if (!svixId || !svix_timestamp || !svix_signature) {
    res.status(400).json({ error: "Missing SVIX headers" });
    return;
  }

  const payload = req.body;
  const body = JSON.stringify(payload);

  const wh = new Webhook(SIGNING_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    res.status(400).send("Error: Verification error");
    return;
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { data } = evt;

    await prisma.user.create({
      data: {
        clerkId: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url,
        email: data.email_addresses[0].email_address,
      },
    });
  }

  if (eventType === "user.deleted") {
    const { data } = evt;

    if (!data.id) {
      res.status(400).send("Missing user id");
    }

    await prisma.user.delete({
      where: {
        clerkId: data.id,
      },
    });
  }

  if (eventType === "user.updated") {
    const { data } = evt;

    await prisma.user.update({
      where: {
        clerkId: data.id,
      },
      data: {
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url,
        email: data.email_addresses[0].email_address,
      },
    });
  }

  res.status(200).send("Webhook received");
}

export default {
  handleClerkWebhook,
};

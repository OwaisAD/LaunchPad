import { Webhook } from "svix";
import { Request, Response } from "express";
import { WebhookEvent } from "@clerk/express/webhooks";

import prisma from "../../prisma/client";

async function handleClerkWebhook(req: Request, res: Response) {
  const isDev = process.env.NODE_ENV === "development";

  const SIGNING_SECRET = isDev
    ? process.env.CLERK_WEBHOOK_SIGNING_SECRET_DEV
    : process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  console.log(SIGNING_SECRET);

  if (!SIGNING_SECRET) {
    console.error("Missing Clerk signing secret");
    throw new Error("Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local");
  }

  try {
    const wh = new Webhook(SIGNING_SECRET);

    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing headers");
      res.status(400).send("Error: Missing headers");
      return;
    }

    const body = req.body;
    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    const { id } = evt.data;
    console.log(evt);

    const eventType = evt.type;

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
    console.log("Webhook payload:", evt.data);

    if (eventType === "user.created") {
      const { data } = evt;

      await prisma.user.create({
        data: {
          id: data.id,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
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
          id: data.id,
        },
        include: {
          Membership: true,
          Organization: true,
          Project: true,
        },
      });
    }

    if (eventType === "user.updated") {
      const { data } = evt;

      await prisma.user.update({
        where: {
          id: data.id,
        },
        data: {
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          imageUrl: data.image_url,
          email: data.email_addresses[0].email_address,
        },
      });
    }

    res.status(200).send("Webhook received");
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    res.status(400).send("Error: Verification error");
    return;
  }
}

export default {
  handleClerkWebhook,
};

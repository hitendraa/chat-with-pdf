"use server";

import { userDetails } from "@/app/dashboard/upgrade/page";
import { adminDb } from "@/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createCheckoutSession(userDetails: userDetails) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  let StripeCustomerId;

  const user = await adminDb.collection("users").doc(userId).get();
  StripeCustomerId = user.data()?.stripeCustomerId;

  if (!StripeCustomerId) {
    const customer = await stripe.customers.create({
      email: userDetails.email,
      name: userDetails.name,
      metadata: {
        userId,
      },
    });

    await adminDb.collection("users").doc(userId).set({
      stripeCustomerId: customer.id,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1PhS0PSDa8bUrxuxqMIoWchi",
        quantity: 1,
      },
    ],
    mode: "subscription",
    customer: StripeCustomerId,
    success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
    cancel_url: `${getBaseUrl()}/upgrade`,
  });

  return session.id;
}

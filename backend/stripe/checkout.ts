import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import Stripe from "stripe";
import { getAuthData } from "~encore/auth";

const stripeSecretKey = secret("StripeSecretKey");

// Lazy initializer for the Stripe client to prevent app startup failure if the secret is not set.
function getStripeClient(): Stripe {
  const key = stripeSecretKey();
  if (!key) {
    throw APIError.internal("StripeSecretKey is not set. Please add it in the Leap Infrastructure tab.");
  }
  return new Stripe(key, {
    apiVersion: "2024-06-20",
  });
}

export interface CreateCheckoutSessionRequest {
  priceId?: string; // For subscription plans
  priceData?: {    // For one-time payments
    amount: number; // in smallest currency unit (e.g., paise for INR)
    currency: string;
    productName: string;
    productDescription?: string;
  };
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string | null;
}

// Creates a Stripe checkout session.
export const createCheckoutSession = api<CreateCheckoutSessionRequest, CreateCheckoutSessionResponse>(
  {
    expose: true,
    method: "POST",
    path: "/stripe/checkout-session",
    auth: true,
  },
  async (req) => {
    const auth = getAuthData();
    if (!auth) {
      throw APIError.unauthenticated("User is not authenticated");
    }

    if (!req.priceId && !req.priceData) {
      throw APIError.invalidArgument("Either priceId or priceData must be provided.");
    }

    let line_items: Stripe.Checkout.SessionCreateParams.LineItem[];
    let mode: Stripe.Checkout.SessionCreateParams.Mode;

    if (req.priceId) {
      // Subscription mode
      mode = "subscription";
      line_items = [{
        price: req.priceId,
        quantity: 1,
      }];
    } else if (req.priceData) {
      // Payment mode for one-time charges
      mode = "payment";
      line_items = [{
        price_data: {
          currency: req.priceData.currency,
          product_data: {
            name: req.priceData.productName,
            description: req.priceData.productDescription,
          },
          unit_amount: req.priceData.amount,
        },
        quantity: 1,
      }];
    } else {
      throw APIError.invalidArgument("Invalid request.");
    }

    try {
      const stripe = getStripeClient();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode,
        success_url: req.successUrl,
        cancel_url: req.cancelUrl,
        customer_email: auth.email,
        metadata: {
          userId: auth.userID,
        },
      });

      if (!session.url) {
        throw APIError.internal("Could not create Stripe checkout session");
      }

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error: any) {
      console.error("Stripe error:", error);
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal("Failed to create Stripe session", { cause: error.message });
    }
  }
);

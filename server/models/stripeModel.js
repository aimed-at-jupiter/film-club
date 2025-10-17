const Stripe = require("stripe");
const path = require("path");

const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: path.resolve(__dirname, `../../.env.${ENV}`),
});

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = (eventData) => {
  // eventData will include things like title, price, etc.
  if (!eventData || !eventData.price || !eventData.film_title) {
    return Promise.reject({ status: 400, msg: "Missing event data" });
  }

  return stripe.checkout.sessions
    .create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: eventData.film_title,
              description: "Film Club Event",
            },
            unit_amount: Math.round(Number(eventData.price) * 100), // Stripe works in pence
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
    })
    .then((session) => {
      return { url: session.url };
    })
    .catch((err) => {
      console.error("Stripe session error:", err);
      return Promise.reject({
        status: 500,
        msg: "Stripe session creation failed",
      });
    });
};

module.exports = { createCheckoutSession };

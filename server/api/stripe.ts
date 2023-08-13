import Stripe from "stripe";

export default defineEventHandler(async (event) => {
  const { productID } = await readBody(event);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: "2022-11-15"
  });

  // const {} = await stripe.products.retrieve(productID);
  const { data } = await stripe.prices.list({
    product: productID
  });

  console.log("products", data[0].unit_amount);
  if (!data?.[0].unit_amount) return;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data[0].unit_amount,
      currency: data[0].currency,
      metadata: { infoOnCustomer: "123" },
      automatic_payment_methods: {
        enabled: true
      }
    });

    return { secret: paymentIntent.client_secret };
  } catch (error) {
    console.log("error", error);
    throw createError({
      statusCode: 500,
      statusMessage: (error as Error).message
    });
  }
});

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  PaymentMethodCreateParams,
  Stripe,
  StripeElements,
  loadStripe
} from "@stripe/stripe-js";
// import { style } from "./stripeStyle";

const router = useRouter();

const config = useRuntimeConfig();

let stripe: Stripe | null;
let loading = ref(true);
let elements: StripeElements;

onMounted(async () => {
  const ELEMENT_TYPE = "card";
  stripe = await loadStripe(config.public.STRIPE_KEY);

  elements = stripe!.elements({
    mode: "payment",
    amount: 1999,
    currency: "usd"
  });
  // const element = elements.create(ELEMENT_TYPE, style);
  // element.mount("#stripe-element-mount-point");
  // const cardElement = elements.create("card");
  // cardElement.mount("#card-element");
  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  loading.value = false;
});

const handleSubmit = async (e: Event) => {
  if (loading.value) return;
  if (!stripe || !elements) {
    // Stripe.js hasn't yet loaded.
    return;
  }
  loading.value = true;
  const { name, email, address, city, state, zip } = Object.fromEntries(
    new FormData(e.target as HTMLFormElement)
  );

  const billing_details: PaymentMethodCreateParams.BillingDetails = {
    name: name as string,
    email: email as string,
    address: {
      city: city as string,
      line1: address as string,
      state: state as string,
      postal_code: zip as string,
      country: "US"
    }
  };

  const cardElement = elements.getElement("card");

  // Create payment intents first and grab secret
  try {
    const response = await fetch("/api/stripe", {
      method: "POST",
      body: JSON.stringify({ productID: "prod_JfGkdfBBEv5KCi" })
    });
    const { secret: clientSecret } = await response.json();

    // Confirm payment

    // Trigger form validation and wallet collection

    const { error: submitError } = await elements.submit();
    if (submitError) {
      console.log("error submit");
      return;
    }

    // const confirm = await stripe?.confirmCardPayment(secret, {
    //   payment_method: {
    //     card: cardElement!,
    //     billing_details
    //   }
    // });

    // Use the clientSecret and Elements instance to confirm the setup
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        shipping: {
          address: {
            city: city as string,
            line1: address as string,
            state: state as string,
            postal_code: zip as string,
            country: "US"
          },
          name: name as string
        },
        return_url: "http://localhost:3000/success"
      }
      // Uncomment below if you only want redirect for redirect-based payments
      // redirect: "if_required",
    });

    loading.value = false;
    // console.log("error?", confirm?.error);
    // confirm?.error ? router.push("/error") : router.push("/success");
    if (error.type === "card_error" || error.type === "validation_error") {
      router.push("/error");
    } else {
      // setMessage("An unexpected error occurred.");
      // router.push("/success");
      console.log("great");
    }
  } catch (error) {
    console.log("error", error);
    router.push("/error");
    loading.value = false;
  }
};
</script>
<template>
  <section class="showcase">
    <div class="nes-container with-title">
      <h3>Donkey Kong Country SNES $19.99</h3>
      <div class="img">
        <img src="donkey.jpeg" alt="" srcset="" />
      </div>
    </div>
  </section>
  <div class="nes-container with-title is-centered">
    <form @submit.prevent="handleSubmit">
      <fieldset :class="{ dis: loading }" class="fields">
        <div class="nes-field"></div>
        <div class="nes-field">
          <label for="name_field">Name</label>
          <input
            placeholder="Jane Doe"
            type="text"
            name="name"
            id="name_field"
            class="nes-input"
          />
        </div>
        <div class="nes-field">
          <label for="email_field">Email</label>
          <input
            placeholder="jane.doe@example.com "
            type="email"
            name="email"
            id="email_field"
            class="nes-input"
          />
        </div>
        <div class="nes-field">
          <label for="address_field">Address</label>
          <input
            placeholder="1234 Sycamore Street"
            type="text"
            name="address"
            id="address_field"
            class="nes-input"
          />
        </div>
        <div class="nes-field">
          <label for="city_field">City</label>
          <input
            placeholder="Reno"
            type="text"
            name="city"
            id="city_field"
            class="nes-input"
          />
        </div>
        <div class="nes-field">
          <label for="state_field">State</label>
          <input
            placeholder="Nevada"
            type="text"
            name="state"
            id="state_field"
            class="nes-input"
          />
        </div>
        <div class="nes-field">
          <label for="zip_field">Zip</label>
          <input
            placeholder="89523"
            type="text"
            name="zip"
            id="zip_field"
            class="nes-input"
          />
        </div>
        <div class="nes-field">
          <label for="email_field">Credit Card</label>
          <!-- <div id="stripe-element-mount-point" class="nes-input" /> -->
          <!-- <div id="card-element" /> -->
          <div id="payment-element" class="nes-input" />
        </div>
      </fieldset>
      <div class="nes-field">
        <button
          type="submit"
          class="nes-btn is-primary"
          :class="{ dis: loading }"
        >
          {{ loading ? "Loading..." : "Pay $19.99" }}
        </button>
      </div>
    </form>
  </div>
</template>
<style>
.img {
  display: flex;
  justify-content: center;
}
h3 {
  font-size: xx-large;
}
</style>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Stripe, StripeElements, loadStripe } from "@stripe/stripe-js";
// import { style } from "./stripeStyle";

const router = useRouter();

const config = useRuntimeConfig();

let stripe: Stripe | null;
let loading = ref(true);
let elements: StripeElements;

onMounted(async () => {
  stripe = await loadStripe(config.public.STRIPE_KEY);
  // elements

  elements = stripe!.elements({
    mode: "payment",
    amount: 1999,
    currency: "usd"
  });
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

  // Create payment intents first and grab secret
  try {
    const response = await fetch("/api/stripe", {
      method: "POST",
      body: JSON.stringify({ productID: "prod_JfGkdfBBEv5KCi" })
    });
    const { secret: clientSecret } = await response.json();

    const { error: submitError } = await elements.submit();
    if (submitError) {
      console.log("error submit");
      loading.value = false;
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        receipt_email: email as string,
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
    if (error.type === "card_error" || error.type === "validation_error") {
      router.push("/error");
    } else {
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
        <img src="/images/donkey.jpeg" alt="" srcset="" />
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

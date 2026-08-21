import { useState } from "react";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface Props {
  clientSecret: string;
  onSuccess: () => void;
}

export default function StripePayment({
  onSuccess,
}: Props) {

  const stripe = useStripe();

  const elements = useElements();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {

      setLoading(true);

      setError("");

      const result =
        await stripe.confirmPayment({

          elements,

          confirmParams: {

            return_url:
              window.location.origin,

          },

          redirect: "if_required",

        });

        console.log(result);

      if (result.error) {

        setError(
          result.error.message ||
            "Payment Failed"
        );

        return;

      }

      if (
        result.paymentIntent &&
        result.paymentIntent.status ===
          "succeeded"
      ) {

        onSuccess();

      }

    } catch (err) {

      setError(
        "Unexpected payment error."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <form
      onSubmit={handleSubmit}
      className="stripe-form"
    >

      <PaymentElement />

      {error && (

        <div
          style={{
            marginTop: 15,
            color: "red",
            fontSize: 14,
          }}
        >

          {error}

        </div>

      )}

      <button
        type="submit"
        className="checkout-btn"
        disabled={
          !stripe || loading
        }
        style={{
          marginTop: 20,
        }}
      >

        <span>

          {loading
            ? "Processing Payment..."
            : "Pay Securely"}

        </span>

      </button>

      <p
        style={{
          marginTop: 20,
          fontSize: 13,
          color: "#777",
          textAlign: "center",
          lineHeight: 1.7,
        }}
      >

        Payments are securely
        processed by Stripe.

        <br />

        Supports Visa,
        Mastercard,
        American Express,
        Apple Pay,
        Google Pay,
        and Link.

      </p>

    </form>

  );

}
import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "../lib/stripe";
import StripePayment from "../components/StripePayment";
import { useCart } from "../context/CartContext";

type Page =
  | "home"
  | "products"
  | "detail"
  | "cart"
  | "checkout"
  | "success"
  | "about"
  | "contact"
  | "favorites";

interface CheckoutPageProps {
  onNavigate: (page: Page) => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, totalPrice, totalShipping, clearCart } = useCart();

  // ==========================
  // STEP
  // ==========================
  const [step, setStep] = useState(1);

  // ==========================
  // LOADING
  // ==========================
  const [loading, setLoading] = useState(false);

  // ==========================
  // STRIPE
  // ==========================
  const [clientSecret, setClientSecret] = useState("");

  // ==========================
  // ORDER
  // ==========================
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [confirmedShipping, setConfirmedShipping] = useState<number | null>(null);
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null);

  // ==========================
  // PAYMENT
  // ==========================
  const [payMethod, setPayMethod] = useState("card");

  // ==========================
  // FORM
  // ==========================
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const set = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ==========================
  // PRICE
  // ==========================
  const shipping = confirmedShipping ?? totalShipping;
  if (items.length === 0) {

  return (

    <div className="checkout-page">

      <h2>

        Your cart is empty.

      </h2>

      <button
        className="checkout-btn"
        onClick={() => onNavigate("products")}
      >

        Continue Shopping

      </button>

    </div>

  );

}
  const total = confirmedTotal ?? totalPrice + shipping;

  // ==========================
  // VALIDATE ADDRESS
  // ==========================
  const validateAddress = () => {
    if (!form.firstName) return "First Name is required";
    if (!form.lastName) return "Last Name is required";
    if (!form.email) return "Email is required";
    if (!form.phone) return "Phone is required";
    if (!form.address) return "Address is required";
    if (!form.city) return "City is required";
    if (!form.state) return "State is required";
    if (!form.pincode) return "Postal Code is required";
    return "";
  };

  // ==========================
  // CREATE PENDING ORDER
  // ==========================
  const createPendingOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Logged User:", user);

    const response = await fetch(`${API_URL}/api/client/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
       payment_method: payMethod.toUpperCase(),
        address: {
          full_name: `${form.firstName} ${form.lastName}`,
          phone: form.phone,
          country: "United Kingdom",
          state: form.state,
          city: form.city,
          postal_code: form.pincode,
          address_line1: form.address,
          address_line2: "",
        },
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          size: item.size,
        })),
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    setOrderId(data.order.id);
    setOrderNumber(data.order.order_number);
    setConfirmedShipping(Number(data.order.shipping));
    setConfirmedTotal(Number(data.order.total));

    return data.order.id;
  };

  // ==========================
  // CREATE PAYMENT INTENT
  // ==========================
  const createPaymentIntent = async (orderId: number) => {
    const response = await fetch(`${API_URL}/api/payments/create-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_id: orderId }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    setClientSecret(data.clientSecret);
  };

  // ==========================
  // CONTINUE TO PAYMENT
  // ==========================
 const handleContinue = async () => {
  const error = validateAddress();

  if (error) {
    alert(error);
    return;
  }

  try {
    setLoading(true);
    const id = await createPendingOrder();
    await createPaymentIntent(id);
    setStep(3);
  } catch (err: any) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  // ==========================
  // PAYMENT SUCCESS
  // ==========================
  const handlePaymentSuccess = () => {
    clearCart();
    localStorage.setItem("lastOrderId", String(orderId));
    localStorage.setItem("lastOrderNumber", orderNumber);
    onNavigate("success");
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* =======================================
            LEFT SIDE
        ======================================= */}
        <div className="checkout-left">
          <div className="checkout-header">
            <h1>Secure Checkout</h1>

            <div className="step-indicator">
              <div className={`step ${step >= 1 ? "active" : ""}`}>
                <span>1</span>
                <p>Address</p>
              </div>

              <div className="line" />

              <div className={`step ${step >= 2 ? "active" : ""}`}>
                <span>2</span>
                <p>Review</p>
              </div>

              <div className="line" />

              <div className={`step ${step >= 3 ? "active" : ""}`}>
                <span>3</span>
                <p>Payment</p>
              </div>
            </div>
          </div>

          {/* =======================================
              STEP 1
          ======================================= */}
          {step === 1 && (
            <div className="checkout-form">
              <div className="section">
                <h3>Contact Information</h3>

                <div className="grid-2">
                  <div className="input-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="john@email.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      placeholder="+44..."
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="section">
                <h3>Shipping Address</h3>

                <div className="input-group">
                  <label>Address</label>
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                  />
                </div>

                <div className="grid-3">
                  <div className="input-group">
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="London"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>County / State</label>
                    <input
                      type="text"
                      placeholder="England"
                      value={form.state}
                      onChange={(e) => set("state", e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Post Code</label>
                    <input
                      type="text"
                      placeholder="SW1A 1AA"
                      value={form.pincode}
                      onChange={(e) => set("pincode", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="checkout-btn"
                onClick={() => setStep(2)}
              >
                <span>Continue to Review</span>
              </button>
            </div>
          )}

          {/* =======================================
              STEP 2 - REVIEW ORDER
          ======================================= */}
          {step === 2 && (
            <div className="checkout-form">
              <div className="section">
                <h3>Review Your Order</h3>

                <div className="review-box">
                  {items.map((item) => {
                    const price = Number(
                      item.product.discount_price || item.product.price
                    );

                    return (
                      <div
                        key={`${item.product.id}-${item.size}-${item.color}`}
                        className="review-item"
                      >
                        <div>
                          <h4>{item.product.name}</h4>
                          <p>Size: {item.size}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                        <strong>
                          £{(price * item.quantity).toFixed(2)}
                        </strong>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ==========================
                  DELIVERY ADDRESS
              ========================== */}
              <div className="section">
                <h3>Delivery Address</h3>

                <div className="review-box">
                  <p>
                    <strong>
                      {form.firstName} {form.lastName}
                    </strong>
                  </p>
                  <p>{form.address}</p>
                  <p>
                    {form.city}, {form.state}
                  </p>
                  <p>{form.pincode}</p>
                  <p>{form.phone}</p>
                  <p>{form.email}</p>
                </div>
              </div>

              {/* ==========================
                  PAYMENT METHOD
              ========================== */}
              <div className="section">
                <h3>Payment Method</h3>

                <div className="payment-methods">

  <button
    type="button"
    className={`pay-method ${
      payMethod === "card" ? "active" : ""
    }`}
    onClick={() => setPayMethod("card")}
  >
    💳 Card
  </button>

  <button
    type="button"
    className={`pay-method ${
      payMethod === "applepay" ? "active" : ""
    }`}
    onClick={() => setPayMethod("applepay")}
  >
    🍎 Apple Pay
  </button>

  <button
    type="button"
    className={`pay-method ${
      payMethod === "googlepay" ? "active" : ""
    }`}
    onClick={() => setPayMethod("googlepay")}
  >
    G Pay
  </button>

  <button
    type="button"
    className={`pay-method ${
      payMethod === "paypal" ? "active" : ""
    }`}
    onClick={() => setPayMethod("paypal")}
  >
    PayPal
  </button>

  <button
    type="button"
    className={`pay-method ${
      payMethod === "klarna" ? "active" : ""
    }`}
    onClick={() => setPayMethod("klarna")}
  >
    Klarna
  </button>

  <button
    type="button"
    className={`pay-method ${
      payMethod === "cod" ? "active" : ""
    }`}
    onClick={() => setPayMethod("cod")}
  >
    Cash on Delivery
  </button>

</div>

                <p
                  style={{
                    marginTop: 15,
                    color: "#777",
                    fontSize: 14,
                  }}
                >
                  Secure payments are processed using Stripe.
                </p>
              </div>

              {/* ==========================
                  BUTTONS
              ========================== */}
              <div className="btn-row">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setStep(1)}
                >
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  className="checkout-btn"
                  disabled={loading}
                  onClick={handleContinue}
                >
                  <span>
                    {loading
                      ? "Preparing Payment..."
                      : "Continue to Secure Payment"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* =======================================
              STEP 3 - SECURE PAYMENT
          ======================================= */}
          {step === 3 && (
            <div className="checkout-form">
              <div className="section">
                <h3>Secure Payment</h3>

                <p
                  style={{
                    color: "#666",
                    marginBottom: 20,
                  }}
                >
                  Complete your payment securely with Stripe.
                </p>

                {/* ==========================
                    ORDER SUMMARY
                ========================== */}
                <div className="review-box">
                  <div className="review-item">
                    <div>
                      <strong>Order Number</strong>
                    </div>
                    <strong>{orderNumber}</strong>
                  </div>

                  <div className="review-item">
                    <div>
                      <strong>Payment Method</strong>
                    </div>
                    <strong>
  {payMethod === "card" && "Card Payment"}
  {payMethod === "applepay" && "Apple Pay"}
  {payMethod === "googlepay" && "Google Pay"}
  {payMethod === "paypal" && "PayPal"}
  {payMethod === "klarna" && "Klarna"}
  {payMethod === "cod" && "Cash on Delivery"}
</strong>
                  </div>

                  <div className="review-item">
                    <div>
                      <strong>Total Payable</strong>
                    </div>
                    <strong>£{total.toFixed(2)}</strong>
                  </div>
                </div>

               {/* ==========================
    CARD / APPLE PAY / GOOGLE PAY
========================== */}

{(payMethod === "card" ||
  payMethod === "applepay" ||
  payMethod === "googlepay") && (

  <div
    style={{
      marginTop: 30,
    }}
  >

    {clientSecret ? (

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
          },
        }}
      >

        <StripePayment
          clientSecret={clientSecret}
          onSuccess={handlePaymentSuccess}
        />

      </Elements>

    ) : (

      <div className="card-box">

        <p>

          Initializing secure payment...

        </p>

      </div>

    )}

  </div>

)}

{/* ==========================
    PAYPAL
========================== */}

{payMethod === "paypal" && (

  <div className="review-box">

    <h4>

      PayPal

    </h4>

    <p>

      You will be redirected to PayPal
      to complete your payment.

    </p>

    <button
      className="checkout-btn"
      disabled
    >

      PayPal Integration Coming Next

    </button>

  </div>

)}

{/* ==========================
    KLARNA
========================== */}

{payMethod === "klarna" && (

  <div className="review-box">

    <h4>

      Klarna

    </h4>

    <p>

      Buy now and pay later using Klarna.

    </p>

    <button
      className="checkout-btn"
      disabled
    >

      Klarna Integration Coming Next

    </button>

  </div>

)}

{/* ==========================
    CASH ON DELIVERY
========================== */}

{payMethod === "cod" && (

  <div
    className="review-box"
    style={{
      marginTop: 25,
    }}
  >

    <h4>

      Cash on Delivery

    </h4>

    <p>

      Pay
      <strong>

        {" "}
        £{total.toFixed(2)}

      </strong>

      {" "}
      when your furniture is delivered.

    </p>

    <button
      type="button"
      className="checkout-btn"
      style={{
        marginTop: 20,
      }}
      onClick={() => {

        clearCart();

        localStorage.setItem(
          "lastOrderId",
          String(orderId)
        );

        localStorage.setItem(
          "lastOrderNumber",
          orderNumber
        );

        onNavigate("success");

      }}
    >

      <span>

        Confirm Order

      </span>

    </button>

  </div>

)}

               

                {/* ==========================
                    BACK BUTTON
                ========================== */}
                <div
                  style={{
                    marginTop: 30,
                  }}
                >
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setStep(2)}
                  >
                    <span>Back</span>
                  </button>
                </div>
              </div>
            </div>
          )}
               </div>

        {/* =======================================
            RIGHT SIDE
        ======================================= */}

        <div className="checkout-right">

          <div className="order-summary-card">

            <div className="summary-header">
              <h2>Your Order</h2>
              <span>{items.length} Items</span>
            </div>

            <div className="order-items">

              {items.map((item) => {

                const price = Number(
                  item.product.discount_price ||
                  item.product.price
                );

                return (

                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="order-item"
                  >

                    <div className="item-image">

                      <img
                        src={
                          item.product.images?.length
                            ? `${API_URL}${item.product.images[0].image_url}`
                            : "/placeholder.png"
                        }
                        alt={item.product.name}
                      />

                    </div>

                    <div className="item-info">

                      <h4>{item.product.name}</h4>

                      <p>Size : {item.size}</p>

                      <p>Qty : {item.quantity}</p>

                    </div>

                    <strong>

                      £{(price * item.quantity).toFixed(2)}

                    </strong>

                  </div>

                );

              })}

            </div>

            <div className="summary-pricing">

              <div className="summary-row">

                <span>Subtotal</span>

                <span>

                  £{totalPrice.toFixed(2)}

                </span>

              </div>

              <div className="summary-row">

                <span>Shipping</span>

                <span>

                  {shipping === 0
                    ? "FREE"
                    : `£${shipping.toFixed(2)}`}

                </span>

              </div>

              <div className="summary-total">

  <span>Total</span>

  <strong>
    £{total.toFixed(2)}
  </strong>

</div>

<hr />

<div
  style={{
    marginTop: 25,
    color: "#666",
    fontSize: 14,
    lineHeight: 1.8,
  }}
>

  <strong>Secure Payment</strong>

  <p>
    Your payment is securely processed using Stripe SSL Encryption.
  </p>

  <div
    style={{
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      marginTop: 10,
    }}
  >
    <span className="payment-badge">Visa</span>
    <span className="payment-badge">Mastercard</span>
    <span className="payment-badge">Amex</span>
    <span className="payment-badge">Apple Pay</span>
    <span className="payment-badge">Google Pay</span>
    <span className="payment-badge">Link</span>
  </div>

</div>
              

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

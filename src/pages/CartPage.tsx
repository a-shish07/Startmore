import { useState } from "react";
import { useCart } from "../context/CartContext";

type Page =
  | "home" | "products" | "detail" | "cart" | "checkout"
  | "success" | "about" | "contact" | "favorites";

interface CartPageProps {
  onNavigate: (page: Page, productId?: number) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, totalShipping, getProductShipping } = useCart();
  console.log(items);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [orderNote, setOrderNote] = useState("");

  const shipping = totalShipping;
  const discount = couponApplied ? Math.round(totalPrice * 0.1) : 0;
  const total = Math.max(0, totalPrice + shipping - discount);

  if (items.length === 0) {
    return (
      <div className="cart-layout">
        <h1>Shopping Bag</h1>
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>🛍️</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 300, marginBottom: "16px" }}>
            Your bag is empty
          </h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "14px" }}>
            Discover our handcrafted nail collection
          </p>
          <button className="btn-primary" onClick={() => onNavigate("products")}>
            <span>Start Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <h1>Shopping Bag</h1>

      {/* Cart Table */}
      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th></th>
            <th>Price</th>
            <th>Shipping</th>
            <th>Quantity</th>
            <th>Product Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* {items.map(item => (
            <tr key={`${item.product.id}-${item.size}-${item.color}`}>
              <td>
                <img
src={
  item.product.images?.length
    ? `${import.meta.env.VITE_API_URL}${item.product.images[0].image_url}`
    : "/placeholder.png"
}
  alt={item.product.name}
  className="cart-item-img"
/>
              </td>
              <td>
                <div className="cart-item-name">{item.product.name}</div>
                <div className="cart-item-variant">{item.size}</div>
              </td>
              <td>
  £
  {Number(
    item.product.discount_price || item.product.price
  ).toFixed(2)}
</td>
              <td>
                <div className="cart-qty">
                  <button onClick={() => updateQuantity(item.product.id, item.size, item.color, -1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.size, item.color, 1)}>+</button>
                </div>
              </td>
              <td>
  £
  {(
    Number(
      item.product.discount_price || item.product.price
    ) * item.quantity
  ).toFixed(2)}
</td>
              <td>
                <button className="remove-btn" onClick={() => removeFromCart(item.product.id, item.size, item.color)}>
                  ✕
                </button>
              </td>
            </tr>
          ))} */}
          {items.map((item) => {
  const price =
    item.product.discount_price !== null &&
    item.product.discount_price !== undefined
      ? Number(item.product.discount_price)
      : Number(item.product.price);
  const itemShipping = getProductShipping(item.product.id);
  const productTotal = (price + itemShipping) * item.quantity;

  return (
    <tr key={`${item.product.id}-${item.size}-${item.color}`}>
      <td>
        <img
          src={
            item.product.images?.length
              ? `${import.meta.env.VITE_API_URL}${item.product.images[0].image_url}`
              : "/placeholder.png"
          }
          alt={item.product.name}
          className="cart-item-img"
        />
      </td>

      <td>
        <div className="cart-item-name">
          {item.product.name}
        </div>

        <div className="cart-item-variant">
          {item.size}
        </div>
      </td>

      <td>
        £{price.toFixed(2)}
      </td>

      <td>
        {itemShipping === 0 ? "Free" : `£${itemShipping.toFixed(2)}`}
      </td>

      <td>
        <div className="cart-qty">
          <button
            onClick={() =>
              updateQuantity(
                item.product.id,
                item.size,
                item.color,
                -1
              )
            }
          >
            −
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() =>
              updateQuantity(
                item.product.id,
                item.size,
                item.color,
                1
              )
            }
          >
            +
          </button>
        </div>
      </td>
      

      <td>
        £{productTotal.toFixed(2)}
      </td>

      <td>
        <button
          className="remove-btn"
          onClick={() =>
            removeFromCart(
              item.product.id,
              item.size,
              item.color
            )
          }
        >
          ✕
        </button>
      </td>
    </tr>
  );
})}
        </tbody>
      </table>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "40px", marginTop: "40px" }}>
        <div>
          <div style={{ border: "1px solid var(--border)", padding: "24px" }}>
            <h4 style={{ fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>
              Order Notes
            </h4>
            <textarea
              style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", fontFamily: "'Jost'", fontSize: "13px", minHeight: "100px", resize: "vertical" }}
              placeholder="Any special requests..."
              value={orderNote}
              onChange={e => setOrderNote(e.target.value)}
            />
          </div>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>£{totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? "var(--gold)" : "inherit" }}>
              {shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}
            </span>
          </div>
          {couponApplied && (
            <div className="summary-row" style={{ color: "var(--gold)" }}>
              <span>Discount (10%)</span>
              <span>−£{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="coupon-row">
            <input
              type="text"
              placeholder="Coupon code"
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
            />
            <button onClick={() => { if (coupon.trim()) setCouponApplied(true); }}>Apply</button>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
          <button
            className="btn-primary"
            style={{ width: "100%", marginTop: "16px", display: "block", textAlign: "center" }}
            onClick={() => onNavigate("checkout")}
          >
            <span>Proceed to Checkout</span>
          </button>
          <button
            onClick={() => onNavigate("products")}
            style={{ width: "100%", marginTop: "12px", background: "none", border: "1px solid var(--border)", padding: "12px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Jost'", color: "var(--text)", transition: "all .3s" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

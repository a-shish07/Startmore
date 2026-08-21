import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

type Product = any;

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (
    productId: number,
    size: string,
    color: string
  ) => void;
  updateQuantity: (
    productId: number,
    size: string,
    color: string,
    delta: number
  ) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  totalShipping: number;
  getProductShipping: (productId: number) => number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "sr_artmore_cart";
const API_URL = import.meta.env.VITE_API_URL;

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Load cart from localStorage when the app starts
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  const [quotedShipping, setQuotedShipping] = useState<number | null>(null);
  const [shippingRates, setShippingRates] = useState<Record<number, number>>({});

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [items]);

  // Always refresh shipping from the database so saved carts cannot use an
  // old product shipping value after an admin changes it.
  useEffect(() => {
    if (items.length === 0) {
      setQuotedShipping(0);
      setShippingRates({});
      return;
    }

    const controller = new AbortController();

    fetch(`${API_URL}/api/client/shipping-quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setQuotedShipping(Number(data.shipping));
          setShippingRates(data.shipping_rates ?? {});
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Failed to refresh shipping quote:", error);
        }
      });

    return () => controller.abort();
  }, [items]);

  const addToCart = useCallback(
    (
      product: Product,
      size = "",
      color = ""
    ) => {
      console.log("Adding Product:", product);

      setItems((prev) => {
        const existing = prev.find(
          (i) =>
            i.product.id === product.id &&
            i.size === size &&
            i.color === color
        );

        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id &&
            i.size === size &&
            i.color === color
              ? {
                  ...i,
                  quantity: i.quantity + 1,
                }
              : i
          );
        }

        return [
          ...prev,
          {
            product,
            quantity: 1,
            size,
            color,
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback(
    (
      productId: number,
      size: string,
      color: string
    ) => {
      setItems((prev) =>
        prev.filter(
          (i) =>
            !(
              i.product.id === productId &&
              i.size === size &&
              i.color === color
            )
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (
      productId: number,
      size: string,
      color: string,
      delta: number
    ) => {
      setItems((prev) =>
        prev
          .map((i) => {
            if (
              i.product.id === productId &&
              i.size === size &&
              i.color === color
            ) {
              const newQty = i.quantity + delta;

              return newQty <= 0
                ? null
                : {
                    ...i,
                    quantity: newQty,
                  };
            }

            return i;
          })
          .filter(Boolean) as CartItem[]
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalCount = items.reduce(
    (sum, i) => sum + i.quantity,
    0
  );

  const totalPrice = items.reduce(
    (sum, i) => {
      const price =
        i.product.discount_price !== null &&
        i.product.discount_price !== undefined
          ? Number(i.product.discount_price)
          : Number(i.product.price);

      return sum + price * i.quantity;
    },
    0
  );

  const localShipping = items.reduce(
    (sum, item) => sum + Number(item.product.shipping_cost ?? 0) * item.quantity,
    0
  );

  const totalShipping = quotedShipping ?? localShipping;

  const getProductShipping = (productId: number) =>
    Number(shippingRates[productId] ?? items.find((item) => item.product.id === productId)?.product.shipping_cost ?? 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
        totalShipping,
        getProductShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error(
      "useCart must be inside CartProvider"
    );
  }

  return ctx;
}

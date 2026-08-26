import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AuthProvider } from "./context/AuthContext";
import { NotifProvider } from "./components/Notification";
import CustomCursor from "./components/CustomCursor";
import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Login from "./pages/login";
import { ForgotPassword, ResetPassword } from "./pages/AuthRecovery";
import Dashboard from "./pages/Dashboard";
import SizeGuide from "./pages/SizeGuide";
import HowToApply from "./pages/HowToApply";
import FAQ from "./pages/FAQ";
import Press from "./pages/Press";
import WholesaleInquiry from "./pages/Wholesale";
import "./index.css";


//Admin Pages
import AdminLogin from "./admin/pages/AdminLogin/AdminLogin";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminDashboard from "./admin/pages/AdminDashboard/AdminDashboard";
import PolicyPage from "./pages/PolicyPage";
import AdminLayout from "./admin/layouts/AdminLayout";
import BannerList from "./admin/pages/Banner/BannerList";
import AddBanner from "./admin/pages/Banner/AddBanner";
import EditBanner from "./admin/pages/Banner/EditBanner";
import CategoryList from "./admin/pages/Categories/CategoryList";
import AddCategory from "./admin/pages/Categories/AddCategory";
import EditCategory from "./admin/pages/Categories/EditCategory";
import ShapeList from "./admin/pages/Shapes/ShapeList";
import AddShape from "./admin/pages/Shapes/AddShape";
import EditShape from "./admin/pages/Shapes/EditShape";
import ProductList from "./admin/pages/Products/ProductList";
import AddProduct from "./admin/pages/Products/AddProduct";
import EditProduct from "./admin/pages/Products/EditProduct";
import SizeList from "./admin/pages/Sizes/SizeList";
import AddSize from "./admin/pages/Sizes/AddSize";
import EditSize from "./admin/pages/Sizes/EditSize";
import OrderList from "./admin/pages/Orders/OrderList";
import OrderDetails from "./admin/pages/Orders/OrderDetails";
import CustomerList from "./admin/pages/Customers/CustomerList";
import CustomerDetails from "./admin/pages/Customers/CustomerDetails";
import UserList from "./admin/pages/Users/UserList";
import UserDetails from "./admin/pages/Users/UserDetails";


type Page =
  | "home" | "products" | "detail" | "cart" | "checkout" | "success" | "about" | "contact" | "favorites"
  | "login" | "dashboard" | "size-guide" | "how-to-apply" | "faq" | "press" | "new-arrivals" | "on-sale" | "best-sellers"
  | "blog" | "careers" | "returns" | "shipping" | "privacy" | "terms" | "wholesale";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProductDetailPageWrapper({ onNavigate }: { onNavigate: any }) {
  const { id } = useParams();
  return <ProductDetailPage productId={parseInt(id || "1")} onNavigate={onNavigate} />;
}

function AppInner() {
  const navigateHook = useNavigate();
  const location = useLocation();

  const getPageFromPath = (path: string): Page => {
    if (path === "/") return "home";
    if (path === "/products") return "products";
    if (path === "/new-arrivals") return "new-arrivals";
    if (path === "/on-sale") return "on-sale";
    if (path === "/best-sellers") return "best-sellers";
    if (path.startsWith("/product/")) return "detail";
    if (path === "/favorites") return "favorites";
    if (path === "/cart") return "cart";
    if (path === "/checkout") return "checkout";
    if (path === "/success") return "success";
    if (path === "/about") return "about";
    if (path === "/contact") return "contact";
    if (path === "/login") return "login";
    if (path === "/dashboard") return "dashboard";
    if (path === "/size-guide") return "size-guide";
    if (path === "/how-to-apply") return "how-to-apply";
    if (path === "/faq") return "faq";
    if (path === "/press") return "press";
    if (path === "/blog") return "blog";
    if (path === "/careers") return "careers";
    if (path === "/returns") return "returns";
    if (path === "/shipping") return "shipping";
    if (path === "/privacy") return "privacy";
    if (path === "/terms") return "terms";
    if (path === "/wholesale") return "wholesale";
    return "home";
  };

  const page = getPageFromPath(location.pathname);

  const navigate = (newPage: Page, id?: number) => {
    if (id !== undefined) {
      navigateHook(`/product/${id}`);
    } else {
      switch (newPage) {
        case "home": navigateHook("/"); break;
        case "products": navigateHook("/products"); break;
        case "new-arrivals": navigateHook("/new-arrivals"); break;
        case "on-sale": navigateHook("/on-sale"); break;
        case "best-sellers": navigateHook("/best-sellers"); break;
        case "favorites": navigateHook("/favorites"); break;
        case "cart": navigateHook("/cart"); break;
        case "checkout": navigateHook("/checkout"); break;
        case "success": navigateHook("/success"); break;
        case "about": navigateHook("/about"); break;
        case "contact": navigateHook("/contact"); break;
        case "login": navigateHook("/login"); break;
        case "dashboard": navigateHook("/dashboard"); break;
        case "size-guide": navigateHook("/size-guide"); break;
        case "how-to-apply": navigateHook("/how-to-apply"); break;
        case "faq": navigateHook("/faq"); break;
        case "press": navigateHook("/press"); break;
        case "blog": navigateHook("/blog"); break;
        case "careers": navigateHook("/careers"); break;
        case "returns": navigateHook("/returns"); break;
        case "shipping": navigateHook("/shipping"); break;
        case "privacy": navigateHook("/privacy"); break;
        case "terms": navigateHook("/terms"); break;
        case "wholesale": navigateHook("/wholesale"); break;
        default: navigateHook("/");
      }
    }
  };

  const isAdminPage = location.pathname.startsWith("/admin");

  const isAuthPage = ["/login", "/forgot-password", "/reset-password"].includes(location.pathname);
  const showFooter =
  !isAdminPage &&
  page !== "checkout" &&
  page !== "success" &&
  !isAuthPage;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <ScrollToTop />
      {/* Hide cursor on mobile later inside component */}
      <CustomCursor />
{!isAdminPage && !isAuthPage && <AnnouncementBar />}

{!isAdminPage && !isAuthPage && (
  <Header
    currentPage={page as any}
    onNavigate={navigate as any}
  />
)}
      {/* Main Content */}
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<HomePage onNavigate={navigate as any} />} />
          <Route path="/products" element={<ProductsPage onNavigate={navigate as any} />} />
          <Route path="/new-arrivals" element={<ProductsPage onNavigate={navigate as any} filter="new" />} />
          <Route path="/on-sale" element={<ProductsPage onNavigate={navigate as any} filter="sale" />} />
          <Route path="/best-sellers" element={<ProductsPage onNavigate={navigate as any} filter="best" />} />
          <Route path="/product/:id" element={<ProductDetailPageWrapper onNavigate={navigate as any} />} />
          <Route path="/favorites" element={<FavoritesPage onNavigate={navigate as any} />} />
          <Route path="/cart" element={<CartPage onNavigate={navigate as any} />} />
          <Route path="/checkout" element={<CheckoutPage onNavigate={navigate as any} />} />
          <Route path="/success" element={<SuccessPage onNavigate={navigate as any} />} />
          <Route path="/about" element={<AboutPage onNavigate={navigate as any} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login onNavigate={navigate as any} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/how-to-apply" element={<HowToApply />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/press" element={<Press />} />
          <Route path="/wholesale" element={<WholesaleInquiry  />} />


          {/* Admin Login */}
<Route
  path="/admin/login"
  element={<AdminLogin />}
/>

{/* Admin Routes */}
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route path="dashboard" element={<AdminDashboard />} />

  <Route path="banners" element={<BannerList />} />
  <Route path="banners/add" element={<AddBanner />} />
  <Route path="banners/edit/:id" element={<EditBanner />} />

  <Route path="/admin/categories" element={<CategoryList />} />
  <Route path="/admin/categories/add" element={<AddCategory />} />
  <Route path="/admin/categories/edit/:id" element={<EditCategory />} />

  <Route path="/admin/shapes" element={<ShapeList />} />
  <Route path="/admin/shapes/add" element={<AddShape />} />
  <Route path="/admin/shapes/edit/:id" element={<EditShape />} />

  <Route path="/admin/products" element={<ProductList />} />
  <Route path="/admin/products/add" element={<AddProduct />} />
  <Route path="/admin/products/edit/:id" element={<EditProduct />} />

  <Route path="/admin/sizes" element={<SizeList />} />
<Route path="/admin/sizes/add" element={<AddSize />} />
<Route path="/admin/sizes/edit/:id" element={<EditSize />} />
<Route path="orders" element={<OrderList />} />
<Route path="orders/:id" element={<OrderDetails />} />
<Route path="customers" element={<CustomerList />} />
<Route path="customers/:id" element={<CustomerDetails />} />
<Route path="users" element={<UserList />} />
<Route path="users/:id" element={<UserDetails />} />
</Route>


          {/* Policy & Info Pages */}
          <Route path="/blog" element={
            <PolicyPage 
              title="Blog & News" 
              subtitle="Luxury Trends" 
              content="Stay tuned for our upcoming blog featuring nail care tips, the latest Aurora chrome trends, and behind-the-scenes stories from our handcrafted studio in India." 
            />
          } />
          <Route path="/careers" element={
            <PolicyPage 
              title="Careers" 
              subtitle="Join the Team" 
              content="We are always looking for creative talents to join SR Artémore. If you are passionate about handcrafted luxury and beauty, send your portfolio to careers@srartemore.com." 
            />
          } />
          <Route path="/returns" element={
            <PolicyPage 
              title="Returns & Refunds" 
              subtitle="Customer Satisfaction" 
              content="Due to the handcrafted and hygienic nature of our products, we accept returns on unused sets within 7 days of delivery if there is a manufacturing defect." 
            />
          } />
          <Route path="/shipping" element={
            <PolicyPage 
              title="Shipping Policy" 
              subtitle="Delivery Info" 
              content="We offer Pan-India delivery. Every set is handcrafted to order, taking 3-5 business days for production, followed by 2-3 days for shipping." 
            />
          } />
          <Route path="/privacy" element={
            <PolicyPage 
              title="Privacy Policy" 
              subtitle="Your Data" 
              content="Your privacy is of utmost importance to us. We use luxury-grade encryption to ensure your personal data and payment information are always secure." 
            />
          } />
          <Route path="/terms" element={
            <PolicyPage 
              title="Terms & Conditions" 
              subtitle="Legal Agreement" 
              content="By using SR Artémore, you agree to our terms of service regarding handcrafted luxury items, custom sizing, and our commitment to quality." 
            />
          } />
        </Routes>
      </main>

      {showFooter && <Footer onNavigate={navigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <NotifProvider>
            <AppInner />
          </NotifProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

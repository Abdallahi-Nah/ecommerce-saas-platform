import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import RegisterStore from "./pages/auth/RegisterStore";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/dashboard/Products";
import ProtectedRoute from "./components/ProtectedRoute";
import AddProduct from "./pages/dashboard/AddProduct";
import EditProduct from "./pages/dashboard/EditProduct";
import Orders from "./pages/dashboard/Orders";
import OrderDetails from "./pages/dashboard/OrderDetails";
import Customers from "./pages/dashboard/Customers";
import Settings from "./pages/dashboard/Settings";
import StorefrontProducts from "./pages/storefront/StorefrontProducts";
import ProductDetails from "./pages/storefront/ProductDetails";
import Cart from "./pages/storefront/Cart";
import Checkout from "./pages/storefront/Checkout";
import OrderTracking from "./pages/storefront/OrderTracking";
import SubscriptionPlans from "./pages/dashboard/SubscriptionPlans";
import SubscriptionSuccess from "./pages/dashboard/SubscriptionSuccess";
import SubscriptionCancel from "./pages/dashboard/SubscriptionCancel";
import AboutPage from "./pages/AboutPage";
import RegisterChoice from "./pages/auth/RegisterChoice";
import RegisterCustomer from "./pages/auth/RegisterCustomer";
import CustomerShop from "./pages/customer/CustomerShop";
import MyOrders from "./pages/customer/MyOrders";
import CustomerCart from "./pages/customer/CustomerCart";



function App() {
  const { isAuthenticated, initializing, user } = useAuth();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-mint-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Landing Page */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.role === "store_owner" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/shop" replace />
            )
          ) : (
            <LandingPage />
          )
        }
      />

      {/* About Page */}
      <Route path="/about" element={<AboutPage />} />

      {/* Authentication Routes */}
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            user?.role === "store_owner" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/shop" replace />
            )
          ) : (
            <RegisterChoice />
          )
        }
      />

      <Route
        path="/register/customer"
        element={
          isAuthenticated ? (
            <Navigate to="/shop" replace />
          ) : (
            <RegisterCustomer />
          )
        }
      />

      <Route
        path="/register/store"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <RegisterStore />
          )
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            user?.role === "store_owner" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/shop" replace />
            )
          ) : (
            <Login />
          )
        }
      />

      {/* Customer Routes - Protected */}
      <Route
        path="/shop"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerShop />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-orders"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      {/* Store Owner Dashboard Routes - Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["store_owner"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute allowedRoles={["store_owner"]}>
            <Products />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/new"
        element={
          <ProtectedRoute allowedRoles={["store_owner"]}>
            <AddProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["store_owner"]}>
            <EditProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={["store_owner"]}>
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute allowedRoles={["store_owner"]}>
            <OrderDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute allowedRoles={["store_owner"]}>
            <Customers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["store_owner"]}>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/subscription"
        element={
          <ProtectedRoute allowedRoles={["store_owner"]}>
            <SubscriptionPlans />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/subscription/success"
        element={
          <ProtectedRoute allowedRoles={["store_owner"]}>
            <SubscriptionSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/subscription/cancel"
        element={
          <ProtectedRoute allowedRoles={["store_owner"]}>
            <SubscriptionCancel />
          </ProtectedRoute>
        }
      />

      {/* Public Storefront Routes */}
      <Route path="/store/:storeId" element={<StorefrontProducts />} />
      <Route
        path="/store/:storeId/product/:productId"
        element={<ProductDetails />}
      />
      <Route path="/store/:storeId/cart" element={<Cart />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerCart />
          </ProtectedRoute>
        }
      />
      <Route path="/store/:storeId/checkout" element={<Checkout />} />
      <Route
        path="/store/:storeId/orders/:orderId"
        element={<OrderTracking />}
      />

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

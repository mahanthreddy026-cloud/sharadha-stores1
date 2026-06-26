import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminNav from "./components/AdminNav";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import BulkOrder from "./pages/BulkOrder";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
import Payment from "./pages/Payment";

// Admin imports
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import Customers from "./pages/admin/Customers";
import AdminBulkOrders from "./pages/admin/BulkOrders";
import AdminOrders from "./pages/admin/Orders";
import Employees from "./pages/admin/Employees";
import Reports from "./pages/admin/Reports";
import ManageAdmins from "./pages/admin/ManageAdmins";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AdminNav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/bulk-order" element={<BulkOrder />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/payment" element={<Payment />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/bulk-orders" element={<AdminBulkOrders />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/manage-admins" element={<ManageAdmins />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
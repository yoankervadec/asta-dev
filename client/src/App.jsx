//
// client/src/App.jsx

import "./assets/reset.css";
import "./assets/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import ModalContainer from "./components/modals/ModalContainer/ModalContainer";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CustomerOrders from "./pages/CustomerOrders";
import DashBoard from "./pages/DashBoard";
import Customers from "./pages/Customers";

function App() {
  return (
    <>
      <BrowserRouter>
        <ModalContainer />
        <main>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customer-orders" element={<CustomerOrders />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;

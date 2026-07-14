import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Cart from "./pages/cart";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProductedRoute";


function App(){

return(
<BrowserRouter>

<Navbar/>

<Routes>

<Route path="/" element={<Home/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/products/:id" element={<ProductDetails/>}/>
<Route path="/admin" element={<Admin/>}/>
<Route path="/register" element={<Register/>}/>
<Route path="/cart" element={<Cart/>}/>
<Route path="/orders" element={<Orders/>}/>

<Route path="/profile" element={
  <ProtectedRoute>
    <Profile/>
  </ProtectedRoute>
}/>

</Routes>

</BrowserRouter>
)

}

export default App;
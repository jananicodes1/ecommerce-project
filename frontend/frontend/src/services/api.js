const USER_API = "https://ecommerce-project-qqdk.onrender.com";
const PRODUCT_API = "https://ecommerce-project-1xbgbonrender.com";

export const loginUser = async (data) => {
  const res = await fetch(USER_API + "/User/Login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const registerUser = async (data) => {
  const res = await fetch(USER_API + "/User/Register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const verifyOtp = async (data) => {
  const res = await fetch(USER_API + "/User/VerifyOTP", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(USER_API + "/User/Profile", {
    headers: { "Authorization": "Bearer " + token }
  });
  return res.json();
};

export const getProducts = async () => {
  const res = await fetch(PRODUCT_API + "/products/");
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(PRODUCT_API + "/products/" + id);
  return res.json();
};

export const getCartItems = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(PRODUCT_API + "/Cart/Items", {
    headers: { "Authorization": "Bearer " + token }
  });
  return res.json();
};

export const removeFromCart = async (product_id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(PRODUCT_API + "/Cart/Remove/" + product_id, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  });
  return res.json();
};

export const updateCartQuantity = async (product_id, quantity) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    PRODUCT_API + "/Cart/Update/" + product_id + "?quantity=" + quantity,
    {
      method: "PUT",
      headers: { "Authorization": "Bearer " + token }
    }
  );
  return res.json();
};

export const buyNow = async (product_id, quantity = 1) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    PRODUCT_API + "/orders/buy/" + product_id + "?quantity=" + quantity,
    {
      method: "POST",
      headers: { "Authorization": "Bearer " + token }
    }
  );
  return res.json();
};
const USER_API = "http://127.0.0.1:8001";
const PRODUCT_API = "http://127.0.0.1:8000";


export const loginUser = async (data) => {
  const res = await fetch(`${USER_API}/User/Login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};


export const getProducts = async () => {
  const res = await fetch(`${PRODUCT_API}/products`);
  return res.json();
};


export const getProductById = async (id) => {
  const res = await fetch(`${PRODUCT_API}/products/${id}`);
  return res.json();
};


export const getUserProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${USER_API}/User/Profile`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  return res.json();
};


export const registerUser = async (data) => {
  const res = await fetch(`${USER_API}/User/Register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};


export const verifyOtp = async (data) => {
  const res = await fetch(`${USER_API}/User/VerifyOTP`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};


export const getCartItems = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://127.0.0.1:8001/Cart/Items`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  return res.json();
};

export const buyNow = async (product_id, quantity = 1) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "http://127.0.0.1:8000/orders/buy/" + product_id + "?quantity=" + quantity,
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      }
    }
  );
  return res.json();
};


export const removeFromCart = async (product_id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "http://127.0.0.1:8001/Cart/Remove/" + product_id,
    {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    }
  );
  return res.json();
};


export const updateCartQuantity = async (product_id, quantity) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "http://127.0.0.1:8000/Cart/Update/" + product_id + "?quantity=" + quantity,
    {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token
      }
    }
  );
  return res.json();
};
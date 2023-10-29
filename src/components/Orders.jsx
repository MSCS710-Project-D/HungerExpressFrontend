


const BASE_URL = "https://us-central1-maristhungerexpress.cloudfunctions.net/api";

const createOrder = (orderData) => {
    return fetch(`${BASE_URL}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    }).then(response => response.json());
  }
  
  const getAllOrders = () => {
    return fetch(`${BASE_URL}/orders/`).then(response => response.json());
  }
  
  const getOrdersByUserId = (userId) => {
    return fetch(`${BASE_URL}/orders/user/${userId}`).then(response => response.json());
  }
  
  // Payment Info
  const getPaymentInfoByUserId = (userId) => {
    return fetch(`${BASE_URL}/paymentInfo/user/${userId}`).then(response => response.json());
  }
  
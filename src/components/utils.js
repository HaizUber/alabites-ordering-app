import axios from 'axios';

// Method to calculate total price in TamCredits
export const calculateTotalPriceInTamCredits = (cartItems) => {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Method to update user's TamCredits balance
export const updateUserTamCreditsBalance = async (userData, totalPrice) => {
  try {
    const response = await axios.patch(`https://alabites-api.vercel.app/users/${userData.uid}/spend-currency`, {
      amount: totalPrice,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to update user balance: ${response.statusText}`);
    }

    console.log('User balance updated successfully:', response.data.newBalance);
    return response.data.newBalance; // Assuming API returns new balance in response
  } catch (error) {
    console.error('Error updating user balance:', error.message);
    throw new Error('Error updating user balance');
  }
};

// Method to generate order ID
export const generateOrderId = () => {
  const prefix = "3000";
  const randomDigits = Math.floor(100000 + Math.random() * 900000); // Generate 6 random digits
  return prefix + randomDigits;
};

// Method to add transaction to user
export const addTransactionToUser = async (userId, amount, orderId, cartItems, paymentMethod) => {
  // Check if cartItems is an array before proceeding
  if (!Array.isArray(cartItems)) {
    throw new Error('Cart items must be an array');
  }

  const transactionOrderId = orderId || generateOrderId(); // Use provided orderId or generate a new one

  let transactionType;
  let transactionDescription;

  // Determine transaction type and description based on payment method
  if (paymentMethod === 'tamcredits') {
    transactionType = 'tamcredits';
    transactionDescription = `Purchase with TamCredits: ${cartItems.map(item => item.name).join(', ')}`;
  } else if (paymentMethod === 'card') {
    transactionType = 'card';
    transactionDescription = `Purchase with Card: ${cartItems.map(item => item.name).join(', ')}`;
  } else {
    throw new Error('Unsupported payment method');
  }

  const transaction = {
    type: transactionType,
    amount,
    description: transactionDescription,
    orderId: transactionOrderId,
  };

  try {
    const response = await axios.post(`https://alabites-api.vercel.app/users/${userId}/transaction`, { transaction });
    if (response.status !== 200) {
      throw new Error('Failed to add transaction to user');
    }
  } catch (error) {
    console.error('Error adding transaction to user:', error.message);
    throw new Error('Error adding transaction to user');
  }
};

// Method to check product stock
export const checkProductStock = async (cartItems) => {
  try {
    const checkPromises = cartItems.map(async (item) => {
      const productResponse = await axios.get(`https://alabites-api.vercel.app/products/query/${item.pid}`);
      const product = productResponse.data.data[0];

      if (!product) {
        throw new Error(`Product not found for ID: ${item.pid}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Product ${item.name} is out of stock`);
      }

      return product;
    });

    return await Promise.all(checkPromises);
  } catch (error) {
    console.error('Error checking product stock:', error.message);
    throw error;
  }
};

// Method to update product stock
export const updateProductStock = async (cartItems) => {
  try {
    const products = await checkProductStock(cartItems); // First check if all products have sufficient stock

    const updatePromises = products.map(async (product) => {
      const cartItem = cartItems.find(item => item.id === product._id); // Use `id` instead of `pid`
      if (!cartItem) {
        console.error(`Cart item with id ${product._id} not found in cart items`);
        throw new Error(`Cart item with id ${product._id} not found in cart items`);
      }
      const updatedStock = product.stock - cartItem.quantity;
      await axios.patch(`https://alabites-api.vercel.app/products/${product._id}/stock`, { stock: updatedStock });
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error updating product stock:', error.message);
    throw error;
  }
};

// Method to handle payment using TamCredits
export const handleTamCreditsPayment = async (currentUser, cartItems) => {
  try {
    if (!currentUser) {
      throw new Error('Current user details not available');
    }

    const startTime = Date.now();

    const tamCreditsBalance = currentUser.currencyBalance;

    const totalPriceInTamCredits = calculateTotalPriceInTamCredits(cartItems);
    if (tamCreditsBalance < totalPriceInTamCredits) {
      throw new Error('Insufficient TamCredits balance');
    }

    // Check and update product stock
    await updateProductStock(cartItems);

    // Create order
    const validOrderItems = await Promise.all(cartItems.map(async (item) => {
      const productResponse = await axios.get(`https://alabites-api.vercel.app/products/query/${item.pid}`);
      const product = productResponse.data.data[0];
      return {
        productId: product._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        store: product.store,
      };
    }));

    const orderPayload = {
      orderNumber: generateOrderId(),
      customer: {
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email,
      },
      items: validOrderItems,
      paymentDetails: {
        method: 'tamcredits',
        transactionId: generateOrderId(),
        amount: totalPriceInTamCredits,
      },
      totalAmount: totalPriceInTamCredits,
      orderStatus: 'Pending',
      store: validOrderItems[0].store,
    };

    await axios.post('https://alabites-api.vercel.app/orders', orderPayload);

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    console.log(`TamCredits payment handled in ${elapsedTime} ms`);

    return true; // Indicate success
  } catch (error) {
    console.error('Error handling TamCredits payment:', error.message);
    throw error;
  }
};

// Method to handle payment using card
export const handleCardPayment = async (userData, cardDetails, cartItems, totalPrice) => {
  const PAYMONGO_SECRET_KEY = process.env.REACT_APP_PAYMONGO_SECRET_KEY;
  try {
    const paymentMethodResponse = await axios.post('https://api.paymongo.com/v1/payment_methods', {
      data: {
        attributes: {
          type: 'card',
          details: {
            card_number: cardDetails.cardNumber.replace(/\s+/g, ''),
            exp_month: parseInt(cardDetails.expMonth, 10),
            exp_year: parseInt(cardDetails.expYear, 10),
            cvc: cardDetails.cvc,
            billing: {
              name: cardDetails.cardholderName,
            },
          },
        },
      },
    }, {
      headers: {
        Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY)}`,
        'Content-Type': 'application/json',
      },
    });

    const paymentMethodId = paymentMethodResponse.data.data.id;
    const paymentIntentResponse = await axios.post('https://api.paymongo.com/v1/payment_intents', {
      data: {
        attributes: {
          amount: totalPrice * 100,
          payment_method_allowed: ['card'],
          currency: 'PHP',
          description: cartItems.map(item => item.name).join(', '),
          statement_descriptor: 'Your Company Name',
          capture_type: 'automatic',
        },
      },
    }, {
      headers: {
        Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY)}`,
        'Content-Type': 'application/json',
      },
    });

    await axios.post(`https://api.paymongo.com/v1/payment_intents/${paymentIntentResponse.data.data.id}/attach`, {
      data: {
        attributes: {
          payment_method: paymentMethodId,
        },
      },
    }, {
      headers: {
        Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY)}`,
        'Content-Type': 'application/json',
      },
    });

    // Check and update product stock
    await updateProductStock(cartItems);

    const validOrderItems = await Promise.all(cartItems.map(async (item) => {
      try {
        if (!item.pid) {
          throw new Error(`Product ID missing for item: ${JSON.stringify(item)}`);
        }

        const productResponse = await axios.get(`https://alabites-api.vercel.app/products/query/${item.pid}`);
        const product = productResponse.data.data[0];
        return {
          productId: product._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          store: product.store,
        };
      } catch (error) {
        console.error('Error fetching product details:', error.message);
        throw error;
      }
    }));

    const orderPayload = {
      orderNumber: generateOrderId(),
      customer: {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
      },
      items: validOrderItems,
      paymentDetails: {
        method: 'card',
        transactionId: paymentIntentResponse.data.data.id,
        amount: totalPrice,
      },
      totalAmount: totalPrice,
      orderStatus: 'Pending',
      store: validOrderItems[0].store,
    };

    const orderResponse = await axios.post('https://alabites-api.vercel.app/orders', orderPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("Order response:", orderResponse.data);
    return paymentIntentResponse; // Return paymentIntentResponse here
  } catch (error) {
    console.error('Error handling card payment:', error.message);
    throw error;
  }
};

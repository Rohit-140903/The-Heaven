const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const ProcessedPayment = require("../models/ProcessedPaymentModel");

exports.checkoutSession = async (req, res) => {
  const products = req.body.products;
  const cartItems = req.body.quantity;
  const total_amount = req.body.total_amount;

  if (
    !products ||
    products.length === 0 ||
    !cartItems ||
    Object.keys(cartItems).length === 0
  ) {
    return res
      .status(400)
      .json({ error: "The cart is empty. Please add items to the cart." });
  }

  const validProducts = products.filter((item) => cartItems[item.id] > 0);

  if (validProducts.length === 0) {
    return res
      .status(400)
      .json({ error: "No valid products found in the cart." });
  }

  const items = validProducts.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: [item.image],
        // because stripe doesn't access private url for that we have to use public clouds
      },
      unit_amount: Math.round(item.new_price * 100),
    },
    quantity: cartItems[item.id],
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items,
    mode: "payment",
    metadata: {
      type: "cart-checkout", // Identifies "Cart Checkout"
      cart: JSON.stringify(
        validProducts.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.new_price,
          images: item.image,
          quantity: cartItems[item.id],
          createdAt: new Date(),
        }))
      ),
    },
    success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: "http://localhost:5173/failure",
  });

  //console.log("checkout: ", validProducts);

  res.json({ id: session.id });
};

exports.buyNow = async (req, res) => {
  const { id, name, new_price, image, quantity } = req.body;

  if (!id || !name || !new_price || !quantity) {
    return res.status(400).json({ error: "Invalid request data." });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: name, 
              images: [image],
             },
            unit_amount: Math.round(new_price * 100),
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/failure",
      metadata: {
        type: "buy-now", // Identifies "Buy Now" checkout
        cart: JSON.stringify({
          id: id,
          name: name,
          price: new_price,
          images: image,
          quantity: quantity,
          createdAt: new Date(),
        }),
      },
    });

    //console.log("buy-now : ", req.body);

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ error: "Checkout session creation failed." });
  }
};


exports.checkPaymentStatusWithSessionId = async(req,res) =>{
  try {
    const sessionId = req.params.sessionId;

    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res
        .status(400)
        .json({ success: false, message: "Payment not completed." });
    }

    const paymentIntent = session.payment_intent; // Unique per payment

    //  Check if this paymentIntent was already processed
    const existingPayment = await ProcessedPayment.findOne({ paymentIntent });
  
    if (existingPayment) {
      console.log("payment already processed");
      return res
        .status(400)
        .json({ success: true, message: "Invalid Transaction", alreadyProcessed: true, });
    }

    // Process stock update based on metadata
    const metadata = session.metadata || {};

    const cartItems = JSON.parse(metadata.cart || "[]");

    if (metadata.type === "buy-now") {
      await Product.findOneAndUpdate(
        { id: cartItems.id },
        { $inc: { stock: -1 } },
        { new: true },
      );
    } else {
    for (const item of cartItems) {
      await Product.findOneAndUpdate(
        { id: item.id },
        { $inc: { stock: -item.quantity } }
      );
    }
    }

    //  Store processed paymentIntent to prevent future duplicate processing
    await ProcessedPayment.create({ paymentIntent, processed: true });

    let orderProducts = {};

    console.log(metadata);

    if (metadata.type === "buy-now") {
      orderProducts = [{
        id: cartItems.id,
        name: cartItems.name,
        price: cartItems.price,
        image: cartItems.images,
        quantity: 1,  // Ensure quantity is correctly assigned
        createdAt: cartItems.createdAt,
      }];
    } else {
      orderProducts = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.images,
        quantity: item.quantity,
        createdAt: item.createdAt,
      }));
    }

    console.log("Stock updated successfully!");
    return res.json({
      success: true,
      message: "Stock updated successfully!",
      orderProducts,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};


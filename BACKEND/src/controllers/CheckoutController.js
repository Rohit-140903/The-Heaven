
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const ProcessedPayment = require("../models/ProcessedPaymentModel");
const ReservedStock = require("../models/ReservedStockModel");

// // Atomic stock deduction
// const reduceStock = async (productId, quantity) => {
//   return await Product.findOneAndUpdate(
//     { id: productId, stock: { $gte: quantity } },
//     { $inc: { stock: -quantity } },
//     { new: true }
//   );
// };

// // --- CART CHECKOUT ---
// exports.checkoutSession = async (req, res) => {
//   const products = req.body.products;
//   const cartItems = req.body.quantity;

//   if (!products?.length || !cartItems || Object.keys(cartItems).length === 0) {
//     return res.status(400).json({ error: "The cart is empty. Please add items to the cart." });
//   }

//   const validProducts = products.filter((item) => cartItems[item.id] > 0);
//   if (validProducts.length === 0) {
//     return res.status(400).json({ error: "No valid products found in the cart." });
//   }

//   // Stock reservation
//   for (const item of validProducts) {
//     const updated = await reduceStock(item.id, cartItems[item.id]);
//     if (!updated) {
//       return res.status(400).json({ error: `Not enough stock for product: ${item.name}` });
//     }
//   }

//   const items = validProducts.map((item) => ({
//     price_data: {
//       currency: "usd",
//       product_data: { name: item.name, images: [item.image] },
//       unit_amount: Math.round(item.new_price * 100),
//     },
//     quantity: cartItems[item.id],
//   }));

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: items,
//     mode: "payment",
//     metadata: {
//       type: "cart-checkout",
//       cart: JSON.stringify(validProducts.map((item) => ({
//         id: item.id,
//         name: item.name,
//         price: item.new_price,
//         images: item.image,
//         quantity: cartItems[item.id],
//         createdAt: new Date(),
//       }))),
//     },
//     success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: "http://localhost:5173/failure",
//   });

//   await ReservedStock.create({
//     sessionId: session.id,
//     items: validProducts.map((item) => ({
//       id: item.id,
//       quantity: cartItems[item.id],
//     })),
//   });

//   res.json({ id: session.id });
// };

// // --- BUY NOW CHECKOUT ---
// exports.buyNow = async (req, res) => {
//   const { id, name, new_price, image, quantity } = req.body;

//   if (!id || !name || !new_price || !quantity) {
//     return res.status(400).json({ error: "Invalid request data." });
//   }

//   const updated = await reduceStock(id, quantity);
//   if (!updated) {
//     return res.status(400).json({ error: "Not enough stock for this product." });
//   }

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: { name, images: [image] },
//             unit_amount: Math.round(new_price * 100),
//           },
//           quantity,
//         },
//       ],
//       mode: "payment",
//       success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: "http://localhost:5173/failure",
//       metadata: {
//         type: "buy-now",
//         cart: JSON.stringify({
//           id,
//           name,
//           price: new_price,
//           images: image,
//           quantity,
//           createdAt: new Date(),
//         }),
//       },
//     });

//     await ReservedStock.create({
//       sessionId: session.id,
//       items: [{ id, quantity }],
//     });

//     res.json({ id: session.id });
//   } catch (error) {
//     console.error("Stripe checkout error:", error);
//     res.status(500).json({ error: "Checkout session creation failed." });
//   }
// };

// // --- PAYMENT CHECK STATUS ---
// exports.checkPaymentStatusWithSessionId = async (req, res) => {
//   try {
//     const sessionId = req.params.sessionId;
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status !== "paid") {
//       return res.status(400).json({ success: false, message: "Payment not completed." });
//     }

//     const paymentIntent = session.payment_intent;
//     const existingPayment = await ProcessedPayment.findOne({ paymentIntent });
//     if (existingPayment) {
//       return res.status(400).json({
//         success: true,
//         message: "Invalid Transaction - Already Processed",
//         alreadyProcessed: true,
//       });
//     }

//     const metadata = session.metadata || {};
//     const cartItems = JSON.parse(metadata.cart || "[]");

//     await ProcessedPayment.create({ paymentIntent, processed: true });
//     await ReservedStock.deleteOne({ sessionId });

//     const orderProducts = metadata.type === "buy-now"
//       ? [{
//           id: cartItems.id,
//           name: cartItems.name,
//           price: cartItems.price,
//           image: cartItems.images,
//           quantity: cartItems.quantity || 1,
//           createdAt: cartItems.createdAt,
//         }]
//       : cartItems.map((item) => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           image: item.images,
//           quantity: item.quantity,
//           createdAt: item.createdAt,
//         }));

//     return res.json({
//       success: true,
//       message: "Stock update confirmed, order created.",
//       orderProducts,
//     });
//   } catch (error) {
//     console.error("Error checking payment status:", error);
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };

// // --- BACKGROUND STOCK ROLLBACK TASK ---
// setInterval(async () => {
//   const cutoff = new Date(Date.now() - 5 * 60 * 1000);
//   const expired = await ReservedStock.find({ timestamp: { $lt: cutoff } });

//   for (const record of expired) {
//     try {
//       const session = await stripe.checkout.sessions.retrieve(record.sessionId);
//       const paymentIntent = session.payment_intent;
//       const existingPayment = await ProcessedPayment.findOne({ paymentIntent });

//       if (session.payment_status !== "paid" && !existingPayment) {
//         console.log(`Rolling back stock for expired session: ${record.sessionId}`);
//         for (const item of record.items) {
//           await Product.updateOne(
//             { id: item.id },
//             { $inc: { stock: item.quantity } }
//           );
//         }
//       }

//       await ReservedStock.deleteOne({ sessionId: record.sessionId });
//     } catch (err) {
//       console.error(`Rollback failed for session ${record.sessionId}:`, err.message);
//     }
//   }
// }, 60 * 1000); // Runs every minute



// // const Order = require("../models/OrderModel");
// // const Product = require("../models/ProductModel");
// // const stripe = require("stripe")(process.env.STRIPE_SECRET);
// // const ProcessedPayment = require("../models/ProcessedPaymentModel");
// // const ReservedStock = require("../models/ReservedStockModel");
// // const schedule = require("node-schedule");

// // // Atomic stock deduction
// // const reduceStock = async (productId, quantity) => {
// //   return await Product.findOneAndUpdate(
// //     { id: productId, stock: { $gte: quantity } },
// //     { $inc: { stock: -quantity } },
// //     { new: true }
// //   );
// // };

// // // --- CART CHECKOUT ---
// // exports.checkoutSession = async (req, res) => {
// //   const products = req.body.products;
// //   const cartItems = req.body.quantity;

// //   if (!products?.length || !cartItems || Object.keys(cartItems).length === 0) {
// //     return res.status(400).json({ error: "The cart is empty. Please add items to the cart." });
// //   }

// //   const validProducts = products.filter((item) => cartItems[item.id] > 0);
// //   if (validProducts.length === 0) {
// //     return res.status(400).json({ error: "No valid products found in the cart." });
// //   }

// //   // Stock reservation
// //   for (const item of validProducts) {
// //     const updated = await reduceStock(item.id, cartItems[item.id]);
// //     if (!updated) {
// //       return res.status(400).json({ error: `Not enough stock for product: ${item.name}` });
// //     }
// //   }

// //   const items = validProducts.map((item) => ({
// //     price_data: {
// //       currency: "usd",
// //       product_data: { name: item.name, images: [item.image] },
// //       unit_amount: Math.round(item.new_price * 100),
// //     },
// //     quantity: cartItems[item.id],
// //   }));

// //   const session = await stripe.checkout.sessions.create({
// //     payment_method_types: ["card"],
// //     line_items: items,
// //     mode: "payment",
// //     metadata: {
// //       type: "cart-checkout",
// //       cart: JSON.stringify(
// //         validProducts.map((item) => ({
// //           id: item.id,
// //           name: item.name,
// //           price: item.new_price,
// //           images: item.image,
// //           quantity: cartItems[item.id],
// //           createdAt: new Date(),
// //         }))
// //       ),
// //     },
// //     success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
// //     cancel_url: "http://localhost:5173/failure",
// //   });

// //   await ReservedStock.create({
// //     sessionId: session.id,
// //     items: validProducts.map((item) => ({
// //       id: item.id,
// //       quantity: cartItems[item.id],
// //     })),
// //   });

// //   res.json({ id: session.id });
// // };

// // // --- BUY NOW CHECKOUT ---
// // exports.buyNow = async (req, res) => {
// //   const { id, name, new_price, image, quantity } = req.body;

// //   if (!id || !name || !new_price || !quantity) {
// //     return res.status(400).json({ error: "Invalid request data." });
// //   }

// //   const updated = await reduceStock(id, quantity);
// //   if (!updated) {
// //     return res.status(400).json({ error: "Not enough stock for this product." });
// //   }

// //   try {
// //     const session = await stripe.checkout.sessions.create({
// //       payment_method_types: ["card"],
// //       line_items: [
// //         {
// //           price_data: {
// //             currency: "usd",
// //             product_data: { name, images: [image] },
// //             unit_amount: Math.round(new_price * 100),
// //           },
// //           quantity,
// //         },
// //       ],
// //       mode: "payment",
// //       success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
// //       cancel_url: "http://localhost:5173/failure",
// //       metadata: {
// //         type: "buy-now",
// //         cart: JSON.stringify({
// //           id,
// //           name,
// //           price: new_price,
// //           images: image,
// //           quantity,
// //           createdAt: new Date(),
// //         }),
// //       },
// //     });

// //     await ReservedStock.create({
// //       sessionId: session.id,
// //       items: [{ id, quantity }],
// //     });

// //     res.json({ id: session.id });
// //   } catch (error) {
// //     console.error("Stripe checkout error:", error);
// //     res.status(500).json({ error: "Checkout session creation failed." });
// //   }
// // };

// // // --- PAYMENT CHECK STATUS ---
// // exports.checkPaymentStatusWithSessionId = async (req, res) => {
// //   try {
// //     const sessionId = req.params.sessionId;
// //     const session = await stripe.checkout.sessions.retrieve(sessionId);

// //     if (session.payment_status !== "paid") {
// //       return res.status(400).json({ success: false, message: "Payment not completed." });
// //     }

// //     const paymentIntent = session.payment_intent;
// //     const existingPayment = await ProcessedPayment.findOne({ paymentIntent });
// //     if (existingPayment) {
// //       return res.status(400).json({
// //         success: true,
// //         message: "Invalid Transaction - Already Processed",
// //         alreadyProcessed: true,
// //       });
// //     }

// //     const metadata = session.metadata || {};
// //     const cartItems = JSON.parse(metadata.cart || "[]");

// //     await ProcessedPayment.create({ paymentIntent, processed: true });
// //     await ReservedStock.deleteOne({ sessionId });

// //     const orderProducts =
// //       metadata.type === "buy-now"
// //         ? [
// //             {
// //               id: cartItems.id,
// //               name: cartItems.name,
// //               price: cartItems.price,
// //               image: cartItems.images,
// //               quantity: cartItems.quantity || 1,
// //               createdAt: cartItems.createdAt,
// //             },
// //           ]
// //         : cartItems.map((item) => ({
// //             id: item.id,
// //             name: item.name,
// //             price: item.price,
// //             image: item.images,
// //             quantity: item.quantity,
// //             createdAt: item.createdAt,
// //           }));

// //     return res.json({
// //       success: true,
// //       message: "Stock update confirmed, order created.",
// //       orderProducts,
// //     });
// //   } catch (error) {
// //     console.error("Error checking payment status:", error);
// //     return res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // // --- BACKGROUND STOCK ROLLBACK TASK ---
// // // Only runs in development mode
// //   schedule.scheduleJob("* * * * *", async () => {
// //     console.log("Running scheduled rollback check...");

// //     const cutoff = new Date(Date.now() - 5 * 60 * 1000);
// //     const expired = await ReservedStock.find({ timestamp: { $lt: cutoff } });

// //     for (const record of expired) {
// //       try {
// //         const session = await stripe.checkout.sessions.retrieve(record.sessionId);
// //         const paymentIntent = session.payment_intent;
// //         const existingPayment = await ProcessedPayment.findOne({ paymentIntent });

// //         if (session.payment_status !== "paid" && !existingPayment) {
// //           console.log(`Rolling back stock for expired session: ${record.sessionId}`);
// //           for (const item of record.items) {
// //             await Product.updateOne(
// //               { id: item.id },
// //               { $inc: { stock: item.quantity } }
// //             );
// //           }
// //         }

// //         await ReservedStock.deleteOne({ sessionId: record.sessionId });
// //       } catch (err) {
// //         console.error(`Rollback failed for session ${record.sessionId}:`, err.message);
// //       }
// //     }
// //   });





exports.checkoutSession = async (req, res) => {
  const products = req.body.products;
  const cartItems = req.body.quantity;

  if (!products?.length || !cartItems || Object.keys(cartItems).length === 0) {
    return res.status(400).json({ error: "The cart is empty. Please add items to the cart." });
  }

  const validProducts = products.filter((item) => cartItems[item.id] > 0);
  if (validProducts.length === 0) {
    return res.status(400).json({ error: "No valid products found in the cart." });
  }

  // DO NOT reduce stock here or create ReservedStock

  const items = validProducts.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.name, images: [item.image] },
      unit_amount: Math.round(item.new_price * 100),
    },
    quantity: cartItems[item.id],
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items,
    mode: "payment",
    metadata: {
      type: "cart-checkout",
      cart: JSON.stringify(validProducts.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.new_price,
        images: item.image,
        quantity: cartItems[item.id],
        createdAt: new Date(),
      }))),
    },
    success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: "http://localhost:5173/failure",
  });

  res.json({ id: session.id });
};

exports.buyNow = async (req, res) => {
  const { id, name, new_price, image, quantity } = req.body;

  if (!id || !name || !new_price || !quantity) {
    return res.status(400).json({ error: "Invalid request data." });
  }

  // DO NOT reduce stock here or create ReservedStock

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name, images: [image] },
            unit_amount: Math.round(new_price * 100),
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/failure",
      metadata: {
        type: "buy-now",
        cart: JSON.stringify({
          id,
          name,
          price: new_price,
          images: image,
          quantity,
          createdAt: new Date(),
        }),
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ error: "Checkout session creation failed." });
  }
};


exports.checkPaymentStatusWithSessionId = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment not completed." });
    }

    const paymentIntent = session.payment_intent;
    const existingPayment = await ProcessedPayment.findOne({ paymentIntent });
    if (existingPayment) {
      return res.status(400).json({
        success: true,
        message: "Invalid Transaction - Already Processed",
        alreadyProcessed: true,
      });
    }

    const metadata = session.metadata || {};
    const cartItems = JSON.parse(metadata.cart || "[]");

    // Atomically reduce stock now, before creating ProcessedPayment

    // Validate and reduce stock for each item****
    for (const item of (metadata.type === "buy-now" ? [cartItems] : cartItems)) {
      const updated = await Product.findOneAndUpdate(
        { id: item.id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product: ${item.name}`,
        });
      }
    }

    // Record payment processed after successful stock deduction
    await ProcessedPayment.create({ paymentIntent, processed: true });

    const orderProducts = metadata.type === "buy-now"
      ? [{
          id: cartItems.id,
          name: cartItems.name,
          price: cartItems.price,
          image: cartItems.images,
          quantity: cartItems.quantity || 1,
          createdAt: cartItems.createdAt,
        }]
      : cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.images,
          quantity: item.quantity,
          createdAt: item.createdAt,
        }));

    return res.json({
      success: true,
      message: "Payment confirmed and stock updated, order created.",
      orderProducts,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};





const Order = require("../models/OrderModel");
const { User, TempUser } = require("../models/UserModel");
const mongoose = require("mongoose");

exports.getOrderHistory = async (req, res) => {
  console.log("User", req.user);
  try {
    const user = await User.findById(req.user.id);
    const orders = await Order.find({ userEmail: user.email }).lean(); // Get all orders

    // Sort products inside each order by createdAt (from newest to oldest)
    orders.forEach((order) => {
      if (order.products && order.products.length > 0) {
        order.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ); // Sort products in descending order based on createdAt
      }
    });
    orders.sort((a, b) => {
      // If both orders have products, compare the createdAt of the first product (most recent after sorting)
      if (a.products.length > 0 && b.products.length > 0) {
        return (
          new Date(b.products[0].createdAt) - new Date(a.products[0].createdAt)
        );
      }
      // If one of the orders doesn't have products, place it at the end
      if (a.products.length === 0) return 1;
      if (b.products.length === 0) return -1;
      return 0; // In case both have no products (shouldn't happen as per your structure)
    });

    //console.log(orders);

    if (!orders || orders.length === 0) {
      console.log("orerHistory: ", orders);
      return res.status(404).json({ message: "No order history found" });
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addOrder = async (req, res) => {
  try {
    const user = await User.findById(new mongoose.Types.ObjectId(req.user.id));
    //console.log("addOrder : ", user.email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products in the order" });
    }

    // Create structured product data including `imageUrl`, `quantity`, and `price`
    //console.log(products);
    const orderProducts = products.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      address: {
        fullName: user.address.fullName,
        phone: user.address.phone,
        street: user.address.street,
        city: user.address.city,
        state: user.address.state,
        zip: user.address.zip,
        country: user.address.country,
      },
      createdAt: item.createdAt,
    }));

    let existingUser = await Order.findOne({ userEmail: user.email });

    if (existingUser) {
      existingUser.products.push(...orderProducts);
      // existingUser.createdAt = Date.now();
      await existingUser.save(); // updates the document if it already exists.
    } else {
      existingUser = new Order({
        userEmail: user.email,
        products: orderProducts,
      });
      await existingUser.save();
    }

    await User.findByIdAndUpdate(req.user.email, {
      $push: { orders: existingUser._id },
    });

    return res
      .status(201)
      .json({ message: "Order updated successfully", order: existingUser });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.findAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().lean();

    const flatOrders = [];

    for (const order of orders) {
      if (order.products && order.products.length > 0) {
        for (const product of order.products) {
          const createdAtDate = product.createdAt ? new Date(product.createdAt) : new Date();

          flatOrders.push({
            orderId :product._id,
            date: createdAtDate,
            userEmail: order.userEmail || "",
            address: product.address || {},
            productName: product.name,
            quantity: product.quantity,
            price: product.price,
            completed : product.completed,
            deliveredAt : product.deliveredAt,
          });
        }
      }
    }

   // console.log(flatOrders);

    // Sort by product createdAt ascending
    flatOrders.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({ success: true, Orders: flatOrders });
  } catch (error) {
    console.error("Error processing orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendMailToUser = async (req,res) => {
  const email = req.body.email;
  const name = req.body.name;
  const product = req.body.product;
  const deliveryDate = req.body.deliveryDate;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Delivery Schedule for Your Order",
    html: `
      <p>Hello ${name || "Customer"},</p>
      <p>Your order for <strong>${product}</strong> is scheduled for delivery on <strong>${deliveryDate}</strong>.</p>
      <br/>
      <p>Thank you for shopping with us.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    res.json({ success: false, error: err.message });
  }
};

exports.updateOrderDetails = async (req, res) => {
  //console.log("details", req.body);

  const { orderId, userEmail, deliveredAt, completed } = req.body;

  if (!orderId || !userEmail) {
    return res.status(400).json({ success: false, message: "orderId and userEmail are required" });
  }

  try {
    // Correct: Pass filter as an object
    const order = await Order.findOne({ userEmail });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found for user" });
    }

    //Find the product by orderId inside order.orders (or whatever nested array holds the order details)
    const product = order.products.find(o => o._id.toString() === orderId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Order item not found" });
    }

    // Safely update
    if (deliveredAt !== undefined) {
      product.deliveredAt = deliveredAt;
    }

    if (completed !== undefined) {
      product.completed = completed;
    }

    await order.save();

    return res.status(200).json({ success: true, message: "Order updated successfully" });

  } catch (err) {
    console.error("Error updating order:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};






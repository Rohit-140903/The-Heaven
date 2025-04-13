const Order = require("../models/OrderModel");
const {User,TempUser} = require("../models/UserModel");
const mongoose = require("mongoose");

exports.getOrderHistory = async (req, res) => {
  console.log("User",req.user);
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
    
        // ✅ Create structured product data including `imageUrl`, `quantity`, and `price`
      console.log(products);
        const orderProducts = products.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          address : {
    
            fullName: user.address.fullName,
            phone: user.address.phone,
            street: user.address.street,
            city: user.address.city,
            state: user.address.state,
            zip:user.address.zip,
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
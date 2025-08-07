
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/DbConfig");
const productRoutes = require("./src/routes/ProductRoute");
const authRoutes = require("./src/routes/AuthRoute");
const cartRoutes = require("./src/routes/CartRoute");
const commentRoutes = require("./src/routes/CommentRoute");
const orderRoutes = require("./src/routes/OrderRoute");
const checkoutRoutes = require("./src/routes/CheckoutRoute");
// const allRoutes = require("./src/routes/AllRoute");
const bodyparser = require("body-parser");

const app = express();
app.use(express.json());
app.use(cors());


connectDB(); // Connect to MongoDB


// All API routes
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", checkoutRoutes);
app.use("/api", commentRoutes);
app.use("/api", orderRoutes);




const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


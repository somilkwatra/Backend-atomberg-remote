const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

dotenv.config();
const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {});
    console.log("Successfully connected to the database");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};

connectDB();

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

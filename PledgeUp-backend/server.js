import express from "express";
import connectDB from "./config/connectDB.js";
import dotenv from "dotenv";
import path from "path";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const relativePath = "../PledgeUp-frontend/build";
const absolutePath = path.resolve(__dirname, relativePath);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(relativePath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(absolutePath));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode at port ${PORT}`);
});

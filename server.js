require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./config/database");

const authRoutes = require("./routes/auth");
const favoriteRoutes = require("./routes/favorties");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");

    await sequelize.sync();
    console.log("Models synced...");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database error:", err);
  }
};

startServer();

app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);

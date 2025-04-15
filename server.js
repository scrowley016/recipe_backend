require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { sequelize } = require("./config/database");

const authRoutes = require("./routes/auth");
const favoriteRoutes = require("./routes/favorites");
const recipeRoutes = require("./routes/recipe");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});


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
app.use("/api/recipes", recipeRoutes);

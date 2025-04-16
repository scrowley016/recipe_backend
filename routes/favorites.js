const express = require("express");
const router = express.Router();
const { Favorite } = require("../config/database");
const requireAuth = require("../utils");



router.get("/", requireAuth, async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
    });
      res.json({ data: favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch favorites" });
  }
});


router.get("/:id", requireAuth, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!favorite) {
      return res.status(404).json({ error: `Favorite not found with id: ${id}` });
    }

    res.json(favorite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch favorite" });
  }
});


router.post("/", requireAuth, async (req, res) => {
  const { mealId, name, imageUrl, strArea, strCategory } = req.body;

  console.log("Received favorite data:", req.body);

  if (!mealId || !name || !imageUrl) {
    return res
      .status(400)
      .json({ error: "Missing required fields: mealId, name, imageUrl" });
  }

  try {
    const newFavorite = await Favorite.create({
      idMeal: mealId,
      strMeal: name,
      strMealThumb: imageUrl,
      strArea,
      strCategory,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Favorite successfully added!",
      data: newFavorite,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save favorite" });
  }
});


router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Favorite.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ message: "Favorite removed", id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete favorite" });
  }
});

module.exports = router;

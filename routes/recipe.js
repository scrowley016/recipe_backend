const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "..", "data", "mock_meals.json");
const requireAuth = require("../utils");
const { Recipe } = require("../config/database");


router.post("/user-recipes", requireAuth, async (req, res) => {
  try {
    const { ingredients, ...rest } = req.body;

    const ingredientsArray =
      typeof ingredients === "string"
        ? ingredients.split(",").map((str) => str.trim())
        : [];

    const newRecipe = await Recipe.create({
      ...rest,
      ingredients: ingredientsArray,
      idMeal: Date.now().toString(),
      userId: req.user.id,
      isUserRecipe: true,
    });

    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ error: "Error creating recipe" });
  }
});


router.put("/user-recipes/:id", requireAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ where: { idMeal: req.params.id } });
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    if (recipe.userId !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    const { ingredients, ...rest } = req.body;

    const updatedData = {
      ...rest,
      ...(ingredients && {
        ingredients: ingredients.split(",").map((str) => str.trim()),
      }),
    };

    await recipe.update(updatedData);
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Error updating recipe" });
  }
});

router.delete("/user-recipes/:id", requireAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ where: { idMeal: req.params.id } });
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    if (recipe.userId !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    await recipe.destroy();
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting recipe" });
  }
});

router.get("/user-recipes", requireAuth, async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      where: {
        userId: req.user.id,
        isUserRecipe: true,
      },
    });

    const withIngredientString = recipes.map((recipe) => {
      const ingredientsArray = recipe.ingredients || [];
      const ingredientsString = ingredientsArray.join(", ");
      return {
        ...recipe.toJSON(),
        ingredientsString,
      };
    });

    res.json(withIngredientString);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user recipes" });
  }
});

router.get("/", async (req, res) => {
  try {
    const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const dbRecipes = await Recipe.findAll();
    const merged = [...jsonData, ...dbRecipes.map((recipe) => recipe.toJSON())];
    res.json(merged);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: "Failed to load recipes" });
  }
});

// router.get("/random", async (req, res) => {
//   try {
//     const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
//     const dbRecipes = await Recipe.findAll();
//     const allRecipes = [...jsonData, ...dbRecipes.map((r) => r.toJSON())];
//     const randomRecipe =
//       allRecipes[Math.floor(Math.random() * allRecipes.length)];
//     res.json(randomRecipe);
//   } catch (err) {
//     res.status(500).json({ error: "Error loading random recipe" });
//   }
// });

router.get("/random", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading data file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const recipes = JSON.parse(data);
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    res.json(randomRecipe);
  });
});


router.get("/:id", async (req, res) => {
  const recipeId = req.params.id;
  try {
    const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const jsonRecipe = jsonData.find((r) => r.idMeal === recipeId);

    if (jsonRecipe) return res.json(jsonRecipe);

    const dbRecipe = await Recipe.findOne({ where: { idMeal: recipeId } });
    if (dbRecipe) return res.json(dbRecipe);

    res.status(404).json({ error: "Recipe not found" });
  } catch (err) {
    res.status(500).json({ error: "Error fetching recipe" });
  }
});

module.exports = router;

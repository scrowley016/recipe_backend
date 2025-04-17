const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const dataPath = path.join(__dirname, "..", "data", "mock_meals.json");
const requireAuth = require("../utils");

router.post("/", requireAuth, (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading data" });

    const recipes = JSON.parse(data);
    const newRecipe = {
      ...req.body,
      idMeal: Date.now().toString(),
      userId: req.user.id, 
    };

    recipes.push(newRecipe);

    fs.writeFile(dataPath, JSON.stringify(recipes, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error saving recipe" });
      res.status(201).json(newRecipe);
    });
  });
});

router.put("/:id", requireAuth, (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading data" });

    const recipes = JSON.parse(data);
    const recipeIndex = recipes.findIndex((r) => r.idMeal === req.params.id);

    if (recipeIndex === -1) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const recipe = recipes[recipeIndex];

    if (recipe.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this recipe" });
    }

    const updatedRecipe = { ...recipe, ...req.body };
    recipes[recipeIndex] = updatedRecipe;

    fs.writeFile(dataPath, JSON.stringify(recipes, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error saving recipe" });
      res.json(updatedRecipe);
    });
  });
});

router.get("/", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading data file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const recipes = JSON.parse(data);
    res.json(recipes);
  });
});

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

router.get("/:id", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading data file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const recipes = JSON.parse(data);
    const recipeId = req.params.id;

    console.log(`Recipe ID requested: ${recipeId}`);

    if (recipeId) {
      const recipe = recipes.find((r) => r.idMeal == recipeId);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      return res.json(recipe);
    }

    res.json(recipes);
  });
});

router.post("/", requireAuth, (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading data" });

    const recipes = JSON.parse(data);
    const newRecipe = {
      ...req.body,
      idMeal: Date.now().toString(),
      userId: req.user.id,
    };

    recipes.push(newRecipe);

    fs.writeFile(dataPath, JSON.stringify(recipes, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error saving recipe" });
      res.status(201).json(newRecipe);
    });
  });
});

router.put("/:id", requireAuth, (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading data" });

    const recipes = JSON.parse(data);
    const recipeIndex = recipes.findIndex((r) => r.idMeal === req.params.id);

    if (recipeIndex === -1) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const recipe = recipes[recipeIndex];

    if (recipe.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this recipe" });
    }

    const updatedRecipe = { ...recipe, ...req.body };
    recipes[recipeIndex] = updatedRecipe;

    fs.writeFile(dataPath, JSON.stringify(recipes, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error saving recipe" });
      res.json(updatedRecipe);
    });
  });
});

router.delete("/:id", requireAuth, (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading data" });

    let recipes = JSON.parse(data);
    const recipeIndex = recipes.findIndex((r) => r.idMeal === req.params.id);

    if (recipeIndex === -1) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const recipe = recipes[recipeIndex];

    if (recipe.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this recipe" });
    }

    recipes.splice(recipeIndex, 1);

    fs.writeFile(dataPath, JSON.stringify(recipes, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error saving data" });
      res.json({ message: "Recipe deleted successfully" });
    });
  });
});

module.exports = router;

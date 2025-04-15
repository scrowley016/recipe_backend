const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const dataPath = path.join(__dirname, '..', 'data', 'mock_meals.json');

router.get('/', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const recipes = JSON.parse(data);
        res.json(recipes);
    });
}
);

router.get('/random', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const recipes = JSON.parse(data);
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        res.json(randomRecipe);
    });
});

router.get('/:id', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const recipes = JSON.parse(data);
        const recipeId = req.params.id;

        console.log(`Recipe ID requested: ${recipeId}`);

        if (recipeId) {
            const recipe = recipes.find((r) => r.idMeal == recipeId);
            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }
            return res.json(recipe);
        }

        res.json(recipes);
    });
});

module.exports = router;
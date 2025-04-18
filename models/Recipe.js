const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Recipe = sequelize.define("Recipe", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
      },
      idMeal: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      strMeal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      strMealThumb: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      strCategory: {
        type: DataTypes.STRING,
      },
      strArea: {
        type: DataTypes.STRING,
      },
      strInstructions: {
        type: DataTypes.TEXT,
      },
      strTags: {
        type: DataTypes.STRING,
      },
      ingredients: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      isUserRecipe: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });

  return Recipe;
};

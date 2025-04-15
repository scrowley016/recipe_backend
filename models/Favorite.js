const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Favorite = sequelize.define("Favorite", {
    idMeal: {
      type: DataTypes.STRING,
      allowNull: false,
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
      allowNull: true,
    },
    strArea: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Favorite;
};

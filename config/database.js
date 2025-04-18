const { Sequelize } = require("sequelize");
const UserModel = require("../models/User");
const FavoriteModel = require("../models/Favorite");
const RecipeModel = require("../models/Recipe");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});


const User = UserModel(sequelize);
const Favorite = FavoriteModel(sequelize);
const Recipe = RecipeModel(sequelize);


User.hasMany(Favorite, { foreignKey: "userId" });
Favorite.belongsTo(User, { foreignKey: "userId" });

// Recipe.hasMany(Favorite, { foreignKey: "recipeId" });
// Favorite.belongsTo(Recipe, { foreignKey: "recipeId" });

// User.hasMany(Recipe, { foreignKey: "userId" });
// Recipe.belongsTo(User, { foreignKey: "userId" });


module.exports = {
  sequelize,
  User,
  Favorite,
  Recipe,
};

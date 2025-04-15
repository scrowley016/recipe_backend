const { Sequelize } = require("sequelize");
const UserModel = require("../models/User");
const FavoriteModel = require("../models/Favorite");

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

User.hasMany(Favorite, { foreignKey: "userId" });
Favorite.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Favorite,
};

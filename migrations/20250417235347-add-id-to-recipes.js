"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.removeConstraint("Recipes", "Recipes_pkey"); 


    await queryInterface.addColumn("Recipes", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    });


    await queryInterface.addConstraint("Recipes", {
      fields: ["idMeal"],
      type: "unique",
      name: "unique_idMeal",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Recipes", "id");
    await queryInterface.removeConstraint("Recipes", "unique_idMeal");

    await queryInterface.changeColumn("Recipes", "idMeal", {
      type: Sequelize.STRING,
      primaryKey: true,
    });
  },
};

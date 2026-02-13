"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("stores", "storeCategory", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("stores", "country", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("stores", "city", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("stores", "address", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("stores", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("stores", "logo", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("stores", "storeCategory");
    await queryInterface.removeColumn("stores", "country");
    await queryInterface.removeColumn("stores", "city");
    await queryInterface.removeColumn("stores", "address");
    await queryInterface.removeColumn("stores", "description");
    await queryInterface.removeColumn("stores", "logo");
  },
};
